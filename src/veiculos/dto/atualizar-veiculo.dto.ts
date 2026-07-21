import { PartialType } from "@nestjs/mapped-types";
import { CriarVeiculoDto } from "./criar-veiculo.dto";

export class AtualizarVeiculoDto extends PartialType(CriarVeiculoDto) {}