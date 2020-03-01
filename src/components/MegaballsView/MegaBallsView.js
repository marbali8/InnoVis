import React, { useEffect, useRef } from "react";
import * as d3 from 'd3';
import { getColorByCompanyCategory } from '../../utility_functions/ColorFunctions.js';

const MegaBalls = ({
    height = 500, width = 1000,
    showBorderOfBallBox = true,
    margin = { left: 0, right: 0, top: 0, bottom: 0 },
    data = []
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

        setupContainersOnMount();
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

                canvas.append('g').classed('balls', true);
            }
        };

        function drawBalls() {

            var balls = d3.select('.balls').selectAll("path").data(graph);

            var simulation = d3.forceSimulation()
                .force("forceX", d3.forceX().strength(.5).x(width / 2 * 1))
                .force("forceY", d3.forceY().strength(.5).y(height / 2 * 1))
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
        }

    }, [data, ballBox.min.x, ballBox.min.y, bhm, bvm, height, margin.bottom, margin.left, margin.right, margin.top, width, showBorderOfBallBox, graph, nodeLinks]); // useEffect

    return <React.Fragment><svg height={height} width={width} ref={anchor}></svg> </React.Fragment>;
};

export default MegaBalls;
