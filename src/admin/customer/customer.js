 import React from 'react'
 import classNames from 'classnames';
 import PropTypes from 'prop-types';
 import { withStyles } from 'material-ui/styles';
 import { customerRef, firebaseAuth } from '../../FB'
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
import Background from '../images/login.jpg';
import {reactLocalStorage} from 'reactjs-localstorage';

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


class Customers extends React.Component {

  constructor(props){
      super(props)
      this.state = {
          loadingData: false,
          CustomersData: [],
      }
  }



  componentDidMount(){
      var _ths = this;

    //document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
    //document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";

     this.loadCustomerData();

  }

  loadCustomerData() {
    var _ths = this;
    let theCustomerData = [];
    //let user_type = reactLocalStorage.get("type") == "admin" ? "admin" : "super_admin";

     customerRef.once('value', function (snapshot) {

       if(!snapshot.exists()) {
         _ths.setState({
             CustomersData: theCustomerData,
             loadingData: true
         })
       }

         var totalCount = snapshot.numChildren();
         var counter = 0;


         snapshot.forEach(function(userItem) {
           let userRec = userItem.val();
            theCustomerData .push({key: userItem.key, firstname: userRec.firstname, lastname: userRec.lastname, email: userRec.email, contact: userRec.contact, uid: userRec.userid})
            counter = counter + 1;
         });


         if (totalCount == counter) {
           _ths.setState({
               CustomersData: theCustomerData,
               loadingData: true
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
          text: "Once deleted, you will not be able to recover this customer!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
      }).then((willDelete) => {
          if (willDelete) {


              customerRef.child(key).once('value', function(snapshot) {
                 let userRec = snapshot.val();
                 let email = userRec.email;
                 let password = userRec.password;

                  //authenticate user
                  firebaseAuth.signInWithEmailAndPassword(email,password).then(function(user) {
                      user.delete();
                      customerRef.child(key).remove();

                      _ths.setState({
                          loadingData: false
                      })

                      _ths.loadCustomerData();
                  }).catch(function(error) {
                        _ths.setState({
                            loadingData: false
                        });
                        _ths.loadCustomerData();
                  });

              });


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
        background: "##147DC2",
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
              <Link to={`/customer/create`} style={{color: '#FFFFFF', background: '#147dc2', padding: "10px", margin: "10px", textDecorationLine: "none"}} aria-label="Add FAQ">
                  Add Customer
              </Link>
          </div>

      </Grid>
      </Grid>

        <ReactTable
          data={this.state.CustomersData}
          columns={[
            {
              Header: "Customers",
              columns: [
                {
                  Header: "First name",
                  accessor: "firstname"
                },
                {
                  Header: "Last name",
                  accessor: "lastname"
                },
                {
                  Header: "Email",
                  accessor: "email"
                },
                {
                  Header: "Action",
                  accessor: "key",
                  Cell: row => (
                    <div>
                        <Link to={`/customer/edit/`+row.value} style={{color: '#000'}} aria-label="Edit">
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

        />

      </div>



    );

  }



}


Customers.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Customers);
