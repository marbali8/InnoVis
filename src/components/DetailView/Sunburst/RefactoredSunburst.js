import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {getColorByCompanyCategory} from "../../../utility_functions/ColorFunctions";

// time for transition between state changes in milliseconds
const transitionDuration = 900;

/** Sunburst component that updates everytime a prop changes with a transition animation, takes in a list of data + other optional props
 data prop format example: [{ label: 'FirstObj', color: 'red', value: 1 }, { label: 'SecondObj', color: 'blue', value: 1 }] */
const Sunburst = ({
                      widthHeightValue = 350,
                      margin = {top: 10, right: 10, bottom: 10, left: 10},
                      data = [],
                      category = -1
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
        data = [{label: "", value: 1, color: 'white'}];
    }

    // set up pie and arc objects/functions
    var pie = d3.pie().sort(null).value((d) => d.value);
    var arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    useEffect(() => {

        console.log("the cat is " + category);

        setupContainersOnMount();
        drawSunburst(category);
        brush(category);
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
                .attr("stroke-opacity", 0.1)
                .each(function (d) {
                    this._current = d;
                });

            enter
                .on('mouseenter', function (d) {
                    d3.selectAll(".center_text").text(d.data.label);
                })
                .on('mouseout', function (d, cat, i) {
                    d3.selectAll(".center_text").text("");
                    //normal behaviour
                    if (d3.selectAll('.arc').attr('opacity') !== '0.2'){
                        d3.selectAll('.center_text').text("");
                        return;
                    }

                    var opacity = d3.select(this).attr('opacity');
                    if (opacity === '0.2'){
                        d3.selectAll('.center_text').text("category selected");
                    } else {
                        d3.selectAll('.center_text').text(d.data.label);
                    }

                })
                .text((d) => d.data.label);
            console.log("category after enter " + cat);

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
                .attr('y', height / 2 + 5)
                .attr('class', 'center_text')
                .style("text-anchor", "middle")
                .text("");

            center_text.exit().remove();
        }

        function brush(cat) {
            if (cat === -1) {
                d3.selectAll('.arc').attr('opacity', 1);
                d3.selectAll('.center_text').text("");
            }
            else {
                d3.selectAll('.arc').attr('opacity', function (d) {
                    if (getColorByCompanyCategory(cat) === d.data.color) {
                        d3.selectAll('.center_text').text(d.data.label);
                        return 1;
                    } else {
                        return 0.2;
                    }
                });
            }
        }

        // used to interpolate between start and end angle when transitioning 
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        }

    }, [arc, data, height, pie, width]);

    return <React.Fragment>
        <div className="Sunburst" ref={anchor}/>
    </React.Fragment>;
};

export default Sunburst;
