import React, {useEffect, useRef, useMemo, useState} from "react";
import * as d3 from 'd3';
import {getColorByCompanyCategory} from '../../utility_functions/ColorFunctions.js';
import classes from './MegaBallsView_v2.module.scss';
import data from '../../data/companies_details.json';
import {keyBy} from 'lodash';

// import styles from '../../globalStyle.module.scss';

const fontSizeOfCompanyDetail = 30 / 2; // /2 because scale for balls and tooltip increased by 2 in y and x axis
const maxZoomScale = 8;
const minZoomScale = 0.5;

const companies = keyBy(data, 'name');


const MegaBalls = ({
                       height = window.innerHeight,
                       width = window.innerWidth,
                       margin = {left: 0, right: 0, top: 0, bottom: 0},
                       year = 2010,
                       data = [],
                   }) => {

    const [tooltipName, setTooltipName] = useState("");
    const [tooltipEmployees, setTooltipEmployees] = useState("");
    const [tooltipRevenue, setTooltipRevenue] = useState("");
    const [tooltipPosition, setTooltipPosition] = useState({x: 0, y: 0});
    const [tooltipFounded, setTooltipFounded] = useState("");
    const [tooltipFounders, setTooltipFounders] = useState("");
    const [tooltipInfo, setTooltipInfo] = useState("");
    const [tooltipWebsite, setTooltipWebsite] = useState("");
    const [foundedIn, setFoundedIn] = useState("");
    const [foundedBy, setFoundedBy] = useState("");


    const anchor = useRef();
    const didMount = useRef(false);
    const simulation = useRef(null);
    const zoom = useRef(null);

    function onCursorMove(e) {
        setTooltipPosition({x: e.nativeEvent.offsetX + 5, y: e.nativeEvent.offsetY + 5})
    }

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
                    .attr("viewBox", "0 0" + (width) + " " + (height))
                    .attr("overflow", 'visible')
                    .classed("svg-content", true)


                let canvas = anchorNode.append('g').classed("canvas", true);
                //glow definitions
                let defs = anchorNode.append("defs");
                let filter = defs.append("filter")
                                 .attr("id","glow")
                                 .attr("x", "-5000%")
                                 .attr("y", "-5000%")
                                 .attr("width", "10000%")
                                 .attr("height", "10000%");

                filter.append("feGaussianBlur")
                      .attr("stdDeviation","8.0")
                      .attr("result","coloredBlur");
                let feMerge = filter.append("feMerge");
                          feMerge.append("feMergeNode")
                                 .attr("in","coloredBlur");
                          feMerge.append("feMergeNode")
                                 .attr("in","SourceGraphic");

                zoom.current = d3.zoom();
                zoom.current.scaleExtent([1, maxZoomScale]);
                canvas.append('g').classed('balls', true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ") scale(2,2)");

                canvas.append('g').classed('tooltip', true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ") scale(2,2)")
                // .append('text')
                // .attr('class', 'companyTooltip')
                // .attr("font-weight", 450)
                // .attr('x', 0)
                // .attr('y', 0)
                // .attr('text-anchor', 'middle')
                // .style('font', "Open Sans")
                // .attr("font-size", fontSizeOfCompanyDetail)
                // .attr("cursor", "none")
                // .attr("pointer-events", "none")
                // .attr("opacity", 0)
                // .append('tspan');

                // setup zoom functionality
                zoom.current = d3.zoom();
                zoom.current.scaleExtent([minZoomScale, maxZoomScale]);
                anchorNode.call(zoom.current.on("zoom", function () {
                    anchorNode.select(".canvas").attr("transform", d3.event.transform);
                    const fontSize = d3.event.transform.k >= 1 ? fontSizeOfCompanyDetail / d3.event.transform.k : fontSizeOfCompanyDetail;
                    d3.select('.companyTooltip').attr("font-size", (fontSize) + "px");
                }));
            }
        }

        function resetZoom() {
            zoom.current = d3.zoom();
            zoom.current.scaleExtent([0.5, maxZoomScale]);
            d3.select(anchor.current).selectAll(".canvas").transition().duration(1000).attr("transform", d3.zoomIdentity);
            d3.select(anchor.current).call(zoom.current.transform, d3.zoomIdentity);
        }

        function setupSimulation() {
            simulation.current = d3.forceSimulation()
                .force("forceX", d3.forceX().strength(-0.04).x(0))
                .force("forceY", d3.forceY().strength(-0.04).y(0))
                .force("charge", d3.forceManyBody().strength(-1))
                .force('collision', d3.forceCollide().radius((d) => {
                    return d.size;
                }))
                .force("charge", d3.forceManyBody().strength(-2))
                .velocityDecay(0.83)
            //.force("collide", d3.forceCollide().strength(1).radius((d) => { return d.size })
            //.iterations(10));
        }

        function drawBalls() {
            var balls = d3.select('.balls').selectAll('circle').data(data.nodes, (d) => {
                return d.key
            });

            balls.on('mouseover', function (d) {
                d3.selectAll('.companyTooltip')
                    .text(function () {
                        return d.name + ": " + (d.employees === null ? '0' : d.employees) + " employee(s) & " + d.revenue + 'SEK revenue in ' + year;
                    });
            })
                .attr("opacity", 0.9);

            balls.transition()
                .duration(500)
                .attr("r", (d) => d.size);


            // d3.select(anchor.current).append('circle').attr('cx', width / 2).attr('cy', height / 2).attr('r', 100);

            // var formatter = new Intl.NumberFormat('se', {
            //   style: 'currency',
            //   currency: 'SEK',
            // });

            var enter = balls.enter()
                .append("circle")
                .attr("id", (d) => d.key)
                .attr("class", (d) => "_" + d.id)
                .attr("fill", function (d) {
                    return getColorByCompanyCategory(d.id)
                })
                .attr("opacity", 0.9)
                .on('mouseenter', function (d, e) {
                    var self = d3.select(this);
                    const x = self.attr('cx');
                    const y = self.attr('cy');
                    setTooltipName(d.name);
                    setTooltipEmployees(d.employees);
                    setTooltipRevenue(new Intl.NumberFormat('en-US').format(d.revenue));
                    setTooltipPosition({x: e.clientX, y: e.clientY});

                    if (d && Object.keys(companies).includes(d.name)) {
                        setFoundedIn("Founded in: ");
                        setFoundedBy("Founders: ");
                        setTooltipFounded(companies[d.name].founded);
                        setTooltipFounders(companies[d.name].founders);
                        setTooltipInfo(companies[d.name].info);
                        setTooltipWebsite(companies[d.name].website);
                    } else {
                        setFoundedIn("")
                        setFoundedBy("")
                        setTooltipFounded("")
                        setTooltipFounders("")
                        setTooltipInfo("")
                        setTooltipWebsite("")
                    }

                    /*
                    d3.select('.tooltip')
                        .append('rect')
                        .attr('class', 'companybox')
                        .attr('width', '100')
                        .attr('height', '100')
                        .attr("x", (x + width / 2))
                        .attr("y", y + height / 2)
                        .style('fill', 'white')
                    */
                    //.text(() => { return d.name + ": " + (d.employees === null ? '0' : d.employees) + " employee(s) & " + d3.format(",")(d.revenue) + ' SEK revenue in ' + year })
                    //.transition()
                    //.delay(20)
                    //.attr("opacity", 1).select("tspan")
                    //.attr("font-weight", 300)
                    //.text(" but this is not.");
                })
                .on('mouseout', function (d) {
                    d3.select('.companybox').remove()
                    setTooltipName("")
                    //.attr("opacity", 0)
                    //.text("");
                })
                .attr('fill-opacity', 1.0)
                .attr("stroke", d => d.error ? "red" : "black")
                .style("stroke-width", '1px')
                .attr("vector-effect", "non-scaling-stroke")
                .attr("stroke-opacity", 0.2)
                .style("filter", function (d) {
                    //TODO: GLOW
                    if (Object.keys(companies).includes(d.name)) {
                        return "url(#glow)";
                    }
                        return "";
                })
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

    }, [year, width, height, data.nodes]); // useEffect

    return <div onMouseMove={onCursorMove}>

        <div className={classes.tooltipBox} style={{
            display: tooltipName ? 'block' : 'none',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`
        }}>
            <div className={classes.tooltipName}>{tooltipName}</div>
            <div className={classes.tooltipEmployees}><b>Number of employees:</b> {tooltipEmployees}</div>
            <div className={classes.tooltipRevenue}><b>Revenue:</b> {tooltipRevenue} kSEK</div>
            <div className={classes.tooltipFounded}><b>{foundedIn}</b> {tooltipFounded}</div>
            <div className={classes.tooltipFounders}><b>{foundedBy}</b>{tooltipFounders}</div>
            <div className={classes.tooltipInfo}>{tooltipInfo}</div>
            <a href={tooltipWebsite} className={classes.tooltipWebsite}>{tooltipWebsite}</a>
        </div>
        <svg overflow='visible'
             height={height} width={width} ref={anchor}/>
    </div>
};

export default MegaBalls;


//old code:

// const nodes = data.nodes.map((node) => {
//     let copyNode;
//     if (node.key === 3812) {
//         const copyNode = node;
//         copyNode.x = width / 15;
//         copyNode.y = 0;
//         return node;
//     }

//     if (node.key === 26110) {
//         const copyNode = node;
//         copyNode.x = 0;
//         copyNode.y = -height / 15;
//         return node;
//     }

//     if (node.key === 72190) {
//         const copyNode = node;
//         copyNode.x = -width / 15;
//         copyNode.y = 0;
//         return node;
//     }
//     copyNode = node;
//     return copyNode;
// });
