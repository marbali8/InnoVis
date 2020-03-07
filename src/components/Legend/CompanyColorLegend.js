import React from 'react';
import classes from './CompanyColorLegend.module.scss';
import { getColorByCompanyCategory } from './../../utility_functions/ColorFunctions.js';
import { getRevenueForCompanyObjectByYear } from '../../data/data_functions';
import categories from '../../data/category_label_mapping.json';

const CompanyLabels = (data = [], year = 2018) => {

    const getLegendForCategory = (category) => {
        const color = getColorByCompanyCategory(category.id);
        const circle = <div style={{ marginRight: '10px', display: 'inline-block', width: '20px', height: '20px', backgroundColor: color, borderRadius: '50%' }} />;

        return <div className={classes.categoryRow}>
            {circle}
            <div className={classes.companyLabel}>
                <div><pre>{JSON.stringify(category.labelEn, null, 2).slice(1, -1)}</pre></div>
            </div>
        </div>
    };

    return (<div className={classes.container}>
        {
            categories.map(category => getLegendForCategory(category))
        }
    </div>);
};

export default CompanyLabels;

/*return (<div className={classes.container}>
    {
        categories.map(category => getLegendForCategory(category))
    }
</div>);*/

/*    return (<div className={classes.container}>
        {
            categories.map(category => {
                return (
                    getRevenueForCompanyObjectByYear(category, year) !== 'null'
                        ? getLegendForCategory(category)
                        : null)
            })
        }
    </div>);*/