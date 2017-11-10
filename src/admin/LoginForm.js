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

import { login, resetPassword } from '../helpers/auth'

function setErrorMsg(error) {
    return {
        loginMessage: error
    }
}

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        width: '100%',
    },
    buttonReset: {
        margin: theme.spacing.unit
    },
    formControl: {
        margin: theme.spacing.unit,
    },
    withoutLabel: {
        marginTop: theme.spacing.unit * 3,
    },
    errormsg: {
        backgroundColor: '#ee2209'
    }
});

class LoginForm extends React.Component {
    state = {
        email: '',
        password: '',
        showPassword: false,
        loginMessage: null
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
        login(this.state.email, this.state.password)
            .then((user) => {
                reactLocalStorage.set('isloggedin', true);
                reactLocalStorage.set('uid', user.uid);
                reactLocalStorage.setObject('user', {
                    'displayName': user.displayName,
                    'photoURL': user.photoURL,
                });
                window.location.assign('/')

                // default constants
                // reactLocalStorage.setObject('user', {
                //     'uid': user.uid,
                //     'displayName': user.displayName,
                //     'email': user.email,
                //     'emailVerified': user.emailVerified,
                //     'isAnonymus': user.isAnonymous,
                //     'metadata': user.metadata,
                //     'phoneNumber': user.phoneNumber,
                //     'photoURL': user.photoURL,
                // });
            })
            .catch((error) => {
                this.setState(setErrorMsg('Invalid username/password.'))
            })
    }

    resetPassword = () => {
        resetPassword(this.state.email)
            .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
            .catch((error) => this.setState(setErrorMsg(`Email address not found.`)))
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <FormControl fullWidth className={classes.formControl}>
                    {
                        this.state.loginMessage &&
                        <div style={{backgroundColor: '#FF3D00', color: '#fff', padding: 10}} role="alert">
                            <span style={{fontWeight: 'bold'}}>Error:</span>
                            &nbsp;{this.state.loginMessage}
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
                <Button className={classes.buttonReset}>Reset Password</Button>

                <Button raised color="primary" className={classes.button}
                onClick={() => {
                    this.handleSubmit()
                }}>
                    Sign in
                </Button>

            </div>
        );
    }
}

LoginForm.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(LoginForm);