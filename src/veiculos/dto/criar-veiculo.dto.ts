import { IsString, IsOptional, IsIn, IsInt, IsNumber, MaxLength } from "class-validator";

export class CriarVeiculoDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  placa?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  modelo?: string;

  @IsIn(["MOTO", "CARRO", "VAN", "BICICLETA"])
  tipo!: "MOTO" | "CARRO" | "VAN" | "BICICLETA";


  @IsInt()
  capacidadeEntregas!: number;

  @IsOptional()
  @IsNumber()
  custoPorKm?: number;

  @IsOptional()
  @IsInt()
  entregadorId?: number;

  @IsInt()
  userId!: number;
}