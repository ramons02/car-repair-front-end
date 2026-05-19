export interface Servico {
  id?: string;
  ordemServicoId?: string;
  descricao: string;
  mecanicoId: string;
  dataHoraServico: string;
  dataHoraTermino: string;
  valor: number;
  ativo?: boolean;
}
