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

// TO BE DONE: needs to be changed so we return category data instead of placeholder data
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



  
