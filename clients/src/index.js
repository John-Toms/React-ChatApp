import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import './index.css';
import Login from './pages/login';
import Regestration from './pages/regesteration';
import Home from './pages/home';

import App from './App';

import registerServiceWorker from './registerServiceWorker';


export default(
    ReactDOM.render(
        <Router history={browserHistory}>
            <Route path="/" component={Login}/>
            <Route path="/home" component={Home}/>        
            <Route path="/regestration" component={Regestration}/>
        </Router>,
        document.getElementById('root')
    )
);

registerServiceWorker();
