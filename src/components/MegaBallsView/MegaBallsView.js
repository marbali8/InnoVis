import React, { useEffect, useRef } from "react";
// import data from '../../data/companies_yearly_data.json';
import * as d3 from 'd3';

const MegaBallsView = (mockData) => {

    const svgRef = useRef();

    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const width = 200 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;
    // to be used!
    const extraPaddingBetweenBalls = 6;

    useEffect(() => {

        // vertical & horizontal margin to ball box, which is rectangular area containing the balls
        // top margin = bottom margin = vertical margin, similar eq for hz. margin!
        const vm = 1 / 10 * height;
        const hm = 1 / 10 * width;
        const ballBox = {
            min: { x: hm, y: vm },
            max: { x: width - hm, y: height - vm }
        };

        // adjustable options
        const numBalls = 283;
        const maxSpeed = 10;
        const maxBallArea = 1;
        // max domain value for color scale's domain = [0,1,2...m]
        const m = 20;

        const radiusScale = d3.scaleSqrt().domain([0, 100]).range([0, maxBallArea]);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(m));

        const nodes = [];
        for (let i = 0; i < numBalls; i++) {
            nodes.push({
                radius: radiusScale(1 + Math.floor(Math.random() * (100 - 1))),
                color: colorScale(Math.floor(Math.random() * m)),
                x: ballBox.min.x + (Math.random() * (ballBox.max.x - ballBox.min.x)),
                y: ballBox.min.y + (Math.random() * (ballBox.max.y - ballBox.min.y)),
                speedX: (Math.random() - 0.5) * 2 * maxSpeed,
                speedY: (Math.random() - 0.5) * 2 * maxSpeed
            });
        }

        // MAKE A FORCE FIELD HERE, BUT HOW????? NOBODY KNOWS! :(
        // const force = d3.forceSimulation(nodes);

        const referencedSvg = d3.select(svgRef.current);

        // create a canvas
        let canvas;
        referencedSvg.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        canvas = referencedSvg.select("g");

        canvas.append("svg:rect")
            .attr("width", width - hm * 2)
            .attr("height", height - vm * 2)
            .attr("x", ballBox.min.x)
            .attr("y", ballBox.min.y)
            .style("fill", "None")
            .style("stroke", "#232323");

        const balls = canvas.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", function (d) { return d.radius })
            .attr("cx", function (d) { return d.x })
            .attr("cy", function (d) { return d.y; })
            .style("fill", function (d) { return d.color; });

        // remaining code from bouncing balls example pasted at eof.

    }, []); // useEffect

    return <React.Fragment><svg height={height} width={width} ref={svgRef}></svg> </React.Fragment>;
};

export default MegaBallsView;


// code from bouncing balls example

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