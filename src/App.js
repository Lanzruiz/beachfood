import React, { Component } from 'react';
import Frontend from "./home";
import Admin from "./admin";
import conf from './config'


class App extends Component {
    render() {

        if (conf.onlyAdmin) {
            return (
                <Admin />
            )
        }
        else {
            return (
                <Frontend />
            )
        }
    }
}

export default App;
