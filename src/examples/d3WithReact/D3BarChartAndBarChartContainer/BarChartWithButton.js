import React, { useState } from "react";

import { getRandomData } from "./utils";
import BarChart from "./BarChart";

/** Component that is built on the BarChart component: creates a coloured bar chart that changes data
 * randomly whenever the button is pressed.
 */
const BarChartWithButton = ({ heightOfBars = 10, widthOfBars = 100, numberOfBars = 10 }) => {

    const [data, setData] = useState(getRandomData(5));
    return (
        <div
            style={{
                width: "50vw",
                height: '100%',
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            {<BarChart height={heightOfBars} width={widthOfBars} data={data} ></BarChart>}
            <button
                style={{
                    width: "100px",
                    margin: "1em 0px",
                    background: "#011627",
                    color: "white",
                    fontSize: "1em"
                }}
                onClick={() => setData(getRandomData(5))}
            >
                get new data
      </button>
        </div >
    );
};

export default BarChartWithButton;