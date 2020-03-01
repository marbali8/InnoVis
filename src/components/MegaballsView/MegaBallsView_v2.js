import React, { useEffect, useState, useRef } from "react";
import * as d3 from 'd3';
import { getColorByCompanyCategory } from '../../utility_functions/ColorFunctions.js';

const MegaBalls = ({
    height = 500,
    width = 1000,
    margin = { left: 0, right: 0, top: 0, bottom: 0 },
    data = []
}) => {

    const anchor = useRef();
    const didMount = useRef(false);
    let nodes = data.nodes;
    const simulation = useRef(null);

    // move the bigger balls a bit to the side so they
    // don't bump the other balls in a jerky way when simulation starts
    nodes = nodes.map((node) => {

        let copyNode;

        if (node.key === 3812) {

            const copyNode = node;
            copyNode.x = width / 7;
            copyNode.y = 0;
            return node;
        }

        if (node.key === 26110) {

            const copyNode = node;
            copyNode.x = 0;
            copyNode.y = -height / 10;
            return node;
        }


        if (node.key === 72190) {

            const copyNode = node;
            copyNode.x = -width / 10;
            copyNode.y = 0;
            return node;
        }

        copyNode = node;
        return copyNode;

    });


    useEffect(() => {
        setupContainersOnMount();
        drawBalls();
        didMount.current = true;

        //----- FUNCTION DEFINITIONS ------------------------------------------------------// 
        function setupContainersOnMount() {

            const scale = 2;

            if (!didMount.current) {


                const anchorNode = d3.select(anchor.current).append("svg")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 " + width / 1.5 + " " + height / 1.5)
                    .attr("overflow", 'visible')
                    .classed("svg-content", true)

                let canvas = anchorNode
                    .append('g')
                canvas.append('g').classed('balls', true).attr("transform", "translate(" + 1 / 1.5 * width / 2 + "," + 1 / 1.5 * height / 1.8 + ")");
            }
        };

        function drawBalls() {

            var balls = d3.select('.balls').selectAll('circle').data(data.nodes, (d) => { return d.key })


            balls.transition()
                .duration(500)
                .attr("r", (d) => d.size);


            var enter = balls.enter().append("circle")
                .attr("id", (d) => d.key)
                .attr("fill", function (d) { return getColorByCompanyCategory(d.id) })
                .attr('fill-opacity', 0.8)
                .style("stroke", d => d.error ? "red" : "black")
                .attr('stroke-opacity', 0.2)
                .transition(d3.easeLinear)
                .duration(700)
                .attr("r", (d) => d.size)

            balls.exit().transition(d3.easeLinear)
                .duration(700)
                .attr("r", 0).remove();

            var enterAndUpdateBalls = balls.merge(enter);

            simulation.current = d3.forceSimulation();

            simulation.current.nodes(data.nodes)
                .on("tick", (d) => {
                    enterAndUpdateBalls
                        .attr("cx", function (d) { return d.x })
                        .attr("cy", function (d) { return d.y });
                })

                .force("forceX", d3.forceX().strength(-0.01).x(0))
                .force("forceY", d3.forceY().strength(-0.01).y(0))
                .force("charge", d3.forceManyBody().strength(-1))
                .force('collision', d3.forceCollide().radius(function (d) {
                    return d.size;
                }))
                .force("charge", d3.forceManyBody().strength(-3))
                .velocityDecay(0.9)
                // .alphaDecay(0)
                // .force("theta", d3.forceManyBody().theta(1))
                .force("collide", d3.forceCollide().strength(1).radius(function (d) { return d.size }).iterations(10))

            simulation.current.restart().alpha(1);
        }


        return () => { simulation.current.stop() }

    }, [data, height, margin.bottom, margin.left, margin.right, margin.top, width, nodes]); // useEffect

    return <React.Fragment><svg overflow='visible' height={height} width={width} ref={anchor}></svg> </React.Fragment>;
};

export default MegaBalls;


   //anchorNode.selectAll("circle").remove();