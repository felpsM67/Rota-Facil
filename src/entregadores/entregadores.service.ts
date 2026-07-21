import { Injectable, NotFoundException } from "@nestjs/common";
import Entregador from "../models/Entregador";
import { CriarEntregadorDto } from "./dto/criar-entregador.dto";
import { AtualizarEntregadorDto } from "./dto/atualizar-entregador.dto";

@Injectable()
export class EntregadoresService {
  async criar(dto: CriarEntregadorDto) {
    return Entregador.create({ ...dto });
  }

  async listar(filtros: { ativo?: boolean; disponivel?: boolean }) {
    const where: any = {};
    if (filtros.ativo !== undefined) where.ativo = filtros.ativo;
    if (filtros.disponivel !== undefined) where.disponivel = filtros.disponivel;

    return Entregador.findAll({ where, order: [["nome", "ASC"]] });
  }

  async buscarPorId(id: number) {
    const entregador = await Entregador.findByPk(id);
    if (!entregador) {
      throw new NotFoundException("Entregador não encontrado");
    }
    return entregador;
  }

  async atualizar(id: number, dto: AtualizarEntregadorDto) {
    const entregador = await this.buscarPorId(id);
    await entregador.update(dto);
    return entregador;
  }

  async alterarDisponibilidade(id: number, disponivel: boolean) {
    const entregador = await this.buscarPorId(id);
    entregador.disponivel = disponivel;
    await entregador.save();
    return entregador;
  }
}