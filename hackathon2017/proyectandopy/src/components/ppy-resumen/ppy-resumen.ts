
import { Component, Input, ViewChild } from '@angular/core';
import * as d3 from "d3";
import { Platform } from 'ionic-angular';
import { AppHelper } from '../../helpers/app-helper';

@Component({
  selector: 'ppy-resumen',
  templateUrl: 'ppy-resumen.html'
})

export class PpyResumen {
  selectData: string

  selectedCharType: number

  selectedTitled: string

  options: Array<any>

  @ViewChild('resumengraph') graph;

  ngOnInit() {
    this.generateResumen();
  }

  generateResumen(){

    let w  = this.graph.nativeElement.clientWidth;
    let h = this.graph.nativeElement.clientWidth * 0.8;
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
                 .padding(0);
                 //.round(f);


    d3.json("/assets/jsons/flare.json", function(error, root) {

    root = d3.hierarchy(root).sum(function(d) { return d.size; });

    var partition = d3.partition()
                   .size([h, w])
                   .padding(0)
                   //.round(f);

    partition(root);
    var kx = w / (root.x1 - root.x0),
      ky = h / 1;
    var indice = Math.floor(Math.random() * (7 - 0) + 0);
    var nodes = vis.selectAll('rect')
          .data(root.descendants())
          .enter()
          .append('rect')
              .attr('fill', function(d) {"#ddd"})
              .attr('stroke', "#ddd")
              .attr("class", function(d) { return d.children ? "parent" : "child"; })
              .attr("x", function(d) { return d.y0; })
              .attr("y", function(d) { return d.x0; })
              .attr("width", function(d) { return d.y1 - d.y0; })
              .attr("height", function(d) { return d.x1 - d.x0; })
              .text(function(d) { return d.data.name; });
    var text = vis.selectAll("text")
        .data(root.descendants())
        .enter().append("text")
        .attr("x", function(d) { return (d.y0+10); })
        .attr("y", function(d) { return (d.x0+10); })
        .attr("dy", ".35em")
        .attr("font-size",".9em")
        .attr("fill", "#504941")
        .style("opacity", function(d) {  return (d.x1 - d.x0)  > 15 ? 1 : 0; })
        .html(function(d) { return d.data.name; });

    function click(d) {
        if (!d.children) return;

        kx = ((d.x1 - d.x0) ? w - 40 : w) / (1 - (d.x1 - d.x0));
        ky = h / (d.y1 - d.y0);
        x.domain([(d.x1 - d.x0), 1]).range([(d.x1 - d.x0) ? 40 : 0, w]);
        y.domain([(d.y0),(d.y1 + d.y0)]);

          var t = vis.transition()
              .duration(d3.event.altKey ? 7500 : 750)
              .attr("transform", function(d) { return "translate(" + x(d.y0) + "," + y(d.x0) + ")"; });

          t.select("rect")
              .attr("width", (d.x1 - d.x0) * kx)
              .attr("height", function(d) { return (d.y1 + d.y0) * ky; });

          t.select("text")
              .attr("transform", transform)
              .style("opacity", function(d) { return (d.y1 + d.y0) * ky > 12 ? 1 : 0; });

          d3.event.stopPropagation();
        }

        function transform(d) {
        return "translate(8," + (d.y1 + d.y0) * ky / 2 + ")";
        }
      });

  }


}
