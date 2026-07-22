import { IsIn, IsOptional, IsString } from "class-validator";

const STATUS_VALIDOS = [
  "PENDENTE",
  "ATRIBUIDA",
  "EM_ROTA",
  "ENTREGUE",
  "FALHOU",
  "REAGENDADA",
  "CANCELADA",
] as const;

export class MudarStatusDto {
  @IsIn(STATUS_VALIDOS)
  status!: (typeof STATUS_VALIDOS)[number];

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  alteradoPorUserId?: number;
}