import React, { useEffect, useRef } from "react";
import * as d3 from 'd3';
import { getColorByCompanyCategory } from '../../utility_functions/ColorFunctions.js';

const MegaBalls = ({
    height = 1000, width = 1000,
    showBorderOfBallBox = true,
    margin = { left: 10, right: 0, top: 15, bottom: 0 },
    year = 2010,
    data = [],
    onBallMouseHover
 }) => {

    const anchor = useRef();
    const didMount = useRef(false);

    const graph = data.nodes;

    console.log(graph);
    const nodeLinks = data.links;



    if (data.length === 0) {
        data = [{ label: "", value: 1, color: 'white' }];
    }

    //const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    //const width = 600 - margin.left - margin.right;
    //const height = 600 - margin.top - margin.bottom;

    const bvm = 1 / 10 * height;
    const bhm = 1 / 10 * width;
    const ballBox = {
        min: { x: bhm, y: bvm },
        max: { x: width - bhm, y: height - bvm }
    };

    useEffect(() => {

        /*setupContainersOnMount();
        drawBalls();
        didMount.current = true;

        //----- FUNCTION DEFINITIONS ------------------------------------------------------// 
        function setupContainersOnMount() {
            const anchorNode = d3.select(anchor.current);
            anchorNode.selectAll("circle").remove();

            if (!didMount.current) {
                let canvas = anchorNode
                    .append("svg")
                    .attr("width", width - margin.left - margin.right)
                    .attr("height", height - margin.top - margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

<<<<<<< HEAD:src/components/MegaBallsView/MegaBallsViewGrouped/MegaBalls.js
                if (showBorderOfBallBox)
                {
                    canvas.append("svg:rect")
                        .attr("width", width - bhm * 2)
                        .attr("height", height - bvm * 2)
                        .attr("x", ballBox.min.x)
                        .attr("y", ballBox.min.y)
                        .style("fill", "None")
                        .style("stroke", "#232323");
                }

                canvas
                    .append('text')
                    .attr('class', 'details')
                    .attr('x', width / 2)
                    .attr('y', height - 20)
                    .attr('text-anchor', 'middle');

                canvas
                    .on('contextmenu', function(){
                        d3.event.preventDefault();
                        onBallMouseHover(-1);
                    });

                canvas.append('g').classed('balls', true);
            }
        }

        function drawBalls()
        {
            var balls = d3.select('.balls')
                .selectAll("path")
                .data(graph);

            // update the simulation based on the data
=======
                canvas.append('g').classed('balls', true);
            }
        };

        function drawBalls() {

            var balls = d3.select('.balls').selectAll("path").data(graph);

>>>>>>> master:src/components/MegaballsView/MegaBallsView.js
            var simulation = d3.forceSimulation()
                .force("forceX", d3.forceX().strength(.5).x(width / 2))
                .force("forceY", d3.forceY().strength(.5).y(height / 2))
                .force("center", d3.forceCenter().x(width * .5).y(height * .5))
                .force("charge", d3.forceManyBody().strength(-2))
                .force("theta", d3.forceManyBody().theta(.9))
                .nodes(graph)
                .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return d.size; }).iterations(2))
                .on("tick", function (d) {
                    enter
                        .attr("cx", function (d) { return d.x; })
                        .attr("cy", function (d) { return d.y; })
                })
                .force("link", d3.forceLink(nodeLinks).strength(.1).distance(1).iterations(2).id(graph.id));

<<<<<<< HEAD:src/components/MegaBallsView/MegaBallsViewGrouped/MegaBalls.js
            var enter = balls.enter()
               .append("circle")
               .attr("r", function (d) { return d.size; })
               .attr("fill", function (d) { return getColorByCompanyCategory(d.id) })
               .attr('fill-opacity', 0.8)
               .style("stroke", d => d.error ? "red" : "black")
               .attr('stroke-opacity', 0.2)
               .attr("cx", function (d) { return d.x + width / 2; })
               .attr("cy", function (d) { return d.y + height / 2; })
               .call(d3.drag()
               .on("start", dragstarted)
               .on("drag", dragged)
               .on("end", dragended))
                .on('mouseover', function(d){
                    d3.selectAll('.details')
                        .text(function () {
                            return d.name + ": " + (d.employees === null ? '0' : d.employees) + " employee(s) and " + d.revenue + 'SEK revenue in ' + year;
                        });
                })
                .on('click', function (d){
                    onBallMouseHover(d.id);
                })
                .on('mouseout', function () {
                    d3.selectAll('.details')
                        .text("");
                });

            //Not working
            balls.exit().remove();


=======
            var enter = balls.enter().append("circle")
                .attr("r", function (d) { return d.size; })
                .attr("fill", function (d) { return getColorByCompanyCategory(d.id) })
                .attr('fill-opacity', 0.8)
                .style("stroke", d => d.error ? "red" : "black")
                .attr('stroke-opacity', 0.2)
                .attr("cx", function (d) { return d.x + width / 2; })
                .attr("cy", function (d) { return d.y + height / 2; })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            balls.exit().remove();

>>>>>>> master:src/components/MegaballsView/MegaBallsView.js
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
        }*/

    }, [data, ballBox.min.x, ballBox.min.y, bhm, bvm, height, margin.bottom, margin.left, margin.right, margin.top, width, showBorderOfBallBox, graph, nodeLinks]); // useEffect

    return <React.Fragment><svg height={height} width={width} ref={anchor}/> </React.Fragment>;
};

export default MegaBalls;
