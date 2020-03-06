import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getColorByCompanyCategory } from "../../../utility_functions/ColorFunctions";
import { getLabelForCategory } from "../../../data/data_functions"

// time for transition between state changes in milliseconds
const transitionDuration = 900;

/** Sunburst component that updates everytime a prop changes with a transition animation, takes in a list of data + other optional props
 data prop format example: [{ label: 'FirstObj', color: 'red', value: 1 }, { label: 'SecondObj', color: 'blue', value: 1 }] */
const Sunburst = ({
    widthHeightValue = 350,
    margin = { top: 10, right: 10, bottom: 10, left: 10 },
    data = []
}) => {

    const width = widthHeightValue - margin.left - margin.right;
    const height = widthHeightValue - margin.top - margin.bottom;
    const outerRadius = ((width + height) / 4) - margin.top;
    const innerRadius = outerRadius / 3;

    const anchor = useRef();
    // used to append objects only on first mount
    const didMount = useRef(false);

    // draws a white donut if no data
    if (data.length === 0) {
        data = [{ label: "", value: 1, color: 'white', fractional: "100%" }];
    }

    // set up pie and arc objects/functions
    var pie = d3.pie().sort(null).value((d) => d.value);
    var arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    useEffect(() => {

        let valueSum = 0;
        for (let i = 0; i < data.length; i++) {
            valueSum += data[i].value;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        data = data.map((d) => {
            let copyData = d;
            copyData.fractional = (Math.round(d.value / valueSum * 100 * 10) / 10) + '%';
            return copyData;
        });

        setupContainersOnMount();
        drawSunburst();
        //brush(category);
        addTextInCenter();
        didMount.current = true;

        //----- FUNCTION DEFINITIONS -------------------------------------------------------------------------//
        function setupContainersOnMount() {
            const anchorNode = d3.select(anchor.current);

            if (!didMount.current) {
                let canvas = anchorNode
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .classed('sunburst_outer_svg', true)
                    .append('g')
                    .attr('transform', 'translate(' + height / 2 + ' ' + width / 2 + ')')
                    .classed('sunburst_canvas', true);

                // container for arcs
                canvas.append('g').classed('arcs', true);
            }
        }

        /** uses enter() and exit() to redraw the sunburst every time props change with transitions */
        function drawSunburst(cat) {
            var arcs = d3.select('.arcs').selectAll("path").data(pie(data));

            // transition arcs when data changes
            arcs.transition().duration(transitionDuration).attrTween("d", arcTween);

            // enter
            var enter = arcs.enter()
                .append("path")
                .attr("class", "arc")
                .attr("d", arc)
                .each(function (d) {
                    this._current = d;
                })
                .attr("fill", function (d) {
                    return d.data.color;
                })
                .attr("stroke", "black")
                .attr("opacity", 1.0)
                .attr("stroke-opacity", 0.1)
                .each(function (d) {
                    this._current = d;
                })
                .on('mouseenter', function (d) {
                    d3.event.preventDefault();
                    d3.selectAll('.arc').attr("opacity", 0.5);
                    d3.select(this).attr("opacity", 1.0);
                    d3.selectAll(".center_text").text(d.data.fractional)
                        .style("font-size", "30px")
                        .style("font-weight", 750);
                    d3.select('.balls').selectAll("._" + d.index).attr('opacity', 0.1);
                })
                .on('mouseleave', function (d) {
                    d3.selectAll('.arc').attr("opacity", 1.0);
                    d3.selectAll(".center_text").text("");
                    d3.event.preventDefault();
                    d3.select('.balls').selectAll('circle').attr('opacity', 0.8);
                })
                .on('contextmenu', function () {
                    d3.event.preventDefault();
                })
                .text((d) => d.data.label);

            // exit
            arcs.exit().remove();
        }

        /** draws the text in the center of the sunburst */
        function addTextInCenter() {
            let center_text = d3.select('.sunburst_outer_svg').selectAll('.center_text').data([0], (d) => d);

            // adds the center text only when mounting
            center_text
                .enter().append('text')
                .attr('x', width / 2)
                .attr('y', height / 2 + 12)
                .attr('class', 'center_text')
                .style("text-anchor", "middle")
                .text("");

            center_text.exit().remove();
        }

        // used to interpolate between start and end angle when transitioning 
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        }

    }, [data]);

    return <React.Fragment>
        <div className="Sunburst" ref={anchor} />
    </React.Fragment>;
};

export default Sunburst;
