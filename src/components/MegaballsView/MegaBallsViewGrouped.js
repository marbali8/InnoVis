import React, {useEffect, useRef} from "react";
import data from '../../../data/companies_yearly_data.json';
import * as d3 from 'd3';
import { getColorBySNICode } from '../../../utility_functions/ColorFunctions.js'

const MegaBallsView = ({ height = 1000, width = 1000, showBorderOfBallBox = true, margin = { left: 0, right: 0, top: 0, bottom: 0 }, onYearClicked , onBallMouseHover}) => {
    const svgRef = useRef();
    var year_choice = onYearClicked;

    //const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    //const width = 600 - margin.left - margin.right;
    //const height = 600 - margin.top - margin.bottom;
    // to be used!

    const bvm = 1 / 10 * height;
    const bhm = 1 / 10 * width;
    const ballBox = {
        min: {x: bhm, y: bvm},
        max: {x: width - bhm, y: height - bvm}
    };

    //const sim = useRef();

    useEffect(() => {
        // vertical & horizontal margin to ball box, which is rectangular area containing the balls
        // top margin = bottom margin = vertical margin, similar eq for hz. margin!


        const referencedSvg = d3.select(svgRef.current);

        referencedSvg.selectAll("*").remove();
        // adjustable options
        const numBalls = data.length;
        //let numCategories = 30;
        //const maxSpeed = 10;
        //const maxBallArea = 1;
        // max domain value for color scale's domain = [0,1,2...m]
        const m = 200;

        /*var categorical = [
            { "name" : "schemeAccent", "n": 8},
            { "name" : "schemeDark2", "n": 8},
            { "name" : "schemePastel2", "n": 8},
            { "name" : "schemeSet2", "n": 8},
            { "name" : "schemeSet1", "n": numCategories},
            { "name" : "schemePastel1", "n": 9},
            { "name" : "schemeCategory10", "n" : numCategories},
            { "name" : "schemeSet3", "n" : 12 },
            { "name" : "schemePaired", "n": 12},
            { "name" : "schemeCategory20", "n" : 20 },
            { "name" : "schemeCategory20b", "n" : 20},
            { "name" : "schemeCategory20c", "n" : 20 }
          ];*/


        //const radiusScale = d3.scaleSqrt().domain([0, 100]).range([0, maxBallArea]);
        //const colorScale2 = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(numCategories));
        //var colorScale3 = d3.scaleOrdinal(d3[categorical[6].name]);
        //pick from here: https://github.com/d3/d3-scale-chromatic
        var colorScale = d3.interpolateSpectral;


        // create a canvas
        let canvas;
        referencedSvg.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        canvas = referencedSvg.select("g");

        var simulation = d3.forceSimulation()
            .force("forceX", d3.forceX().strength(.5).x(width / 2 * 1))
            .force("forceY", d3.forceY().strength(.5).y(height / 2 * 1))
            .force("center", d3.forceCenter().x(width * .5).y(height * .5))
            .force("charge", d3.forceManyBody().strength(-2))
            .force("theta", d3.forceManyBody().theta(.9));

        const graph = [];
        const nodeLinks = [];
        const anchorNodes = {};
        const anchorNodesIndex = {};
        var idx = 0;
        for (let i = 0; i < numBalls; i++) {
            let tempID = data[i].primary_code_in_NIC;
            var ball = {};
            switch (year_choice) {
                case 2008:
                case 2009:
                case 2010:
                    ball = {
                        size: Math.sqrt(Math.sqrt(data[i].revenue_2010)),
                        secsize: Math.sqrt(data[i].employees_2010),
                        id: tempID,
                        name: data[i].company_name,
                        nr_employees: data[i].employees_2010,
                        revenue: data[i].revenue_2010
                    };
                    break;
                case 2011:
                    ball = {
                        size: Math.sqrt(Math.sqrt(data[i].revenue_2011)),
                        secsize: Math.sqrt(data[i].employees_2011),
                        id: tempID,
                        name: data[i].company_name,
                        nr_employees: data[i].employees_2011,
                        revenue: data[i].revenue_2011
                    };
                    break;
                case 2012:
                    ball = {
                        size: Math.sqrt(Math.sqrt(data[i].revenue_2012)),
                        secsize: Math.sqrt(data[i].employees_2012),
                        id: tempID,
                        name: data[i].company_name,
                        nr_employees: data[i].employees_2012,
                        revenue: data[i].revenue_2012
                    };
                    break;
                case 2013:
                    ball = {
                        size: Math.sqrt(Math.sqrt(data[i].revenue_2013)),
                        secsize: Math.sqrt(data[i].employees_2013),
                        id: tempID,
                        name: data[i].company_name,
                        nr_employees: data[i].employees_2013,
                        revenue: data[i].revenue_2013
                    };
                    break;
                case 2014:
                    ball = {
                        size: Math.sqrt(Math.sqrt(data[i].revenue_2014)),
                        secsize: Math.sqrt(data[i].employees_2014),
                        id: tempID,
                        name: data[i].company_name,
                        nr_employees: data[i].employees_2014,
                        revenue: data[i].revenue_2014
                    };
                    break;
                case 2015:
                    ball = {
                        size: Math.sqrt(Math.sqrt(data[i].revenue_2015)),
                        secsize: Math.sqrt(data[i].employees_2015),
                        id: tempID,
                        name: data[i].company_name,
                        nr_employees: data[i].employees_2015,
                        revenue: data[i].revenue_2015
                    };
                    break;
                case 2016:
                    ball = {
                        size: Math.sqrt(Math.sqrt(data[i].revenue_2016)),
                        secsize: Math.sqrt(data[i].employees_2016),
                        id: tempID,
                        name: data[i].company_name,
                        nr_employees: data[i].employees_2016,
                        revenue: data[i].revenue_2016
                    };
                    break;
                case 2017:
                    ball = {
                        size: Math.sqrt(Math.sqrt(data[i].revenue_2017)),
                        secsize: Math.sqrt(data[i].employees_2017),
                        id: tempID,
                        name: data[i].company_name,
                        nr_employees: data[i].employees_2017,
                        revenue: data[i].revenue_2017
                    };
                    break;
                case 2019:
                case 2020:
                case 2018:
                    ball = {
                        size: Math.sqrt(Math.sqrt(data[i].revenue_2018)),
                        secsize: Math.sqrt(data[i].employees_2018),
                        id: tempID,
                        name: data[i].company_name,
                        nr_employees: data[i].employees_2018,
                        revenue: data[i].revenue_2018
                    };
                    break;
                default:
                    ball = {
                        size: Math.sqrt(Math.sqrt(data[i].revenue_2010)),
                        secsize: Math.sqrt(data[i].employees_2010),
                        id: tempID,
                        name: data[i].company_name,
                        nr_employees: data[i].employees_2010,
                        revenue: data[i].revenue_2010
                    }
            }
            graph.push(ball);
            if (tempID in anchorNodes) {
                nodeLinks.push({"source": anchorNodes[tempID], "target": i});
                nodeLinks.push({"source": i, "target": anchorNodes[tempID]});
            } else {
                anchorNodes[tempID] = i;
                anchorNodesIndex[tempID] = idx;
                idx += 5;
            }
        }

        // update the simulation based on the data
        simulation
            .nodes(graph)
            .force("collide", d3.forceCollide().strength(.2).radius(function (d) {
                return d.size;
            }).iterations(2))
            .on("tick", function (d) {
                node
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    })
            })
            .force("link", d3.forceLink(nodeLinks).strength(.1).distance(1).iterations(2).id(graph.id));

        Object.size = function (obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

        // draw bounding box;
        canvas.append("svg:rect")
            .attr("width", width - bhm * 2)
            .attr("height", height - bvm * 2)
            .attr("x", ballBox.min.x)
            .attr("y", ballBox.min.y)
            .style("fill", "None")
            .style("stroke", "#232323");

        canvas
            .append('text')
            .attr('class', 'details')
            .attr('x', width / 2)
            .attr('y', height - 20)
            .attr('text-anchor', 'middle')
            .text(year_choice);

        var node = canvas.append("g")
            .attr("class", "node")
            .selectAll("circle")
            .data(graph)
            .enter().append("circle")
            .attr("r", function (d) {
                return d.size;
            })
            .attr("fill", function (d) {
                return colorScale(anchorNodesIndex[d.id] / 100)
            }) // m was (Object.size(anchorNodes)) before, matching Sunburst
            .attr('fill-opacity', 0.8)
            .style("stroke", d => d.error ? "red" : "black")
            .attr("cx", function (d) {
                return d.x + width / 2;
            })
            .attr("cy", function (d) {
                return d.y + height / 2;
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

            .on('mouseover', function(d){
                console.log("first " + onBallMouseHover);
                onBallMouseHover(d.id);
                console.log("second " + onBallMouseHover);
                console.log("The id is: " + d.id);
                d3.selectAll('.details')
                    .text(function (p) {
                        return d.name + ": " + (d.nr_employees === null ? '0' : d.nr_employees) + " employee(s) and " + d.revenue + 'SEK revenue in ' + year_choice;
                    });
            })
            .on('mouseout', function (d) {
                d3.selectAll('.details')
                    .text(year_choice);
            });

        /*
                var node = canvas.selectAll('.node')
                    .data( graph )
                    .enter().append('g')
                    //.attr('title', name)
                    .attr('class', 'node')
                    .call( d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
        
        
                node.append('circle')
                    .attr('r', function (d) { return d.secsize; })
                    .attr("fill", function (d) { return colorScale(d.id / (Object.size(anchorNodes))) })
                    .attr('fill-opacity', 1)
                    .attr("cx", function (d) { return d.x+width/2; })
                    .attr("cy", function (d) { return d.y+height/2; })
        ;
        
                node.append('circle')
                    .attr('r', function (d) { return d.size; })
                    .attr('stroke', 'black')
                    .attr('fill', 'transparent')
                    .attr("cx", function (d) { return d.x+width/2; })
                    .attr("cy", function (d) { return d.y+height/2; });
        */
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
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

        /*
            function types(d) {
                d.gdp = +d.gdp;
                d.size = +d.gdp / 100;
                d.size < 3 ? d.radius = 3 : d.radius = d.size;
                return d;
            }*/


        // remaining code from bouncing balls example pasted at eof.

    }, [year_choice, ballBox.min.x, ballBox.min.y, bhm, bvm, height, margin.bottom, margin.left, margin.right, margin.top, width]); // useEffect

    return <React.Fragment>
        <svg height={height} width={width} ref={svgRef}></svg>
    </React.Fragment>;
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
