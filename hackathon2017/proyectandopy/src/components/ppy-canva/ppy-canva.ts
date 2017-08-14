
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
    this._presupuestos = Object.keys(presupuestos).map(key=>presupuestos[key]);
  }

  get presupuestos() { return this._presupuestos; }

  ngOnInit() {

    this.generatePie();
  }

  generatePie() {
    var dispatch = d3.dispatch("load", "statechange");

    var presupuestosByName = d3.map();
    this.presupuestos.forEach(function(d) { presupuestosByName.set(d.nombre, {nombre: d.nombre, programas: d.programas}); });

    // A drop-down menu for selecting a state; uses the "menu" namespace.
    dispatch.on("load.menu", function(presupuestosByName) {
      var select = d3.select('.py-canva-select')
      .on("change", function() { dispatch.call("statechange", this, presupuestosByName.get(this.value)); });
      select.selectAll("option")
      .data(presupuestosByName.values())
      .enter().append("option")
      .attr("value", function(d) { return d.nombre; })
      .text(function(d) { return d.nombre; });
      dispatch.on("statechange.menu", function(presupuesto) {
        select.property("value", presupuesto.nombre);
      });
    });

    dispatch.on("load.pie", function(presupuestosByName) {
      let width  = this.graph.nativeElement.clientWidth;
      let height = this.graph.nativeElement.clientWidth;
      let radius = Math.min(width, height) / 2;
      let data = presupuestosByName.get(presupuestosByName.keys()[0]).programas;
      let color  = d3.scaleOrdinal()
      .range(["#00838f",
      "#388e3c", "#ad1457",
      "#ff1744", "#1a237e",
      "#004d40", "#607d8b"]);

      let arc = d3.arc()
      .outerRadius(radius * 0.5)
      .innerRadius(radius - 20);

      let pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.value; });

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
      .text(function(d) { return d.data.value.toString()+" Gs"; })
      .style("fill", "white");

      let tooltip = d3.select('#chart')                               // NEW
          .append('div')                                                // NEW
          .attr('class', 'tooltip');                                    // NEW

        tooltip.append('div')                                           // NEW
          .attr('class', 'label');                                      // NEW

        tooltip.append('div')                                           // NEW
          .attr('class', 'count');                                      // NEW

        tooltip.append('div')                                           // NEW
          .attr('class', 'percent');
          g.on('mouseover', function(d) {                            // NEW
                var total = d3.sum(data.map(function(d) {                // NEW
                  console.log(d);
                  return d.count;                                           // NEW
                }));                                                        // NEW
                var percent = Math.round(1000 * d.data.value / total) / 10; // NEW
                tooltip.select('.label').html(d.data.name);                // NEW
                tooltip.select('.count').html(d.data.value);                // NEW
                tooltip.select('.percent').html(percent + '%');             // NEW
                tooltip.style('display', 'block');                          // NEW
              });
      dispatch.on("statechange.pie", function(d) {
        svg.selectAll("*").remove();
        let g = svg.selectAll(".arc")
        .data(pie(d.programas))
        .enter().append("g")
        .attr("class", "arc");

        g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.value); });

        g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.value.toString()+"Gs"; })
        .style("fill", "white");
      });
    });

    dispatch.call("load", this, presupuestosByName);
    dispatch.call("statechange", this, presupuestosByName.get(presupuestosByName.keys()[0]));

  }

}
