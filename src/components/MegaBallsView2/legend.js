import React, { useEffect, useRef } from "react";
import * as d3 from 'd3';

const BallsLegend = ({
    height = 80, width = 1000,
    margin = { left: 10, right: 0, top: 15, bottom: -10 },
}) => {

    const anchor = useRef();
    const didMount = useRef(false);
    const maxR = height / 2 - 10;
    const circleX = margin.left + maxR;


    var circleData = [
         { "cy": height/2 - 20, "radius": maxR}, 
         { "cy": height/2 - 10, "radius": maxR-10},
         { "cy": height/2 - 0, "radius": maxR-20}];


    useEffect(() => {

        setupContainersOnMount();
        didMount.current = true;

        //----- FUNCTION DEFINITIONS ------------------------------------------------------// 
        function setupContainersOnMount() {
            const anchorNode = d3.select(anchor.current);

            if (!didMount.current) {
                let canvas = anchorNode
                    .append("svg")
                    .attr("width", width - margin.left - margin.right)
                    .attr("height", height - margin.top - margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
                var circles = canvas.selectAll("g")
                    .data(circleData)
                    .enter()
                    .append("g");

                circles.append("circle")
                    .attr("cx", circleX)
                    .attr("cy", function (d) { return d.cy; })
                    .attr("r", function (d) { return d.radius; })
                    .style("fill", "transparent")
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .style("stroke-dasharray", ("4,2"));

          
                canvas
                    .append('text')
                    .attr('class', 'details')
                    .attr('x', (circleX + maxR*4 + 20))
                    .attr('y', height / 2 - 12)
                    .style("font-size", "21px")
                    .attr("font-weight", 500)
                    .attr('text-anchor', 'middle');

                d3.selectAll('.details')
                    .text("Revenue of company");

            }
        }
    }, [height, margin.bottom, margin.left, margin.right, margin.top, width]); // useEffect

    return <React.Fragment><svg height={height} width={width} ref={anchor} /> </React.Fragment>;
};

export default BallsLegend;
