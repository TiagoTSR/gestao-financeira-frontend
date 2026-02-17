import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/admin-layout.component';
import { LancamentosPesquisa } from './lancamentos/lancamentos-pesquisa/lancamentos-pesquisa';
import { PessoasPesquisa } from './pessoas/pessoas-pesquisa/pessoas-pesquisa';
import { LancamentoCadastro } from './lancamentos/lancamento-cadastro/lancamento-cadastro';
import { PessoaCadastro } from './pessoas/pessoa-cadastro/pessoa-cadastro';
import { loginComponent } from './login/login-component/login-component';

export const routes: Routes = [
    {path: "", redirectTo: "login", pathMatch: "full" },
    {path: "login", component: loginComponent },
    {path: "admin", component: AdminLayoutComponent,children: [
        {path: "lancamentos", component: LancamentosPesquisa},
        {path: "pessoas", component: PessoasPesquisa},
        {path: "lancamentos/cadastro", component: LancamentoCadastro},
        {path: "pessoas/cadastro", component: PessoaCadastro},
        {path: "lancamentos/cadastro/:id", component: LancamentoCadastro},
        {path: "pessoas/cadastro/:id", component: PessoaCadastro},
    ]}
    
    ];