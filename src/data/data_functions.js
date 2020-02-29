import companyData from '../data/companies.json';
import { getColorByCompanyCategory } from '../utility_functions/ColorFunctions.js';

function compare(a, b) {
    const catA = a.values;
    const catB = b.values;
  
    let comparison = 0;
    if (catA > catB) {
      comparison = 1;
    } else if (catA < catB) {
      comparison = -1;
    }
    return comparison;
}

export function getRevenueForCompanyObjectByYear(companyObj, year) {
    const revenueKey = "revenue" + year;
    const revenue = companyObj[revenueKey];
    if (revenue === "null") return 0;
    return revenue;
}

export function getDataForSunburst(year) {
    const numCategories = 10;
    const numCompanies = companyData.length;
    const categories = [];
    
    var catNames = new Array(numCategories).fill(" ");
    var catValue = new Array(numCategories).fill(0);
    
    for (let i = 0; i < numCompanies; ++i)
    {
        catValue[companyData[i].category] += getRevenueForCompanyObjectByYear(companyData[i], year);
        if (catNames[companyData[i].category] === ' ')
        {
            catNames[companyData[i].category] = companyData[i].catname;
        }
    }

    for (let i = 0; i < numCategories; ++i)
    {
        categories.push({ label: catNames[i], color: getColorByCompanyCategory(i), value: catValue[i] });
    }

    return categories.sort(compare);
};

export function getDataForMegaballs(year) 
{
    const numCompanies = companyData.length;
    const anchorNodes = {};
    const graph = [];
    const nodeLinks = [];
            
    for (let i = 0; i < numCompanies; i++) {
        let category = companyData[i].category;
        
        graph.push({size: Math.sqrt(Math.sqrt(getRevenueForCompanyObjectByYear(companyData[i], year))), id: companyData[i].category});
        
        if (category in anchorNodes) {
            nodeLinks.push({ "source": anchorNodes[category], "target": i });
            nodeLinks.push({ "source": i, "target": anchorNodes[category] });
        }
        else {
            anchorNodes[category] = i;
        }
    }

    const megaData = {nodes: graph, links: nodeLinks};
    return megaData;
}


  
