
import { Component, Input, ViewChild } from '@angular/core';
import * as d3 from "d3";
import * as html2canvas from "html2canvas";
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

  selectedCharType: number

  selectedTitled: string

  titles = ['Inversión por Programa', 'Avances vs Metas', 'Costos vs Beneficiarios']

  options: Array<any>

  smallScreen: boolean = false;

  @ViewChild('graph') graph;

  _presupuestos: Array<any>;

  public constructor(public pl: Platform) {
    this.smallScreen = pl.width() < 768;
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

  colores(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[parseInt(n) % colores_g.length];
  }
  generatePie() {
    let self = this;
    let dispatch = d3.dispatch("load", "statechange");

    let presupuestosByName = d3.map();
    this.presupuestos.forEach(function(d) { presupuestosByName.set(d.nombre, {nombre: d.nombre, programas: d.programas}); });

    dispatch.on("load.pie", function(presupuestosByName) {
      let width  = this.smallScreen ? 350 : 500;
      let height = width * 0.9;
      let radius = Math.min(width, height) / 2;
      let data = presupuestosByName["$"+self.selectData].programas;

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
              .html(`<i style="background:${self.colores(d.data.total)}"></i> ${AppHelper.toTitleCase(d.data.nombre)}<br>`);
        return self.colores(d.data.total);
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
         .style("fill", function(d) { return self.colores(d.data.total); })
         .style("fill-opacity", .5)
         .style("stroke", function(d) { return self.colores(d.data.total); })
         .style("stroke-width", 2);

        g.on('click', function(d) {
          let total = d3.sum(data.map(function(d) {
            return d.total;
          }));
          let info = d3.select('.pie-info');
          let percent = Math.round(1000 * d.data.total / total)/10;
          info.select('#label').html(AppHelper.toTitleCase(d.data.nombre));
          info.select('#count').html(d.data.total+" Beneficiarios");
          info.select('#percentage').html(percent + '%');
          info.select('#detail').html('');
          info.style('display', 'block');
          Object.keys(d.data.detalle).forEach(function(k) {
            info.select('#detail')
                .append("p")
                .html(`${AppHelper.toTitleCase(k)} ${d.data.detalle[k]}<br>`);
          });
        });
      });
    });

    dispatch.call("load", this, presupuestosByName);
    dispatch.call("statechange", this, presupuestosByName["$"+self.selectData]);

  }

  d() {
    html2canvas(document.getElementsByClassName('graph-canva')[0],
    {
      onrendered: function (canvas) {
        var a = document.createElement('a');
        // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        a.download = 'somefilename.jpg';
        a.click();
      }
    });
  }

}
