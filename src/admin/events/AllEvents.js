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
import { CircularProgress } from 'material-ui/Progress';

import {
    Link
} from 'react-router-dom'

import swal from 'sweetalert';

import { eventsref } from '../../FB'

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
        currentEvent: null,
        loadingData: false,
    };


    componentDidMount(){
        this.getAllevtData()
    }

    getAllevtData = () => {
        var _ths = this;

        eventsref.on('value', function(snapshot) {
            let theEventData = [];

            _ths.setState({
                loadingData: true,
            })

            snapshot.forEach(function(eventItem) {
                var childKey = eventItem.key;
                var childData = eventItem.val();
                childData['key'] = childKey;
                // var theImfile = eventsStoreref.child(childData.image);
                //
                // theImfile.getDownloadURL().then(function(url) {
                //     childData['imagepath'] = url;
                // });
                theEventData.push(childData)
            });
            _ths.setState({
                evtData: theEventData
            })
        }).bind(this);
        setTimeout(() => {
            this.setState({
                loadingData: false,
            })
        }, 3000)

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
                _ths.getAllevtData()
                eventsref.child(key).remove();
            }
        });
    };

    render() {

        const { classes } = this.props;

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
                        <Link to={`/events/addnew`} className='linkBtn primary'>
                        <span>
                            <EditIcon />
                            Add New
                        </span>
                        </Link>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>

                            {
                                (this.state.loadingData) ?
                                    <div  style={{justifyContent: 'center', alignItems: 'center'}}>
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