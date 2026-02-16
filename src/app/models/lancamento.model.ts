export interface Lancamento {
  id: number;
  descricao: string;
  dataVencimento: Date; 
  dataPagamento: Date;
  valor: number;
  observacao: string;
  tipo: 'RECEITA' | 'DESPESA';
  
  categoriaId: number;
  categoriaNome: string;
  pessoaId: number;
  pessoaNome: string;
}