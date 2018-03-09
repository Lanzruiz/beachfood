import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import Save from 'material-ui-icons/Save';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import green from 'material-ui/colors/green';
import CheckIcon from 'material-ui-icons/Check';
import KeyboardBackspace from 'material-ui-icons/KeyboardBackspace';

import { DateTimePicker } from 'material-ui-pickers'

import { RestaurantOwnerRef, firebaseAuth } from '../../FB'
import { saveEvent } from '../../helpers/events'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import IconButton from 'material-ui/IconButton';
import swal from 'sweetalert';

import stylesm from '../../App.css'

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 30,
    },
    paper: {
        padding: 16,
        color: theme.palette.text.secondary,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 0,
        borderWidth: 2,
        borderColor: '#000'
    },
    button: {
        float: 'right',
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    buttonProgress: {
        color: green[500],
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
        float: 'right'
    },
});


class UpdateRestaurantOwner extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            origEmail: '',
            password: '',
            origPassword: '',
            userid: '',
            userKey: '',
            isloading: false,
            issuccess: false,
            showPassword: false,
            emailError: false,
            errorFields: false,
            invalidEmail: false,
            requirelogin: false

        }
    }


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

    componentDidMount(){
        var _ths = this;

        var restoID = this.props.match.params.restoid;

        RestaurantOwnerRef.child(restoID).once('value', function(snapshot) {
            let clubRec = snapshot.val();
            _ths.setState({
               firstname: clubRec.firstname,
               lastname: clubRec.lastname,
               email: clubRec.email,
               userid: clubRec.userid,
               origEmail: clubRec.email,
               origPassword: clubRec.password,
               userKey: restoID
            })
        });

    }




    saveRestaurantOwner(){

        var _ths = this;

        this.setState({
            isloading: true,
            issuccess: false,
        })




        var errorFields= false;
        if(this.state.firstname == "" || this.state.lastname == "" || this.state.email == "") {
           errorFields = true;
           swal ( "Oops" ,  "All fields are required except for password!" ,  "error" );
           this.setState({
               isloading: false
           })
        }

        if(errorFields == false) {

             //user want to change the email address on auth
             firebaseAuth.signInWithEmailAndPassword(this.state.origEmail,this.state.origPassword)
             .then(function(user) {
                if (_ths.state.email != _ths.state.origEmail) {
                      user.updateEmail(_ths.state.email).catch(function(error) {
                          errorFields = true;
                          if (error.code == "auth/invalid-email") {
                              _ths.setState({
                                  invalidEmail: true,
                                  isloading: false,
                                  issuccess: false
                              })
                          } else if(error.code == "auth/email-already-in-use") {
                            _ths.setState({
                                emailError: true,
                                isloading: false,
                                issuccess: false
                            })
                          } else if(error.code = "auth/requires-recent-login") {
                            _ths.setState({
                                requirelogin: true,
                                isloading: false,
                                issuccess: false
                            })
                          }
                      }).then(function(user) {
                        errorFields = false
                      });
              }

              //check if password is not empty change password to firebase auth
              if(_ths.state.password != "") {
                 //user wants to change password
                 user.updatePassword(_ths.state.password).then(function(user) {
                     console.log("success change password");
                     errorFields = false;
                 }).catch(function(error) {
                    console.log(error);
                    errorFields = true;
                 });
              }

              //save data to user firebase
              if(errorFields == false) {
                        var value = {}
                        if(_ths.state.password == "") {
                         var value = {
                              firstname: _ths.state.firstname,
                              lastname: _ths.state.lastname,
                              email: _ths.state.email
                          }
                          console.log(_ths.state.userKey);
                          RestaurantOwnerRef.child(_ths.state.userKey).update(value);
                        } else {
                         var value = {
                              firstname: _ths.state.firstname,
                              lastname: _ths.state.lastname,
                              email: _ths.state.email,
                              password: _ths.state.password
                          }
                          RestaurantOwnerRef.child(_ths.state.userKey).update(value);
                        }



                        _ths.setState({
                                      password: '',
                                      isloading: false,
                                      issuccess: true,
                                      showPassword: false,
                                      emailError: false,
                                      errorFields: false
                      });


              }
             });

        }










    }


    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    render() {
        const { classes } = this.props;
        const isupdateBTN = (this.props.match.params.evid) ? 'Update' : 'Save';
        const isupdated = (this.props.match.params.evid) ? 'Update' : 'Save';
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.issuccess,
        });
        if(this.state.emailError == true) {
          var _ths = this;
          swal ( "Oops" ,  "Email address already in used!" ,  "error" );
          _ths.setState({
              emailError: false
          })
        } else if(this.state.invalidEmail) {
          var _ths = this;
          swal ( "Oops" ,  "Invalid Email address!" ,  "error" );
          _ths.setState({
              invalidEmail: false
          })
        } else if(this.state.requirelogin) {
          var _ths = this;
          swal ( "Oops" ,  "Error! Failed to validate user credential." ,  "error" );
          _ths.setState({
              requirelogin: false
          })
        }

        if(this.state.issuccess == true) {
          swal ( "Success" ,  "Restaurant Owner successfully saved!" ,  "success" );
            var _ths = this;
            _ths.setState({
                issuccess: false
            })
        }

        return (
            <div className="App">
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <Link to={`/restaurant_owner`} className='linkBtn primary'>
                        <span>
                            <KeyboardBackspace />
                            Back
                        </span>
                        </Link>
                    </Grid>
                    <Grid item xs={6} className="pageToolbarRight">
                        <Button
                            className={buttonClassname}
                            disabled={this.state.isloading} raised dense color="primary"
                            onClick={() => {
                                this.saveRestaurantOwner()
                            }}>
                            {
                                this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                    this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                        <Save className={classes.leftIcon} />
                            }
                            {
                                this.state.issuccess ? `Restaurant Owner Saved` : `Save Restaurant Owner`
                            }
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <Paper className={classes.paper}>
                            <Typography type="title" gutterBottom>
                                Restaurant Owner
                            </Typography>

                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="firstname"
                                    label="First name"
                                    value={this.state.firstname}
                                    onChange={this.handleChange('firstname')}
                                    margin="normal"
                                />
                            </FormControl>

                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="lastname"
                                    label="Last name"
                                    value={this.state.lastname}
                                    onChange={this.handleChange('lastname')}
                                    margin="normal"
                                />
                            </FormControl>

                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="email"
                                    label="Email address"
                                    value={this.state.email}
                                    onChange={this.handleChange('email')}
                                    margin="normal"
                                />
                            </FormControl>

                            <FormControl fullWidth className={stylesm.theFromControl}>

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



                        </Paper>
                    </Grid>

                </Grid>
            </div>
        );
    }
}

UpdateRestaurantOwner.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpdateRestaurantOwner);
