import { TipoLancamento } from './tipoLancamento.model';

export interface Lancamento {
  id: number;
  descricao: string;
  dataVencimento: Date; 
  dataPagamento: Date;
  valor: number;
  observacao: string;
  tipo: TipoLancamento;
  pessoaId: number;
  categoriaId: number | null;
}