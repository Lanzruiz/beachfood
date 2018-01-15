import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Tabs, { Tab } from 'material-ui/Tabs';
import LoginForm from './LoginForm';
import SwipeableViews from 'react-swipeable-views';
import AppBar from 'material-ui/AppBar';

import config from '../config'
import Background from '../admin/images/clubimagelogin.jpg';

const styles = theme => ({
    root: {
        display: 'flex',
        paddingLeft: 20,
        paddingRight: 20,
        flexGrow: 1,
        marginTop: 30,
    },
    tabRoot: {
        backgroundColor: theme.palette.background.paper,
    },
    paper: {
        color: theme.palette.text.secondary,
    },
});


function TabContainer({ children, dir }) {
    return (
        <div dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </div>
    );
}

class Login extends React.Component {

    state = {
        value: 0,
    };

    componentDidMount(){
       document.body.style.backgroundImage = `url(${Background})`;
       document.body.style.backgroundSize = 'cover';
       //document.body.style.backgroundSize = 'auto';


    }ch

    // Handle tab index
    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    render() {
        const { classes, theme } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item container xs={12}
                          direction='row'
                          justify='center'
                          alignItems='center'>
                        <h1>{config.sitename}</h1>
                    </Grid>
                    <Grid item lg={4} xs={12}>
                    </Grid>
                    <Grid item lg={4} xs={12}>
                        <Paper className={classes.paper}>
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    fullWidth
                                >
                                    <Tab label="Login" />

                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabContainer dir={theme.direction}>
                                    <LoginForm />
                                </TabContainer>

                            </SwipeableViews>

                        </Paper>
                    </Grid>
                    <Grid item lg={4} xs={12}>
                    </Grid>

                </Grid>
            </div>
        );
    }
}

TabContainer.propTypes = {
    dir: PropTypes.string.isRequired,
};


Login.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Login);
