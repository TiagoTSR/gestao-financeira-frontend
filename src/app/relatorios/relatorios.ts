import { Component, OnInit } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { RelatoriosService } from './relatorios.service';

type Modo = 'mes' | 'periodo';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    DatePickerModule,
    SelectButtonModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.scss',
})
export class Relatorios implements OnInit {

  modos = [
    { label: 'Por mês', value: 'mes' },
    { label: 'Por período', value: 'periodo' },
  ];
  modoSelecionado: Modo = 'mes';

  mesSelecionado: Date = new Date();
  periodoInicio?: Date;
  periodoFim?: Date;
  periodoLabel = '';

  ngOnInit(): void {}

  periodoValido(): boolean {
    if (this.modoSelecionado === 'mes') {
      return !!this.mesSelecionado;
    }
    return !!this.periodoInicio && !!this.periodoFim;
  }

  private calcularPeriodo(): { inicio: string; fim: string } {
    const toISO = (data: Date): string => {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const dia = String(data.getDate()).padStart(2, '0');
      return `${ano}-${mes}-${dia}`;
    };

    if (this.modoSelecionado === 'mes') {
      const ano = this.mesSelecionado.getFullYear();
      const mes = this.mesSelecionado.getMonth();
      return {
        inicio: toISO(new Date(ano, mes, 1)),
        fim: toISO(new Date(ano, mes + 1, 0)),
      };
    }

    return {
      inicio: toISO(this.periodoInicio!),
      fim: toISO(this.periodoFim!),
    };
  }

  private formatarData(iso: string): string {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }
  constructor(private relatoriosService: RelatoriosService) {}

  async gerar(): Promise<void> {
  if (!this.periodoValido()) return;

  const { inicio, fim } = this.calcularPeriodo();

  try {
    const blob = await this.relatoriosService
      .relatorioLancamentosPorPessoa(
        new Date(inicio),
        new Date(fim)
      );

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `relatorio.pdf`;
    link.click();

    window.URL.revokeObjectURL(url);
    link.remove();

  } catch (error) {
    console.error('Erro ao gerar relatório', error);
  }
}
}