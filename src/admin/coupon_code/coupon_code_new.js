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

import { DatePicker } from 'material-ui-pickers'

import { couponCodeRef, firebaseAuth } from '../../FB'
import { saveEvent } from '../../helpers/events'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import IconButton from 'material-ui/IconButton';
import swal from 'sweetalert';
import Background from '../images/login.jpg';
import {reactLocalStorage} from 'reactjs-localstorage';
import stylesm from '../../App.css'
import * as moment  from 'moment';


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


class NewCouponCode extends React.Component {

    constructor(props){
        super(props)

        const currentDate = new Date();

        currentDate.setFullYear(currentDate.getFullYear() - 1);

        this.state = {
            name: '',
            code: '',
            discount_in_dollar: '',
            discount_in_percentage: '',
            activation_date: currentDate,
            expiration_date: currentDate,
            isloading: false,
            issuccess: false,
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




    saveCouponCode(){

        var _ths = this;

        this.setState({
            isloading: true,
            issuccess: false,
        })




        var errorFields= false;
        if(this.state.name == "") {
          errorFields = true;
          swal ( "Oops" ,  "Please enter your coupon code name" ,  "error" );
          this.setState({
              isloading: false
          })
        }

        if(this.state.code == "") {
          errorFields = true;
          swal ( "Oops" ,  "Please enter your coupon code" ,  "error" );
          this.setState({
              isloading: false
          })
        }

        if(this.state.expiration_date == "")  {
          errorFields = true;
          swal ( "Oops" ,  "Please enter your expiration date" ,  "error" );
          this.setState({
              isloading: false
          })
        }

        if(this.state.activation_date == "") {
          errorFields = true;
          swal ( "Oops" ,  "Please enter your activation date" ,  "error" );
          this.setState({
              isloading: false
          })
        }

        if(this.state.discount_in_dollar == "" && this.state.discount_in_percentage == "") {
          errorFields = true;
          swal ( "Oops" ,  "Please enter your discount amount or percentage" ,  "error" );
          this.setState({
              isloading: false
          })
        }




        //check if email address is valid
        if(errorFields == false) {

          const activationDate = moment(_ths.state.activation_date).format('YYYY-MM-DD');
          const expirationDate = moment(_ths.state.expiration_date).format('YYYY-MM-DD');

          console.log(activationDate);
          console.log(expirationDate);

          var value = {
              name: _ths.state.name,
              code: _ths.state.code,
              discount_in_dollar: _ths.state.discount_in_dollar,
              discount_in_percentage: _ths.state.discount_in_percentage,
              activation_date: activationDate,
              expiration_date: expirationDate
          }

          couponCodeRef.push(value);


          _ths.setState({
              name: '',
              code: '',
              discount_in_dollar: '',
              discount_in_percentage: '',
              activation_date: new Date(),
              expiration_date: new Date(),
              isloading: false,
              issuccess: true,
              showPassword: false,
              emailError: false,
              errorFields: false
          });



        }





    }


    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleDateChange = (date) => {
        this.setState({ activation_date: date });
    }

    handleDateChangeExpiration = (date) => {
        this.setState({ expiration_date: date });
    }

    render() {
        const { classes } = this.props;
        const isupdateBTN = (this.props.match.params.evid) ? 'Update' : 'Save';
        const isupdated = (this.props.match.params.evid) ? 'Update' : 'Save';
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.issuccess,
        });

        if(this.state.issuccess == true) {
          swal ( "Success" ,  "Coupon Code successfully saved!" ,  "success" );
            var _ths = this;
            _ths.setState({
                issuccess: false
            })
        }

        return (
            <div className="App">
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <Link to={`/coupon_code`} className='linkBtn primary'>
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
                                this.saveCouponCode()
                            }}>
                            {
                                this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                    this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                        <Save className={classes.leftIcon} />
                            }
                            {
                                this.state.issuccess ? `Coupon Code Saved` : `Save Coupon Code`
                            }
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <Paper className={classes.paper}>
                            <Typography type="title" gutterBottom>
                                Coupon Code
                            </Typography>

                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="name"
                                    label="Name"
                                    value={this.state.name}
                                    onChange={this.handleChange('name')}
                                    margin="normal"
                                />
                            </FormControl>

                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="code"
                                    label="Code"
                                    value={this.state.code}
                                    onChange={this.handleChange('code')}
                                    margin="normal"
                                />
                            </FormControl>

                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="discount_in_dollar"
                                    label="Discount ($)"
                                    value={this.state.discount_in_dollar}
                                    onChange={this.handleChange('discount_in_dollar')}
                                    margin="normal"
                                />
                            </FormControl>

                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="discount_in_percentage"
                                    label="Discount (%)"
                                    value={this.state.discount_in_percentage}
                                    onChange={this.handleChange('discount_in_percentage')}
                                    margin="normal"
                                />
                            </FormControl>

                            <FormControl fullWidth className={stylesm.theFromControl}>

                            <DatePicker
                                keyboard
                                clearable
                                margin="normal"
                                label="Choose activation date"
                                maxDateMessage="Date must be greater than today"
                                value={this.state.activation_date}
                                onChange={this.handleDateChange}
                                animateYearScrolling={false}
                                returnMoment={false}
                                format="YYYY-MM-DD"
                              />

                            </FormControl>

                            <FormControl fullWidth className={stylesm.theFromControl}>

                            <DatePicker
                                keyboard
                                clearable
                                margin="normal"
                                label="Choose expiration date"
                                maxDateMessage="Date must be greater than today"
                                value={this.state.expiration_date}
                                onChange={this.handleDateChangeExpiration}
                                animateYearScrolling={false}
                                returnMoment={false}
                                format="YYYY-MM-DD"
                              />

                            </FormControl>






                        </Paper>
                    </Grid>

                </Grid>
            </div>
        );
    }
}

NewCouponCode.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewCouponCode);
