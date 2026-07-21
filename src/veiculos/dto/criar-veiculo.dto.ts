import { IsString, IsOptional, IsIn, IsInt, IsNumber, MaxLength } from "class-validator";

export class CriarVeiculoDto {
  @IsString()
  @MaxLength(10)
  placa!: string;

  @IsString()
  @MaxLength(100)
  modelo!: string;

  @IsIn(["MOTO", "CARRO", "VAN", "BICICLETA"])
  tipo!: "MOTO" | "CARRO" | "VAN" | "BICICLETA";


  @IsInt()
  capacidadeEntregas!: number;

  @IsOptional()
  @IsNumber()
  custoPorKm?: number;

  @IsInt()
  entregadorId!: number;

  @IsInt()
  userId!: number;
}