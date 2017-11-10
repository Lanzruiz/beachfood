/**
 * Created by BOSS on 11/4/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {reactLocalStorage} from 'reactjs-localstorage';
import conf from '../config';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui-icons/Menu';

import Login from "./Login";
import Dashboard from "./Dashboard";
import Events from "./events";
import AllEvents from "./events/AllEvents";


import HomeIcon from 'material-ui-icons/Home';
import EventIcon from 'material-ui-icons/Event';
import EventNote from 'material-ui-icons/EventNote';

import PowerSettingsNew from 'material-ui-icons/PowerSettingsNew';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'


function logout() {
    reactLocalStorage.clear()
    window.location.assign('/')
}

const routes = [
    { path: '/',
        exact: true,
        sidebar: () => <div>Dashboard</div>,
        main: () => <Dashboard/>
    },
    { path: '/events',
        sidebar: () => <div>Events</div>,
        main: () => <Events/>
    },
    { path: '/allevents',
        sidebar: () => <div>All Events</div>,
        main: () => <AllEvents/>
    }

]

const drawerWidth = 240;

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100vh',
    },
    appBar: {
        position: 'absolute',
        marginLeft: drawerWidth,
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    drawerHeader: theme.mixins.toolbar,
    drawerPaper: {
        width: 250,
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            position: 'fixed',
            height: '100vh',
            top: 0,
            bottom: 0
        },
    },
    content: {
        backgroundColor: theme.palette.background.default,
        width: '100%',
        height: 'calc(100% - 56px)',
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 64,
        },
    },
});

class Frontend extends React.Component {
    state = {
        mobileOpen: false
    };

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

    render() {
        const { classes, theme } = this.props;

        const drawer = (
            <div>
                <div className={classes.drawerHeader}  style={{
                    position: 'relative'
                }}>
                    <h1 style={{
                        margin: 0,
                        position: 'absolute',
                        left: '30%',
                        top: '20%'
                    }}>{conf.sitename}</h1>
                </div>
                <Divider />
                <List>
                    <Link to="/" style={{
                        textDecoration: 'none'
                    }}>
                        <ListItem button>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                    </Link>
                    <Link to="/events" style={{
                        textDecoration: 'none'
                    }}>
                        <ListItem button>
                            <ListItemIcon>
                                <EventIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add Event" />
                        </ListItem>
                    </Link>
                    <Link to="/allevents" style={{
                        textDecoration: 'none'
                    }}>
                        <ListItem button>
                            <ListItemIcon>
                                <EventNote />
                            </ListItemIcon>
                            <ListItemText primary="All Events" />
                        </ListItem>
                    </Link>

                </List>
            </div>
        );

        if (!conf.login){
            return (
                <Login/>
            )
        }

        return (
            <div className={classes.root}>
                <div className={classes.appFrame}>

                    <Router>
                        <div className="app-wrapper">
                            <AppBar className={classes.appBar}>
                                <Toolbar>
                                    <IconButton
                                        color="contrast"
                                        aria-label="open drawer"
                                        onClick={this.handleDrawerToggle}
                                        className={classes.navIconHide}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Typography type="title" color="inherit" noWrap style={{flex: 1}}>
                                        {routes.map((route, index) => (
                                            <Route
                                                key={index}
                                                path={route.path}
                                                exact={route.exact}
                                                component={route.sidebar}
                                            />
                                        ))}
                                    </Typography>

                                    <IconButton color="contrast" aria-label="Logout"
                                                onClick={() => {
                                                    logout()
                                                }}>
                                        <PowerSettingsNew />
                                    </IconButton>
                                </Toolbar>
                            </AppBar>
                            <div className="main-wrapper">
                                <Hidden mdUp>
                                    <Drawer
                                        type="temporary"
                                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                                        open={this.state.mobileOpen}
                                        classes={{
                                            paper: classes.drawerPaper,
                                        }}
                                        onRequestClose={this.handleDrawerToggle}
                                        ModalProps={{
                                            keepMounted: true, // Better open performance on mobile.
                                        }}
                                    >
                                        {drawer}
                                    </Drawer>
                                </Hidden>
                                <Hidden mdDown implementation="css">
                                    <Drawer
                                        type="permanent"
                                        open
                                        classes={{
                                            paper: classes.drawerPaper,
                                        }}
                                    >
                                        {drawer}
                                    </Drawer>
                                </Hidden>

                                <main className={classes.content}>
                                    <div className="pageInner">

                                        {routes.map((route, index) => (
                                            // Render more <Route>s with the same paths as
                                            // above, but different components this time.
                                            <Route
                                                key={index}
                                                path={route.path}
                                                exact={route.exact}
                                                component={route.main}
                                            />
                                        ))}
                                    </div>
                                </main>
                            </div>
                        </div>
                    </Router>

                </div>
            </div>
        );
    }
}

Frontend.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Frontend);