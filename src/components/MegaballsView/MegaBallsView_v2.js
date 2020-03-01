import React, {useEffect, useRef} from "react";
import * as d3 from 'd3';
import {getColorByCompanyCategory} from '../../utility_functions/ColorFunctions.js';
import {getLabelForCategory} from "../../data/data_functions";

const MegaBalls = ({
                       height = 500,
                       width = 1000,
                       margin = {left: 0, right: 0, top: 0, bottom: 0},
                       year = 2010,
                       data = [],
                       category,
                       onBallMouseHover
                   }) => {

    const anchor = useRef();
    const didMount = useRef(false);
    let nodes = data.nodes;
    const simulation = useRef(null);

    // move the bigger balls a bit to the side so they
    // don't bump the other balls in a jerky when simulation starts
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
        resetZoom();
        drawBalls();
        brush(category);

        didMount.current = true;

        //----- FUNCTION DEFINITIONS ------------------------------------------------------// 
        function setupContainersOnMount() {

            if (!didMount.current) {

                const anchorNode = d3.select(anchor.current)
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 " + width + " " + height)
                    .attr("overflow", 'visible')
                    .classed("svg-content", true);

                let canvas = anchorNode.append('g').classed("canvas", true);

                canvas.append('g').classed('balls', true).attr("transform", "translate(" + width / 2 + "," + height / 1.8 + ")");

                anchorNode.append('text')
                    .attr('class', 'details')
                    .attr('x', width / 2)
                    .attr('y', height - 20)
                    .attr('text-anchor', 'middle');
                anchorNode.append('text')
                    .attr('class', 'categorydetails')
                    .attr('x', width / 2)
                    .attr('y', 20)
                    .attr('text-anchor', 'middle')
                    .style('font-weight', 'bold');

                // setup zoom functionality
                anchorNode.call(d3.zoom().on("zoom", function () {
                    anchorNode.select("g").attr("transform", d3.event.transform)
                }));
            }
        }

        function resetZoom() {
            var zoom = d3.zoom();
            d3.select(anchor.current).selectAll(".canvas").transition().duration(1000).attr("transform", d3.zoomIdentity);
            d3.select(anchor.current).call(d3.zoom().transform, d3.zoomIdentity);
        }

        function drawBalls() {

            var balls = d3.select('.balls').selectAll('circle').data(data.nodes, (d) => {
                return d.key
            });


            balls.transition()
                .duration(500)
                .attr("r", (d) => d.size);

            var enter = balls.enter()
                .append("circle")
                .attr("id", (d) => d.key)
                .attr("fill", function (d) {
                    return getColorByCompanyCategory(d.id)
                })
                .attr('fill-opacity', 0.8)
                .attr("stroke", d => d.error ? "red" : "black")
                .style("stroke-width", '1')
                .attr("vector-effect", "non-scaling-stroke")
                .attr('stroke-opacity', 0.2)
                .on('mouseover', function (d) {
                    d3.selectAll('.details')
                        .text(function () {
                            return d.name + ": " + (d.employees === null ? '0' : d.employees) + " employee(s) and " + d.revenue + 'SEK revenue in ' + year;
                        });
                })
                .on('mouseout', function (d) {
                    d3.selectAll('.details')
                        .text("");
                })
                .on('click', function (d) {
                    onBallMouseHover(d.id);
                })
                .on('contextmenu', function () {
                    d3.event.preventDefault();
                    onBallMouseHover(-1);
                })
                .transition(d3.easeLinear)
                .duration(700)
                .attr("r", (d) => d.size);

            balls.exit().transition(d3.easeLinear)
                .duration(700)
                .attr("r", 0).remove();

            var enterAndUpdateBalls = balls.merge(enter);

            simulation.current = d3.forceSimulation();

            simulation.current.nodes(data.nodes)
                .on("tick", (d) => {
                    enterAndUpdateBalls
                        .attr("cx", function (d) {
                            return d.x
                        })
                        .attr("cy", function (d) {
                            return d.y
                        });
                })

                .force("forceX", d3.forceX().strength(-0.01).x(0))
                .force("forceY", d3.forceY().strength(-0.01).y(0))
                .force("charge", d3.forceManyBody().strength(-1))
                .force('collision', d3.forceCollide().radius(function (d) {
                    return d.size;
                }))
                .force("charge", d3.forceManyBody().strength(-3))
                .velocityDecay(0.9)
                .force("collide", d3.forceCollide().strength(1).radius(function (d) {
                    return d.size
                }).iterations(10));


            simulation.current.restart().alpha(1);


        }

        function brush(cat) {
            if (cat !== -1) {
                var color = getColorByCompanyCategory(cat);
                d3.selectAll('.categorydetails').text(getLabelForCategory(cat));
                d3.select('.balls').selectAll('circle').attr('opacity', 0.2);
                d3.selectAll("[fill='" + color + "']").attr('opacity', 1);
            } else {
                d3.selectAll('.categorydetails').text("");
                d3.select('.balls').selectAll('circle').attr('opacity', 1);
            }
        }


        return () => {
            simulation.current.stop()
        }

    }, [data, height, margin.bottom, margin.left, margin.right, margin.top, width, nodes]); // useEffect

    return <React.Fragment>
        <svg overflow='visible' height={height} width={width} ref={anchor}/>
    </React.Fragment>;
};

export default MegaBalls;


//anchorNode.selectAll("circle").remove();