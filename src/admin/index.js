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
import Events from './events'
import Users from './users'
import AllClubs from './clubs'
import AllDrinks from './drinks'
import Subscriptions from './subscriptions'
import Cities from './cities'
import UserSubscription from './user_subscription'
import UserGiftDrynx from './user_gift'
import UserFreeDrinks from './user_drinks'
import ContactUs from './contact_us'
import FAQ from './faq'
import Pages from './pages'
import UserReferral from './user_referral'


import HomeIcon from 'material-ui-icons/Home';
import EventIcon from 'material-ui-icons/Event';
import AccountIcon from 'material-ui-icons/AccountBox';
import Contacts from 'material-ui-icons/Contacts';
import Weekend from 'material-ui-icons/Weekend';
import LocalBar from 'material-ui-icons/LocalBar';
import PersonPin from 'material-ui-icons/PersonPin';
import LocationCity from 'material-ui-icons/LocationCity';

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
        path: '/',
        exact: true,
        menuName: 'Home',
        menuIcon: <HomeIcon />,
        sidebar: () => <div>Dashboard</div>,
        main: () => <Dashboard/>
    },
    {
        path: '/events',
        menuName: 'Events',
        menuIcon: <EventIcon />,
        sidebar: () => <div>Events</div>,
        main: () => <Events/>
    },
    {
        path: '/users',
        menuName: 'Users',
        menuIcon: <Contacts />,
        sidebar: () => <div>Users</div>,
        main: () => <Users/>
    },
    {
        path: '/clubs',
        menuName: 'Clubs',
        menuIcon: <Weekend />,
        sidebar: () => <div>Clubs</div>,
        main: () => <AllClubs/>
    },
    {
        path: '/drinks',
        menuName: 'Drinks',
        menuIcon: <LocalBar />,
        sidebar: () => <div>Drinks</div>,
        main: () => <AllDrinks/>
    },
    {
        path: '/subscriptions',
        menuName: 'Subscriptions',
        menuIcon: <PersonPin />,
        sidebar: () => <div>Subscriptions</div>,
        main: () => <Subscriptions />
    },
    {
        path: '/cities',
        menuName: 'Cities',
        menuIcon: <LocationCity />,
        sidebar: () => <div>Cities</div>,
        main: () => <Cities />
    },
    {
      path: '/user-subscription',
      menuName: 'User Subscription',
      menuIcon: <Contacts />,
      sidebar: () => <div>User Subscription</div>,
      main: () => <UserSubscription />
    },
    {
      path: '/user-gifts',
      menuName: 'User Gift Drynx',
      menuIcon: <Contacts />,
      sidebar: () => <div>User Gift Drynx</div>,
      main: () => <UserGiftDrynx />
    },
    {
      path: '/user-drinks',
      menuName: 'User Free Drinks',
      menuIcon: <Contacts />,
      sidebar: () => <div>User Free Drinks</div>,
      main: () => <UserFreeDrinks />
    },
    {
      path: '/contact-us',
      menuName: 'Contact Us',
      menuIcon: <PersonPin />,
      sidebar: () => <div>Contact Us</div>,
      main: () => <ContactUs />
    },
    {
      path: '/faq',
      menuName: 'FAQ',
      menuIcon: <PersonPin />,
      sidebar: () => <div>FAQ</div>,
      main: () => <FAQ />
    },
    {
      path: '/pages',
      menuName: 'Pages',
      menuIcon: <PersonPin />,
      sidebar: () => <div>Pages</div>,
      main: () => <Pages />
    },
    {
      path: '/user-referral',
      menuName: 'Referral',
      menuIcon: <PersonPin />,
      sidebar: () => <div>Referral</div>,
      main: () => <UserReferral />
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
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <h1 style={{
                        margin: 0
                    }}>{conf.sitename}</h1>
                </div>
                <Divider />
                <List>
                    {routes.map((route, index) => (
                        // Render more <Route>s with the same paths as
                        // above, but different components this time.
                    <Link key={index} to={route.path} style={{
                        textDecoration: 'none'
                        }}>
                            <ListItem button>
                                <ListItemIcon>
                                    {route.menuIcon}
                                </ListItemIcon>
                                <ListItemText primary={route.menuName} />
                            </ListItem>
                        </Link>
                    ))}

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
