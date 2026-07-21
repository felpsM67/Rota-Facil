import { PartialType } from "@nestjs/mapped-types";
import { CriarEntregadorDto } from "./criar-entregador.dto";

export class AtualizarEntregadorDto extends PartialType(CriarEntregadorDto) {}