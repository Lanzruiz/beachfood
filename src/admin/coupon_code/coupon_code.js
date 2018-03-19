 import React from 'react'
 import classNames from 'classnames';
 import PropTypes from 'prop-types';
 import { withStyles } from 'material-ui/styles';
 import { couponCodeRef, firebaseAuth } from '../../FB'
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


class CouponCode extends React.Component {

  constructor(props){
      super(props)
      this.state = {
          loadingData: false,
          CouponCodeData: [],
      }
  }



  componentDidMount(){
      var _ths = this;

    //document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
    //document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";

     this.loadCouponCodeData();

  }

  loadCouponCodeData() {
    var _ths = this;
    let theCouponCodeData = [];
    //let user_type = reactLocalStorage.get("type") == "admin" ? "admin" : "super_admin";

     couponCodeRef.once('value', function (snapshot) {

       if(!snapshot.exists()) {
         _ths.setState({
             CouponCodeData: theCouponCodeData,
             loadingData: true
         })
       }

         var totalCount = snapshot.numChildren();
         var counter = 0;


         snapshot.forEach(function(userItem) {
           let couponRec = userItem.val();
            theCouponCodeData .push({key: userItem.key, activation_date: couponRec.activation_date, expiration_date: couponRec.expiration_date, name: couponRec.name, code: couponRec.code,
                                   discount_in_dollar: couponRec.discount_in_dollar, discount_in_percentage: couponRec.discount_in_percentage})
            counter = counter + 1;
         });


         if (totalCount == counter) {
           _ths.setState({
               CouponCodeData: theCouponCodeData,
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
          text: "Once deleted, you will not be able to recover this coupon code!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
      }).then((willDelete) => {
          if (willDelete) {

              couponCodeRef.child(key).remove();

              _ths.setState({
                  loadingData: false
              })

              _ths.loadCouponCodeData();


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
              <Link to={`/coupon_code/create`} style={{color: '#FFFFFF', background: '#147dc2', padding: "10px", margin: "10px", textDecorationLine: "none"}} aria-label="Add Coupon Code">
                  Add Coupon Code
              </Link>
          </div>

      </Grid>
      </Grid>

        <ReactTable
          data={this.state.CouponCodeData}
          columns={[
            {
              Header: "Coupon Code",
              columns: [
                {
                  Header: "name",
                  accessor: "name"
                },
                {
                  Header: "Code",
                  accessor: "code"
                },
                {
                  Header: "Discount ($)",
                  accessor: "discount_in_dollar"
                },
                {
                  Header: "Discount (%)",
                  accessor: "discount_in_percentage"
                },
                {
                  Header: "Activation Date",
                  accessor: "activation_date"
                },
                {
                  Header: "Expiration Date",
                  accessor: "expiration_date"
                },

                {
                  Header: "Action",
                  accessor: "key",
                  Cell: row => (
                    <div>
                        <Link to={`/coupon_code/edit/`+row.value} style={{color: '#000'}} aria-label="Edit">
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


CouponCode.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CouponCode);
