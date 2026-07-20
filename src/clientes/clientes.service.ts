import { Injectable, NotFoundException } from "@nestjs/common";
import Cliente from "../models/Cliente";
import { CriarClienteDto } from "./dto/criar-cliente.dto";
import { AtualizarClienteDto } from "./dto/atualizar-cliente.dto";

@Injectable()
export class ClientesService {
  async criar(dto: CriarClienteDto) {
    return Cliente.create({ ...dto });
  }

  async listar(filtros: { ativo?: boolean; bairro?: string }) {
    const where: any = {};
    if (filtros.ativo !== undefined) where.ativo = filtros.ativo;
    if (filtros.bairro) where.bairro = filtros.bairro;

    return Cliente.findAll({ where, order: [["nome", "ASC"]] });
  }

  async buscarPorId(id: number) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      throw new NotFoundException("Cliente não encontrado");
    }
    return cliente;
  }

  async atualizar(id: number, dto: AtualizarClienteDto) {
    const cliente = await this.buscarPorId(id);
    await cliente.update(dto);
    return cliente;
  }

  async alterarStatus(id: number, ativo: boolean) {
    const cliente = await this.buscarPorId(id);
    cliente.ativo = ativo;
    await cliente.save();
    return cliente;
  }
}