import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { DashboardService } from './dashboard.service';
import { forkJoin } from 'rxjs';

Chart.register(ChartDataLabels);

type Modo = 'mes' | 'periodo';

// ✅ Interfaces para tipagem dos dados da API
interface DadoCategoria {
  categoria: { nome: string };
  total: number;
}

interface DadoDia {
  dia: string; // "YYYY-MM-DD"
  tipo: 'RECEITA' | 'DESPESA';
  total: number;
}

const CHART_COLORS = {
  receita: '#3366CC',
  despesa: '#D62B00',
  categorias: ['#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477'],
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChartModule,
    PanelModule,
    DatePickerModule,
    SelectButtonModule,
    ButtonModule,
    FormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  pieChartData: any;
  lineChartData: any;
  carregando = false;

  modos = [
    { label: 'Por mês', value: 'mes' },
    { label: 'Por período', value: 'periodo' },
  ];
  modoSelecionado: Modo = 'mes';

  mesSelecionado: Date = new Date();
  intervalo: Date[] = [];
  periodoLabel = '';
  pieChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold' as const, size: 14 },
        formatter: (value: number) => value,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} lançamentos`;
          },
        },
      },
    },
  };

  lineChartOptions: any = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' as const },
      datalabels: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value: number = context.raw || 0;
            return `${context.dataset.label}: R$ ${value.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) =>
            'R$ ' + Number(value).toLocaleString('pt-BR'),
        },
      },
      x: {
        grid: { display: false },
      },
    },
    elements: {
      line: { borderWidth: 3 },
    },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    const { inicio, fim } = this.calcularPeriodo();
    if (!inicio || !fim) return;

    this.periodoLabel = `${this.formatarData(inicio)} – ${this.formatarData(fim)}`;
    this.carregarDados(inicio, fim);
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

    if (this.intervalo?.length === 2 && this.intervalo[1]) {
      return {
        inicio: toISO(this.intervalo[0]),
        fim: toISO(this.intervalo[1]),
      };
    }

    return { inicio: '', fim: '' };
  }

  private carregarDados(inicio: string, fim: string): void {
    this.carregando = true;

    forkJoin({
      porCategoria: this.dashboardService.lancamentosPorCategoria(inicio, fim),
      porDia: this.dashboardService.lancamentosPorDia(inicio, fim),
    }).subscribe({
      next: ({ porCategoria, porDia }) => {
        this.montarGraficoPizza(porCategoria);
        this.montarGraficoLinha(porDia);
        this.carregando = false;
      },
      error: () => (this.carregando = false),
    });
  }

  private montarGraficoPizza(dados: DadoCategoria[]): void {
    this.pieChartData = {
      labels: dados.map((d) => d.categoria.nome),
      datasets: [
        {
          data: dados.map((d) => d.total),
          backgroundColor: CHART_COLORS.categorias,
        },
      ],
    };
  }

  private montarGraficoLinha(dados: DadoDia[]): void {
  const diasUnicos = [...new Set(dados.map((d) => d.dia))].sort((a, b) =>
    a.localeCompare(b)
  );

  const buscarTotal = (dia: string, tipo: 'RECEITA' | 'DESPESA'): number => {
    const registro = dados.find((d) => d.dia === dia && d.tipo === tipo);
    return registro?.total ?? 0;
  };

  const receitas = diasUnicos.map((dia) => buscarTotal(dia, 'RECEITA'));
  const despesas = diasUnicos.map((dia) => buscarTotal(dia, 'DESPESA'));

  const maiorValor = Math.max(...receitas, ...despesas, 500);

  const maxDinamico = Math.ceil((maiorValor * 1.2) / 5000) * 5000;

  const stepSize = maxDinamico <= 10000  ? 1000
                 : maxDinamico <= 50000  ? 5000
                 : maxDinamico <= 200000 ? 10000
                 : 50000;

  this.lineChartOptions = {
    ...this.lineChartOptions,
    scales: {
      y: {
        min: 500,
        max: maxDinamico,
        beginAtZero: false,
        ticks: {
          stepSize,
          callback: (value: any) =>
            'R$ ' + Number(value).toLocaleString('pt-BR'),
        },
      },
      x: { grid: { display: false } },
    },
  };

  this.lineChartData = {
    labels: diasUnicos.map((diaStr) => {
      const [, mes, dia] = diaStr.split('-');
      return `${dia}/${mes}`;
    }),
    datasets: [
      {
        label: 'Receitas',
        data: receitas,
        borderColor: CHART_COLORS.receita,
        backgroundColor: CHART_COLORS.receita + '33',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: false,
        spanGaps: true,
      },
      {
        label: 'Despesas',
        data: despesas,
        borderColor: CHART_COLORS.despesa,
        backgroundColor: CHART_COLORS.despesa + '33',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: false,
        spanGaps: true,
      },
    ],
  };
}

private formatarData(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
}