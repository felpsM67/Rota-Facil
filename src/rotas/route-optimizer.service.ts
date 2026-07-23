import { Injectable, BadRequestException, NotFoundException, Inject } from "@nestjs/common";
import sequelize from "../database";
import Entrega from "../models/Entrega";
import Entregador from "../models/Entregador";
import Veiculo from "../models/Veiculo";
import Rota from "../models/Rota";
import ParadaRota from "../models/ParadaRota";
import HistoricoStatusEntrega from "../models/HistoricoStatusEntrega";
import { GerarRotaDto } from "./dto/gerar-rota.dto";
import { GeocodingService } from "../common/geocoding.service";
import type { RouteProvider, Coordinates } from "../common/route-provider.interface";
import { ROUTE_PROVIDER } from "../common/route-provider.token";

@Injectable()
export class RouteOptimizerService {
  constructor(
    private readonly geocodingService: GeocodingService,
    @Inject(ROUTE_PROVIDER) private readonly routeProvider: RouteProvider
  ) {}

  async gerar(dto: GerarRotaDto): Promise<Rota> {
    // 1. Validar entregador (regra 2 da seção 22)
    const entregador = await Entregador.findByPk(dto.entregadorId);
    if (!entregador) throw new NotFoundException("Entregador não encontrado");
    if (!entregador.ativo || !entregador.disponivel) {
      throw new BadRequestException("Entregador precisa estar ativo e disponível");
    }

    // 2. Validar veículo, se informado (regra 3)
    let veiculo: Veiculo | null = null;
    if (dto.veiculoId) {
      veiculo = await Veiculo.findByPk(dto.veiculoId);
      if (!veiculo) throw new NotFoundException("Veículo não encontrado");
      if (!veiculo.ativo) throw new BadRequestException("Veículo precisa estar ativo");
    }

    // 3. Validar entregas (regra 1: só PENDENTE pode entrar em rota nova)
    const entregas = await Entrega.findAll({ where: { id: dto.entregaIds } });

    if (entregas.length !== dto.entregaIds.length) {
      throw new NotFoundException("Uma ou mais entregas informadas não foram encontradas");
    }

    const entregasNaoPendentes = entregas.filter((e) => e.status !== "PENDENTE");
    if (entregasNaoPendentes.length > 0) {
      const ids = entregasNaoPendentes.map((e) => e.id).join(", ");
      throw new BadRequestException(
        `As entregas [${ids}] não estão PENDENTE e não podem entrar em uma nova rota`
      );
    }

    // 4. Verificar capacidade (regra 8)
    if (veiculo && entregas.length > veiculo.capacidadeEntregas) {
      throw new BadRequestException(
        `O veículo suporta no máximo ${veiculo.capacidadeEntregas} entregas, mas foram selecionadas ${entregas.length}`
      );
    }

    // 5. Resolver coordenadas da origem
    let origem: Coordinates;
    if (dto.latitudeOrigem && dto.longitudeOrigem) {
      origem = { latitude: dto.latitudeOrigem, longitude: dto.longitudeOrigem };
    } else {
      origem = await this.geocodingService.geocodificarEndereco(dto.enderecoOrigem);
    }

    // 6. Geocodificar entregas que ainda não têm lat/long
    //    (sequencial com pausa, para respeitar o limite do Nominatim)
    for (const entrega of entregas) {
      if (!entrega.latitude || !entrega.longitude) {
        await this.geocodingService.geocodificarEntregaSeNecessario(entrega);
        await this.geocodingService.aguardarLimiteDeRequisicao();
      }
    }

    // 7. Priorizar urgentes primeiro (regra 5) antes de mandar pro otimizador,
    //    assim se o provedor não conseguir reordenar tudo perfeitamente,
    //    a ordem de entrada já favorece as urgentes
    const entregasOrdenadas = [...entregas].sort((a, b) => {
      const peso: Record<string, number> = { URGENTE: 0, ALTA: 1, NORMAL: 2, BAIXA: 3 };
      return peso[a.prioridade] - peso[b.prioridade];
    });

    // 8. Montar pontos: [origem, entrega1, entrega2, ...]
    const pontos: Coordinates[] = [
      origem,
      ...entregasOrdenadas.map((e) => ({
        latitude: Number(e.latitude),
        longitude: Number(e.longitude),
      })),
    ];

    // 9. Chamar o provedor de rotas para otimizar a ordem de visita
    const resultado = await this.routeProvider.otimizarRota(pontos);

    // resultado.ordem[0] é sempre a origem (índice 0) — descartamos
    const ordemEntregas = resultado.ordem.filter((indice) => indice !== 0);

    // 10. Persistir tudo em transação (regra 18)
    return sequelize.transaction(async (t) => {
      const rota = await Rota.create(
        {
          userId: dto.userId,
          entregadorId: dto.entregadorId,
          veiculoId: dto.veiculoId,
          dataRota: dto.dataRota,
          status: "PLANEJADA",
          metodoOtimizacao: "OSRM",
          enderecoOrigem: dto.enderecoOrigem,
          latitudeOrigem: origem.latitude,
          longitudeOrigem: origem.longitude,
          distanciaEstimadaKm: resultado.distanciaTotalMetros / 1000,
          duracaoEstimadaMinutos: Math.round(resultado.duracaoTotalSegundos / 60),
        } as any,
        { transaction: t }
      );

      for (let i = 0; i < ordemEntregas.length; i++) {
        const indiceNoPonto = ordemEntregas[i]; // índice em `pontos` (1-based em relação às entregas)
        const entrega = entregasOrdenadas[indiceNoPonto - 1];
        const trecho = resultado.trechos[i]; // trecho que leva até essa parada

        await ParadaRota.create(
          {
            rotaId: rota.id,
            entregaId: entrega.id,
            sequencia: i + 1,
            status: "PENDENTE",
            distanciaAnteriorKm: trecho ? trecho.distanciaMetros / 1000 : null,
            duracaoAnteriorMinutos: trecho ? Math.round(trecho.duracaoSegundos / 60) : null,
          } as any,
          { transaction: t }
        );

        const statusAnterior = entrega.status;
        entrega.status = "ATRIBUIDA";
        entrega.atribuidoEm = new Date();
        await entrega.save({ transaction: t });

        await HistoricoStatusEntrega.create(
          {
            entregaId: entrega.id,
            statusAnterior,
            novoStatus: "ATRIBUIDA",
            motivo: `Atribuída à rota #${rota.id}`,
          } as any,
          { transaction: t }
        );
      }

      return rota;
    });
  }
}