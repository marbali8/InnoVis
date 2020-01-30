import React, { useEffect } from 'react';
import classes from './exampleComponent.module.scss';

/** Example of a functional component that takes in a props object that looks like this {height:__,width:__}
 *  
 * -()=>{} is E6 arrow notation instead of traditiona function (){}
 * 
 * -you could also write const exampleComponent = (props)=>{} but then you have to refer to prop properties with prop.height prop.width
 * so we use something called 'destructuring' to decompose the object so we can access height, width, directly
 * 
 * -setting height=10 gives the prop a default value if it is undefined
 * 
 * -name of component has to start with capital letter, and the folder should also be named as such. 
*/
const ExampleComponent = ({ height, width }) => {

    // useEfect has to do with rendering, can be used in many ways.
    // This one simply runs this after the mount to the DOM, and then never again.
    //you might not need this for all components, especially if they are dumb components
    useEffect(() => { console.log("useEffect called") }, []);

    return <div className={classes.exampleComponent}></div>;
};

export default ExampleComponent;