import React, { useEffect, useRef } from "react";
import * as d3 from 'd3';
import classes from './CompanyLabels.module.scss';
import { getColorByCompanyCategory } from "../../utility_functions/ColorFunctions";
import { getLabelForCategory } from "../../data/data_functions";


const CompanyLabel = ({
    data = []
}) => {

    const margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    const anchor = useRef();
    const didMount = useRef(false);

     useEffect(() => { 
        
        console.log("useEffect for CompanyLabel called");

        setupContainersOnMount();
        didMount.current = true;

        function setupContainersOnMount() {
            const anchorNode = d3.select(anchor.current);

            if(didMount.current) {
                let canvas = anchorNode
                    .append("svg")
                    .attr("width", width - margin.left - margin.right)
                    .attr("height", height - margin.top - margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    anchorNode.selectAll("mydots")
                        .data((data.nodes, (d) => {
                            return d.key
                        })
                        .enter()
                        .append("circle")
                            .attr("cx", 100)
                            .attr("cy", data.nodes, function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                            .attr("r", 7)
                            .style("fill", data.nodes, function (d) {
                                return getColorByCompanyCategory(d.id)
                            }));

                    anchorNode.selectAll("mylabels")
                        .data((data.nodes, (d) => {
                            return d.key
                        })
                        .enter()
                        .append("text")
                          .attr("x", 120)
                          .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                          .style("fill", "fill", data.nodes, function (d) {
                            return getColorByCompanyCategory(d.id)
                          })
                          .text("hello")
                          .attr("text-anchor", "left")
                          .style("alignment-baseline", "middle"));
            
                }
        }
    
    }, [data, height, margin.bottom, margin.left, margin.right, margin.top, width]);

    // style property is passed an object with height and width converted to strings using template literals
    return <React.Fragment><svg height={height} width={width} ref={anchor} /> </React.Fragment>;
};

export default CompanyLabel;