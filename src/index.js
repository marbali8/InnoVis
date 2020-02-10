import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App.js';
import StreamGraph from './components/StreamGraph/StreamGraph.js'
import * as serviceWorker from './serviceWorker';

// entry point to entire application -> ReactDOM renders the App inside the root element in the index file.
ReactDOM.render(<StreamGraph />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
