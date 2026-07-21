import { Injectable, NotFoundException } from "@nestjs/common";
import Veiculo from "../models/Veiculo";
import { CriarVeiculoDto } from "./dto/criar-veiculo.dto";
import { AtualizarVeiculoDto } from "./dto/atualizar-veiculo.dto";

@Injectable()
export class VeiculosService {
  async criar(dto: CriarVeiculoDto) {
    return Veiculo.create({ ...dto });
  }

  async listar(filtros: { ativo?: boolean; entregadorId?: number }) {
    const where: any = {};
    if (filtros.ativo !== undefined) where.ativo = filtros.ativo;
    if (filtros.entregadorId !== undefined) where.entregadorId = filtros.entregadorId;

    return Veiculo.findAll({ where, order: [["createdAt", "DESC"]] });
  }

  async buscarPorId(id: number) {
    const veiculo = await Veiculo.findByPk(id);
    if (!veiculo) {
      throw new NotFoundException("Veículo não encontrado");
    }
    return veiculo;
  }

  async atualizar(id: number, dto: AtualizarVeiculoDto) {
    const veiculo = await this.buscarPorId(id);
    await veiculo.update(dto);
    return veiculo;
  }
}