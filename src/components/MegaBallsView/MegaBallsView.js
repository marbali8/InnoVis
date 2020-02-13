import React, { useEffect, useRef } from "react";
//import data from '../../data/companies_yearly_data.json';
import * as d3 from 'd3';


const MegaBallsView = () => {

    const svgRef = useRef();


    useEffect(() => {

        const margin = { top: 100, right: 100, bottom: 0, left: 100 };
        const width = 200 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;

        const boundingBox = {
            min: { x: margin.left, y: height - margin.bottom },
            max: { x: width - margin.right, y: margin.top }
        };

        // adjustable options
        const numBalls = 283;
        // max domain value for color scale = [0,1,2...m];
        const m = 20;
        const padding = 6;
        const maxSpeed = 10;

        const radiusScale = d3.scaleSqrt().range([0, 8]);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(m));

        const nodes = [];

        for (let i = 0; i < numBalls; i++) {
            nodes.push({
                radius: radiusScale(1 + Math.floor(Math.random() * 50)),
                color: colorScale(Math.floor(Math.random() * m)),
                x: boundingBox.min.x + (Math.random() * (boundingBox.max.x - boundingBox.min.x)),
                y: boundingBox.min.y + (Math.random() * (boundingBox.max.y - boundingBox.min.y)),
                speedX: (Math.random() - 0.5) * 2 * maxSpeed,
                speedY: (Math.random() - 0.5) * 2 * maxSpeed
            });
        }


        const svg = d3.select(svgRef.current);

        svg.append("svg").attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.select("svg").append("svg:rect")
            .attr("width", 50)
            .attr("height", 50)
            .attr("x", 0)
            .attr("y", 0)
            .style("fill", "red")
            .style("stroke", "#232323");

        // const circle = svg.selectAll("circle")
        //     .data(nodes)
        //     .enter().append("circle")
        //     .attr("r", function (d) { return d.radius; })
        //     .attr("cx", function (d) { return d.x; })
        //     .attr("cy", function (d) { return d.y; })
        //     .style("fill", function (d) { return d.color; });

        // function tick(e) {
        //     force.alpha(1);
        //     circle
        //         .each(gravity(e.alpha))
        //         .each(collide(0.03))
        //         .attr("cx", function (d) { return d.x; })
        //         .attr("cy", function (d) { return d.y; });
        // }

        // // Move nodes toward cluster focus
        // function gravity(alpha) {
        //     return function (d) {
        //         if ((d.x - d.radius - 2) < rect[0]) d.speedX = Math.abs(d.speedX);
        //         if ((d.x + d.radius + 2) > rect[2]) d.speedX = -1 * Math.abs(d.speedX);
        //         if ((d.y - d.radius - 2) < rect[1]) d.speedY = -1 * Math.abs(d.speedY);
        //         if ((d.y + d.radius + 2) > rect[3]) d.speedY = Math.abs(d.speedY);

        //         d.x = d.x + (d.speedX * 0.01);
        //         d.y = d.y + (-1 * d.speedY * 0.01);
        //     };
        // }

        // // Resolve collisions between nodes
        // function collide(alpha) {
        //     //changed from: d3.geom.quadtree 
        //     var quadtree = d3.quadtree(nodes);

        //     return function (d) {
        //         var r = d.radius + radius.domain()[1] + padding,
        //             nx1 = d.x - r,
        //             nx2 = d.x + r,
        //             ny1 = d.y - r,
        //             ny2 = d.y + r;

        //         quadtree.visit(function (quad, x1, y1, x2, y2) {
        //             if (quad.point && (quad.point !== d)) {
        //                 var x = d.x - quad.point.x,
        //                     y = d.y - quad.point.y,
        //                     l = Math.sqrt(x * x + y * y),
        //                     r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;

        //                 if (l < r) {
        //                     l = (l - r) / l * alpha;
        //                     d.x -= x *= l;
        //                     d.y -= y *= l;
        //                     quad.point.x += x;
        //                     quad.point.y += y;
        //                 }
        //             }
        //             return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        //         });
        //     };
        // };//collide

    }, []); //useEffect



    return <React.Fragment><svg ref={svgRef}></svg> </React.Fragment>;
};


export default MegaBallsView;

 // const force =
        //     //d3.layout.force()
        //     d3.forceSimulation(nodes)
        //         //.size([width, height])
        //         .force("charge", d3.forceManyBody())
        //         .force("center", d3.forceCenter())
        //         .start();