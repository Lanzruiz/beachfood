/**
 * Created by BOSS on 11/17/2017.
 */
import React from 'react'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, {
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import Slide from 'material-ui/transitions/Slide';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Save from 'material-ui-icons/Save';
import CheckIcon from 'material-ui-icons/Check';
import EditIcon from 'material-ui-icons/Edit';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import { LinearProgress } from 'material-ui/Progress';

import { CircularProgress } from 'material-ui/Progress';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';

import { clubssref, clubStoreref } from '../../FB'
import stylesm from '../../App.css'
import swal from 'sweetalert';
import { saveClub, updateClub } from '../../helpers/clubs'
var i2b = require("imageurl-base64");
function Transition(props) {
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
        color: '#FAFAFA',
    },
    buttonSuccess: {
        backgroundColor: '#3ebd08',
        '&:hover': {
            backgroundColor: '#41bc08',
        }
    },
});

class AllCity extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            open: false,
            loadingData: false,
            isSingle: false,
            isSingleID: '',
            clubData: [],
            clubName: '',
            address: '',
            clubDesc: '',
            clubimage: '',
            icon: '',
            phone: '',
            lat: '',
            lng: '',
            city: '',
            zip: '',
            clubstate: '',
            isloading: false,
            issuccess: false,
            isPlaceChanged: false,
            uploadProgress: 0
        }
    }

    componentDidMount(){
        var _ths = this;
        _ths.theGoolgePlaces()
        clubssref.on('value', function(snapshot) {
            let theclubData = [];
            _ths.setState({
                loadingData: true
            })
            snapshot.forEach(function(eventItem) {
                var childKey = eventItem.key;
                var childData = eventItem.val();
                childData['key'] = childKey;
                if (!childData.info){
                    theclubData.push(childData)
                }
            });
            _ths.setState({
                clubData: theclubData,
                loadingData: false
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

            if (place.photos){
                var pImg = place.photos[0].getUrl({
                    'maxWidth': 1600
                });
                _ths.setState({
                    address: place.formatted_address,
                    icon: place.icon,
                    clubimage: pImg ? pImg : '',
                    phone: place.international_phone_number,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    isPlaceChanged: true
                })
            }
            else {
                _ths.setState({
                    address: place.formatted_address,
                    icon: place.icon,
                    clubimage: pImg ? pImg : '',
                    phone: place.international_phone_number,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    isPlaceChanged: false
                })
            }


            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] === "postal_code") {
                        _ths.setState({
                            zip: place.address_components[i].long_name
                        })
                    }
                    if (place.address_components[i].types[j] === "administrative_area_level_1") {
                        _ths.setState({
                            city: place.address_components[i].long_name
                        })
                    }
                    if (place.address_components[i].types[j] === "administrative_area_level_2") {
                        _ths.setState({
                            clubstate: place.address_components[i].long_name
                        })
                    }

                }
            }
        })
    }

    savetheClub(){

        var _ths = this;
        if (this.state.clubName !== ''){
            _ths.setState({
                isloading: true,
            })

            var imageName = `${this.makeid()}.png`;

            //console.log(this.state.dimage);

            setTimeout(() => {
                saveClub({
                    address : this.state.address,
                    city : this.state.city,
                    description : this.state.clubDesc,
                    image : imageName,
                    lat : this.state.lat,
                    lng : this.state.lng,
                    name : this.state.clubName,
                    clubstate : this.state.clubstate,
                    clzip : this.state.zip
                }).then((club) => {

                    this.toDataURL(this.state.clubimage)
                    .then((response) => response)
                    .then((data) => {
                        var thencB64img = data.replace(/^data:image\/(png|jpg);base64,/, "")
                        var blob = _ths.b64toBlob(thencB64img, 'image/png');
                        let uploadTask = clubStoreref.child(imageName).put(blob);

                        uploadTask.on('state_changed', function(snapshot){
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            _ths.setState({
                                uploadProgress :progress
                            });
                            console.log(progress);
                            //console.log(snapshot.state);
                        }, function(error) {
                            console.log('Filed');
                        }, function() {
                            _ths.setState({
                                isSingle: false,
                                isSingleID: '',
                                clubName: '',
                                address: '',
                                clubDesc: '',
                                clubimage: '',
                                icon: '',
                                phone: '',
                                lat: '',
                                lng: '',
                                city: '',
                                zip: '',
                                clubstate: '',
                                isPlaceChanged: false,
                                isloading: false
                            })
                            setTimeout(() => {
                                _ths.setState({
                                    issuccess: false,
                                })
                            }, 2000)
                            //var downloadURL = uploadTask.snapshot.downloadURL;
                            //console.log(downloadURL);
                        });

                    })
                })

            }, 1000)
        }
    }

    toDataURL(url) {
        var _ths = this;

        return new Promise((resolve, reject) => {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                var dataURL;
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL("image/png");
                resolve(dataURL)
                reject('error')
                canvas = null;
            };
            img.src = url;
        })
    }

    b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    editClub(key){
        var _ths = this;

        _ths.setState({
            isSingleID: key,
            isSingle: true
        })

        var thref = clubssref.child(key);

        thref.on('value', (snap) => {
            snap.forEach((club) => {
                _ths.setState({ [club.key]: club.val() });
                if (club.key === 'name' ){
                    _ths.setState({
                        clubName: club.val()
                    });
                }
                if (club.key === 'description' ){
                    _ths.setState({
                        clubDesc: club.val()
                    });
                }
                if (club.key === 'image' ){
                    _ths.setState({
                        clubimage: club.val()
                    });
                }
                if (club.key === 'state' ){
                    _ths.setState({
                        clubstate: club.val()
                    });
                }

            })
        })
    }


    updatetheClub(){

        var _ths = this;
        if (this.state.clubName !== ''){
            _ths.setState({
                isloading: true,
            })

            var imageName = _ths.state.isPlaceChanged ? `${this.makeid()}.png` : _ths.state.clubimage;

            //console.log(this.state.dimage);

            updateClub({
                thkey: this.state.isSingleID,
                address : this.state.address,
                city : this.state.city,
                description : this.state.clubDesc,
                image : imageName,
                lat : this.state.lat,
                lng : this.state.lng,
                name : this.state.clubName,
                clubstate : this.state.clubstate,
                clzip : this.state.zip
            }).then((club) => {
                if (_ths.state.isPlaceChanged) {
                    _ths.toDataURL(this.state.clubimage)
                        .then((response) => response)
                        .then((data) => {
                            console.log('in');
                            var thencB64img = data.replace(/^data:image\/(png|jpg);base64,/, "")
                            var blob = _ths.b64toBlob(thencB64img, 'image/png');
                            let uploadTask = clubStoreref.child(imageName).put(blob);

                            uploadTask.on('state_changed', function(snapshot){
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                _ths.setState({
                                    uploadProgress :progress
                                });
                                console.log(progress);

                                //console.log(snapshot.state);
                            }, function(error) {
                                console.log('Filed');
                            }, function() {
                                _ths.setState({
                                    isSingle: false,
                                    isSingleID: '',
                                    clubName: '',
                                    address: '',
                                    clubDesc: '',
                                    clubimage: '',
                                    icon: '',
                                    phone: '',
                                    lat: '',
                                    lng: '',
                                    city: '',
                                    zip: '',
                                    clubstate: '',
                                    isPlaceChanged: false,
                                    isloading: false
                                })
                                setTimeout(() => {
                                    _ths.setState({
                                        issuccess: false,
                                    })
                                }, 2000)
                                //var downloadURL = uploadTask.snapshot.downloadURL;
                                //console.log(downloadURL);
                            });

                        })
                }
                else {
                    setTimeout(() => {
                        _ths.setState({
                            isSingle: false,
                            isSingleID: '',
                            clubName: '',
                            address: '',
                            clubDesc: '',
                            clubimage: '',
                            icon: '',
                            phone: '',
                            lat: '',
                            lng: '',
                            city: '',
                            zip: '',
                            clubstate: '',
                            isPlaceChanged: false,
                            isloading: false,
                            issuccess: false,
                        })
                    }, 2000)
                }


            })
        }
    }

    cancelEdit(){
        this.setState({
            isSingle: false,
            isSingleID: '',
            clubName: '',
            address: '',
            clubDesc: '',
            clubimage: '',
            icon: '',
            phone: '',
            lat: '',
            lng: '',
            city: '',
            zip: '',
            clubstate: '',
            isPlaceChanged: false,
            isloading: false,
            issuccess: false,
        })
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
                clubssref.child(key).remove();
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

    handlePlaces = prop => event =>{
        this.setState({ address: event.target.value });
    }

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    render() {
        const { classes } = this.props;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.issuccess,
        });

        return (
            <div className="App">
                <Grid container spacing={24}>

                    <Grid item xs={12} lg={8}>

                        <Grid container>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth className={stylesm.theFromControl}>
                                    <InputLabel htmlFor="clubName">Club Name</InputLabel>
                                    <Input
                                        id="clubName"
                                        value={this.state.clubName}
                                        onChange={this.handleChange('clubName')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth className={stylesm.theFromControl}>
                                    <InputLabel htmlFor="address">Place</InputLabel>
                                    <Input
                                        ref={(address) => { this.addr = address; }}
                                        id="address"
                                        value={this.state.address}
                                        onChange={this.handlePlaces('address')}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="clubDesc"
                                    label="Club Description"
                                    multiline
                                    rows="4"
                                    value={this.state.clubDesc}
                                    onChange={this.handleChange('clubDesc')}
                                    margin="normal"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    {
                        this.state.isSingle ?
                            <Grid item container xs={12} lg={4}>

                                <Grid item xs={12} lg={6}>
                                    <Button raised
                                            color="primary"
                                            disabled={this.state.isloading}
                                            onClick={() => {
                                                this.updatetheClub()
                                            }}>
                                        {
                                            this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                                this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                                    <Save className={classes.leftIcon} />
                                        }
                                        {
                                            this.state.issuccess ? 'Updated' : 'Update'
                                        }
                                    </Button>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Button raised
                                            color="primary"
                                            onClick={() => {
                                                this.cancelEdit()
                                            }}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid> :
                            <Grid item xs={12} lg={4}>
                                <Button raised
                                        color="primary"
                                        disabled={this.state.isloading}
                                        onClick={() => {
                                            this.savetheClub()
                                        }}>
                                    {
                                        this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                            this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                                <Save className={classes.leftIcon} />
                                    }
                                    {
                                        this.state.issuccess ? 'Club Added' : 'Add Club'
                                    }
                                </Button>
                            </Grid>

                    }


                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <LinearProgress mode="determinate" value={this.state.uploadProgress} />
                            {
                                (this.state.clubData.length > 0) ?
                                    <List>
                                        {
                                            (this.state.clubData) ?
                                                this.state.clubData.map((value, i) => (
                                                    <div
                                                        key={i}>
                                                        <ListItem
                                                            dense
                                                            className={classes.listItem}>
                                                            <ListItemText primary={`${value.name}`} secondary={`City: ${value.city}`} />
                                                            <ListItemSecondaryAction>
                                                                <Tooltip id="tooltip-icon" title="Edit" placement="left">
                                                                    <IconButton aria-label="Edit"
                                                                        onClick={() => {
                                                                            this.editClub(value.key)
                                                                        }}>
                                                                        <EditIcon />
                                                                    </IconButton>
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
                                                <Typography type="headline" gutterBottom>There are no club found</Typography>
                                        }
                                    </List> :
                                    <div  style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <CircularProgress className={classes.progress} />
                                    </div>
                            }
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }

}

AllCity.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllCity);