export interface PessoaQueryParams {
  nome?: string;
  cidade?: string;
  ativo?: boolean;

  page?: number;
  size?: number;
  sort?: string[];
}