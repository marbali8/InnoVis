
export function getRevenueForCompanyObjectByYear(companyObj, year) {
    const revenueKey = "revenue_" + year;
    const revenue = companyObj[revenueKey];
    return revenue;
}

// TO BE DONE: needs to be changed so we return category data instead of placeholder data
export function getDataForSunburst(year) {
    const rand1 = Math.random() * (10 - 1) + 1;
    const rand2 = Math.random() * (10 - 1) + 1;
    return [{ label: 'FirstObj', color: 'red', value: rand1 }, { label: 'SecondObj', color: 'blue', value: rand2 }];
};