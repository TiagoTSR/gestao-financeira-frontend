import { Endereco } from './endereco.model';

export interface Pessoa {
  id: number;
  nome: string;
  endereco: Endereco;
  ativo: boolean;
}