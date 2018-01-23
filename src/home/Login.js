import React, {Component} from 'react';
import Button from 'material-ui/Button';


class Login extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Login</h1>
                    <Button href="/" label="Home"/>
                </header>
            </div>
        );
    }
}

export default Login;
