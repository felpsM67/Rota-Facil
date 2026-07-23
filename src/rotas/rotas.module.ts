import { Module } from "@nestjs/common";
import { RotasController } from "./rotas.controller";
import { RotasService } from "./rotas.service";
import { RouteOptimizerService } from "./route-optimizer.service";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [CommonModule],
  controllers: [RotasController],
  providers: [RotasService, RouteOptimizerService],
})
export class RotasModule {}