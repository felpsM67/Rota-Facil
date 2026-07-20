import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ClientesService } from "./clientes.service";
import { CriarClienteDto } from "./dto/criar-cliente.dto";
import { AtualizarClienteDto } from "./dto/atualizar-cliente.dto";

@Controller("clientes")
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  async criar(@Body() dto: CriarClienteDto) {
    const cliente = await this.clientesService.criar(dto);
    return {
      success: true,
      data: cliente,
      message: "Cliente cadastrado com sucesso",
    };
  }

  @Get()
  async listar(
    @Query("ativo") ativo?: string,
    @Query("bairro") bairro?: string
  ) {
    const filtros = {
      ativo: ativo !== undefined ? ativo === "true" : undefined,
      bairro,
    };
    const clientes = await this.clientesService.listar(filtros);
    return { success: true, data: clientes };
  }

  @Get(":id")
  async buscarPorId(@Param("id", ParseIntPipe) id: number) {
    const cliente = await this.clientesService.buscarPorId(id);
    return { success: true, data: cliente };
  }

  @Patch(":id")
  async atualizar(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AtualizarClienteDto
  ) {
    const cliente = await this.clientesService.atualizar(id, dto);
    return {
      success: true,
      data: cliente,
      message: "Cliente atualizado com sucesso",
    };
  }

  @Patch(":id/status")
  async alterarStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("ativo") ativo: boolean
  ) {
    const cliente = await this.clientesService.alterarStatus(id, ativo);
    return {
      success: true,
      data: cliente,
      message: "Status atualizado com sucesso",
    };
  }
}