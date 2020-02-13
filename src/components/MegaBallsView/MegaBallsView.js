import React, { useEffect, useRef } from "react";
// import data from '../../data/companies_yearly_data.json';
import * as d3 from 'd3';

const MegaBallsView = (mockData) => {

    const svgRef = useRef();

    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    // to be used!
    const extraPaddingBetweenBalls = 6;

    useEffect(() => {

        // vertical & horizontal margin to ball box, which is rectangular area containing the balls
        // top margin = bottom margin = vertical margin, similar eq for hz. margin!
        const bvm = 1 / 10 * height;
        const bhm = 1 / 10 * width;
        const ballBox = {
            min: { x: bhm, y: bvm },
            max: { x: width - bhm, y: height - bvm }
        };

        // adjustable options
        const numBalls = 280;
        let numCategories = 6;
        const maxSpeed = 1;
        const maxBallArea = 10;
        // max domain value for color scale's domain = [0,1,2...m]
        const m = 20;

        const radiusScale = d3.scaleSqrt().domain([0, 100]).range([0, maxBallArea]);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(numCategories));
        var colorSpectral = d3.scaleSequential().domain([1, 10]).interpolator(d3.schemeSpectral);

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

        const referencedSvg = d3.select(svgRef.current);

        // create a canvas
        let canvas;
        referencedSvg.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        canvas = referencedSvg.select("g");

        var simulation = d3.forceSimulation()
            .force("forceX", d3.forceX().strength(.1).x(-width * .5))
            .force("forceY", d3.forceY().strength(.1).y(-height * .5))
            .force("center", d3.forceCenter().x(width * .5).y(height * .5))
            .force("charge", d3.forceManyBody().strength(-1))
            .force("distanceMin", d3.forceManyBody().distanceMin(-1))
            .force("theta", d3.forceManyBody().theta(.9));

        const graph = [];
        const nodeLinks = [];
        const nodeAntiLinks = [];


        for (let i = 0; i < numBalls; i++) {
            if (i < numCategories) {
                graph.push({ size: 0, id: i });

                if (i > 0) {
                    for (let j = 0; j < i; j++) {
                        nodeLinks.push({ "source": i, "target": j });
                    }
                }
            }
            else {
                graph.push({
                    size: Math.random() * 2 + 3,
                    id: i % numCategories
                });

                for (let j = 0; j < numCategories; j++) {
                    if (j == i % numCategories) {
                        nodeLinks.push({ "source": j, "target": i });
                    }
                    else {
                        nodeAntiLinks.push({ "source": j, "target": i });
                    }
                }
            }

        }
        //const graph = [{ size: 2 }, { size: 3 }, { size: 4 }];

        // update the simulation based on the data
        simulation
            .nodes(graph)
            .force("collide", d3.forceCollide().strength(.9).radius(function (d) { return d.radius; }).iterations(1))
            .on("tick", function (d) {
                node
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; })
            })
            .force("link", d3.forceLink(nodeLinks).strength(.09).distance(.0005).iterations(10).id(graph.id));
        //.force("link", d3.forceLink(nodeAntiLinks).strength(.03).distance(10).iterations(2));



        // draw bounding box;
        canvas.append("svg:rect")
            .attr("width", width - bhm * 2)
            .attr("height", height - bvm * 2)
            .attr("x", ballBox.min.x)
            .attr("y", ballBox.min.y)
            .style("fill", "None")
            .style("stroke", "#232323");

        var node = canvas.append("g")
            .attr("class", "node")
            .selectAll("circle")
            .data(graph)
            .enter().append("circle")
            .attr("r", function (d) { return d.size; })
            .attr("fill", function (d) { return colorScale(d.id) })
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function pow(x, y) {
            let ret = 1;
            for (let i = 0; i < y; i++) {
                ret *= x;
            }
            return ret;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
        }

        function types(d) {
            d.gdp = +d.gdp;
            d.size = +d.gdp / 100;
            d.size < 3 ? d.radius = 3 : d.radius = d.size;
            return d;
        }


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




        // old balls

         // const balls = canvas.selectAll("circle")
        //     .data(nodes)
        //     .enter().append("circle")
        //     .attr("r", function (d) { return d.radius })
        //     .attr("cx", function (d) { return d.x })
        //     .attr("cy", function (d) { return d.y; })
        //     .style("fill", function (d) { return d.color; });