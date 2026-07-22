import {
  IsString,
  IsOptional,
  IsIn,
  IsInt,
  IsNumber,
  IsDateString,
  MaxLength,
} from "class-validator";

export class CriarEntregaDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigoExterno?: string;

  @IsOptional()
  @IsInt()
  clienteId?: number;

  @IsInt()
  userId!: number;

  @IsString()
  @MaxLength(150)
  nomeCliente!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefoneCliente?: string;

  @IsString()
  @MaxLength(150)
  rua!: string;


  @IsString()
  numero!: string;


  @IsString()
  bairro!: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsIn(["BAIXA", "NORMAL", "ALTA", "URGENTE"])
  prioridade?: "BAIXA" | "NORMAL" | "ALTA" | "URGENTE";

  @IsOptional()
  @IsDateString()
  dataAgendada?: Date;

  @IsOptional()
  @IsDateString()
  inicioJanelaEntrega?: Date;

  @IsOptional()
  @IsDateString()
  fimJanelaEntrega?: Date;

  @IsOptional()
  @IsString()
  observacao?: string;
}