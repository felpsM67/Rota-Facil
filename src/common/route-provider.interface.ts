export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface TrechoRota {
  distanciaMetros: number;
  duracaoSegundos: number;
}

export interface RotaOtimizadaResult {
  distanciaTotalMetros: number;
  duracaoTotalSegundos: number;
  trechos: TrechoRota[];
  // ordem dos ÍNDICES ORIGINAIS dos pontos, na sequência otimizada de visita
  // ordem[0] é sempre a origem (índice 0)
  ordem: number[];
}

export interface RouteProvider {
  geocode(endereco: string): Promise<Coordinates>;
  otimizarRota(pontos: Coordinates[]): Promise<RotaOtimizadaResult>;
}

