import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/admin-layout.component';
import { LancamentosPesquisa } from './lancamentos/lancamentos-pesquisa/lancamentos-pesquisa';
import { PessoasPesquisa } from './pessoas/pessoas-pesquisa/pessoas-pesquisa';
import { LancamentoCadastro } from './lancamentos/lancamento-cadastro/lancamento-cadastro';
import { PessoaCadastro } from './pessoas/pessoa-cadastro/pessoa-cadastro';
import { loginComponent } from './login/login-component/login-component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    {path: "", redirectTo: "login", pathMatch: "full" },
    {path: "login", component: loginComponent },
    {path: "admin", component: AdminLayoutComponent,canActivate: [authGuard],children: [
        {path: "lancamentos", component: LancamentosPesquisa,canActivate: [authGuard]},
        {path: "pessoas", component: PessoasPesquisa,canActivate: [authGuard]},
        {path: "lancamentos/cadastro", component: LancamentoCadastro,canActivate: [authGuard]},
        {path: "pessoas/cadastro", component: PessoaCadastro,canActivate: [authGuard]},
        {path: "lancamentos/cadastro/:id", component: LancamentoCadastro,canActivate: [authGuard]},
        {path: "pessoas/cadastro/:id", component: PessoaCadastro,canActivate: [authGuard]},
    ]}
    
    ];