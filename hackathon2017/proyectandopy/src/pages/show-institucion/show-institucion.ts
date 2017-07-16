import { Component, Injectable, ViewChildren, QueryList } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShowBasePage } from '../../app/show-base-page';
import { InstitucionData } from '../../providers/institucion';

import { Chart } from 'chart.js';


@Component({
  selector: 'page-show-institucion',
  templateUrl: 'show-institucion.html',
  providers: [InstitucionData]
})

export class ShowInstitucionPage extends ShowBasePage {

  item: {id: string, nivelId: string, nombre: string, meta: any}

  meta: Array<any>

  charts: Array<any>

  chartsData: any

  presupuestos: Array<string>

  @ViewChildren('.canvas') ionSlides:QueryList<any>;
  //@ViewChild('barCanvas') barCanvas;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData) {
    super(navCtrl, navParams);
    this.dataService = dataService;
  }

  ionViewDidLoad() {
    this.charts = [];
    this.dataService.getQuery(this.dataService.getResumenPrograma(this.item.nivelId, this.item.id, undefined)).then(records => {
      this.chartsData = this.structResumenPrograma(records);
      this.presupuestos = Object.keys(this.charts);
      for(let key of this.charts) {
        this.charts.push(this.getBarChart());
      }
    });
  }

  pushItem(record: {id: string, nivelId: string, nombre: string, meta: any}) {

  }

  structResumenPrograma (meta):any {
    let presupuestos = {};

    for(let row of meta) {
      if(presupuestos[row.tipo_presupuesto_id] === undefined){
        presupuestos[row.tipo_presupuesto_id] = {nombre: row.tipo_presupuesto_nombre, nombre_programas: [], programas: []};
      }
      presupuestos[row.tipo_presupuesto_id].nombre_programas.push(row.programa_nombre);
      presupuestos[row.tipo_presupuesto_id].programas.push({name: row.programa_nombre, value: row.cantidad_total});
      presupuestos[row.tipo_presupuesto_id].nombre_programas = presupuestos[row.tipo_presupuesto_id].nombre_programas.sort();
    };
    console.log(presupuestos)
    return presupuestos;
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
        data: [],
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

    return this.getChart(this.chart.nativeElement, "bar", data, options);
  }

}
