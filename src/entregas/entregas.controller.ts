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
import { EntregasService } from "./entregas.service";
import { CriarEntregaDto } from "./dto/criar-entrega.dto";
import { AtualizarEntregaDto } from "./dto/atualizar-entrega.dto";
import { MudarStatusDto } from "./dto/mudar-status.dto";

@Controller("entregas")
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) {}

  @Post()
  async criar(@Body() dto: CriarEntregaDto) {
    const entrega = await this.entregasService.criar(dto);
    return { success: true, data: entrega, message: "Entrega cadastrada com sucesso" };
  }

  @Get()
  async listar(
    @Query("status") status?: string,
    @Query("bairro") bairro?: string,
    @Query("dataAgendada") dataAgendada?: string,
    @Query("prioridade") prioridade?: string
  ) {
    const entregas = await this.entregasService.listar({
      status,
      bairro,
      dataAgendada,
      prioridade,
    });
    return { success: true, data: entregas };
  }

  @Get(":id")
  async buscarPorId(@Param("id", ParseIntPipe) id: number) {
    const entrega = await this.entregasService.buscarPorId(id);
    return { success: true, data: entrega };
  }

  @Patch(":id")
  async atualizar(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AtualizarEntregaDto
  ) {
    const entrega = await this.entregasService.atualizar(id, dto);
    return { success: true, data: entrega, message: "Entrega atualizada com sucesso" };
  }

  @Patch(":id/status")
  async mudarStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: MudarStatusDto
  ) {
    const entrega = await this.entregasService.mudarStatus(id, dto);
    return { success: true, data: entrega, message: "Status atualizado com sucesso" };
  }

  @Get(":id/historico")
  async historico(@Param("id", ParseIntPipe) id: number) {
    const historico = await this.entregasService.historico(id);
    return { success: true, data: historico };
  }
}