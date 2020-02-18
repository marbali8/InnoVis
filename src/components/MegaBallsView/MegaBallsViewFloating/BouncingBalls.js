import React, { useEffect, useRef } from "react";
import * as d3 from 'd3';

function getRandom(min, max) {
    return min + (Math.random() * (max - min));
};

function tick(circles, ballBox, bubbles) {
    circles
        .each(gravity(gravityAlpha, ballBox))
        .each(collide(collisionForce, bubbles))
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });
}

function gravity(alpha, ballBox) {
    return function (d) {
        if ((d.x - d.radius) < ballBox.min.x) d.speedX = Math.abs(d.speedX);
        if ((d.x + d.radius) > ballBox.max.x) d.speedX = -1 * Math.abs(d.speedX);
        if ((d.y - d.radius) < ballBox.max.y) d.speedY = -1 * Math.abs(d.speedY);
        if ((d.y + d.radius) > ballBox.min.y) d.speedY = Math.abs(d.speedY);

        d.x = d.x + (d.speedX * alpha);
        d.y = d.y + (-1 * d.speedY * alpha);
    };
}

function collide(alpha, balls) {
    var quadtree = d3.quadtree()
        .x(bubble => bubble.x)
        .y(bubble => bubble.y)
        .addAll(balls);

    return function (d) {
        var r = d.radius;
        var nx1 = d.x - r;
        var nx2 = d.x + r;
        var ny1 = d.y - r;
        var ny2 = d.y + r;
        var key = d.key;

        quadtree.visit(function (quad, x1, y1, x2, y2) {

            // checks if the quad/node in tree has leaf nodes/pts
            // and that they aren't the same ball as the current one
            if (!quad.length && quad.data.key !== key) {
                var x = d.x - quad.data.x,
                    y = d.y - quad.data.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.data.radius * extraPaddingBetweenBalls;
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.data.x += x;
                    quad.data.y += y;
                };
            };
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
};

// adjustable options:
const maxSpeed = 1500;
//const maxBallArea = 50;
const gravityAlpha = 0.001;
const extraPaddingBetweenBalls = 0.8;
const collisionForce = 0.8;
const m = 20;

// scales
//const radiusScale = d3.scaleSqrt().domain([0, 100]).range([0, maxBallArea]);
const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(m));

const createBubble = ({ radius, key, color }, ballBox) => {

    color = color && color !== undefined ? color : colorScale(Math.floor(Math.random() * m));

    return {
        radius: radius,
        color: color,
        x: getRandom(ballBox.min.x, ballBox.max.x),
        y: getRandom(ballBox.max.y, ballBox.min.y),
        speedX: (Math.random() - 0.5) * 2 * maxSpeed,
        speedY: (Math.random() - 0.5) * 2 * maxSpeed,
        key: key
    }
};

/** props are: height, width, showBorderOfBallBox, margin, 
 * balls to be drawn in this format: [{radius:<number>, key: <unique string>, color: <string hex color>}, {...},] */
const MegaBallsView = ({ height = 1000, width = 1000, showBorderOfBallBox = true, margin = { left: 0, right: 0, top: 0, bottom: 0 }, balls }) => {

    const svgRef = useRef();

    const bvm = 1.5 / 10 * height;
    const bhm = 1.5 / 10 * width;

    const ballBox = {
        min: { x: margin.left + bhm, y: margin.top + height - bvm },
        max: { x: margin.left + width - bhm, y: margin.top + bvm }
    };

    const sim = useRef();

    useEffect(() => {
        const referencedSvg = d3.select(svgRef.current);

        // create canvas area if not already created
        if (sim.current === undefined) {
            referencedSvg.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            let canvas = referencedSvg.select("g");

            canvas
                .append("svg:rect")
                .attr("width", ballBox.max.x - ballBox.min.x)
                .attr("height", ballBox.min.y - ballBox.max.y)
                .attr("x", ballBox.min.x)
                .attr("y", ballBox.max.y)
                .style("fill", "none")
                .style("stroke", showBorderOfBallBox && "#232323");
        }

        var canvas = referencedSvg.select("g");
        const bubbles = balls.map((ball) => { return createBubble(ball, ballBox) });
        let selection = canvas.selectAll("circle").data(bubbles, (bubble) => bubble.key);

        let enter = selection.enter().append("circle")
            .style("fill", function (d) { return d.color })
            .attr("r", function (d) { return 1 })
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .attr("id", function (d) { return d.key });

        enter.transition().duration(1000).attr('r', function (ball) { return ball.radius });

        let update = selection.style("fill", function (d) { return d.color })
            .attr("r", function (d) { return d.radius; })
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .attr("id", function (d) { return d.key });


        let exit = selection.exit();

        exit.transition().duration(1000).attr('r', function (ball) { return 0 }).remove();

        const merge = enter.merge(update);

        if (sim.current !== undefined) {
            sim.current.stop();
        }

        let simulation = d3.forceSimulation().alphaDecay(0).on("tick", () => tick(merge, ballBox, bubbles));
        sim.current = simulation;

    }, [balls]);

    return (
        < React.Fragment >
            <svg height={height} width={width} ref={svgRef}></svg>
        </React.Fragment >);
};

export default MegaBallsView;







