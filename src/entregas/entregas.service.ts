import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import Entrega from "../models/Entrega";
import HistoricoStatusEntrega from "../models/HistoricoStatusEntrega";
import { CriarEntregaDto } from "./dto/criar-entrega.dto";
import { AtualizarEntregaDto } from "./dto/atualizar-entrega.dto";
import { MudarStatusDto } from "./dto/mudar-status.dto";
import sequelize from "../database";

@Injectable()
export class EntregasService {
  async criar(dto: CriarEntregaDto) {
    return Entrega.create({ ...dto } as any);
  }

  async listar(filtros: {
    status?: string;
    bairro?: string;
    dataAgendada?: string;
    prioridade?: string;
  }) {
    const where: any = {};
    if (filtros.status) where.status = filtros.status;
    if (filtros.bairro) where.bairro = filtros.bairro;
    if (filtros.dataAgendada) where.dataAgendada = filtros.dataAgendada;
    if (filtros.prioridade) where.prioridade = filtros.prioridade;

    return Entrega.findAll({ where, order: [["createdAt", "DESC"]] });
  }

  async buscarPorId(id: number) {
    const entrega = await Entrega.findByPk(id);
    if (!entrega) {
      throw new NotFoundException("Entrega não encontrada");
    }
    return entrega;
  }

  async atualizar(id: number, dto: AtualizarEntregaDto) {
    const entrega = await this.buscarPorId(id);

    // Só permite editar entregas que ainda não saíram para rota
    if (!["PENDENTE"].includes(entrega.status)) {
      throw new BadRequestException(
        "Só é possível editar entregas com status PENDENTE"
      );
    }

    await entrega.update(dto);
    return entrega;
  }

  async mudarStatus(id: number, dto: MudarStatusDto) {
    const entrega = await this.buscarPorId(id);
    const statusAnterior = entrega.status;

    return sequelize.transaction(async (t) => {
      entrega.status = dto.status;

      // Marca timestamps conforme o novo status, sem sobrescrever os demais
      if (dto.status === "ATRIBUIDA") entrega.atribuidoEm = new Date();
      if (dto.status === "EM_ROTA") entrega.saiuParaEntregaEm = new Date();
      if (dto.status === "ENTREGUE") entrega.entregueEm = new Date();
      if (dto.status === "CANCELADA") entrega.canceladoEm = new Date();
      if (dto.status === "FALHOU") entrega.motivoFalha = dto.motivo ?? entrega.motivoFalha;

      await entrega.save({ transaction: t });

      await HistoricoStatusEntrega.create(
        {
          entregaId: entrega.id,
          statusAnterior,
          novoStatus: dto.status,
          motivo: dto.motivo,
          alteradoPorUserId: dto.alteradoPorUserId,
        },
        { transaction: t }
      );

      return entrega;
    });
  }

  async historico(entregaId: number) {
    await this.buscarPorId(entregaId); // garante que a entrega existe
    return HistoricoStatusEntrega.findAll({
      where: { entregaId },
      order: [["alteradoEm", "ASC"]],
    });
  }
}