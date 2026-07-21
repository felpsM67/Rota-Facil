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
import { EntregadoresService } from "./entregadores.service";
import { CriarEntregadorDto } from "./dto/criar-entregador.dto";
import { AtualizarEntregadorDto } from "./dto/atualizar-entregador.dto";

@Controller("entregadores")
export class EntregadoresController {
  constructor(private readonly entregadoresService: EntregadoresService) {}

  @Post()
  async criar(@Body() dto: CriarEntregadorDto) {
    const entregador = await this.entregadoresService.criar(dto);
    return { success: true, data: entregador, message: "Entregador cadastrado com sucesso" };
  }

  @Get()
  async listar(
    @Query("ativo") ativo?: string,
    @Query("disponivel") disponivel?: string
  ) {
    const filtros = {
      ativo: ativo !== undefined ? ativo === "true" : undefined,
      disponivel: disponivel !== undefined ? disponivel === "true" : undefined,
    };
    const entregadores = await this.entregadoresService.listar(filtros);
    return { success: true, data: entregadores };
  }

  @Get(":id")
  async buscarPorId(@Param("id", ParseIntPipe) id: number) {
    const entregador = await this.entregadoresService.buscarPorId(id);
    return { success: true, data: entregador };
  }

  @Patch(":id")
  async atualizar(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AtualizarEntregadorDto
  ) {
    const entregador = await this.entregadoresService.atualizar(id, dto);
    return { success: true, data: entregador, message: "Entregador atualizado com sucesso" };
  }

  @Patch(":id/disponibilidade")
  async alterarDisponibilidade(
    @Param("id", ParseIntPipe) id: number,
    @Body("disponivel") disponivel: boolean
  ) {
    const entregador = await this.entregadoresService.alterarDisponibilidade(id, disponivel);
    return { success: true, data: entregador, message: "Disponibilidade atualizada com sucesso" };
  }
}