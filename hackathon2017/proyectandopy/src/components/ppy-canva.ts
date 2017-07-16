import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'ppy-canva',
  templateUrl: 'ppy-canva.html'
})

export class PpyCanva {

  @ViewChild('canva') canva;

  _presupuesto: { nombre: string, nombre_programas: string, programas: Array<any>};

  @Input()
  set presupuesto(presupuesto: { nombre: string, nombre_programas: string, programas: Array<any>}) {
    this._presupuesto = presupuesto;
  }

  get presupuesto() { return this._presupuesto; }

  ngOnInit() {
    this.getBarChart(this.presupuesto.nombre, this.presupuesto.nombre_programas, this.presupuesto.programas)
  }

  getChart(context, chartType, data, options?) {
    return new Chart(context, {
      type: chartType,
      data: data,
      options: options
    });
  }

  getBarChart(label, labels, series) {
    let data = {
      labels: labels,
      datasets: [{
        label: label,
        data: series.map(function(x) {
            return x.value;
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(244, 164, 96, 0.8)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(244, 164, 96, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    };

    let options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
    console.log(series)
    return this.getChart(this.canva.nativeElement, "bar", data, options);

  }
}
