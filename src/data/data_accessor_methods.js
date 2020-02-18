import companyData from './companies_yearly_data.js';
import * as _ from 'lodash';

export function getRevenueForCompanyObjectByYear(companyObj, year) {

    const revenueKey = "revenue_" + year;

    const revenue = companyObj[revenueKey];

    return revenue;

}
