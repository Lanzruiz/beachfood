/**
 * Created by Thomas Woodfin on 12/13/2017.
 */
 import React from 'react'
 import classNames from 'classnames';
 import PropTypes from 'prop-types';
 import { withStyles } from 'material-ui/styles';
 import { faqRef } from '../../FB'
 import { updateUsers } from '../../helpers/users'
 import stylesm from '../../App.css'
 import ReactTable from "react-table";
 import "react-table/react-table.css";

 import IconButton from 'material-ui/IconButton';
 import DeleteIcon from 'material-ui-icons/Delete';
 import EditIcon from 'material-ui-icons/Edit';
 import Grid from 'material-ui/Grid';
 import Paper from 'material-ui/Paper';

 import Dialog from 'material-ui/Dialog';
 import AppBar from 'material-ui/AppBar';
 import Toolbar from 'material-ui/Toolbar';
 import Slide from 'material-ui/transitions/Slide';
 import KeyboardBackspace from 'material-ui-icons/KeyboardBackspace';
 import Typography from 'material-ui/Typography';
 import Button from 'material-ui/Button';
 import TextField from 'material-ui/TextField';
 import { FormControl } from 'material-ui/Form';
 import Input, { InputLabel } from 'material-ui/Input';
 import Save from 'material-ui-icons/Save';
 import CheckIcon from 'material-ui-icons/Check';
 import swal from 'sweetalert';
 import { DateTimePicker } from 'material-ui-pickers'
 import Card, { CardHeader, CardContent } from 'material-ui/Card';

 import Avatar from 'material-ui/Avatar';
 import { CircularProgress } from 'material-ui/Progress';
 import Divider from 'material-ui/Divider';
 import Tooltip from 'material-ui/Tooltip';

 import {
     Link
 } from 'react-router-dom'

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
    paper: {
        padding: 16,
        color: theme.palette.text.secondary,
    }
});


class FAQ extends React.Component {

  constructor(props){
      super(props)
      this.state = {
          loadingData: false,
          FaqData: []
      }
  }



  componentDidMount(){
      var _ths = this;

     this.loadFAQData();

  }

  loadFAQData() {
    var _ths = this;
    let theFaqData = [];

     faqRef.once('value', function(snapshot) {

         var totalCount = snapshot.numChildren();
         var counter = 0;


         snapshot.forEach(function(subscriptionItem) {
           let faqRec = subscriptionItem.val();
            theFaqData .push({key: subscriptionItem.key, answer: faqRec.answer, question: faqRec.question})
            counter = counter + 1;
         });


         if (totalCount == counter) {
           _ths.setState({
               FaqData: theFaqData,
               loadingData: true,
               answer: '',
               question: ''
           })
         }

     });
  }


  handleModalOpen(){
      this.setState({ open: true });
  };

  handleChange = prop => event => {
      this.setState({ [prop]: event.target.value });
  };

  handleModalClose() {
      this.setState({ open: false });
  };


  askDeleteConfirm(key) {
      var _ths = this;
      swal({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this faq!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
      }).then((willDelete) => {
          if (willDelete) {
              _ths.setState({
                  loadingData: false
              })
              faqRef.child(key).remove();
              this.loadFAQData();
          }
      });
  };


  render() {

    if(this.state.loadingData == false) {
       return "Loading...";
    }

    const { classes } = this.props;
    const buttonClassname = classNames({
        [classes.buttonSuccess]: this.state.issuccess,
    });

    var buttonStyle = {
        background: "#3f51b5",
        padding: "10px",
        margin: "10px",
        color: "#FFF",
        fontSize: "15px"
      };


    return (

      <div className="App">
      <Grid container spacing={24}>
      <Grid item xs={12} className="pageToolbarRight">
          <div style={{margin: "20px"}}>
              <Link to={`/faq/create`} style={{color: '#FFFFFF', background: '#3f51b5', padding: "10px", margin: "10px"}} aria-label="Add FAQ">
                  Add FAQ
              </Link>
          </div>

      </Grid>
      </Grid>

        <ReactTable
          data={this.state.FaqData}
          columns={[
            {
              Header: "FAQ",
              columns: [
                {
                  Header: "Question",
                  accessor: "question"
                },{
                  Header: "Action",
                  accessor: "key",
                  Cell: row => (
                    <div>
                        <Link to={`/faq/edit/`+row.value} style={{color: '#757575'}} aria-label="Edit">
                            <EditIcon />
                        </Link>

                        <IconButton aria-label="Delete"
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

                <div style={divStyle}>{row.original.answer}</div>

              );
          }}
        />

      </div>



    );

  }



}


FAQ.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FAQ);
