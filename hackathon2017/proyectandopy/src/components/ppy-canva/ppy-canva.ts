
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
  selectData: string

  selectedCharType: number

  selectedTitled: string

  titles = ['Inversión por Programa', 'Avances vs Metas', 'Costos vs Beneficiarios']

  options: Array<any>

  hashColores: any = {};

  smallScreen: boolean = false;

  @ViewChild('graph') graph;

  _presupuestos: Array<any>;

  public constructor(public plt: Platform) {
    this.smallScreen = plt.width() < 768;
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
              .html(`<i style="background:${self.colores(d.data.nombre)}"></i> ${AppHelper.toTitleCase(d.data.nombre)}<br>`);
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
                .html(`${d.data.detalle[k]} ${k.toLowerCase()} <br>`);
          });
        });
      });
    });

    dispatch.call("load", this, presupuestosByName);
    dispatch.call("statechange", this, presupuestosByName["$"+self.selectData]);

  }

  d() {
    let self = this;
    html2canvas(document.getElementsByClassName('graph-canva')[0],
    {
      onrendered: function (canvas) {
        let url = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        if(self.plt.is('core')){
          var a = document.createElement('a');
          a.href = url;
          a.download = 'estadistica.jpg';
          a.click();
        } else {
          //self.fileTransfer.download(url, self.file.dataDirectory + 'file.pdf').then((entry) => {
          //  console.log('download complete: ' + entry.toURL());
          //}, (error) => {
            // handle error
          //});
        }
      }

    });
  }

}
