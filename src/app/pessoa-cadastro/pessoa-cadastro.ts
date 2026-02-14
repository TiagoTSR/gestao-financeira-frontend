import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-pessoa-cadastro',
  imports: [
    FormsModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    TableModule
  ],
  templateUrl: './pessoa-cadastro.html',
  styleUrl: './pessoa-cadastro.scss',
})
export class PessoaCadastro {

}
