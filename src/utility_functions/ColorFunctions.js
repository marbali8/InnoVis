import * as d3 from 'd3';

// objects that store info, maybe one big object with each category and which SNI codes belong to it

// or just an object that maps SNI code to color


const categorical = [
    "schemeTableau10",
    "schemeAccent",
    "schemeDark2",
    "schemePastel2",
    "schemeSet2",
    "schemeSet1",
    "schemePastel1",
    "schemeCategory10",
    "schemeSet3",
    "schemePaired",
    "schemeCategory20",
    "schemeCategory20b",
    "schemeCategory20c"
];

const sequential = [
    "interpolateGreys",             //0
    "interpolateRdBu",
    "interpolateRdYlBu",
    "interpolateRdYlGn",
    "interpolateSpectral",
    "interpolateOranges",           //5
    "interpolateTurbo",
    "interpolateViridis",
    "inteprolateInferno",
    "interpolateMagma",
    "interpolatePlasma",            //10
    "interpolateCividis",
    "interpolateWarm",
    "interpolateCool",
    "interpolateCubehelixDefault",
    "interpolateBuPu",              //15
    "interpolateGnBu",
    "interpolateOrRd",
    "interpolatePuBuGn",
    "interpolatePuBu",
    "interpolatePuRd",              //20
    "interpolateRdPu",
    "interpolateYlGnBu",
    "interpolateYlGnBu",
    "interpolateYlOrBr",
    "interpolateYlOrRd",            //25
    "interpolateRainbow",
    "interpolateSinebow"            //27
];


const numCategories = 10+1;
//const colorScale = d3.scaleOrdinal(d3.quantize(d3[sequential[4]], numCategories).reverse());
var colorScale = d3.scaleOrdinal(d3[categorical[0]].reverse());

//tbd
export function getColorBySNICode(SNIcode) {
    return 'red';
}

export function getColorByCompanyCategory(companyCategory) {

    const color = colorScale(companyCategory)

    if (color !== null && color !== undefined) {
        return colorScale(companyCategory);
    }

    return 'black';


}

//tbd
export function getColorByCompanyKey(key) {
    return 'purple';
}
