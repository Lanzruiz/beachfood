/**
 * Created by BOSS on 12/5/2017.
 */
import React, { Component } from 'react'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import { LinearProgress } from 'material-ui/Progress';
import List, {
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
} from 'material-ui/List';
import {
    Link
} from 'react-router-dom'
import Save from 'material-ui-icons/Save';
import CheckIcon from 'material-ui-icons/Check';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';
import { subscriptionref, usersref } from '../../FB'

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
    }
});

class AllSubscriptions extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loadingData: false,
            subsData: [],
            uploadProgress: 0,
        }

    }

    componentDidMount(){
        var _ths = this;
        _ths.setState({
            loadingData: true
        })
        subscriptionref.on('value', (snap) => {
            let subsdata = [];
            snap.forEach((subs) => {
                var childkey = subs.key;
                var childdata = subs.val();
                childdata['key'] = childkey;
                usersref.child(childdata.user_id).on('value', (usnp) => {
                    childdata['userInf'] = usnp.val();
                })
                console.log(childdata);
                subsdata.push(childdata)
            })
            _ths.setState({
                subsData: subsdata,
                loadingData: false
            })
        })
    }

    render() {
        const { classes } = this.props;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.isclubAdded,
        });
        return (
            <div className="App">
                <Grid container spacing={24}>

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
                                            (this.state.subsData.length > 0) ?
                                                this.state.subsData.map((value, i) => (
                                                    <div
                                                        key={i}>
                                                        <ListItem
                                                            dense
                                                            className={classes.listItem}>
                                                            <ListItemText primary={`${(value.userinf !== null) ? value.userinf.email : ''}`} secondary={`Price: ${value.price}\n Free: ${value.isFreeDrinks ? 'Yes' : 'No'}`} />
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
        )
    }
}

AllSubscriptions.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllSubscriptions);