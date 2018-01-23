/**
 * Created by Thomas Woodfin on 12/21/2017.
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
import SettingsIcon from 'material-ui-icons/Settings';

import Login from "./Login";
import Dashboard from "./Dashboard";

import Settings from './settings'
import ClubsRouter from './club'
import DrinksRouter from './drinks'
//import Subscriptions from './subscriptions'
import NavLink from "../admin/NavLink";


import HomeIcon from 'material-ui-icons/Home';
import Weekend from 'material-ui-icons/Weekend';
import LocalBar from 'material-ui-icons/LocalBar';
import CompanyLogo from '../admin/images/logo.png';
import MenuItemImage from '../admin/images/btn_inactive.png';
import TopMenuImage from '../admin/images/title_bg.png';


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
    {
        path: '/drynx_club',
        exact: true,
        menuName: 'Home',
        menuIcon: <HomeIcon />,
        sidebar: () => <div>Dashboard</div>,
        main: () => <Dashboard/>
    },
    {
        path: '/drynx_club/settings',
        exact: true,
        menuName: 'Settings',
        menuIcon: <SettingsIcon />,
        sidebar: () => <div>Settings</div>,
        main: () => <Settings/>
    },
    {
        path: '/drynx_club/clubs',
        exact: true,
        menuName: 'Clubs',
        menuIcon: <Weekend />,
        sidebar: () => <div>Clubs</div>,
        main: () => <ClubsRouter/>
    },
    {
        path: '/drynx_club/drinks',
        exact: true,
        menuName: 'Drinks',
        menuIcon: <LocalBar />,
        sidebar: () => <div>Dashboard</div>,
        main: () => <DrinksRouter/>
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
      backgroundImage: `url(${TopMenuImage})`,
      backgroundSize: 'cover',
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
    drawerHeader: {backgroundColor: '#000'},
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
    menuItem: {
       backgroundImage: `url(${MenuItemImage})`,
       backgroundSize: '97%',
       backgroundRepeat: 'no-repeat',
       color: '#fff'
    },
    menuItemIcon: {
       color: '#fff',
       marginTop: '-15px;'
    },
    menuItemText: {
      color: '#fff',
      marginLeft: '-18px',
      marginTop: '-5px',
      fontSize: '14px'
    },
    topMenu: {
      backgroundImage: `url(${TopMenuImage})`,
      backgroundSize: 'cover'
    },
});

class Clubs extends React.Component {
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
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <h1 style={{
                        margin: 0
                    }}><img src={CompanyLogo} style={{width: '200px', padding: '10px'}}/></h1>
                </div>
                <Divider />
                <List style={{backgroundColor: '#222F35'}}>
                    {routes.map((route, index) => (
                        // Render more <Route>s with the same paths as
                        // above, but different components this time.
                    <NavLink key={index} to={route.path} style={{
                        textDecoration: 'none'
                        }}>
                            <ListItem button>
                                <ListItemIcon className={classes.menuItemIcon}>
                                    {route.menuIcon}
                                </ListItemIcon>
                                <ListItemText className={classes.menuItemText}
                                    disableTypography primary={<Typography type="body2" style={{ color: '#9CA9AF' }}>{route.menuName}</Typography>}
                                />
                            </ListItem>
                        </NavLink>
                    ))}

                </List>
            </div>
        );

        if (!conf.loginClub){
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

Clubs.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Clubs);
