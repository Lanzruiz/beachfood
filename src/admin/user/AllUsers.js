/**
 * Created by BOSS on 11/17/2017.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, {
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader,
} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 30,
    },
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    paper: {
        padding: 16,
        color: theme.palette.text.secondary,
    },
});

function AllUsers(props) {
    const { classes } = props;

    return (
        <div className="App">
            <Grid container spacing={24}>
                <Grid item xs={6}>
                    {/*<Button href={`/orders/23`} color="primary" className={classes.button}>*/}
                    {/*<Save className={props.classes.leftIcon} />*/}
                    {/*<span>Save</span>*/}
                    {/*</Button>*/}
                </Grid>
                <Grid item xs={6}>

                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <List subheader={<ListSubheader>All Users</ListSubheader>}>
                            <ListItem>
                                <ListItemText primary="Pan cake" />
                                <ListItemSecondaryAction>
                                    <Link to={`/orders/23`} aria-label="Edit">
                                        <EditIcon />
                                    </Link>
                                    <IconButton className={classes.button} aria-label="Delete">
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Pan cake" />
                                <ListItemSecondaryAction>
                                    <Link to={`/orders/24`} aria-label="Edit">
                                        <EditIcon />
                                    </Link>
                                    <IconButton className={classes.button} aria-label="Delete">
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

AllUsers.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllUsers);