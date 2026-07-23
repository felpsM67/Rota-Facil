import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import sequelize from "../database";
import Rota from "../models/Rota";
import ParadaRota from "../models/ParadaRota";
import Entrega from "../models/Entrega";
import HistoricoStatusEntrega from "../models/HistoricoStatusEntrega";
import { GerarRotaDto } from "./dto/gerar-rota.dto";
import { RouteOptimizerService } from "./route-optimizer.service";

@Injectable()
export class RotasService {
  constructor(private readonly routeOptimizerService: RouteOptimizerService) {}

  async gerar(dto: GerarRotaDto) {
    return this.routeOptimizerService.gerar(dto);
  }

  async listar(filtros: { status?: string; dataRota?: string; entregadorId?: number }) {
    const where: any = {};
    if (filtros.status) where.status = filtros.status;
    if (filtros.dataRota) where.dataRota = filtros.dataRota;
    if (filtros.entregadorId) where.entregadorId = filtros.entregadorId;

    return Rota.findAll({ where, order: [["dataRota", "DESC"]] });
  }

  async buscarPorId(id: number) {
    const rota = await Rota.findByPk(id, {
      include: [
        {
          model: ParadaRota,
          include: [Entrega],
        },
      ],
      order: [[{ model: ParadaRota, as: "ParadaRotas" }, "sequencia", "ASC"]],
    });
    if (!rota) throw new NotFoundException("Rota não encontrada");
    return rota;
  }

  async iniciar(id: number) {
    const rota = await this.buscarRotaSimples(id);
    if (rota.status !== "PLANEJADA") {
      throw new BadRequestException("Só é possível iniciar rotas com status PLANEJADA");
    }

    return sequelize.transaction(async (t) => {
      rota.status = "EM_ANDAMENTO";
      rota.inicioReal = new Date();
      await rota.save({ transaction: t });

      const paradas = await ParadaRota.findAll({ where: { rotaId: rota.id }, transaction: t });
      for (const parada of paradas) {
        const entrega = await Entrega.findByPk(parada.entregaId, { transaction: t });
        if (entrega && entrega.status === "ATRIBUIDA") {
          const statusAnterior = entrega.status;
          entrega.status = "EM_ROTA";
          entrega.saiuParaEntregaEm = new Date();
          await entrega.save({ transaction: t });

          await HistoricoStatusEntrega.create(
            {
              entregaId: entrega.id,
              statusAnterior,
              novoStatus: "EM_ROTA",
              motivo: `Rota #${rota.id} iniciada`,
            } as any,
            { transaction: t }
          );
        }
      }

      return rota;
    });
  }

  async finalizar(id: number) {
    const rota = await this.buscarRotaSimples(id);
    if (rota.status !== "EM_ANDAMENTO") {
      throw new BadRequestException("Só é possível finalizar rotas EM_ANDAMENTO");
    }

    rota.status = "CONCLUIDA";
    rota.fimReal = new Date();
    await rota.save();
    return rota;
  }

  async cancelar(id: number) {
    const rota = await this.buscarRotaSimples(id);
    if (rota.status === "CONCLUIDA") {
      throw new BadRequestException("Não é possível cancelar uma rota já concluída");
    }

    return sequelize.transaction(async (t) => {
      rota.status = "CANCELADA";
      await rota.save({ transaction: t });

      // Devolve as entregas dessa rota para PENDENTE, para que possam
      // entrar em uma nova rota (regra 17: canceladas não entram em rota,
      // mas aqui é a ROTA que foi cancelada, não a entrega)
      const paradas = await ParadaRota.findAll({ where: { rotaId: rota.id }, transaction: t });
      for (const parada of paradas) {
        const entrega = await Entrega.findByPk(parada.entregaId, { transaction: t });
        if (entrega && ["ATRIBUIDA", "EM_ROTA"].includes(entrega.status)) {
          const statusAnterior = entrega.status;
          entrega.status = "PENDENTE";
          await entrega.save({ transaction: t });

          await HistoricoStatusEntrega.create(
            {
              entregaId: entrega.id,
              statusAnterior,
              novoStatus: "PENDENTE",
              motivo: `Rota #${rota.id} cancelada`,
            } as any,
            { transaction: t }
          );
        }
        parada.status = "CANCELADA";
        await parada.save({ transaction: t });
      }

      return rota;
    });
  }

  private async buscarRotaSimples(id: number) {
    const rota = await Rota.findByPk(id);
    if (!rota) throw new NotFoundException("Rota não encontrada");
    return rota;
  }
}