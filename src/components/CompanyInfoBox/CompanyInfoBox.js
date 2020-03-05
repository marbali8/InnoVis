import React from 'react'
import data from '../../data/company_details'
import classes from '../../containers/App/App.module.scss';
import {keyBy} from 'lodash'

const companies = keyBy(data, 'name')

const CompanyInfoBox = ({selectedCompany}) => {
  if (selectedCompany && Object.keys(companies).includes(selectedCompany.name)) {
    const company = companies[selectedCompany.name]
    return <div className={classes.card}>
      <h1 className="companyName">{company.name}</h1>
      <p className="founders">Founders: {company.founders}</p>
      <p className="year">Founded in: {company.founded}</p><p>{company.info}</p>
      <a href={company.website}>website link</a>
    </div>;
  } else {
    return <div></div>
  }
}

export default CompanyInfoBox;
