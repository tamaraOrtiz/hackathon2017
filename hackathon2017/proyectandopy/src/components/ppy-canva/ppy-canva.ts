
import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import * as d3 from "d3";
import { Platform } from 'ionic-angular';

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

  @ViewChild('graph') graph;

  _presupuestos: Array<{ nombre: string, nombre_programas: string, programas: Array<any>}>;

  @Input()
  set presupuestos(presupuestos: Array<{ nombre: string, nombre_programas: string, programas: Array<any>}>) {
    console.log(Object.keys(presupuestos).map(key=>presupuestos[key]));
    this._presupuestos = Object.keys(presupuestos).map(key=>presupuestos[key]);
  }

  get presupuestos() { return this._presupuestos; }

  ngOnInit() {

    this.generatePie();
    //this.getBarChart(this.presupuesto.nombre, this.presupuesto.nombre_programas, this.presupuesto.programas, this.getArrayDataDoughnut, this.backgroundColor, this.borderColor)
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
      onAnimationComplete: function () {
        console.log(this.graph.nativeElement.toDataURL("image/png"));
      },
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

    return this.getChart(this.graph.nativeElement, "doughnut", data, options);

  }

  generatePie() {
    var dispatch = d3.dispatch("load", "statechange");
    // A drop-down menu for selecting a state; uses the "menu" namespace.
    dispatch.on("load.menu", function(stateById) {
      var select = d3.select("body")
      .append("div")
      .append("select")
      .on("change", function() { dispatch.call("statechange", this, stateById.get(this.value)); });

      select.selectAll("option")
      .data(stateById.values())
      .enter().append("option")
      .attr("value", function(d) { return d.id; })
      .text(function(d) { return d.id; });

      dispatch.on("statechange.menu", function(state) {
        select.property("value", state.id);
      });
    });
    let width  = 200;
    let height = 200;
    let radius = Math.min(width, height) / 2;

    let data = this.presupuestos[0].programas.filter((item) => {
      return [item.value, item.name];
    });

    let color  = d3.scaleOrdinal()
    .range(["#00838f",
    "#388e3c", "#ad1457",
    "#ff1744", "#1a237e",
    "#004d40", "#607d8b"]);

    let arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

    let pie = d3.pie()
    .sort(null)
    .value(function(d) { console.log(d); return d.value; });

    let svg = d3.select(this.graph.nativeElement)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

    g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color(d.data.value); });

    g.append("text")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.data.value; });
  }

}
