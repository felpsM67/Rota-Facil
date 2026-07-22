import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ClientesModule } from "./clientes/clientes.module";
import { EntregadoresModule } from "./entregadores/entregadores.module";
import { VeiculosModule } from "./veiculos/veiculos.module";
import { EntregasModule } from "./entregas/entregas.module";

@Module({
  imports: [
    DatabaseModule,
    ClientesModule,
    EntregadoresModule,
    VeiculosModule,
    EntregasModule,
  ],
})
export class AppModule {}