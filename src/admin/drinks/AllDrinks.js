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
import {
    Link
} from 'react-router-dom'
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
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import { LinearProgress } from 'material-ui/Progress';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import { CircularProgress } from 'material-ui/Progress';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';
import Switch from 'material-ui/Switch';
import { clubssref, drinksref, Storageref } from '../../FB'

import swal from 'sweetalert';
import MenuItem from 'material-ui/Menu/MenuItem';
import stylesm from '../../App.css'
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
        color: '#999',
    },
    buttonSuccess: {
        backgroundColor: '#3ebd08',
        '&:hover': {
            backgroundColor: '#41bc08',
        }
    },
    menu: {
        width: 200,
    },
});

class AllDrinks extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            open: false,
            loadingData: false,
            drinksData: [],
            clubData: [],
            drinksName: '',
            whatsinit: '',
            drinksDesc: '',
            drinksImg: '',
            drinksImgName: '',
            drinksImgtype: '',
            drinksImgpreview: '',
            drinkPrice: '',
            checked: ['isFreeDrink'],
            isFree: true,
            selectedclubid: '',
            isSingle: false,
            isSingleID: '',
            isloading: false,
            issuccess: false,
            isPlaceChanged: false,
            uploadProgress: 0,
            issavingdrinks: false,
            isdrinksAdded: false
        }
    }

    componentDidMount(){
        var _ths = this;
        let theclubData = [];
        _ths.setState({
            loadingData: true
        })
        clubssref.on('value', function(snapshot) {

            snapshot.forEach(function(eventItem) {
                var childKey = eventItem.key;
                var childData = eventItem.val();
                childData['key'] = childKey;
                if (!childData.info){
                    theclubData.push(childData)
                }
            });
            _ths.setState({
                clubData: theclubData
            })
        }).bind(this);

        drinksref.on('value', function(snapshot) {
            let thedrinksData = [];
            snapshot.forEach(function(drinks) {
                var childKey = drinks.key;
                var childData = drinks.val();
                drinksref.child(childKey).on('value', function(chl) {
                    chl.forEach((clItem) => {
                        var tnchild = clItem.val();
                        tnchild['key'] = childKey;
                        tnchild['idkey'] = clItem.key;
                        thedrinksData.push(tnchild)
                    })
                })
            });
            _ths.setState({
                drinksData: thedrinksData,
                loadingData: false
            })
        }).bind(this);

    }

    saveDrinks(){
        var _ths = this;
        var theFileid = this.makeid();
        var filenamearr = this.state.drinksImgName.split('.');

        drinksref.child(`${this.state.selectedclubid}`).push({
            name : _ths.state.drinksName,
            whatsinit : _ths.state.whatsinit,
            description : _ths.state.drinksDesc,
            image : theFileid+'.'+filenamearr[1],
            isFreeDrinks : _ths.state.isFree,
            price : _ths.state.drinkPrice
        }).then((data) => {
            if (this.state.evtImg !== ''){
                var uploadTask = Storageref.child('club_image/'+theFileid+'.'+filenamearr[1]).put(this.state.drinksImg);

                uploadTask.on('state_changed', function(snapshot){
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    if (progress === 100){
                        _ths.setState({
                            isloading: false,
                            isdrinksAdded: true,
                        })
                        setTimeout(() => {
                            _ths.setState({
                                loadingData: false,
                                drinksName: '',
                                whatsinit: '',
                                drinksDesc: '',
                                drinksPrice: '',
                                drinksImg: '',
                                drinksImgName: '',
                                drinksImgtype: '',
                                drinksImgpreview: '',
                                selectedclubid: '',
                                drinkPrice: '',
                                isFree: false,
                                isSingle: false,
                                isSingleID: '',
                                isloading: false,
                                issuccess: false,
                                isPlaceChanged: false,
                                uploadProgress: 0,
                                issavingdrinks: false,
                                isdrinksAdded: false
                            })

                            _ths.handleRequestClose()
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

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                drinksImg: file,
                drinksImgName: file.name,
                drinksImgtype: file.type,
                drinksImgpreview: reader.result
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

    handleToggle = value => () => {
        var _ths = this;
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
            _ths.setState({
                isFree: false
            })
        } else {
            newChecked.splice(currentIndex, 1);
            _ths.setState({
                isFree: true
            })
        }

        this.setState({
            checked: newChecked,
        });
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleRequestClose = () => {
        this.setState({ open: false });
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
                        <Button onClick={() => {this.handleClickOpen()}} raised color="primary">Add Drinks</Button>
                        <Dialog
                            open={this.state.open}
                            transition={Transition}
                            keepMounted
                            onRequestClose={this.handleRequestClose}>
                            <DialogTitle>Add New Drinks</DialogTitle>
                            <DialogContent>
                                <Grid container>
                                    <Grid container>
                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth
                                            style={{
                                                marginTop: 15
                                            }}>
                                                <InputLabel htmlFor="clubName">Drinks Name</InputLabel>
                                                <Input
                                                    id="clubName"
                                                    margin="normal"
                                                    value={this.state.drinksName}
                                                    onChange={this.handleChange('drinksName')}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <TextField
                                                    id="selectedclubid"
                                                    select
                                                    label="Select Club"
                                                    value={this.state.selectedclubid}
                                                    onChange={this.handleChange('selectedclubid')}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            className: classes.menu,
                                                        },
                                                    }}
                                                    helperText="Please select club"
                                                    margin="normal"
                                                >
                                                    {
                                                        this.state.clubData.map((club, i) => {
                                                            return (
                                                                <MenuItem key={i} value={club.key}>{club.name}</MenuItem>
                                                            )
                                                        })
                                                    }

                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container>

                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <TextField
                                                    id="whatsinit"
                                                    label="What's in it"
                                                    multiline
                                                    rows="4"
                                                    value={this.state.whatsinit}
                                                    onChange={this.handleChange('whatsinit')}
                                                    margin="normal"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <TextField
                                                    id="drinksDesc"
                                                    label="Drinks Description"
                                                    multiline
                                                    rows="4"
                                                    value={this.state.drinksDesc}
                                                    onChange={this.handleChange('drinksDesc')}
                                                    margin="normal"
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} lg={6}>
                                            <InputLabel htmlFor="drinkPrice">Free Drink</InputLabel>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <Switch
                                                    onChange={this.handleToggle('isFreeDrink')}
                                                    checked={this.state.checked.indexOf('isFreeDrink') !== -1}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth
                                                 style={{
                                                     marginTop: 15
                                                 }}>
                                                <InputLabel htmlFor="drinkPrice">Drinks Price</InputLabel>
                                                <Input
                                                    id="drinkPrice"
                                                    margin="normal"
                                                    value={this.state.drinkPrice}
                                                    onChange={this.handleChange('drinkPrice')}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <InputLabel htmlFor="drinksImg">Event Images</InputLabel>
                                                <TextField
                                                    id="drinksImg"
                                                    onChange={(e)=>this._handleImageChange(e)}
                                                    margin="normal"
                                                    type="file"
                                                />
                                            </FormControl>
                                            <FormControl fullWidth>
                                                <Avatar style={{
                                                    borderRadius: 0,
                                                    width: 100,
                                                    height: 100
                                                }} src={this.state.drinksImgpreview}/>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleRequestClose} color="primary">
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    className={buttonClassname}
                                    disabled={this.state.issavingdrinks}
                                    onClick={() => {
                                        this.saveDrinks()
                                    }}>
                                    {
                                        this.state.issavingdrinks ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                            this.state.isdrinksAdded ? <CheckIcon  className={classes.leftIcon}/> :
                                                <Save className={classes.leftIcon} />
                                    }
                                    {
                                        this.state.isdrinksAdded ? 'Saving Drinks' : 'Save Drinks'
                                    }
                                </Button>
                            </DialogActions>
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
                                            (this.state.drinksData.length > 0) ?
                                                this.state.drinksData.map((value, i) => (
                                                    <div
                                                        key={i}>
                                                        <ListItem
                                                            dense
                                                            className={classes.listItem}>
                                                            <ListItemText primary={`${value.name}`} secondary={`Price: ${value.price}\n Free: ${value.isFreeDrinks ? 'Yes' : 'No'}`} />
                                                            <ListItemSecondaryAction>
                                                                <Tooltip id="tooltip-icon" title="Edit" placement="left">
                                                                    <Tooltip id="tooltip-icon" placement="left">
                                                                        <Link to={`/drinks/edit/${value.key}/${value.idkey}`} style={{color: '#757575'}} aria-label="Edit">
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
        );
    }

}

AllDrinks.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllDrinks);