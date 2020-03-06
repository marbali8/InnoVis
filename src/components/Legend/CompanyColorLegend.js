import React from 'react';
import classes from './CompanyColorLegend.module.scss';

// getColorBycompanyCategory returns the color of the category, taking in the category id as input, where there are 10 categories in total.
import { getColorByCompanyCategory } from './../../utility_functions/ColorFunctions.js';
import { getRevenueForCompanyObjectByYear } from '../../data/data_functions';

// this contains an array of categories, where each elem has an id as an identifier and a label in swedish
import categories from '../../data/category_label_mapping.json';

const CompanyLabels = (data = [], year = 2010) => {
    
    // function that takes in a category element and outputs a row in the company color legend
    const getLegendForCategory = (category) => {

        // this circle needs to change color based on category using getColorByCompanyCategory(category.id);
        const color = getColorByCompanyCategory(category.id);
        const circle = <div style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: color, borderRadius: '50%' }} />;

        return <div className={classes.categoryRow}>
            {circle}
            <div className={classes.label}>
                <div><pre>{JSON.stringify(category.labelEn,null,2).slice(1, -1)}</pre></div>
            </div>
        </div>
    };

    return (<div className={classes.container}>
        {
            categories.map(category => {
                return (
                getRevenueForCompanyObjectByYear(category, year) !== 'null'
                ? getLegendForCategory(category)
                : 'null')
            })
        }
    </div>);
};

export default CompanyLabels;