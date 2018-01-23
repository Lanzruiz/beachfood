import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import conf from '../config';

import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';

class Home extends Component {
    render() {
        return (
            <div className="App">
                <header>
                    <AppBar
                        title={<span>Title</span>}
                        iconElementRight={<Button label="Save"><Avatar src="./images/uxceo-128.jpg" /></Button>}
                    />
                    <nav>
                        <ul>
                            <li><Link to='/'>Home</Link></li>
                            <li><Link to='/login'>Login</Link></li>
                        </ul>
                    </nav>
                    <h1 className="App-title">{conf.sitename}</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
            </div>

        );
    }
}

export default Home;
