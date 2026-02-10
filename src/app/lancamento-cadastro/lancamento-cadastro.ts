import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { SelectButtonModule } from 'primeng/selectbutton';


@Component({
  selector: 'app-lancamento-cadastro',
  imports: [
    FormsModule,
    ButtonModule,
    FluidModule,
    InputNumberModule,
    InputTextModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    SelectButtonModule
  ],
  templateUrl: './lancamento-cadastro.html',
  styleUrl: './lancamento-cadastro.scss',
})
export class LancamentoCadastro {

  dataVencimento: Date | undefined;
  dataRecebimento: Date | undefined;

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];
  
}
