import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsInt,
  Length,
  MaxLength,
} from "class-validator";

export class CriarClienteDto {
  @IsString()
  @MaxLength(150)
  nome!: string;

  @IsString()
  @MaxLength(20)
  telefone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  rua?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  numero?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bairro?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  cidade?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  estado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(9)
  cep?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  complemento?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsInt()
  userId!: number;
}