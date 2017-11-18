/**
 * Created by BOSS on 11/4/2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import {reactLocalStorage} from 'reactjs-localstorage';

import { auth } from '../helpers/auth'

function setErrorMsg(error) {
    return {
        registerError: error.message
    }
}

function setSuccessMsg(msg) {
    return {
        registersucces: msg
    }
}

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        width: '100%',
    },
    formControl: {
        margin: theme.spacing.unit,
    },
    withoutLabel: {
        marginTop: theme.spacing.unit * 3,
    },
});

class RegisterForm extends React.Component {
    state = {
        email: '',
        password: '',
        showPassword: false,
        registerError: null,
        registersucces: null,
    };

    // password show hide control
    handleChangePass = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPasssword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    // Handle auth
    handleSubmit = () => {
        auth(this.state.email, this.state.password)
            .then((user) => {
                reactLocalStorage.set('isloggedin', true);
                reactLocalStorage.set('uid', user.uid);
                reactLocalStorage.setObject('user', {
                    'displayName': user.displayName,
                    'photoURL': user.photoURL,
                });
                this.setState(setErrorMsg({error: null}))
                this.setState(setSuccessMsg('You have successfully registered. Please wait we will redirect you to the dashboard.'))

                setTimeout(function () {
                    window.location.assign('/')
                }, 5000)

            })
            .catch(e => this.setState(setErrorMsg(e)))
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <FormControl fullWidth className={classes.formControl}>
                    {
                        this.state.registerError &&
                        <div style={{backgroundColor: '#FF3D00', color: '#fff', padding: 10}} role="alert">
                            <span style={{fontWeight: 'bold'}}>Error:</span>
                            &nbsp;{this.state.registerError}
                        </div>
                    }
                    {
                        this.state.registersucces &&
                        <div style={{backgroundColor: '#3ebd08', color: '#fff', padding: 10}} role="alert">
                            <span style={{fontWeight: 'bold'}}>Congratulation:</span>
                            &nbsp;{this.state.registersucces}
                        </div>
                    }
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <InputLabel htmlFor="amount">Email</InputLabel>
                    <Input
                        id="email"
                        onChange={(event) => {
                            this.setState({ email: event.target.value });
                        }}
                        value={this.state.email}
                    />
                </FormControl>

                <FormControl fullWidth className={classes.formControl}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        id="password"
                        type={this.state.showPassword ? 'text' : 'password'}
                        value={this.state.password}
                        onChange={this.handleChangePass('password')}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={this.handleClickShowPasssword}
                                    onMouseDown={this.handleMouseDownPassword}
                                >
                                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>

                    {
                        this.state.loginMessage &&
                        <div className="alert alert-danger" role="alert">
                            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                            <span className="sr-only">Error:</span>
                            &nbsp;{this.state.loginMessage} <a onClick={this.resetPassword} className="alert-link">Forgot Password?</a>
                        </div>
                    }
                </FormControl>

                <Button raised color="primary" className={classes.button}
                        onClick={() => {
                            this.handleSubmit()
                        }}>
                    Sign Up
                </Button>

            </div>
        );
    }
}

RegisterForm.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RegisterForm);