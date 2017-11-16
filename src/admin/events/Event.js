import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
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

import { Storageref } from '../../FB'
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


class Event extends React.Component {

    constructor(props){
        super(props)
        this.state = {
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
        }
    }

    componentDidMount(){
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

            // var map = new window.google.maps.Map(mapcontent, {
            //     center: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
            //     zoom: 25
            // });
            //
            // var marker = new window.google.maps.Marker({
            //     map: map,
            //     anchorPoint: new window.google.maps.Point(0, -29)
            // });
            //
            // var trafficLayer = new window.google.maps.TrafficLayer();
            // trafficLayer.setMap(map);
            //
            // if (place.geometry.viewport) {
            //     map.fitBounds(place.geometry.viewport);
            // } else {
            //     map.setCenter(place.geometry.location);
            //     map.setZoom(25);  // Why 17? Because it looks good.
            // }
            // marker.setPosition(place.geometry.location);
            // marker.setVisible(true);

        });
    }

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
        })

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
    }

    makeid = () => {
        var text = "";
        var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 12; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    render() {
        const { classes } = this.props;
        const isupdateBTN = (this.props.match.params.evid) ? 'Update' : 'Save';
        const isupdated = (this.props.match.params.evid) ? 'Update' : 'Save';
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.issuccess,
        });
        return (
            <div className="App">
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <Link to={`/events`} className='linkBtn primary'>
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
                                this.saveEvent()
                            }}>
                            {
                                this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                    this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                        <Save className={classes.leftIcon} />
                            }
                            {
                                this.state.issuccess ? `Event Saved` : `Save Event`
                            }
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <Paper className={classes.paper}>
                            <Typography type="title" gutterBottom>
                                Event Details
                            </Typography>
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

                        </Paper>
                    </Grid>
                    <Grid item xs={5}>
                        <Paper className={classes.paper}>
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
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

Event.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Event);
