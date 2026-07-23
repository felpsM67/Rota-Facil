import {
  IsInt,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
  ArrayMinSize,
} from "class-validator";

export class GerarRotaDto {
  @IsInt()
  userId: number;

  @IsInt()
  entregadorId: number;

  @IsOptional()
  @IsInt()
  veiculoId?: number;

  @IsString()
  enderecoOrigem: string;

  @IsOptional()
  @IsNumber()
  latitudeOrigem?: number;

  @IsOptional()
  @IsNumber()
  longitudeOrigem?: number;

  @IsDateString()
  dataRota: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  entregaIds: number[];
}