import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import 'fontsource-roboto';

import App from './app/App';
import './index.css';
import { jwtRequestInterceptor, jwtResponseInterceptor } from './util/jwtInterceptor';
import { baseUrl, httpProtocol } from './util/urlResolver';

Axios.defaults.baseURL = `${baseUrl(httpProtocol)}/api`;
Axios.interceptors.request.use(jwtRequestInterceptor);
Axios.interceptors.response.use((response) => response, jwtResponseInterceptor);

const theme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <RecoilRoot>
                    <CssBaseline />
                    <App />
                </RecoilRoot>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
