/**
 * Created by BOSS on 11/11/2017.
 */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Slide from 'material-ui/transitions/Slide';
import KeyboardBackspace from 'material-ui-icons/KeyboardBackspace';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Save from 'material-ui-icons/Save';
import CheckIcon from 'material-ui-icons/Check';
import swal from 'sweetalert';
import { DateTimePicker } from 'material-ui-pickers'
import Card, { CardHeader, CardContent } from 'material-ui/Card';

import Avatar from 'material-ui/Avatar';
import { CircularProgress } from 'material-ui/Progress';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';

import {
    Link
} from 'react-router-dom'

import { eventsref, Storageref, eventsStoreref } from '../../FB'
import { saveEvent } from '../../helpers/events'
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
    bigAvatar: {
        width: 60,
        height: 60,
    },
    button: {
        margin: theme.spacing.unit,
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
        color: '#FAFAFA',
    },
    buttonSuccess: {
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: 'transparent',
        },
        float: 'right'
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}


class AllEvents extends React.Component {
    state = {
        open: false,
        evtData: [],
        loadingData: false,
        evtName: '',
        evtDesc: '',
        evtImg: '',
        evtImgName: '',
        evtImgtype: '',
        address: '',
        icon: '',
        phone: '',
        lat: 0,
        lng: 0,
        state: '',
        zip: 0,
        evtImgpreview: '',
        startDateTime: new Date(),
        endDateTime: new Date(),
        isloading: false,
        issuccess: false,
        isSingle: false,
        singleData: []
    };


    componentDidMount(){
        var _ths = this;

        eventsref.on('value', function(snapshot) {
            let theEventData = [];

            snapshot.forEach(function(eventItem) {
                var childKey = eventItem.key;
                var childData = eventItem.val();
                childData['key'] = childKey;
                theEventData.push(childData)
            });
            _ths.setState({
                evtData: theEventData
            })
        }).bind(this);
    }

