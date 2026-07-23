import { Injectable, NotFoundException, BadGatewayException } from "@nestjs/common";
import { Coordinates, RotaOtimizadaResult, RouteProvider } from "./route-provider.interface";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OSRM_URL = "https://router.project-osrm.org";

@Injectable()
export class OsrmProvider implements RouteProvider {
  async geocode(endereco: string): Promise<Coordinates> {
    const url = `${NOMINATIM_URL}?q=${encodeURIComponent(endereco)}&format=json&limit=1`;

    const resp = await fetch(url, {
      headers: {
        // Nominatim exige um User-Agent identificável — é regra de uso, não opcional
        "User-Agent": "RotaFacil-MVP/1.0 (uso educacional/desenvolvimento)",
      },
    });

    if (!resp.ok) {
      throw new BadGatewayException("Falha ao consultar o serviço de geocodificação");
    }

    const data = await resp.json();

    if (!data || data.length === 0) {
      throw new NotFoundException(`Endereço não encontrado: "${endereco}"`);
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  }

  async otimizarRota(pontos: Coordinates[]): Promise<RotaOtimizadaResult> {
    if (pontos.length < 2) {
      throw new BadGatewayException("São necessários ao menos 2 pontos para gerar rota");
    }

    const coordsStr = pontos.map((p) => `${p.longitude},${p.latitude}`).join(";");

    // source=first: força o primeiro ponto (origem) como início da rota
    // roundtrip=false: não precisa voltar pra origem no final
    const url = `${OSRM_URL}/trip/v1/driving/${coordsStr}?source=first&roundtrip=false&overview=false`;

    const resp = await fetch(url);

    if (!resp.ok) {
      throw new BadGatewayException("Falha ao consultar o serviço de rotas (OSRM)");
    }

    const data = await resp.json();

    if (data.code !== "Ok") {
      throw new BadGatewayException(`OSRM retornou erro: ${data.code}`);
    }

    const trip = data.trips[0];

    // waypoints vem na ORDEM DE ENTRADA, cada um informando sua posição
    // (waypoint_index) dentro da rota otimizada. Precisamos inverter isso
    // para saber: "na posição X da rota, qual ponto original está?"
    const ordem: number[] = data.waypoints
      .map((wp: any, indiceOriginal: number) => ({
        indiceOriginal,
        posicaoNaRota: wp.waypoint_index,
      }))
      .sort((a: any, b: any) => a.posicaoNaRota - b.posicaoNaRota)
      .map((item: any) => item.indiceOriginal);

    return {
      distanciaTotalMetros: trip.distance,
      duracaoTotalSegundos: trip.duration,
      trechos: trip.legs.map((leg: any) => ({
        distanciaMetros: leg.distance,
        duracaoSegundos: leg.duration,
      })),
      ordem,
    };
  }
}