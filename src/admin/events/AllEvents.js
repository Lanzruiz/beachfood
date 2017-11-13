/**
 * Created by BOSS on 11/11/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import swal from 'sweetalert';

import { eventsref, eventsStoreref } from '../../FB'

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
        margin: 10,
    },
    bigAvatar: {
        width: 60,
        height: 60,
    },
});

class AllEvents extends React.Component {
    state = {
        evtData: [],
        currentEvent: null
    };


    componentDidMount(){
        this.getAllevtData()
    }

    getAllevtData = () => {
        var _ths = this;
        eventsref.on('value', function(snapshot) {
            snapshot.forEach(function(eventItem) {
                var childKey = eventItem.key;
                var childData = eventItem.val();
                childData['key'] = childKey;
                var theImfile = eventsStoreref.child(childData.image);

                theImfile.getDownloadURL().then(function(url) {
                    childData['imagepath'] = url;
                });

                _ths.setState({
                    evtData: [childData]
                })
            });
        });
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
                swal("Okey! The event has been deleted!", {
                    icon: "success",
                }).then(() => {
                    _ths.getAllevtData()
                    eventsref.child(key).remove();
                });

            }
        });
    };

    render() {

        const { classes } = this.props;

        return (
            <div className="App">
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <List>
                                {
                                    (this.state.evtData.length > 0) ?
                                    this.state.evtData.map((value, i) => (
                                        <div
                                            key={i}>
                                            <ListItem
                                                dense
                                                className={classes.listItem}>
                                                <Avatar alt="Remy Sharp" src={value.imagepath} />
                                                <ListItemText primary={`${value.name}`} />
                                                <ListItemSecondaryAction>
                                                    <Tooltip id="tooltip-icon" title="Edit" placement="left">
                                                        <Link to={`/editevent/${value.key}`} aria-label="Edit">
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
                                    )) :
                                    <ListItem
                                        dense
                                        className={classes.listItem}>
                                        <ListItemText
                                            style={{
                                                textAlign: 'center',
                                                fontsize: 25,
                                                fontWeight: 'bold'
                                            }}
                                            primary="There are no event found" />
                                    </ListItem>
                                }
                            </List>
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