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
import Administrator from './administrator'
import ClubOwner from './club_owner'


import HomeIcon from 'material-ui-icons/Home';
import EventIcon from 'material-ui-icons/Event';
import AccountIcon from 'material-ui-icons/AccountBox';
import Contacts from 'material-ui-icons/Contacts';
import Weekend from 'material-ui-icons/Weekend';
import LocalBar from 'material-ui-icons/LocalBar';
import PersonPin from 'material-ui-icons/PersonPin';
import LocationCity from 'material-ui-icons/LocationCity';
import GiftCard from 'material-ui-icons/CardGiftcard';
import Referrals from 'material-ui-icons/Group';
import PagesIcon from 'material-ui-icons/Pages';
import QuestionAnswer from 'material-ui-icons/QuestionAnswer';
import ContactIcon from 'material-ui-icons/Contacts';
import LockIcon from 'material-ui-icons/Lock';
import CompanyLogo from './images/logo.png';
import MenuItemImage from './images/btn_inactive.png';
import MenuItemImageActive from './images/btn_active.png';
import TopMenuImage from './images/title_bg.png';
import NavLink from "./NavLink";
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
        path: '/drynx_admin',
        exact: true,
        menuName: 'Home',
        menuIcon: <HomeIcon />,
        sidebar: () => <div>Dashboard</div>,
        main: () => <Dashboard/>
    },
    {
        path: '/administrator',
        menuName: 'Administrator',
        menuIcon: <LockIcon />,
        sidebar: () => <div>Administrator</div>,
        main: () => <Administrator/>
    },
    {
        path: '/club_owner',
        menuName: 'Club Owner',
        menuIcon: <AccountIcon />,
        sidebar: () => <div>Club Owner</div>,
        main: () => <ClubOwner/>
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
      menuIcon: <GiftCard />,
      sidebar: () => <div>User Gift Drynx</div>,
      main: () => <UserGiftDrynx />
    },
    {
      path: '/user-drinks',
      menuName: 'User Free Drinks',
      menuIcon: <LocalBar />,
      sidebar: () => <div>User Free Drinks</div>,
      main: () => <UserFreeDrinks />
    },
    {
      path: '/user-referral',
      menuName: 'User Referrals',
      menuIcon: <Referrals />,
      sidebar: () => <div>User Referral</div>,
      main: () => <UserReferral />
    },
    {
      path: '/pages',
      menuName: 'Pages',
      menuIcon: <PagesIcon />,
      sidebar: () => <div>Pages</div>,
      main: () => <Pages />
    },
    {
      path: '/faq',
      menuName: 'FAQ',
      menuIcon: <QuestionAnswer />,
      sidebar: () => <div>FAQ</div>,
      main: () => <FAQ />
    },
    {
      path: '/contact-us',
      menuName: 'Contact Us',
      menuIcon: <ContactIcon />,
      sidebar: () => <div>Contact Us</div>,
      main: () => <ContactUs />
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

    menuItemActive: {
       backgroundImage: `url(${MenuItemImageActive})`,
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
    }
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
        //var isActive = this.router === this.props.to;
        //var className = isActive ? classes.menuItemActive : classes.menuItem;
        //console.log(this);
        //console.log(this.props.location.pathname);
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

        if (!conf.login){
            return (
                <Login/>
            )
        }

        return (
            <div className={classes.root}>
                <div className={classes.appFrame} >

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
