import { CssBaseline } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import 'fontsource-roboto';

import App from './app/App';
import './index.css';

Axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline />
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
