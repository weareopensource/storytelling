import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import {Chart} from '../chart.class';
@Component({
  selector: 'app-dendogram',
  templateUrl: './dendogram.component.html',
  styleUrls: ['./dendogram.component.scss']
})
export class DendogramComponent extends Chart implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  private element: any;
  private data: Array<any> = [];
  private width: number;
  private height: number;
  constructor() {
    super();
  }

  ngOnInit() {
    this.data = this.dataInput;
    this.element = this.chartContainer.nativeElement;
    this.init();
  }
  init() {
    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;

    let svg = d3.select(this.element).append('svg');
    svg.attr('width', this.width);
    svg.attr('height', this.height);

    let g = svg.append('g').attr('transform', 'translate(40,0)');
    let i = 0,
        duration = 750,
        root;

// declares a tree layout and assigns the size
    let treemap = d3.tree().size([this.height, this.width]);

// Assigns parent, children, height, depth
    root = d3.hierarchy(this.data, d => {console.log(d['children']); return d['children']; });
    root.x0 = this.height / 2;
    root.y0 = 0;

// Collapse after the second level
      console.log(root);
      root.data[0].children.forEach(collapse);

    update(root);

// Collapse the node and all it's children
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function update(source) {

      // Assigns the x and y position for the nodes
      let treeData = treemap(root);

      // Compute the new tree layout.
        let nodes = treeData.descendants(),
          links = treeData.descendants().slice(1);

      // Normalize for fixed-depth.
      nodes.forEach(d =>{ d.y = d.depth * 180 });

      // ****************** Nodes section ***************************

      // Update the nodes...
        let node = svg.selectAll('g.node')
          .data(nodes, d => {return d['id'] || (d['id'] = ++i); });

      // Enter any new modes at the parent's previous position.
        let nodeEnter = node.enter().append('g')
          .attr('class', 'node')
          .attr('transform', function(d) {
            return 'translate(' + source.y0 + ',' + source.x0 + ')';
          })
          .on('click', click);

      // Add Circle for the nodes
      nodeEnter.append('circle')
          .attr('class', 'node')
          .attr('r', 1e-6)
          .style('fill', function(d) {
            return d['_children'] ? 'lightsteelblue' : '#fff';
          });

      // Add labels for the nodes
      nodeEnter.append('text')
          .attr('dy', '.35em')
          .attr('x', d => {
            return d.children || d['_children'] ? -13 : 13;
          })
          .attr('text-anchor', function(d) {
            return d.children || d['_children'] ? 'end' : 'start';
          })
          .text(d => { return d.data['name']; });

      // UPDATE
        let nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate.transition()
          .duration(duration)
          .attr('transform', function(d) {
            return 'translate(' + d.y + ',' + d.x + ')';
          });

      // Update the node attributes and style
      nodeUpdate.select('circle.node')
          .attr('r', 10)
          .style('fill', function(d) {
            return d['_children'] ? 'lightsteelblue' : '#fff';
          })
          .attr('cursor', 'pointer');


      // Remove any exiting nodes
        let nodeExit = node.exit().transition()
          .duration(duration)
          .attr('transform', function(d) {
            return 'translate(' + source.y + ',' + source.x + ')';
          })
          .remove();

      // On exit reduce the node circles size to 0
      nodeExit.select('circle')
          .attr('r', 1e-6);

      // On exit reduce the opacity of text labels
      nodeExit.select('text')
          .style('fill-opacity', 1e-6);

      // ****************** links section ***************************

      // Update the links...
      let link = svg.selectAll('path.link')
          .data(links, function(d) { return d['id']; });

      // Enter any new links at the parent's previous position.
      let linkEnter = link.enter().insert('path', 'g')
          .attr('class', 'link')
          .attr('d', d =>{
            let o = {x: source.x0, y: source.y0}
            return diagonal(o, o);
          });

      // UPDATE
      let linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate.transition()
          .duration(duration)
          .attr('d', d =>{ return diagonal(d, d.parent); });

      // Remove any exiting links
      let linkExit = link.exit().transition()
          .duration(duration)
          .attr('d', function(d) {
            let o = {x: source.x, y: source.y}
            return diagonal(o, o);
          })
          .remove();

      // Store the old positions for transition.
      nodes.forEach(function(d){
        d['x0'] = d.x;
        d['y0'] = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {

       let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

        return path;
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }
    }
  }
  load() {

  }
  ease() {

  }

}