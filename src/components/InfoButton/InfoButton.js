import React, { useState } from 'react';
import classes from './InfoButton.module.scss';

const InfoButton = () => {

    const [showButton, setShowButton] = useState(false);

    return <div style={{ zIndex: '100' }}>
        <div onClick={() => { setShowButton(!showButton) }} className={classes.InfoButton}>
            <div className={classes.button}>?</div>
            {showButton && <div className={classes.popupBox}>
                <div className={classes.bubble}>
                    <div className={classes.introText}>
                        <p>The circles represent startup companies KTH innovation has helped create and foster</p>
                        <p>The circle's area is proportional to the total revenue of that company during the active year, which is selected with the time slider </p>
                        <p>Hover on the circles to find out more about each company, and use zoom to pan in and out!</p>
                    </div>
                    <div className={classes.footer}>

                        <p>This data was taken from tax revenue info. provided by KTH Innovation. The visualisation was developed as part of the Information Visualization course at KTH. Group members are: <a
                            href="mailto:hesseb@kth.se">Alexander Hesseborn</a>, <a href="mailto:alvinh@kth.se">Alvin
                        Häger</a>, <a href="mailto:sonebo@kth.se">Christina Sonebo</a>, <a href="mailto:hcbayat@kth.se">Hannah
                        Clara Bayat</a>, <a href="mailto:jacobel@kth.se">Jacob von Eckermann</a> and <a
                                href="mailto:marbr@kth.se">Mar Balibrea</a>. </p>
                    </div>


                </div>
            </div>}
        </div>

    </div>
};

export default InfoButton;