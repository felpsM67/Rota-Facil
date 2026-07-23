import { Injectable, Inject } from "@nestjs/common";
import Entrega from "../models/Entrega";
import type { RouteProvider } from "./route-provider.interface";
import { ROUTE_PROVIDER } from "./route-provider.token";

@Injectable()
export class GeocodingService {
  constructor(
    @Inject(ROUTE_PROVIDER) private readonly routeProvider: RouteProvider
  ) {}

  private montarEndereco(entrega: Entrega): string {
    return [entrega.rua, entrega.numero, entrega.bairro, entrega.cidade, entrega.estado]
      .filter(Boolean)
      .join(", ");
  }

  /** Só chama a API se a entrega ainda não tiver coordenadas salvas */
  async geocodificarEntregaSeNecessario(entrega: Entrega): Promise<void> {
    if (entrega.latitude && entrega.longitude) return;

    const endereco = this.montarEndereco(entrega);
    const coords = await this.routeProvider.geocode(endereco);

    entrega.latitude = coords.latitude;
    entrega.longitude = coords.longitude;
    await entrega.save();
  }

  async geocodificarEndereco(endereco: string) {
    return this.routeProvider.geocode(endereco);
  }

  /** Nominatim pede no máx. ~1 req/segundo — respeitamos isso ao geocodificar em lote */
  async aguardarLimiteDeRequisicao(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1100));
  }
}