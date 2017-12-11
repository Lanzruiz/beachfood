/**
 * Created by BOSS on 12/5/2017.
 */
import React, { Component } from 'react'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import { LinearProgress } from 'material-ui/Progress';
import List, {
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
} from 'material-ui/List';
import {
    Link
} from 'react-router-dom'

import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Slide from 'material-ui/transitions/Slide';
import KeyboardBackspace from 'material-ui-icons/KeyboardBackspace';
import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import { DatePicker } from 'material-ui-pickers';
import MenuItem from 'material-ui/Menu/MenuItem';
import swal from 'sweetalert';

import Save from 'material-ui-icons/Save';
import CheckIcon from 'material-ui-icons/Check';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';
import { subscriptionref, subsref } from '../../FB'

import stylesm from '../../App.css'

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

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AllSubscriptions extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
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
        subscriptionref.on('value', (snap) => {
            let subsdata = [];
            snap.forEach((subs) => {
                var childkey = subs.key;
                var childdata = subs.val();
                childdata['key'] = childkey;
                subsdata.push(childdata)
            })
            _ths.setState({
                subsData: subsdata,
                loadingData: false
            })
        })
    }

    saveSubscription(){

        var _ths = this;

        _ths.setState({
            isloading: true,
            issuccess: true
        })

        subsref.push({
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
                })
                _ths.handleModalClose()
            })
        })
    }

    handleModalOpen(){
        this.setState({ open: true });
    };

    handleModalClose() {
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

    askDeleteConfirm(key) {
        var _ths = this;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this event!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                _ths.setState({
                    loadingData: false
                })
                subsref.child(key).remove();
            }
        });
    };

    render() {
        const { classes } = this.props;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.isclubAdded,
        });
        return (
            <div className="App">
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        {/*<Button href={`/orders/23`} color="primary" className={classes.button}>*/}
                        {/*<Save className={props.classes.leftIcon} />*/}
                        {/*<span>Save</span>*/}
                        {/*</Button>*/}
                    </Grid>
                    <Grid item xs={6} className="pageToolbarRight">
                        <Button onClick={() => {this.handleModalOpen()}} raised color="primary">Add Subscription</Button>
                        <Dialog
                            fullScreen
                            open={this.state.open}
                            onRequestClose={() => {this.handleModalClose()}}
                            transition={Transition}
                        >
                            <AppBar className={classes.appBar}>
                                <Toolbar>
                                    <IconButton color="contrast" onClick={() => {this.handleModalClose()}} aria-label="Close">
                                        <KeyboardBackspace />
                                    </IconButton>
                                    <Typography type="title" color="inherit" className={classes.flex}>
                                        Add New Subscription
                                    </Typography>
                                    <Button
                                        color="contrast"
                                        className={buttonClassname}
                                        disabled={this.state.isloading}
                                        onClick={() => {
                                            this.saveSubscription()
                                        }}>
                                        {
                                            this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                                this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                                    <Save className={classes.leftIcon} />
                                        }
                                        {
                                            this.state.issuccess ? 'Subscription Saved' : 'Save Subscription'
                                        }
                                    </Button>
                                </Toolbar>
                            </AppBar>
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex'
                                }}>
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
                                                value={this.state.subsName}
                                                onChange={this.handleChange('freeDrinks')}
                                            />
                                        </FormControl>

                                    </Grid>
                                </Grid>
                            </div>
                        </Dialog>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <LinearProgress mode="determinate" value={this.state.uploadProgress} />
                            {
                                (this.state.loadingData) ?
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <CircularProgress className={classes.progress}/>
                                    </div>
                                    :
                                    <List>
                                        {
                                            (this.state.subsData.length > 0) ?
                                                this.state.subsData.map((value, i) => (
                                                    <div
                                                        key={i}>
                                                        <ListItem
                                                            dense
                                                            className={classes.listItem}>
                                                            <ListItemText primary={`Price: ${value.amount}`} secondary={`Type: ${value.type}\n Free Drinks: ${value.freeDrinks}`} />
                                                            <ListItemSecondaryAction>
                                                                <Tooltip id="tooltip-icon" title="Edit" placement="left">
                                                                    <Tooltip id="tooltip-icon" placement="left">
                                                                        <Link to={`/subscriptions/edit/${value.key}`} style={{color: '#757575'}} aria-label="Edit">
                                                                            <EditIcon />
                                                                        </Link>
                                                                    </Tooltip>
                                                                </Tooltip>
                                                                <Tooltip id="tooltip-icon" title="Delete" placement="left">
                                                                    <IconButton aria-label="Delete"
                                                                                onClick={() => {
                                                                                    this.askDeleteConfirm(value.key)
                                                                                }}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Tooltip>

                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                        <Divider inset />
                                                    </div>
                                                ))
                                                :
                                                <Typography type="headline" gutterBottom>There are no drinks found</Typography>
                                        }
                                    </List>
                            }
                        </Paper>
                    </Grid>

                </Grid>
            </div>
        )
    }
}

AllSubscriptions.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllSubscriptions);