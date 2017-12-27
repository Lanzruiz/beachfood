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
 import { administratorRef } from '../FB'

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
      var _ths = this;

        login(this.state.email, this.state.password)
            .then((user) => {
                console.log(user.uid);
                //check if userid is valid
                administratorRef.orderByChild('userid').equalTo(user.uid).once('child_added', function (snapshot) {
                  console.log(snapshot.val());
                    if(snapshot.exists()) {
                      reactLocalStorage.set('isloggedin', true);
                      reactLocalStorage.set('uid', user.uid);
                      reactLocalStorage.setObject('user', {
                          'displayName': user.displayName,
                          'photoURL': user.photoURL,
                      });
                      window.location.assign('/drynx_admin');
                      _ths.setState(setErrorMsg(null));
                    } else {
                      console.log("Invalid access");
                       _ths.setState(setErrorMsg('Invalid username/password.'));
                    }
                }).catch(function(error) {
                  console.log("Invalid access");
                   _ths.setState(setErrorMsg('Invalid username/password.'));
                });

                //_ths.setState(setErrorMsg('Invalid username/password.'));

            })
            .catch((error) => {
                this.setState(setErrorMsg('Invalid username/password.'));
            })
    }

    resetPassword = () => {

      if(this.state.email == "") {
        this.setState(setErrorMsg('Please enter your valid email address'));
      } else {
        var _ths = this;
        administratorRef.orderByChild('email').equalTo(this.state.email).once('value', function (snapshot) {
            if(snapshot.exists()) {
              resetPassword(_ths.state.email)
                  .then(() => _ths.setState(setErrorMsg(`Password reset email sent to ${_ths.state.email}.`)))
                  .catch(function(error) {
                    _ths.setState(setErrorMsg(`Email address not found.`));
                  });

            } else {
               _ths.setState(setErrorMsg(`Email address not found.`));
            }
        });

      }

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
                <Button className={classes.buttonReset} onClick={() => {
                    this.resetPassword()
                }}>Reset Password</Button>

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
