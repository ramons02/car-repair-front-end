export interface OrdemServico {
  id?: string;
  clienteId: string;
  veiculoId: string;
  dataEntrada: string;
  dataSaida?: string;
  problema: string;
  observacoes?: string;
  ativo?: boolean;
}
