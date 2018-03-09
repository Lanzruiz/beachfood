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

import { customerRef, firebaseAuth } from '../../FB'
import { saveEvent } from '../../helpers/events'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import IconButton from 'material-ui/IconButton';
import swal from 'sweetalert';
import Background from '../images/login.jpg';
import {reactLocalStorage} from 'reactjs-localstorage';
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


class NewCustomer extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            userid: '',
            contact:'',
            isloading: false,
            issuccess: false,
            showPassword: false,
            emailError: false,
            errorFields: false

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
        //document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
        //document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";

    }




    saveCustomer(){

        var _ths = this;

        this.setState({
            isloading: true,
            issuccess: false,
        })




        var errorFields= false;
        if(this.state.firstname == "" || this.state.lastname == "" || this.state.email == "" || this.state.password == "" || this.state.contact == "") {
           errorFields = true;
           swal ( "Oops" ,  "All fields are required!" ,  "error" );
           this.setState({
               isloading: false
           })
        }

        //check if email address is valid
        if(errorFields == false) {

          firebaseAuth.signInWithEmailAndPassword(this.state.email, " ")
          .catch(function(error) {
              if(error.code === "auth/wrong-password") {
                _ths.setState({
                    emailError: true,
                    isloading: false,
                    issuccess: false
                })
              } else if(error.code === "auth/user-not-found"){
                   //create new user in auth
                   firebaseAuth.createUserWithEmailAndPassword(_ths.state.email, _ths.state.password)
                   .then(function(user) {

                     var user_type = reactLocalStorage.get("type") == "admin" ? "admin" : "super_admin";
                     var value = {
                         firstname: _ths.state.firstname,
                         lastname: _ths.state.lastname,
                         email: _ths.state.email,
                         contact: _ths.state.contact,
                         userid: user.uid,
                         password: _ths.state.password,
                         user_type: user_type,
                     }

                     customerRef.push(value);

                     _ths.setState({
                         firstname: '',
                         lastname: '',
                         email: '',
                         password: '',
                         userid: '',
                         contact: '',
                         isloading: false,
                         issuccess: true,
                         showPassword: false,
                         emailError: false,
                         errorFields: false
                     });





                   })
                   .catch(function(error) {
                      console.log(error);
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
        }

        if(this.state.issuccess == true) {
          swal ( "Success" ,  "Customer successfully saved!" ,  "success" );
            var _ths = this;
            _ths.setState({
                issuccess: false
            })
        }

        return (
            <div className="App">
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <Link to={`/customer`} className='linkBtn primary'>
                        <span>
                            <KeyboardBackspace />
                            Back
                        </span>
                        </Link>
                    </Grid>
                    <Grid item xs={6} className="pageToolbarRight">
                        <Button
                            style={{background: '#147dc2'}}
                            className={buttonClassname}
                            disabled={this.state.isloading} raised dense color="primary"
                            onClick={() => {
                                this.saveCustomer()
                            }}>
                            {
                                this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                    this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                        <Save className={classes.leftIcon} />
                            }
                            {
                                this.state.issuccess ? `Customer Saved` : `Save Customer`
                            }
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <Paper className={classes.paper}>
                            <Typography type="title" gutterBottom>
                                Customers
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
                                    id="contact"
                                    label="Contact no"
                                    value={this.state.contact}
                                    onChange={this.handleChange('contact')}
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

NewCustomer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewCustomer);
