export interface Cliente {
  id?: string;
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo?: boolean;
}