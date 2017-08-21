
import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import * as d3 from "d3";
import { Platform } from 'ionic-angular';
import { AppHelper } from '../../helpers/app-helper';

@Component({
  selector: 'ppy-canva',
  templateUrl: 'ppy-canva.html'
})

export class PpyCanva {
  backgroundColor= [
    'rgb(247, 109, 109)',
    'rgb(247, 109, 187)',
    'rgb(224, 109, 247)',
    'rgb(148, 109, 247)',
    'rgb(109, 141, 247)',
    'rgb(109, 211, 247)',
    'rgb(109, 247, 201)'
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
  selectData: string
  options: Array<any>

  @ViewChild('graph') graph;

  _presupuestos: Array<{ nombre: string, nombre_programas: string, programas: Array<any>}>;

  @Input()
  set presupuestos(presupuestos: Array<{ nombre: string, nombre_programas: string, programas: Array<any>}>) {
    this._presupuestos = Object.keys(presupuestos).map(key=>presupuestos[key]);
  }

  get presupuestos() { return this._presupuestos; }

  ngOnInit() {
    let presupuestosByName = d3.map();
    this.presupuestos.forEach(function(d) { presupuestosByName.set(d.nombre, {nombre: d.nombre, programas: d.programas}); });
    this.options = presupuestosByName.values();
    this.selectData = presupuestosByName.keys()[0];
    this.generatePie();
  }

  onItemSelect($event) {
    this.generatePie();
  }

  generatePie() {
    let self = this;
    let dispatch = d3.dispatch("load", "statechange");

    let presupuestosByName = d3.map();
    this.presupuestos.forEach(function(d) { presupuestosByName.set(d.nombre, {nombre: d.nombre, programas: d.programas}); });

    dispatch.on("load.pie", function(presupuestosByName) {
      let width  = this.graph.nativeElement.clientWidth * 0.8;
      let height = this.graph.nativeElement.clientWidth * 0.8;
      let radius = Math.min(width, height) / 2;
      let data = presupuestosByName["$"+self.selectData].programas;
      let color  = d3.scaleOrdinal()
      .range(this.backgroundColor);

      let legend = d3.select("#pie-info-legend");
      legend.html('');

      let arc = d3.arc()
      .outerRadius(radius * 0.5)
      .innerRadius(radius - 20);

      let pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.value; });

      d3.select(this.graph.nativeElement).html('');

      let info = d3.select('.pie-info');
      info.select('#label').html("Seleccione un programa");                // NEW
      info.select('#count').html('');                // NEW
      info.select('#percent').html('');

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
      .style("fill", function(d) {
        legend.append("p")
              .html(`<i style="background:${color(d.data.value)}"></i> ${AppHelper.toTitleCase(d.data.name)}<br>`);
        return color(d.data.value);
      });

      svg.append("div")
         .attr("class", "pie-info");

      dispatch.on("statechange.pie", function(d) {
        svg.selectAll("*").remove();
        let g = svg.selectAll(".arc")
                   .data(pie(d.programas))
                   .enter().append("g")
                   .attr("class", "arc");

        g.append("path")
         .attr("d", arc)
         .style("fill", function(d) { return color(d.data.value); })
         .style("fill-opacity", .5) // set the fill opacity
         .style("stroke", function(d) { return color(d.data.value); })    // set the line colour
         .style("stroke-width", 2);

        g.on('click', function(d) {
          let total = d3.sum(data.map(function(d) {              // NEW
            return d.value;                                           // NEW
          }));
          console.log(total)
          let info = d3.select('.pie-info');
          let percent = Math.round(1000 * d.data.value / total)/10; // NEW
          info.select('#label').html(AppHelper.toTitleCase(d.data.name));                // NEW
          info.select('#count').html(d.data.value*1000000 + ' Gs');                // NEW
          info.select('#percentage').html(percent + '%');             // NEW
          info.style('display', 'block');                          // NEW
        });
      });
    });

    dispatch.call("load", this, presupuestosByName);
    dispatch.call("statechange", this, presupuestosByName["$"+self.selectData]);

  }

}
