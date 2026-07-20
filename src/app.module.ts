import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ClientesModule } from "./clientes/clientes.module";

@Module({
  imports: [DatabaseModule, ClientesModule],
})
export class AppModule {}