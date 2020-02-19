
export function getRevenueForCompanyObjectByYear(companyObj, year) {

    const revenueKey = "revenue_" + year;

    const revenue = companyObj[revenueKey];

    return revenue;

}
