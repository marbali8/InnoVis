import React, { useEffect, useRef, useMemo } from "react";
import * as d3 from 'd3';
import { getColorByCompanyCategory } from '../../utility_functions/ColorFunctions.js';
// import styles from '../../globalStyle.module.scss';

const fontSizeOfCompanyDetail = 30;
const maxZoomScale = 9;

const MegaBalls = ({
    height = 500,
    width = 1000,
    margin = { left: 0, right: 0, top: 0, bottom: 0 },
    year = 2010,
    data = [],
    category,
}) => {

    const anchor = useRef();
    const didMount = useRef(false);
    const simulation = useRef(null);
    const zoom = useRef(null);

    // move the bigger balls a bit to the side so they
    // don't bump the other balls in a jerky way when simulation starts
    const nodes = data.nodes.map((node) => {
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
            copyNode.x = -width / 8;
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
        didMount.current = true;

        //----- FUNCTION DEFINITIONS ------------------------------------------------------// 
        function setupContainersOnMount() {

            if (!didMount.current) {
                setupSimulation();

                const anchorNode = d3.select(anchor.current)
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 " + width + " " + height)
                    .attr("overflow", 'visible')
                    .classed("svg-content", true)

                let canvas = anchorNode.append('g').classed("canvas", true);

                zoom.current = d3.zoom();
                zoom.current.scaleExtent([1, maxZoomScale]);
                canvas.append('g').classed('balls', true).attr("transform", "translate(" + width / 2 + "," + height / 1.8 + ")");

                canvas.append('g').classed('tooltip', true).attr("transform", "translate(" + width / 2 + "," + height / 1.8 + ")")
                    .append('text')
                    .attr('class', 'companyTooltip')
                    .attr("font-weight", 450)
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('text-anchor', 'middle')
                    .style('font', "Open Sans")
                    .attr("font-size", fontSizeOfCompanyDetail)
                    .attr("cursor", "none")
                    .attr("pointer-events", "none")
                    .attr("opacity", 0)
                    .append('tspan');

                // setup zoom functionality
                anchorNode.call(zoom.current.on("zoom", function () {
                    anchorNode.select(".canvas").attr("transform", d3.event.transform);
                    const fontSize = d3.event.transform.k >= 1 ? fontSizeOfCompanyDetail / d3.event.transform.k : fontSizeOfCompanyDetail;
                    d3.select('.companyTooltip').attr("font-size", (fontSize) + "px");
                }));
            }
        }

        function resetZoom() {
            d3.select(anchor.current).selectAll(".canvas").transition().duration(1000).attr("transform", d3.zoomIdentity);
            d3.select(anchor.current).call(zoom.current.transform, d3.zoomIdentity);
        }

        function setupSimulation() {
            simulation.current = d3.forceSimulation()
                .force("forceX", d3.forceX().strength(-0.01).x(0))
                .force("forceY", d3.forceY().strength(-0.01).y(0))
                .force("charge", d3.forceManyBody().strength(-1))
                .force('collision', d3.forceCollide().radius((d) => { return d.size; }))
                .force("charge", d3.forceManyBody().strength(-3))
                .velocityDecay(0.83)
                .force("collide", d3.forceCollide().strength(1).radius((d) => { return d.size })
                    .iterations(10));
        }

        function drawBalls() {
            var balls = d3.select('.balls').selectAll('circle').data(data.nodes, (d) => {
                return d.key
            })

            balls.on('mouseover', function (d) {
                d3.selectAll('.companyTooltip')
                    .text(function () {
                        return d.name + ": " + (d.employees === null ? '0' : d.employees) + " employee(s) & " + d.revenue + 'SEK revenue in ' + year;
                    });
            })

            balls.transition()
                .duration(500)
                .attr("r", (d) => d.size);

            var enter = balls.enter()
                .append("circle")
                .attr("id", (d) => d.key)
                .attr("class", (d) => "_" + d.id)
                .attr("fill", function (d) {
                    return getColorByCompanyCategory(d.id)
                })
                .on('mouseenter', function (d) {
                    var self = d3.select(this);
                    const x = self.attr('cx');
                    const y = self.attr('cy');

                    d3.select('.companyTooltip')
                        .attr("x", (x + width / 2))
                        .attr("y", y)
                        .text(() => { return d.name + ": " + (d.employees === null ? '0' : d.employees) + " employee(s) & " + d3.format(",")(d.revenue) + ' SEK revenue in ' + year })
                        .transition()
                        .delay(20)
                        .attr("opacity", 1).select("tspan")
                        .attr("font-weight", 300)
                        .text(" but this is not.");
                })
                .on('mouseout', function (d) {
                    d3.select('.companyTooltip')
                        .attr("opacity", 0)
                        .text("");
                })
                .attr('fill-opacity', 1.0)
                .attr("stroke", d => d.error ? "red" : "black")
                .style("stroke-width", '1px')
                .attr("vector-effect", "non-scaling-stroke")
                .attr('stroke-opacity', 0.2)
                .transition(d3.easeLinear)
                .duration(700)
                .attr("r", (d) => d.size);

            balls.exit().transition(d3.easeLinear)
                .duration(700)
                .attr("r", 0).remove();

            var enterAndUpdateBalls = balls.merge(enter);

            simulation.current.nodes(data.nodes)
                .on("tick", (d) => {
                    enterAndUpdateBalls
                        .attr("cx", function (d) {
                            return d.x
                        })
                        .attr("cy", function (d) {
                            return d.y
                        });
                });

            simulation.current.alpha(1).restart();
        }

        return () => {
            simulation.current.stop();
        }

    }, [data, year, height, width]); // useEffect

    return <React.Fragment>
        <svg overflow='visible' height={height} width={width} ref={anchor} />
    </React.Fragment>
};

export default MegaBalls;

