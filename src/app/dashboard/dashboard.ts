import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-dashboard',
  imports: [ChartModule, PanelModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

   pieChartData = {
    labels: ['Mensal', 'Educação', 'Lazer', 'Imprevistos'],
    datasets: [
      {
        data: [2500, 2700, 550, 235],
        backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC']
      }
    ]
  };
  lineChartData = {
    labels: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    datasets: [
      {
        label: 'Receitas',
        data: [4, 10, 18, 5, 1, 20, 3],
        borderColor: '#3366CC'
      }, {
        label: 'Despesas',
        data: [10, 15, 8, 5, 1, 7, 9],
        borderColor: '#D62B00'
      }
    ]
  };

 pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { boxWidth: 10, padding: 8 }
    },
    datalabels: {
      color: '#fff',
      font: { weight: 'bold' as const, size: 12 },
      anchor: 'center' as const,
      align: 'center' as const,
      clamp: true,
      clip: false,
      formatter: (value: number, ctx: any) => {
        const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
        const percent = ((value / total) * 100).toFixed(1);
        if ((value / total) < 0.07) return '';
        return `R$ ${value.toLocaleString('pt-BR')}\n${percent}%`;
      }
    }
  },
  layout: { padding: 0 }
};

maxValue = Math.max(...this.lineChartData.datasets.flatMap(d => d.data));

lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { boxWidth: 10, padding: 8 }
    },
    datalabels: {
      color: (ctx: any) => ctx.dataset.borderColor, // mesma cor da linha
      font: { weight: 'bold' as const, size: 11 },
      anchor: 'end' as const,
      align: 'top' as const,        // número aparece acima do ponto
      offset: 4,
      formatter: (value: number) => value
    }
  },
  layout: { padding: { top: 20, bottom: 0, left: 0, right: 0 } }, // espaço para o label do topo
  scales: {
    y: {
      min: 0,
      max: 25,
      ticks: { padding: 2 },
      grid: { drawBorder: false }
    },
    x: {
      ticks: { padding: 2 },
      grid: { drawBorder: false },
      offset: false
    }
  }
};
  constructor() { }

  ngOnInit() {
  }

}
