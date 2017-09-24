import { Component, Input, ViewChild } from '@angular/core';
import * as d3 from "d3";
import { AppHelper } from '../../helpers/app-helper';

@Component({
  selector: 'ppy-canva',
  templateUrl: 'ppy-canva.html'
})

export class PpyCanva {
  selectData: string

  selectedCharType: number

  selectedTitled: string

  titles = ['Inversión por Programa', 'Avances vs Metas', 'Costos vs Beneficiarios']

  options: Array<any>

  hashColores: any = {};

  smallScreen: boolean = false;

  @ViewChild('graph') graph;

  _presupuestos: Array<any>;

  public constructor(public appHelper: AppHelper) {
    this.smallScreen = appHelper.platform.width() < 768;
  }

  @Input()
  set presupuestos(presupuestos: Array<any>) {
    this._presupuestos = Object.keys(presupuestos).map(key=> {
      let tipo = {};
      tipo['nombre'] = key;
      tipo['programas'] = Object.keys(presupuestos[key]).map(k=> {
        let programa = {};
        programa['nombre'] = k;
        return Object.assign({}, programa, presupuestos[key][k]);
      });
      return tipo;
    });
  }

  get presupuestos() { return this._presupuestos; }

  ngOnInit() {
    let presupuestosByName = d3.map();
    this.presupuestos.forEach(function(d) { presupuestosByName.set(d.nombre, {nombre: d.nombre, programas: d.programas}); });
    this.options = presupuestosByName.values();
    this.selectData = presupuestosByName.keys()[0];
  }

  ngAfterViewInit() {
    if(this.options.length > 0){
      this.generatePie();
    }
  }

  onItemSelect($event) {
    this.generatePie();
  }

  onGraphTypeSelect($event){
    this.selectedTitled = this.titles[this.selectedCharType];
    switch(this.selectedCharType) {
      case 0:
        this.generatePie();
        break;
      case 1:
        this.generateAvancesGraph();
        break;
      case 2:
        this.generateAvancesVsMetasGraph();
        break;
      case 3:
        this.generateCostosVsBeneficiariosGraph();
        break;
      default:
        break;
    }
  }

  generateAvancesVsMetasGraph(){
    let self = this;
    let dispatch = d3.dispatch("load", "statechange");
    let avancesVsMetas = d3.map();
  }

  generateCostosVsBeneficiariosGraph(){
    let self = this;
    let dispatch = d3.dispatch("load", "statechange");
    let costosVsBeneficiarios = d3.map();
  }

  generateAvancesGraph(){
    let self = this;
    let dispatch = d3.dispatch("load", "statechange");
    let avances = d3.map();
  }

  colores(key) {
    let colors = ["#e1eef6", "#ff5f2e", "#fcbe32",
                  "#004e66", "#2b90d9", "#ff4e50",
                  "#008c9e", "#490a3d", "#ee6e9f",
                  "#3b8686", "#ee2560", "#5c196b",
                  "#b84a39", "#7200da", "#CBA6C3",
                  "#67D5B5", "#C16200", "#D1B6E1"]
    if(!this.hashColores[key]){
      this.hashColores[key] = colors[Math.round(colors.length * Math.random())];
    }
    return this.hashColores[key];
  }

  generatePie() {
    let self = this;
    let dispatch = d3.dispatch("load", "statechange");

    let presupuestosByName = d3.map();
    this.presupuestos.forEach(function(d) {
      let otrosProgramas = { nombre: "Otros", total: 0, detalle: {} };
      let programas = [];
      let total = d3.sum(d.programas.map(function(d) {
        return d.total;
      }));
      d.programas.forEach(function(programa) {
        if(programa.total * 1.0 / total <= 0.10){
          otrosProgramas.total+= programa.total;

          self.appHelper.combineHashes(programa.detalle, otrosProgramas.detalle);
        } else {
          programas.push(programa);
        }
      });
      if(otrosProgramas.total > 0) {
        programas.push(otrosProgramas);
      }
      presupuestosByName.set(d.nombre, { nombre: d.nombre, programas: programas });
    });

    dispatch.on("load.pie", function(presupuestosByName) {
      let width  = this.smallScreen ? 350 : 500;
      let height = width * 0.9;
      let radius = Math.min(width, height) / 2;
      let data = presupuestosByName["$"+self.selectData].programas;

      let localeFormatter = d3.formatLocale({ "decimal": ",", "thousands": ".", "grouping": [3]});
      let numberFormatter = localeFormatter.format(",.2f")

      let legend = d3.select("#pie-info-legend");
      legend.html('');

      let arc = d3.arc()
                  .outerRadius(radius - 10)
                  .innerRadius(0);

      let pie = d3.pie()
      .sort(null)
      .value(function(d) {
        return d.total;
      });

      let total = d3.sum(data.map(function(d) {
        return d.total;
      }));

      d3.select(this.graph.nativeElement).html('');

      let info = d3.select('.pie-info');
      info.select('#label').html("Seleccione un programa");                // NEW
      info.select('#count').html('');                // NEW
      info.select('#percent').html('');

      let svg = d3.select(this.graph.nativeElement)
      .append("svg")
      .attr("fill", "white")
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
              .html(`<i style="background:${self.colores(d.data.nombre)}"></i> ${self.appHelper.toTitleCase(d.data.nombre)}<br>`);
        return self.colores(d.data.nombre);
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
         .style("fill", function(d) { return self.colores(d.data.nombre); })
         .style("fill-opacity", .5)
         .style("stroke", function(d) { return self.colores(d.data.nombre); })
         .style("stroke-width", 2)
        g.append("text")
	       .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	       .text(function(d) { return numberFormatter(d.data.total.toString());})
         .style("font-size", function(d) {
           let width = d3.select(this.previousSibling).node().getBBox().width;

           return `${self.appHelper.fontSizeforWidth(width, numberFormatter(d.data.total.toString()))}`;
         })
         .style("text-anchor","middle")
	       .style("fill", "#fff");

        g.on('click', function(d) {
          let info = d3.select('.pie-info');
          let percent = Math.round(1000 * d.data.total / total)/10;
          info.select('#label').html(self.appHelper.toTitleCase(d.data.nombre));
          info.select('#count').html(numberFormatter(d.data.total.toString())+" Beneficiarios");
          info.select('#percentage').html(numberFormatter(percent.toString()) + '%');
          info.select('#detail').html('');
          info.style('display', 'block');
          Object.keys(d.data.detalle).forEach(function(k) {
            info.select('#detail')
                .append("p")
                .html(`${numberFormatter(d.data.detalle[k].toString())} ${k.toLowerCase()} <br>`);
          });
        });
      });
    });

    dispatch.call("load", this, presupuestosByName);
    dispatch.call("statechange", this, presupuestosByName["$"+self.selectData]);

  }

}
