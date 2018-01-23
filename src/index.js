import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import './App.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
const theme = createMuiTheme();


render((

    <MuiThemeProvider theme={theme}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </MuiThemeProvider>

), document.getElementById('root'));
registerServiceWorker();
