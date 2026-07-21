import { IsString, IsOptional, IsBoolean, IsInt, MaxLength } from "class-validator";

export class CriarEntregadorDto {
  @IsString()
  @MaxLength(150)
  nome!: string;

  @IsString()
  @MaxLength(20)
  telefone!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  documento?: string;

  @IsOptional()
  @IsBoolean()
  disponivel?: boolean;

  @IsOptional()
  @IsInt()
  userId?: number;
}