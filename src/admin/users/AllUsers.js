/**
 * Created by Thomas Woodfin on 11/17/2017.
 */
import React from 'react'
import ReactTable from "react-table";
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
import EditIcon from 'material-ui-icons/Edit';

import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Slide from 'material-ui/transitions/Slide';
import KeyboardBackspace from 'material-ui-icons/KeyboardBackspace';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Save from 'material-ui-icons/Save';
import CheckIcon from 'material-ui-icons/Check';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';

import { CircularProgress } from 'material-ui/Progress';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';

import { usersref } from '../../FB'
import { updateUsers } from '../../helpers/users'
import stylesm from '../../App.css'
import swal from 'sweetalert';
import {
    Link
} from 'react-router-dom'
import matchSorter from 'match-sorter'
import Background from '../images/users.jpg';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}


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
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: 'transparent',
        },
        float: 'right'
    },
});

class AllUsers extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            open: false,
            loadingData: false,
            userData: [],
            email: '',
            password: '',
            username: '',
            issuccess: false,
            showPassword: false
        }
    }

    // password show hide control
    handleChangePass = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPasssword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    componentDidMount(){
        var _ths = this;

        document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
        document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";

        usersref.on('value', function(snapshot) {
            let theUserData = [];
            _ths.setState({
                loadingData: true
            })
            snapshot.forEach(function(eventItem) {
                var childKey = eventItem.key;
                var childData = eventItem.val();
                childData['key'] = childKey;

                if (!childData.info){
                    theUserData.push(childData)
                }
            });
            _ths.setState({
                userData: theUserData,
                loadingData: false
            })
        }).bind(this);
    }

    updateUserInfo(key){
        updateUsers({
            thekey: key,
            email: this.state.email,
            password: this.state.password,
            username: this.state.username
        })

        this.setState({
           issuccess: true
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
                usersref.child(key).remove();
            }
        });
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleModalOpen(uid){
        var _ths = this;
        usersref.child(`${uid}/`).on('value', (snap) => {
            snap.forEach(function (childSnap) {
                _ths.setState({ [childSnap.key]: childSnap.val() });
            })
        })
        this.setState({ open: true });
    };

    handleModalClose() {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.issuccess,
        });

        if(this.state.issuccess == true) {
          swal ( "Success" ,  "Users successfully saved!" ,  "success" );
            var _ths = this;
            _ths.setState({
                issuccess: false
            })
        }

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
                        <Dialog
                            fullScreen
                            open={this.state.open}
                            onRequestClose={() => {this.handleModalClose()}}
                            transition={Transition}
                        >
                            <AppBar className={classes.appBar}>
                                <Toolbar>
                                    <IconButton color="contrast" onClick={() => {this.handleModalClose()}} aria-label="Close">
                                        <KeyboardBackspace />
                                    </IconButton>
                                    <Typography type="title" color="inherit" className={classes.flex}>
                                        Update User
                                    </Typography>
                                    <Button
                                        color="contrast"
                                        className={buttonClassname}
                                        disabled={this.state.isloading}
                                        onClick={() => {
                                            this.updateUserInfo()
                                        }}>
                                        {
                                            this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                                this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                                    <Save className={classes.leftIcon} />
                                        }
                                        {
                                            this.state.issuccess ? 'User Updated' : 'Update User'
                                        }
                                    </Button>
                                </Toolbar>
                            </AppBar>
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    paddingTop: 30
                                }}>
                                <Grid container style={{width: '100%', margin: 0}}>
                                    <Grid item xs={12} lg={7}>
                                        <FormControl fullWidth className={stylesm.theFromControl}>
                                            <InputLabel htmlFor="email">Email</InputLabel>
                                            <Input
                                                id="email"
                                                value={this.state.email}
                                                onChange={this.handleChange('email')}
                                            />
                                        </FormControl>

                                        <FormControl fullWidth className={stylesm.theFromControl}>
                                            <InputLabel htmlFor="username">Username</InputLabel>
                                            <Input
                                                id="username"
                                                value={this.state.username}
                                                onChange={this.handleChange('username')}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} lg={5}>
                                        <FormControl fullWidth className={classes.formControl}>
                                            <InputLabel htmlFor="password">Password</InputLabel>
                                            <Input
                                                id="password"
                                                type={this.state.showPassword ? 'text' : 'password'}
                                                value={this.state.password}
                                                onChange={this.handleChangePass('password')}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={this.handleClickShowPasssword}
                                                            onMouseDown={this.handleMouseDownPassword}
                                                        >
                                                            {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>

                                    </Grid>
                                </Grid>
                            </div>
                        </Dialog>
                    </Grid>
                    <Grid item xs={12}>


                            <ReactTable
                            filterable
                              data={this.state.userData}
                              columns={[
                                {
                                  Header: "User Information",
                                  columns: [
                                    {
                                      Header: "Firstname",
                                      accessor: "firstname",
                                      filterMethod: (filter, rows) =>
                                            matchSorter(rows, filter.value, { keys: ["firstname"] }),
                                      filterAll: true

                                    },
                                    {
                                      Header: "Lastname",
                                      accessor: "lastname",
                                      filterMethod: (filter, rows) =>
                                            matchSorter(rows, filter.value, { keys: ["lastname"] }),
                                      filterAll: true
                                    },
                                    {
                                      Header: "Email",
                                      accessor: "email",
                                      filterMethod: (filter, rows) =>
                                            matchSorter(rows, filter.value, { keys: ["email"] }),
                                      filterAll: true

                                    },
                                    {
                                      Header: "Action",
                                      accessor: "key",
                                      filterable: false,
                                      Cell: row => (
                                        <div>
                                        <Link to={`/users/edit/`+row.value} style={{color: '#000'}} aria-label="Edit">
                                            <EditIcon />
                                        </Link>


                                            <IconButton aria-label="Delete" style={{color: '#000'}}
                                                        onClick={() => {
                                                            this.askDeleteConfirm(row.value)
                                                        }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                      )
                                    }
                                  ]
                                }
                              ]}
                              defaultPageSize={15}
                              className="-striped -highlight"
                              SubComponent = {row =>  {
                                var divStyle = {
                                    background: "#eee",
                                    padding: "20px",
                                    margin: "20px"
                                  };
                                  return (

                                    <div style={divStyle}>
                                        <p>Birthday: {row.original.birthday}</p>
                                        <p>User Code: {row.original.user_code}</p>
                                        <p>createdAt: {row.original.createdAt}</p>
                                        </div>


                                  );
                              }}
                            />


                    </Grid>
                </Grid>
            </div>
        );
    }

}

AllUsers.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllUsers);
