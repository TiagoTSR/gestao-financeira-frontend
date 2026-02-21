import { TipoLancamento } from './tipoLancamento.model';

export interface Lancamento {
  id: number;
  descricao: string;
  dataVencimento: string; 
  dataPagamento: string;
  valor: number;
  observacao: string;
  tipo: TipoLancamento;
  categoriaId?: number;
  categoriaNome?: string;
  pessoaId?: number;
  pessoaNome?: string;
}