export interface LancamentoQueryParams {
  
  descricao?: string;
  dataVencimentoDe?: string;   
  dataVencimentoAte?: string;  
 
  page?: number;
  size?: number;

 
  sort?: string[]; 
}