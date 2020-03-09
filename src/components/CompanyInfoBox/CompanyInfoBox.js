import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import data from '../../data/company_details'
import {keyBy} from 'lodash'

const companies = keyBy(data, 'name');



const CompanyInfoBox = ({ height = 1000, width = 500 }) => {

  const anchor = useRef(null);
  const didMount = useRef(false);
  /** note to christina:
   * this component creates and appends the company info box elements on mount.
and in megaballs we use d3 to select the elements mounted here and change them
                  -> click on a ball will change the text of these elements + change opacity to make it visible.
                  -> click on background of megaballs will empty the text and set the opacity of the company infobox to 0, i.e. invisible!
  **/
  useEffect(() => {

    if (!didMount.current) {
      const companyInfoBox = d3.select(anchor.current).append('div').classed('companyInfoBoxContainer', true);

      const card = companyInfoBox.append('div').classed('companyInfoBox', true);

      card.append('h1').classed('companyInfoBox_companyName', true);
      card.append('p').classed('companyInfoBox_year', true);
      card.append('p').classed('companyInfoBox_founders', true);
      card.append('p').classed('companyInfoBox_info',true);
      card.append('a').classed('companyInfoBox_website',true);
    }
  }, []);

  return <div ref={anchor} className={"CompanyInfoBox"} height={width} width={height} />
}
export default CompanyInfoBox;











// old code:

// import React from 'react'
// import data from '../../data/company_details'
// import classes from '../../containers/App/App.module.scss';
// import {keyBy} from 'lodash'

// const companies = keyBy(data, 'name')

// const CompanyInfoBox = ({selectedCompany}) => {
//   if (selectedCompany && Object.keys(companies).includes(selectedCompany.name)) {
//     const company = companies[selectedCompany.name]
//     return <div className={classes.card}>
//       <h1 className="companyName">{company.name}</h1>
//       <p className="founders">Founders: {company.founders}</p>
//       <p className="year">Founded in: {company.founded}</p><p>{company.info}</p>
//       <a href={company.website}>website link</a>
//     </div>;
//   } else {
//     return <div></div>
//   }
// }

// export default CompanyInfoBox;