    theGoolgePlaces(){
        var _ths = this;
        var element = document.querySelector('#address');
        //var mapcontent = document.querySelector('#map');

        var autocomplete = new window.google.maps.places.Autocomplete(element);
        return autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            _ths.setState({
                address: place.formatted_address,
                icon: place.icon,
                phone: place.international_phone_number,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            })

            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] === "postal_code") {
                        _ths.setState({
                            zip: place.address_components[i].long_name
                        })
                    }
                    if (place.address_components[i].types[j] === "administrative_area_level_1") {
                        _ths.setState({
                            state: place.address_components[i].long_name
                        })
                    }

                }
            }
        })
    }

    saveEvent(){

        var _ths = this;
        var theFileid = this.makeid();
        var filenamearr = this.state.evtImgName.split('.');

        this.setState({
            isloading: true,
            issuccess: false,
        })
        saveEvent({
            address : this.state.address,
            description : this.state.evtDesc,
            evstartdatetime : this.state.startDateTime.toLocaleString(),
            evenddatetime : this.state.endDateTime.toLocaleString(),
            image : theFileid+'.'+filenamearr[1],
            lat : this.state.lat,
            lng : this.state.lng,
            name : this.state.evtName,
            state : this.state.state,
            zip : this.state.zip
        }).then((data) => {
            if (this.state.evtImg !== ''){
                var uploadTask = Storageref.child('events/'+theFileid+'.'+filenamearr[1]).put(this.state.evtImg);

                uploadTask.on('state_changed', function(snapshot){
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    if (progress === 100){
                        _ths.setState({
                            isloading: false,
                            issuccess: true,
                        })
                        setTimeout(() => {
                            _ths.setState({
                                loadingData: false,
                                evtName: '',
                                evtDesc: '',
                                evtImg: '',
                                evtImgName: '',
                                evtImgtype: '',
                                address: '',
                                icon: '',
                                phone: '',
                                lat: 0,
                                lng: 0,
                                state: '',
                                zip: 0,
                                startDateTime: new Date(),
                                endDateTime: new Date(),
                                evtImgpreview: '',
                                issuccess: false,
                            })
                            document.querySelector('#evtImg').value = '';
                            _ths.addr.value = "";
                            _ths.handleModalClose()
                        }, 3000)
                    }

                    console.log(snapshot.state);
                }, function(error) {
                    console.log('Filed');
                }, function() {
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    console.log(downloadURL);
                });
            }
        })
    }

    handleModalOpen(){
        this.setState({ open: true });
        setTimeout(() => {
            this.theGoolgePlaces()
        }, 2000)
    };

    handleSingleModalOpen(evid){
        var _ths = this;
        eventsref.child(`${evid}/`).on('value', (snap) => {
            snap.forEach(function (childSnap) {
                _ths.setState({ [childSnap.key]: childSnap.val() });
                if (childSnap.key === 'image'){

                    setTimeout(() => {

                        if (childSnap.val() !== ''){
                            Storageref.child('events/'+childSnap.val()).getDownloadURL().then(function(url) {
                                _ths.setState({
                                    evtImgprev: url
                                })
                            })
                            eventsStoreref.child(`${_ths.state.image}`).getMetadata().then(function(metadata) {
                                _ths.setState({
                                    evtImg: metadata.name,
                                    evtImgName: metadata.name
                                })
                            })
                        }
                    }, 2000)
                }
            });
        });

        setTimeout(() => {
            this.theGoolgePlaces()
        }, 2000)
        this.setState({
            open: true,
            isSingle: true
        });
    };

    handleModalClose() {
        this.setState({ open: false });
    };
    handlePlaces = prop => event =>{
        this.setState({ address: event.target.value });
    }

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handlestartDateTimeChange = dateTime => {
        this.setState({ startDateTime: dateTime })
    }

    handleendDateTimeChange = dateTime => {
        this.setState({ endDateTime: dateTime })
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                evtImg: file,
                evtImgName: file.name,
                evtImgtype: file.type,
                evtImgpreview: reader.result
            });
        }

        reader.readAsDataURL(file)
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
                eventsref.child(key).remove();
            }
        });
    };

    makeid = () => {
        var text = "";
        var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 12; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    render() {

        const { classes } = this.props;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.issuccess,
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
                        <Button onClick={() => {this.handleModalOpen()}} raised color="primary">Add Event</Button>
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
                                        Add New Event
                                    </Typography>
                                    <Button
                                        color="contrast"
                                        className={buttonClassname}
                                        disabled={this.state.isloading}
                                        onClick={() => {
                                            this.saveEvent()
                                        }}>
                                        {
                                            this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                                this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                                    <Save className={classes.leftIcon} />
                                        }
                                        {
                                            this.state.issuccess ? 'Event Saved' : 'Save Event'
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
                                            <InputLabel htmlFor="evtName">Event Name</InputLabel>
                                            <Input
                                                id="evtName"
                                                value={this.state.evtName}
                                                onChange={this.handleChange('evtName')}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth className={stylesm.theFromControl}>
                                            <TextField
                                                id="evtDesc"
                                                label="Event Description"
                                                multiline
                                                rows="4"
                                                value={this.state.evtDesc}
                                                onChange={this.handleChange('evtDesc')}
                                                margin="normal"
                                            />
                                        </FormControl>
                                        <div
                                            style={{
                                                marginTop: 20,
                                                marginBottom: 20,
                                            }}>
                                            <InputLabel htmlFor="evtDate">Event Start</InputLabel>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <DateTimePicker
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    value={this.state.startDateTime}
                                                    returnMoment={false}
                                                    format="MMMM Do YYYY, h:mm:ss a"
                                                    onChange={this.handlestartDateTimeChange}
                                                />
                                            </FormControl>
                                        </div>
                                        <div
                                            style={{
                                                marginTop: 20,
                                                marginBottom: 20,
                                            }}>
                                            <InputLabel htmlFor="evtDate">Event End</InputLabel>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <DateTimePicker
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    value={this.state.endDateTime}
                                                    returnMoment={false}
                                                    format="MMMM Do YYYY, h:mm:ss a"
                                                    onChange={this.handleendDateTimeChange}
                                                />
                                            </FormControl>
                                        </div>

                                        <FormControl fullWidth className={stylesm.theFromControl}>
                                            <InputLabel htmlFor="evtImg">Event Images</InputLabel>
                                            <TextField
                                                id="evtImg"
                                                onChange={(e)=>this._handleImageChange(e)}
                                                margin="normal"
                                                type="file"
                                            />
                                        </FormControl>

                                        <FormControl fullWidth className={stylesm.theFromControl}>
                                            <Avatar src={this.state.evtImgpreview} className={classes.avatar} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} lg={5}>
                                        <Typography type="title" gutterBottom>
                                            Venue
                                        </Typography>
                                        <FormControl fullWidth className={stylesm.theFromControl}>
                                            <InputLabel htmlFor="evtVenue">Search for place</InputLabel>
                                            <Input
                                                ref={(address) => { this.addr = address; }}
                                                id="address"
                                                value={this.state.address}
                                                onChange={this.handlePlaces('address')}
                                            />
                                        </FormControl>

                                        <FormControl fullWidth className={stylesm.theFromControl} style={{marginTop: 50}}>
                                            <Card className={classes.card}>
                                                <CardHeader
                                                    avatar={
                                                        <Avatar aria-label="Recipe" src={this.state.icon}/>
                                                    }
                                                    title={this.state.address}
                                                />
                                                <CardContent>
                                                    <Typography>{
                                                        this.state.phone ?
                                                            `Phone: ${this.state.phone}` : ''
                                                    }
                                                    </Typography>
                                                    <Typography>{
                                                        this.state.zip ?
                                                            `Zip: ${this.state.zip}` : ''
                                                    }
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </div>
                        </Dialog>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>

                            {
                                (this.state.loadingData) ?
                                    <div  style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <CircularProgress className={classes.progress} />
                                    </div> :
                                    <List>
                                        {
                                            this.state.evtData.map((value, i) => (
                                                <div
                                                    key={i}>
                                                    <ListItem
                                                        dense
                                                        className={classes.listItem}>
                                                        <ListItemText primary={`${value.name}`} />
                                                        <ListItemSecondaryAction>
                                                            <Tooltip id="tooltip-icon" title="Edit" placement="left">
                                                                <Link to={`/events/edit/${value.key}`} style={{color: '#757575'}} aria-label="Edit">
                                                                    <EditIcon />
                                                                </Link>
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
                                        }
                                    </List>
                            }
                        </Paper>

                    </Grid>
                </Grid>

            </div>
        );
    }
}

AllEvents.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllEvents);