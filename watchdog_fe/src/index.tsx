import { CssBaseline } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import 'fontsource-roboto';

import App from './app/App';
import './index.css';
import { jwtRequestInterceptor, jwtResponseInterceptor } from './util/jwtInterceptor';

Axios.defaults.baseURL = 'http://127.0.0.1:8000/api';
Axios.interceptors.request.use(jwtRequestInterceptor);
Axios.interceptors.response.use((response) => response, jwtResponseInterceptor);

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline />
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
