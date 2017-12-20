/**
 * Created by BOSS on 11/16/2017.
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

                    setTimeout(() => {

                        if (childSnap.val() !== ''){
                            Storageref.child('events/'+childSnap.val()).getDownloadURL().then(function(url) {
                                _ths.setState({
                                    evtImgprev: url
                                })
                            }).catch((err) => {
                                _ths.setState({
                                    evtImgprev: ''
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
                    }, 2000)
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

    updateTheEvent(){
        var _ths = this;
        var theFileid = this.makeid();
        var filenamearr = this.state.evtImgName.split('.');

        var isError = false;
        if (this.state.name == "") {
           isError = true;
           swal ( "Oops" ,  "Please enter your event name!" ,  "error" );
           this.setState({
               isloading: false
           })
        }

        if(isError == false) {
          updateEvent({
              evid: this.props.match.params.evid,
              address : this.state.address,
              description : this.state.description,
              evstartdatetime : this.state.evstartdatetime,
              evenddatetime : this.state.evenddatetime,
              image : (this.state.ifImgChanged) ? theFileid+'.'+filenamearr[1] : this.state.evtImgName,
              lat : this.state.lat,
              lng : this.state.lng,
              name : this.state.name,
              state : this.state.state,
              zip : this.state.zip
          })

          if (this.state.ifImgChanged){
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
                              issuccess: false,
                          })
                      }, 3000)
                  }

                  console.log(snapshot.state);
              }, function(error) {
                  console.log('Filed');
              }, function() {
                  var downloadURL = uploadTask.snapshot.downloadURL;
                  console.log(uploadTask.snapshot);
              });
          } else {
            _ths.setState({
                isloading: false,
                issuccess: true,
            })
          }
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
                        <Button
                            className={buttonClassname}
                            disabled={this.state.isloading} raised dense color="primary"
                            onClick={() => {
                                this.updateTheEvent()
                            }}>
                            {
                                this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                    this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                        <Save className={classes.leftIcon} />
                            }
                            {
                                this.state.issuccess ? `Event Updated` : `Update Event`
                            }
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <Paper className={classes.paper}>
                            <Typography type="title" gutterBottom>
                                Event Details
                            </Typography>
                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <InputLabel htmlFor="name">Event Name</InputLabel>
                                <Input
                                    id="name"
                                    value={this.state.name}
                                    onChange={this.handleChange('name')}
                                />
                            </FormControl>
                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="description"
                                    label="Event Description"
                                    multiline
                                    rows="4"
                                    value={this.state.description}
                                    onChange={this.handleChange('description')}
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
                                        value={this.state.evstartdatetime}
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
                                        value={this.state.evenddatetime}
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

                            <FormControl fullWidth className={stylesm.theFromControl} style={{justifyContent: 'center', alignItems: 'center'}}>
                                {
                                    this.state.evtImgpreview &&
                                    <ImageLoader
                                        src={this.state.evtImgpreview}
                                        className={classes.avatar}
                                        placeholder="Loading">
                                        <CircularProgress className={classes.progress} />
                                    </ImageLoader>

                                }
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
                            <Typography type="title" gutterBottom style={{marginTop: 30}}>
                                Previous Image
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
                                            Image not found
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
