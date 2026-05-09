export interface Servico {
  id?: string;
  ordemServicoId?: string;
  descricao: string;
  mecanico: string;
  dataHoraServico: string;
  dataHoraTermino: string;
  valor: number;
  ativo?: boolean;
}
