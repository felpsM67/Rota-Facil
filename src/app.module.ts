import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ClientesModule } from "./clientes/clientes.module";
import { EntregadoresModule } from "./entregadores/entregadores.module";
import { VeiculosModule } from "./veiculos/veiculos.module";
import { EntregasModule } from "./entregas/entregas.module";
import { RotasModule } from "./rotas/rotas.module";

@Module({
  imports: [
    DatabaseModule,
    ClientesModule,
    EntregadoresModule,
    VeiculosModule,
    EntregasModule,
    RotasModule,
  ],
})
export class AppModule {}