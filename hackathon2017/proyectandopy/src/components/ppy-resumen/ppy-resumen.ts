
import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import * as d3 from "d3";
import { Platform } from 'ionic-angular';
import { AppHelper } from '../../helpers/app-helper';

@Component({
  selector: 'ppy-resumen',
  templateUrl: 'ppy-resumen.html'
})

export class PpyResumen {
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

  options: Array<any>

  @ViewChild('resumengraph') graph;

  ngOnInit() {
    this.generateResumen();
  }

  generateResumen(){
    console.log(this.graph);
    let w  = 1000
    let h = 1000;
    let x = d3.scaleLinear().range([0, w]);
    let y = d3.scaleLinear().range([0, h]);

    let vis = d3.select(this.graph.nativeElement)
              .append("div")
              .attr("class", "chart")
              .attr("width", w)
              .attr("height", h)
              .append("svg:svg")
              .attr("width", w)
              .attr("height", h);

    let partition = d3.partition()
                 .size([h, w])
                 .padding(0)
                 //.round(f);
    d3.json("/assets/jsons/flare.json", function(error, root) {
      if (error) throw error;
      root = d3.hierarchy(root);
      root.sum(function(d) { return d.size; });
      let g = vis.selectAll("g")
          .data(partition(root).descendants())
          .enter().append("svg:g")
          .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; });
     let kx = w / root.dx;
     let ky = h / 1;

     g.append("svg:rect")
         .attr("width", root.dy * kx)
         .attr("height", function(d) { return d.dx * ky; })
         .attr("class", function(d) { return d.children ? "parent" : "child"; });

     g.append("svg:text")
         .attr("transform", function() { alert("jola"); })
         .attr("dy", ".35em")
         .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
         .text(function(d) { return d.name; })

  });

  }

}
