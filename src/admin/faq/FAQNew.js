import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

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

//import { DateTimePicker } from 'material-ui-pickers'
import swal from 'sweetalert';
import { faqRef } from '../../FB'
//import { saveEvent } from '../../helpers/events'
import Background from '../images/login.jpg';

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


class FAQNew extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            question: '',
            answer: '',
            isloading: false,
            issuccess: false,
        }
    }

    componentDidMount(){
        var _ths = this;

        document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
        document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";
    }




    saveFAQ(){

        var _ths = this;

        this.setState({
            isloading: true,
            issuccess: false,
        })

        var value = {
            answer: this.state.answer,
            question: this.state.question
        }

        faqRef.push(value);

        this.setState({
            isloading: false,
            issuccess: true,
        })


    }


    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    render() {
        const { classes } = this.props;
        const isupdateBTN = (this.props.match.params.evid) ? 'Update' : 'Save';
        const isupdated = (this.props.match.params.evid) ? 'Update' : 'Save';
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.issuccess,
        });

        if(this.state.issuccess == true) {
          swal ( "Success" ,  "FAQ successfully saved!" ,  "success" );
            var _ths = this;
            _ths.setState({
                issuccess: false
            })
        }

        return (
            <div className="App">
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <Link to={`/faq`} className='linkBtn primary'>
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
                                this.saveFAQ()
                            }}>
                            {
                                this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                    this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                        <Save className={classes.leftIcon} />
                            }
                            {
                                this.state.issuccess ? `FAQ Saved` : `Save FAQ`
                            }
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <Paper className={classes.paper}>
                            <Typography type="title" gutterBottom>
                                FAQ
                            </Typography>

                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="question"
                                    label="Question"
                                    multiline
                                    rows="4"
                                    value={this.state.question}
                                    onChange={this.handleChange('question')}
                                    margin="normal"
                                />
                            </FormControl>

                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="answer"
                                    label="Answer"
                                    multiline
                                    rows="4"
                                    value={this.state.answer}
                                    onChange={this.handleChange('answer')}
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

FAQNew.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FAQNew);
