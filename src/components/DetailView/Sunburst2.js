import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Sunburst = ({ widthHeightValue = 400, margin = { top: 10, right: 10, bottom: 10, left: 10 }, textDisplayedAtCenter = "Default text", data = [{ label: 'FirstObj', color: 'red', value: 1, key: 'uniqueKey1' }, { label: 'SecondObj', color: 'blue', value: 1, key: 'uniqueKey2' }] }) => {

    const width = widthHeightValue - margin.left - margin.right;
    const height = widthHeightValue - margin.top - margin.bottom;
    const outerRadius = ((width + height) / 4) - margin.top;
    const innerRadius = outerRadius / 3;

    const anchor = useRef();
    // set to true when the component has mounted for first time
    const didMount = useRef(false);

    if (data.length === 0) {
        data = [{ label: "", value: 1, key: -1, color: 'white' }];
    }

    // setup pie and arc
    var pie = d3.pie().value((d) => { return d.value });
    var arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    useEffect(() => {
        setupContainersOnMount();
        drawSunburst();
        didMount.current = true;
    }, [widthHeightValue, data, margin, textDisplayedAtCenter]);

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

            let sunburst_arcs_container = canvas.append('g').classed('arcs', true);
        }

    };

    function drawSunburst() {

        var arcs = d3.select('.arcs').selectAll(".arc").data(pie(data), (d) => { console.log(d); return d.key });

        // enter arcs
        arcs.enter().append("path")
            .attr("class", "arc")
            .attr("d", arc)
            .attr("fill", function (d) { return d.data.color })
            .attr('stroke', 'black')
            .append('title')
            .text((d) => d.data.label);

        // remove exiting elements
        arcs.exit().remove();

        // add center text
        let center_text = d3.select('.sunburst_outer_svg').selectAll('.center_text').data([textDisplayedAtCenter], (d) => d);

        center_text
            .enter().append('text')
            .attr('x', width / 2)
            .attr('y', height / 2 + 5)
            .attr('class', 'circletext')
            .style("text-anchor", "middle")
            .text(textDisplayedAtCenter);

        center_text.exit().remove();
    };

    return <React.Fragment>
        <div className="Sunburst" ref={anchor} />
    </React.Fragment>;

}

export default Sunburst;


//old code: 
// // create empty (completely white) sunburst to show while data is processing to show real sunuburst
            // sunburst_slices_container
            //     .selectAll('.arc')
            //     .data(pie([{ label: "", value: 1, key: -1 }]), (d) => d.key)
            //     .enter()
            //     .append('path')
            //     .attr('d', arc
            //     )
            //     .classed('arc', true)
            //     .attr('fill', 'white')
            //     .attr('stroke', "black")
            //     .append('title')
            //     .text('No data available.');