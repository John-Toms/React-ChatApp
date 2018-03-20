import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import './index.css';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';

import App from './App';

import registerServiceWorker from './registerServiceWorker';


export default(
    ReactDOM.render(
        <Router history={browserHistory}>
            <Route path="/" component={Home}/>
            <Route path="/login" component={Login}/>        
            <Route path="/register" component={Register}/>
        </Router>,
        document.getElementById('root')
    )
);

registerServiceWorker();
