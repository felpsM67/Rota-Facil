import { Module } from "@nestjs/common";
import { OsrmProvider } from "./osrm.provider";
import { GeocodingService } from "./geocoding.service";
import { ROUTE_PROVIDER } from "./route-provider.token";

@Module({
  providers: [
    GeocodingService,
    {
      provide: ROUTE_PROVIDER,
      useClass: OsrmProvider, // <- ÚNICO lugar que muda quando trocar de provedor
    },
  ],
  exports: [GeocodingService, ROUTE_PROVIDER],
})
export class CommonModule {}