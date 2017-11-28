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
import MenuItem from 'material-ui/Menu/MenuItem';


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
            isSingle: false,
            isSingleID: '',
            isloading: false,
            issuccess: false,
            isPlaceChanged: false,
            uploadProgress: 0
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

    makeid = () => {
        var text = "";
        var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 12; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
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
                                    <InputLabel htmlFor="clubName">Drinks Name</InputLabel>
                                    <Input
                                        id="clubName"
                                        value={this.state.drinksName}
                                        onChange={this.handleChange('drinksName')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth className={stylesm.theFromControl}>
                                    <TextField
                                        id="clubid"
                                        select
                                        label="Select"
                                        className={classes.textField}
                                        value={this.state.clubid}
                                        onChange={this.handleChange('clubid')}
                                        SelectProps={{
                                            MenuProps: {
                                                className: classes.menu,
                                            },
                                        }}
                                        helperText="Please select club"
                                        margin="normal"
                                    >
                                        <MenuItem key={1} value="Test">
                                            Drinks
                                        </MenuItem>
                                    </TextField>
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
                                        this.state.issuccess ? 'Drinks Added' : 'Add Drink'
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
                                            (this.state.drinksData) ?
                                                this.state.drinksData.map((value, i) => (
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
                                                <Typography type="headline" gutterBottom>There are no drinks found</Typography>
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

AllDrinks.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllDrinks);