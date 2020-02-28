import * as d3 from 'd3';

// objects that store info, maybe one big object with each category and which SNI codes belong to it

// or just an object that maps SNI code to color

const numCategories = 10;

var categorical = [
    { "name" : "schemeAccent", "n": 8},
    { "name" : "schemeDark2", "n": 8},
    { "name" : "schemePastel2", "n": 8},
    { "name" : "schemeSet2", "n": 8},
    { "name" : "schemeSet1", "n": numCategories},
    { "name" : "schemePastel1", "n": 9},
    { "name" : "schemeCategory10", "n" : numCategories},
    { "name" : "schemeSet3", "n" : 12 },
    { "name" : "schemePaired", "n": 12},
    { "name" : "schemeCategory20", "n" : 20 },
    { "name" : "schemeCategory20b", "n" : 20},
    { "name" : "schemeCategory20c", "n" : 20 }
];

//const colorScale2 = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(numCategories));
//const colorScale = d3.interpolateSpectral;
var colorScale = d3.scaleOrdinal(d3[categorical[0].name]);


export function getColorBySNICode(SNIcode) {
    return 'red';
};

export function getColorByCompanyCategory(companyCategory) {
    return colorScale(companyCategory);
}

// each obj in data has a unique key which can be used to map a color
export function getColorByCompanyKey(key) {
    return 'purple';
}
