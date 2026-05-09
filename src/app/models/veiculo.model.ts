export interface Veiculo {
  id?: string;
  marca: string;
  modelo: string;
  anoFabricacao: number | null;
  anoModelo: number | null;
  placa: string;
  cor: string;
  ativo?: boolean;
}
