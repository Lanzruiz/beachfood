import React, { Component } from 'react';
import Frontend from "./home";
import Admin from "./admin";
import Clubs from "./clubs";
import conf from './config'


class App extends Component {
    render() {

        if (conf.onlyAdmin) {
            return (
                <Admin />
            )
        } else {
            return (
                <Frontend />
            )
        }
    }
}

export default App;
