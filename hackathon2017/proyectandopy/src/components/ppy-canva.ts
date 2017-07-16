
import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'ppy-canva',
  templateUrl: 'ppy-canva.html'
})

export class PpyCanva {
   backgroundColor= [
    'rgba(255, 99, 132, 0.2)',
    'rgba(244, 164, 96, 0.8)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
  ];

  borderColor= [
    'rgba(255,99,132,1)',
    'rgba(244, 164, 96, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ];

  @ViewChild('canva') canva;

  _presupuesto: { nombre: string, nombre_programas: string, programas: Array<any>};

  @Input()
  set presupuesto(presupuesto: { nombre: string, nombre_programas: string, programas: Array<any>}) {
    this._presupuesto = presupuesto;
  }

  get presupuesto() { return this._presupuesto; }

  ngOnInit() {
    this.getBarChart(this.presupuesto.nombre, this.presupuesto.nombre_programas, this.presupuesto.programas, this.getArrayDataDoughnut, this.backgroundColor, this.borderColor)
  }

  getChart(context, chartType, data, options?) {
    return new Chart(context, {
      type: chartType,
      data: data,
      options: options
    });
  }

  getArrayDataBar(series, background, border){
    var datasets= []
    var i=0;
    series.map(function(x) {
        datasets.push({
          label: x.name,
          data: [x.value],
          backgroundColor: background[i],
          borderColor: border[i],
          borderWidth: 1
        });
        i += 1;
    });
    return datasets;
  }

  getArrayDataDoughnut(series, background, border){
    console.log(background)
    var data= [];
    series.map(function(x) {
        data.push(x.value);
    });
    var datasets = [{
      backgroundColor: background,
      borderColor: border,
      data: data
    }]
    return datasets;
  }

  getBarChart(label, labels, series, getArrayData, background, border) {
    let data = {
      labels: labels.map(function(x) {
        return x.toLowerCase();
      }),
      datasets: getArrayData(series, background, border),

    };

    let options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
            display: false
        }],

      },
      legend: {
          labels: {
              // This more specific font property overrides the global property
              fontSize: 10
          }
      }
    }
    console.log(series)
    return this.getChart(this.canva.nativeElement, "doughnut", data, options);

  }
}
