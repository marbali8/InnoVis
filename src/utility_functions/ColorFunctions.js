import * as d3 from 'd3';

// objects that store info, maybe one big object with each category and which SNI codes belong to it

// or just an object that maps SNI code to color

const numCategories = 10;

const categorical = [
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


const colorScale = d3.scaleOrdinal(d3.quantize(d3[sequential[4]], numCategories));
//var colorScale = d3.scaleOrdinal(d3[categorical[0]]);

//tbd
export function getColorBySNICode(SNIcode) {
    return 'red';
};

export function getColorByCompanyCategory(companyCategory) {
    return colorScale(companyCategory);
}

//tbd
export function getColorByCompanyKey(key) {
    return 'purple';
}
