import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import swal from 'sweetalert';
import TextField from 'material-ui/TextField';
//import Input, { InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
//import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import Save from 'material-ui-icons/Save';
//import Card, { CardHeader, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import green from 'material-ui/colors/green';
import CheckIcon from 'material-ui-icons/Check';
import KeyboardBackspace from 'material-ui-icons/KeyboardBackspace';
import Background from '../images/login.jpg';
//import { DateTimePicker } from 'material-ui-pickers'

import { pagesRef } from '../../FB'
//import { saveEvent } from '../../helpers/events'


import stylesm from '../../App.css'

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
        width: '100%',
        height: '100%',
        borderRadius: 0,
        borderWidth: 2,
        borderColor: '#000'
    },
    button: {
        float: 'right',
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    buttonProgress: {
        color: green[500],
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
        float: 'right'
    },
});


class PagesUpdate extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            description: '',
            isloading: false,
            issuccess: false,
            isFAQLoaded: false,
            pageID: '',
        }
    }

    componentDidMount(){
        var _ths = this;
        var pageID = this.props.match.params.pageid;

        document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
        document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";

        var description = "";

        pagesRef.child(pageID).once('value', function(snapshot) {
            description = snapshot.val().description;


            _ths.setState({
                isFAQLoaded: true,
                description: description,
                pageID: pageID
            })

        });






    }




    savePage(){

        var _ths = this;

        this.setState({
            isloading: true,
            issuccess: false,
        })

        var value = {
            description: this.state.description
        }

        pagesRef.child(this.state.pageID).update(value);

        this.setState({
            isloading: false,
            issuccess: true,
        })


    }


    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    render() {

      if(this.state.isFAQLoaded == false) {
         return "Loading...";
      }

      if(this.state.issuccess == true) {
        swal ( "Success" ,  "Pages successfully saved!" ,  "success" );
          var _ths = this;
          _ths.setState({
              issuccess: false
          })
      }

        const { classes } = this.props;
        const isupdateBTN = (this.props.match.params.evid) ? 'Update' : 'Save';
        const isupdated = (this.props.match.params.evid) ? 'Update' : 'Save';
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.issuccess,
        });
        return (
            <div className="App">
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <Link to={`/pages`} className='linkBtn primary'>
                        <span>
                            <KeyboardBackspace />
                            Back
                        </span>
                        </Link>
                    </Grid>
                    <Grid item xs={6} className="pageToolbarRight">
                        <Button
                            className={buttonClassname}
                            disabled={this.state.isloading} raised dense color="primary"
                            onClick={() => {
                                this.savePage()
                            }}>
                            {
                                this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                    this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                        <Save className={classes.leftIcon} />
                            }
                            {
                                this.state.issuccess ? `Page Saved` : `Save Page`
                            }
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <Paper className={classes.paper}>
                            <Typography type="title" gutterBottom>
                                PAGES
                            </Typography>

                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="description"
                                    label="Description"
                                    multiline
                                    rows="8"
                                    value={this.state.description}
                                    onChange={this.handleChange('description')}
                                    margin="normal"
                                />
                            </FormControl>


                        </Paper>
                    </Grid>

                </Grid>
            </div>
        );
    }
}

PagesUpdate.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PagesUpdate);
