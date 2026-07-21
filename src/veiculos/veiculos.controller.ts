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
import { VeiculosService } from "./veiculos.service";
import { CriarVeiculoDto } from "./dto/criar-veiculo.dto";
import { AtualizarVeiculoDto } from "./dto/atualizar-veiculo.dto";

@Controller("veiculos")
export class VeiculosController {
  constructor(private readonly veiculosService: VeiculosService) {}

  @Post()
  async criar(@Body() dto: CriarVeiculoDto) {
    const veiculo = await this.veiculosService.criar(dto);
    return { success: true, data: veiculo, message: "Veículo cadastrado com sucesso" };
  }

  @Get()
  async listar(
    @Query("ativo") ativo?: string,
    @Query("entregadorId") entregadorId?: string
  ) {
    const filtros = {
      ativo: ativo !== undefined ? ativo === "true" : undefined,
      entregadorId: entregadorId ? Number(entregadorId) : undefined,
    };
    const veiculos = await this.veiculosService.listar(filtros);
    return { success: true, data: veiculos };
  }

  @Get(":id")
  async buscarPorId(@Param("id", ParseIntPipe) id: number) {
    const veiculo = await this.veiculosService.buscarPorId(id);
    return { success: true, data: veiculo };
  }

  @Patch(":id")
  async atualizar(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AtualizarVeiculoDto
  ) {
    const veiculo = await this.veiculosService.atualizar(id, dto);
    return { success: true, data: veiculo, message: "Veículo atualizado com sucesso" };
  }
}