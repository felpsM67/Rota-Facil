import { Controller, Post, Get, Param, Query, Body, ParseIntPipe } from "@nestjs/common";
import { RotasService } from "./rotas.service";
import { GerarRotaDto } from "./dto/gerar-rota.dto";

@Controller("rotas")
export class RotasController {
  constructor(private readonly rotasService: RotasService) {}

  @Post("gerar")
  async gerar(@Body() dto: GerarRotaDto) {
    const rota = await this.rotasService.gerar(dto);
    return { success: true, data: rota, message: "Rota gerada com sucesso" };
  }

  @Get()
  async listar(
    @Query("status") status?: string,
    @Query("dataRota") dataRota?: string,
    @Query("entregadorId") entregadorId?: string
  ) {
    const rotas = await this.rotasService.listar({
      status,
      dataRota,
      entregadorId: entregadorId ? Number(entregadorId) : undefined,
    });
    return { success: true, data: rotas };
  }

  @Get(":id")
  async buscarPorId(@Param("id", ParseIntPipe) id: number) {
    const rota = await this.rotasService.buscarPorId(id);
    return { success: true, data: rota };
  }

  @Post(":id/iniciar")
  async iniciar(@Param("id", ParseIntPipe) id: number) {
    const rota = await this.rotasService.iniciar(id);
    return { success: true, data: rota, message: "Rota iniciada com sucesso" };
  }

  @Post(":id/finalizar")
  async finalizar(@Param("id", ParseIntPipe) id: number) {
    const rota = await this.rotasService.finalizar(id);
    return { success: true, data: rota, message: "Rota finalizada com sucesso" };
  }

  @Post(":id/cancelar")
  async cancelar(@Param("id", ParseIntPipe) id: number) {
    const rota = await this.rotasService.cancelar(id);
    return { success: true, data: rota, message: "Rota cancelada com sucesso" };
  }
}