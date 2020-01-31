import { range as d3range } from "d3-array";
import { randomNormal as d3randomNormal } from "d3-random";

const colors = ["#2176ae", "#57b8ff", "#b66d0d", "#fbb13c", "#fe6847"];


export const getRandomData = (totalPoints = 5) => {

    if (0 <= totalPoints && totalPoints <= 5) {
        return d3range(totalPoints).map((d, i) => {
            return { x: d, y: d3randomNormal()(), color: colors[i] };
        });
    }

    else {
        return d3range(totalPoints).map((d, i) => {
            return { x: d, y: d3randomNormal()(), color: '#' + Math.random().toString(16).substr(2, 6) };
        });
    }
};
