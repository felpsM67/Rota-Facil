import { PartialType, OmitType } from "@nestjs/mapped-types";
import { CriarEntregaDto } from "./criar-entrega.dto";

// status não é editado por aqui — tem endpoint próprio (PATCH /entregas/:id/status)
export class AtualizarEntregaDto extends PartialType(
  OmitType(CriarEntregaDto, [] as const)
) {}