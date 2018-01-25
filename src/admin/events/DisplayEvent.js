/**
 * Created by Thomas Woodfin on 11/16/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import swal from 'sweetalert';
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

import { eventsStoreref, Storageref, eventsref } from '../../FB'
import { updateEvent } from '../../helpers/events'

import ImageLoader from '../ImageLoader'


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

var moment = require('moment');
class UpdateEvent extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            name: '',
            description: '',
            evstartdatetime : new Date(),
            evenddatetime : new Date(),
            evtImg: '',
            evtImgName: '',
            evtImgtype: '',
            evtImgpreview: '',
            evtImgprev: '',
            ifImgChanged: false,
            image: '',
            address: '',
            icon: '',
            phone: '',
            lat: 0,
            lng: 0,
            state: '',
            zip: 0,
            checkImage: ''
        }
    }

    componentDidMount(){
        var _ths = this;
        var element = document.querySelector('#address');

        eventsref.child(`${this.props.match.params.evid}/`).on('value', (snap) => {
            snap.forEach(function (childSnap) {
                _ths.setState({ [childSnap.key]: childSnap.val() });

                if (childSnap.key === 'evstartdatetime'){
                    _ths.setState({
                        evstartdatetime: childSnap.val().toLocaleString()
                    })
                }

                if (childSnap.key === 'evenddatetime'){
                    _ths.setState({
                        evenddatetime: childSnap.val().toLocaleString()
                    })
                }

                if (childSnap.key === 'image'){

                    //setTimeout(() => {

                        if (childSnap.val() !== ''){
                            //_ths.setState({checkImage: "Image Loading..."})
                            Storageref.child('events/'+childSnap.val()).getDownloadURL().then(function(url) {
                                _ths.setState({
                                    evtImgprev: url,
                                    checkImage: ''
                                })
                            }).catch((err) => {
                                _ths.setState({
                                    evtImgprev: '',
                                    checkImage: 'Image not found.'
                                })
                            })
                            eventsStoreref.child(`${_ths.state.image}`).getMetadata().then(function(metadata) {
                                _ths.setState({
                                    evtImg: metadata.name,
                                    evtImgName: metadata.name
                                })
                            }).catch((err) => {
                                _ths.setState({
                                    evtImg: '',
                                    evtImgName: ''
                                })
                            })
                        }
                    //}, 500)
                }

            });
        });

        var autocomplete = new window.google.maps.places.Autocomplete(element);
        autocomplete.addListener('place_changed', function() {
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
        });

    }

    handlePlaces = prop => event =>{
        this.setState({ address: event.target.value });
    }

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handlestartDateTimeChange = dateTime => {
        this.setState({ evstartdatetime: dateTime })
    }

    handleendDateTimeChange = dateTime => {
        this.setState({ evenddatetime: dateTime })
    }

    _handleImageChange(e) {
        e.preventDefault();
        var _ths = this;
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            _ths.setState({
                evtImg: file,
                evtImgName: file.name,
                evtImgtype: file.type,
                evtImgpreview: reader.result,
                ifImgChanged: true,
            });
        }

        reader.readAsDataURL(file)
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
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.issuccess,
        });

        if(this.state.issuccess == true) {
          swal ( "Success" ,  "Club Owner successfully saved!" ,  "success" );
            var _ths = this;
            _ths.setState({
                issuccess: false
            })
        }

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

                    </Grid>
                    <Grid item xs={7}>
                        <Paper className={classes.paper}>
                            <Typography type="title" gutterBottom>
                                Event Details
                            </Typography>
                            <FormControl fullWidth className={stylesm.theFromControl}>

                                <p>Event Name</p>
                                <p style={{color: '#000'}}>{this.state.name}</p>

                            </FormControl>
                            <FormControl fullWidth className={stylesm.theFromControl}>

                            <p>Event Description</p>
                            <p style={{color: '#000'}}>{this.state.description}</p>


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
                                        readOnly
                                        value={this.state.evstartdatetime}
                                        returnMoment={false}
                                        format="MMMM Do YYYY, h:mm:ss a"
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
                                        readOnly
                                        value={this.state.evenddatetime}
                                        returnMoment={false}
                                        format="MMMM Do YYYY, h:mm:ss a"
                                    />
                                </FormControl>
                            </div>




                        </Paper>
                    </Grid>
                    <Grid item xs={5}>
                        <Paper className={classes.paper}>
                            <Typography type="title" gutterBottom>
                                Venue
                            </Typography>
                            <FormControl fullWidth className={stylesm.theFromControl}>


                                <div>{this.state.address}</div>


                            </FormControl>


                            <Typography type="title" gutterBottom style={{marginTop: 30}}>
                               Image
                            </Typography>
                            <FormControl fullWidth className={stylesm.theFromControl} style={{justifyContent: 'center', alignItems: 'center'}}>
                                {
                                    (this.state.evtImgprev && this.state.evtImgprev !== '') ?
                                    <ImageLoader
                                        src={this.state.evtImgprev}
                                        className={classes.avatar}
                                        placeholder="Loading">
                                        <CircularProgress className={classes.progress} />
                                    </ImageLoader> :
                                        <Typography>
                                            {this.state.checkImage}
                                        </Typography>

                                }
                            </FormControl>

                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

UpdateEvent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpdateEvent);
