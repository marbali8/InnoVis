import React, { useEffect, useRef } from "react";
// import data from '../../data/companies_yearly_data.json';
import * as d3 from 'd3';

const MegaBallsView = (mockData) => {

    const svgRef = useRef();

    const margin = { left: 0, right: 0, top: 0, bottom: 100 };
    const width = 1000 - margin.left - margin.right;
    const height = 1000 - margin.top - margin.bottom;

    useEffect(() => {

        // vertical & horizontal margin to ball box, which is rectangular area containing the balls
        // top margin = bottom margin = vertical margin, similar eq for hz. margin!
        // max = top right corner, min = bottom left corner
        // as bvm and bhm increase -> area of ballBox decreases. 
        const bvm = 1 / 10 * height;
        const bhm = 1 / 10 * width;
        const ballBox = {
            min: { x: margin.left + bhm, y: margin.top + height - bvm },
            max: { x: margin.left + width - bhm, y: margin.top + bvm }
        };

        // adjustable options
        const numBalls = 500;
        const maxSpeed = 100;
        const maxBallArea = 10;
        const gravityAlpha = 0.001;
        const extraPaddingBetweenBalls = 0.95;
        const collisionAlpha = 1;
        const showBorderOfBallBox = false;

        // max domain value for color scale's domain = [0,1,2...m]
        const m = 20;

        const radiusScale = d3.scaleSqrt().domain([0, 100]).range([0, maxBallArea]);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(m));

        const balls = [];
        for (let i = 0; i < numBalls; i++) {
            const r = radiusScale(1 + Math.floor(Math.random() * (100 - 1)));
            balls.push({
                radius: r,
                color: colorScale(Math.floor(Math.random() * m)),
                x: getRandom(ballBox.min.x, ballBox.max.x),
                y: getRandom(ballBox.max.y, ballBox.min.y),
                speedX: (Math.random() - 0.5) * 2 * maxSpeed,
                speedY: (Math.random() - 0.5) * 2 * maxSpeed,
                key: `ball${i}`
            });
        }

        const referencedSvg = d3.select(svgRef.current);

        // create a canvas to draw on
        let canvas;
        referencedSvg.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        canvas = referencedSvg.select("g");

        var simulation = d3.forceSimulation()
            // stops the simulation from ending, it will just keep going!
            .alphaDecay(0)
        // not used right now, since we only use force simulation to call tick.
        // .force("forceX", d3.forceX().strength(.1).x(width * .5))
        // .force("forceY", d3.forceY().strength(.1).y(height * .5))
        // .force("center", d3.forceCenter().x(width * .5).y(height * .5))
        // .force("charge", d3.forceManyBody().strength(0.1));

        // call tick function to update ball positions with gravity() & collision()
        simulation
            .nodes([]) // empty for now
            .force("collide", d3.forceCollide().strength(.5).radius(function (d) { return d.radius + 20; }).iterations(1000))
            .on("tick", function (d) {
                tick();
            });

        // // draw bounding box
        canvas.append("svg:rect")
            .attr("width", ballBox.max.x - ballBox.min.x)
            .attr("height", ballBox.min.y - ballBox.max.y)
            .attr("x", ballBox.min.x)
            .attr("y", ballBox.max.y)
            .style("fill", "none")
            .style("stroke", () => { return showBorderOfBallBox && "#232323" });


        var circles = canvas.selectAll("circle")
            .data(balls)
            .enter().append("circle")
            .attr("r", function (d) { return d.radius; })
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .style("fill", function (d) { return d.color; });

        // updates the position, velocity of the balls
        function tick() {
            circles
                .each(gravity(gravityAlpha))
                .each(collide(collisionAlpha))
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        }

        // checks if any ball has hit the boundary box, changing its direction & speed accordingly
        function gravity(alpha) {
            return function (d) {
                if ((d.x - d.radius) < ballBox.min.x) d.speedX = Math.abs(d.speedX);
                if ((d.x + d.radius) > ballBox.max.x) d.speedX = -1 * Math.abs(d.speedX);
                if ((d.y - d.radius) < ballBox.min.y) d.speedY = -1 * Math.abs(d.speedY);
                if ((d.y + d.radius) > ballBox.max.y) d.speedY = Math.abs(d.speedY);

                d.x = d.x + (d.speedX * alpha);
                d.y = d.y + (-1 * d.speedY * alpha);
            };
        }

        // collision detection between balls + change their dir/speed accordingly
        function collide(alpha) {
            var quadtree = d3.quadtree()
                .x(ball => ball.x)
                .y(ball => ball.y)
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

        function getRandom(min, max) {
            return min + (Math.random() * (max - min));
        };

    }, [height, margin.bottom, margin.left, margin.right, margin.top, width]); // useEffect

    return <React.Fragment><svg height={height} width={width} ref={svgRef}></svg> </React.Fragment>;
};

export default MegaBallsView;
