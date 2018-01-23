/**
 * Created by BOSS on 12/6/2017.
 */
import React, { Component } from 'react'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import {
    Link
} from 'react-router-dom'

import KeyboardBackspace from 'material-ui-icons/KeyboardBackspace';
import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import { DatePicker } from 'material-ui-pickers';
import MenuItem from 'material-ui/Menu/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import Slide from 'material-ui/transitions/Slide';
import Save from 'material-ui-icons/Save';
import CheckIcon from 'material-ui-icons/Check';
import Button from 'material-ui/Button';
import { subscriptionref, subsref } from '../../FB'

import stylesm from '../../App.css'

function TransitionUp(props) {
    return <Slide direction="up" {...props} />;
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 30,
    },
    button: {
        margin: theme.spacing.unit,
        float: 'right'
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    buttonProgress: {
        color: '#999',
    },
    buttonSuccess: {
        backgroundColor: '#3ebd08',
        '&:hover': {
            backgroundColor: '#41bc08',
        }
    }
});

class AllSubscriptions extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
            transition: null,
            loadingData: false,
            subsData: [],
            amount: '',
            type: '',
            date_start: new Date(),
            date_end: new Date(),
            freeDrinks: '',
            isloading: false,
            issuccess: false,
            uploadProgress: 0
        }

    }

    componentDidMount(){
        var _ths = this;
        _ths.setState({
            loadingData: true
        })
    
        var thId = this.props.match.params.subsId;
        
        //console.log(this.props.match.params.subsId);
        
        subscriptionref.child(thId).on('value', (snap) => {
            snap.forEach((subs) => {
                var childkey = subs.key;
                var childdata = subs.val();
                this.setState({ [childkey]: childdata });
                
                if (childkey === 'date_start') {
                    this.setState({ [childkey]: childdata.toLocaleString() });
                }
                
                if (childkey === 'date_end') {
                    this.setState({ [childkey]: childdata.toLocaleString() });
                }
                
            })
            _ths.setState({
                loadingData: false
            })
        })
    }

    updateSubscription(){

        var _ths = this;

        _ths.setState({
            isloading: true,
            issuccess: true
        })
    
    
        var thId = this.props.match.params.subsId;
        
        subsref.child(thId).set({
            amount : _ths.state.amount,
            date_start : _ths.state.date_start.toLocaleString(),
            date_end : _ths.state.date_end.toLocaleString(),
            freeDrinks : _ths.state.freeDrinks,
            type : _ths.state.type,
        }).then((da) => {
            setTimeout(() => {
                _ths.setState({
                    isloading: false,
                    issuccess: false,
                    open: true,
                })
                
            }, 2000)
        })
    }
    
    handleRequestClose = () => {
        this.setState({ open: false });
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handlestartDateTimeChange = dateTime => {
        this.setState({ date_start: dateTime })
    }

    handleendDateTimeChange = dateTime => {
        this.setState({ date_end: dateTime })
    }

    render() {
        const { classes } = this.props;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.isclubAdded,
        });
        return (
            <div className="App">
                
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <Link to={`/subscriptions`} className='linkBtn primary'>
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
                                    this.updateSubscription()
                                }}>
                            {
                                this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                        this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                                <Save className={classes.leftIcon} />
                            }
                            {
                                this.state.issuccess ? `Plan Updated` : `Update Plan`
                            }
                        </Button>
                    </Grid>
                    {
                        (this.state.loadingData) ?
                            <div style={{
                                width: '100%',
                                minHeight: 300,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <CircularProgress className={classes.progress}/>
                            </div>
                            :
                            <Grid container style={{width: '100%', margin: 0}}>
                                <Grid item xs={12} lg={7}>
            
                                    <FormControl fullWidth className={stylesm.theFromControl}>
                                        <InputLabel htmlFor="amount">Ammount</InputLabel>
                                        <Input
                                                id="amount"
                                                value={this.state.amount}
                                                onChange={this.handleChange('amount')}
                                        />
                                    </FormControl>
                                    <div
                                            style={{
                                                marginTop: 20,
                                                marginBottom: 20,
                                            }}>
                                        <InputLabel htmlFor="start_date">Start Date</InputLabel>
                                        <FormControl fullWidth className={stylesm.theFromControl}>
                                            <DatePicker
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    value={this.state.date_start}
                                                    returnMoment={false}
                                                    format="MM-DD-YY"
                                                    onChange={(dateTime) => {
                                                        this.handlestartDateTimeChange(dateTime)
                                                    }}
                                            />
                                        </FormControl>
                                    </div>
                                    <div
                                            style={{
                                                marginTop: 20,
                                                marginBottom: 20,
                                            }}>
                                        <InputLabel htmlFor="end_date">End Date</InputLabel>
                                        <FormControl fullWidth className={stylesm.theFromControl}>
                                            <DatePicker
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    value={this.state.date_end}
                                                    returnMoment={false}
                                                    format="MM-DD-YY"
                                                    onChange={(dateTime) => {
                                                        this.handleendDateTimeChange(dateTime)
                                                    }}
                                            />
                                        </FormControl>
                                    </div>
        
                                </Grid>
                                <Grid item xs={12} lg={5}>
                                    <FormControl fullWidth className={stylesm.theFromControl}>
                                        <TextField
                                                id="selectType"
                                                select
                                                label="Select Type"
                                                className={classes.textField}
                                                value={this.state.type}
                                                onChange={this.handleChange('type')}
                                                SelectProps={{
                                                    MenuProps: {
                                                        className: classes.menu,
                                                    },
                                                }}
                                                helperText="Please select subscription type"
                                                margin="normal"
                                        >
                                            <MenuItem key='free' value='free'>
                                                Free
                                            </MenuItem>
                                            <MenuItem key='weekly' value='weekly'>
                                                Weekly
                                            </MenuItem>
                                            <MenuItem key='monthly' value='monthly'>
                                                Monthly
                                            </MenuItem>
                                            <MenuItem key='yearly' value='yearly'>
                                                Yearly
                                            </MenuItem>
                
                                        </TextField>
                                    </FormControl>
                                    <FormControl fullWidth className={stylesm.theFromControl}>
                                        <InputLabel htmlFor="freeDrinks">Free Drinks</InputLabel>
                                        <Input
                                                id="freeDrinks"
                                                value={this.state.freeDrinks}
                                                onChange={this.handleChange('freeDrinks')}
                                        />
                                    </FormControl>
        
                                </Grid>
                            </Grid>
                    }
                </Grid>
    
                <Snackbar
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
                    transition={TransitionUp}
                    autoHideDuration={3000}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Plan successfully updated..</span>}
                />
                
            </div>
        )
    }
}

AllSubscriptions.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllSubscriptions);