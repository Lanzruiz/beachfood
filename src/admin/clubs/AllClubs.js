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

import { CircularProgress } from 'material-ui/Progress';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';

import { clubssref } from '../../FB'
import stylesm from '../../App.css'
import swal from 'sweetalert';
import { saveClub, updateClub } from '../../helpers/clubs'

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

class AllClubs extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            open: false,
            loadingData: false,
            clubData: [],
            clubName: '',
            place: '',
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
            console.log(place);
            var pImg = place.photos[0].getUrl({
                'maxWidth': 1600
            });
            _ths.setState({
                place: place.formatted_address,
                icon: place.icon,
                clubimage: pImg,
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
            setTimeout(() => {
                saveClub({
                    address : this.state.place,
                    city : this.state.city,
                    description : this.state.clubDesc,
                    image : this.state.clubimage,
                    lat : this.state.lat,
                    lng : this.state.lng,
                    name : this.state.clubName,
                    clubstate : this.state.clubstate,
                    clzip : this.state.zip
                }).then((club) => {
                    _ths.setState({
                        address : '',
                        city : '',
                        description : '',
                        image : '',
                        lat : '',
                        lng : '',
                        name : '',
                        clubstate : '',
                        clzip : '',
                        isloading: false,
                        issuccess: true,
                    })
                })
                setTimeout(() => {
                    _ths.setState({
                        issuccess: false,
                    })
                }, 1000)
            }, 1000)
        }
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

    handlePlaces = prop => event =>{
        this.setState({ place: event.target.value });
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
                                        ref={(place) => { this.addr = place; }}
                                        id="address"
                                        value={this.state.place}
                                        onChange={this.handlePlaces('place')}
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

                    <Grid item xs={12} lg={4}>
                        <Button raised
                                color="primary"
                                className={buttonClassname}
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

                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
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
                                                            <ListItemText primary={`${value.address}`} secondary={`City: ${value.city}`} />
                                                            <ListItemSecondaryAction>
                                                                <Tooltip id="tooltip-icon" title="Edit" placement="left">
                                                                    <IconButton aria-label="Edit"
                                                                        onClick={() => {
                                                                            this.updateclub(value.key)
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

AllClubs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllClubs);