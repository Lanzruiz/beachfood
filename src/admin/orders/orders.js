 import React from 'react'
 import classNames from 'classnames';
 import PropTypes from 'prop-types';
 import { withStyles } from 'material-ui/styles';
 import { ordersRef, firebaseAuth, couponCodeRef, customerRef, restaurantMenuRef } from '../../FB'
 import { updateUsers } from '../../helpers/users'
 import stylesm from '../../App.css'
 import ReactTable from "react-table";
 import "react-table/react-table.css";

 import IconButton from 'material-ui/IconButton';
 import DeleteIcon from 'material-ui-icons/Delete';
 import EditIcon from 'material-ui-icons/Edit';
 import Grid from 'material-ui/Grid';
 import Paper from 'material-ui/Paper';

 //import Dialog from 'material-ui/Dialog';
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
import OpenIcon from 'material-ui-icons/Visibility';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';

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


class CustomerOrders extends React.Component {

  constructor(props){
      super(props)
      this.state = {
          loadingData: false,
          OrderData: [],
          open_display: false,
          customer_name: '',
          order_code: '',
          tax: '',
          discount: '',
          total_amount: 0,
          order_date: '',
          orderDetails: []
      }
  }



  componentDidMount(){
      var _ths = this;

    //document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
    //document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";

     this.loadOrderData();

  }

  loadOrderData() {
    var _ths = this;
    let theOrderData = [];
    //let user_type = reactLocalStorage.get("type") == "admin" ? "admin" : "super_admin";

    ordersRef.once('value', function(snapshot) {
        if(!snapshot.exists()) {
           _ths.setState({
               OrderData: theOrderData,
               loadingData: true
           })
        }

        var totalCount = snapshot.numChildren();
        var recordCount = 0;

        snapshot.forEach(function(childSnapshot) {
              //console.log(childSnapshot.val());
              var totalAmount = 0;
              var count = 0;
              var tax = 0;
              var discount = 0;
              var quantity = 0;
              var order_code = childSnapshot.key;
              var name = "";

              var productCounter = 0
              var totalProductCount = 1;


              childSnapshot.forEach(function(childData) {
                  //console.log(childData.val().products);
                  var orderData = childData.val();


                  name = orderData.customer_name;
                  tax = orderData.tax;
                  discount = orderData.discount;

                  ordersRef.child(childSnapshot.key).child(childData.key).child("products").once('value',function(productData) {
                       totalProductCount = productData.numChildren();
                     productData.forEach(function(childSnapshot) {
                         productCounter = productCounter + 1;
                         var productInfo = childSnapshot.val();


                         var amount = productInfo.price * productInfo.quantity;
                         totalAmount =  totalAmount + amount;
                         console.log("Amount");
                         console.log(amount);

                         quantity = quantity + productInfo.quantity;
                     })

                     if(productCounter == totalProductCount) {
                       totalAmount = (parseFloat(totalAmount) + parseFloat(tax)) - parseFloat(discount);
                       console.log("Total Amount");
                       console.log(totalAmount);
                       theOrderData.push({order_code: order_code, total_amount: totalAmount, quantity: quantity, tax: tax, discount: discount, customer_name: name})
                       recordCount = recordCount + 1;
                     }

                     if (totalCount == recordCount) {
                       _ths.setState({
                           OrderData: theOrderData,
                           loadingData: true
                       })
                     }

                  })


              })



        })

        //console.log(theOrderData);


    })

    //  couponCodeRef.once('value', function (snapshot) {
     //
    //    if(!snapshot.exists()) {
    //      _ths.setState({
    //          CouponCodeData: theCouponCodeData,
    //          loadingData: true
    //      })
    //    }
     //
    //      var totalCount = snapshot.numChildren();
    //      var counter = 0;
     //
     //
    //      snapshot.forEach(function(userItem) {
    //        let couponRec = userItem.val();
    //         theCouponCodeData .push({key: userItem.key, activation_date: couponRec.activation_date, expiration_date: couponRec.expiration_date, name: couponRec.name, code: couponRec.code,
    //                                discount_in_dollar: couponRec.discount_in_dollar, discount_in_percentage: couponRec.discount_in_percentage})
    //         counter = counter + 1;
    //      });
     //
     //
    //      if (totalCount == counter) {
    //        _ths.setState({
    //            CouponCodeData: theCouponCodeData,
    //            loadingData: true
    //        })
    //      }
     //
    //  });
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

              _ths.loadOrderData();


          }
      });
  };


  displayOrderDetails(order_code) {
    var _ths = this;
    this.setState({open_display: true})
    ordersRef.child(order_code).on('value', function(snapshot) {
      var totalAmount = 0;
      var count = 0;
      var tax = 0;
      var discount = 0;
      var name = "";
      let theOrderDetails = [];
      var order_date = "";
      var amount = 0;

         snapshot.forEach(function (childData){
           var orderData = childData.val();
           console.log(orderData);

           name = orderData.customer_name;
           tax = orderData.tax;
           discount = orderData.discount;
           order_date = orderData.createdAt;


           //var amount = orderData.amount * orderData.quantity;
           //totalAmount =  totalAmount + amount;
           //count = count + 1;

           ordersRef.child(snapshot.key).child(childData.key).child("products").once('value',function(productData) {

             productData.forEach(function(childSnapshot) {

                 var productInfo = childSnapshot.val();
                 console.log(productInfo);

                 var amount = productInfo.price * productInfo.quantity;
                 totalAmount =  totalAmount + amount;

                 theOrderDetails.push({restaurant: productInfo.restaurant_name, menu_name: productInfo.name,
                                    quantity: productInfo.quantity, amount: productInfo.price, total_amount: amount, key: childSnapshot.key});
             })

             //console.log(theOrderDetails);

             totalAmount = (parseFloat(totalAmount) + parseFloat(tax)) - parseFloat(discount);

             _ths.setState({
               customer_name: name,
               order_code: order_code,
               tax: tax,
               discount: discount,
               total_amount: totalAmount,
               orderDetails: theOrderDetails,
               order_date: order_date
             });

           })






         });






    });

  }

  displayHandleRequestClose() {
     this.setState({
       open_display: false,
       customer_name: '',
       order_code: '',
       tax: '',
       discount: '',
       total_amount: '',
       orderDetails: [],
       order_date: ''
     })
  }


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

      {  /**********display drinks***************/ }

        <Dialog
            open={this.state.open_display}
            transition={Transition}
            keepMounted
            onRequestClose={this.handleRequestClose}>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid container>
                        <Grid item xs={12} lg={6}>
                              <p style={{fontSize:12, color:'#999'}}>Name</p>
                              <p style={{color: '#000'}}>{this.state.customer_name}</p>
                        </Grid>
                        <Grid item xs={12} lg={6}>

                            <p style={{fontSize:12, color:'#999'}}>Order Date</p>
                            <p style={{color: '#000'}}>{this.state.order_date}</p>

                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={12} lg={3}>
                              <p style={{fontSize:12, color:'#999'}}>Restaurant</p>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                              <p style={{fontSize:12, color:'#999'}}>Menu</p>
                        </Grid>
                        <Grid item xs={12} lg={2}>
                              <p style={{fontSize:12, color:'#999'}}>Quantity</p>
                        </Grid>
                        <Grid item xs={12} lg={2}>
                              <p style={{fontSize:12, color:'#999'}}>Amount</p>
                        </Grid>
                        <Grid item xs={12} lg={2}>
                              <p style={{fontSize:12, color:'#999'}}>Total Amount</p>
                        </Grid>
                    </Grid>

                    {this.state.orderDetails.map((orderDatas) => {
                        return ([
                                <Grid container>
                                    <Grid item xs={12} lg={3}>
                                          <p style={{color: '#000'}}>{orderDatas.restaurant}</p>
                                    </Grid>
                                    <Grid item xs={12} lg={3}>
                                          <p style={{color: '#000'}}>{orderDatas.menu_name}</p>
                                    </Grid>
                                    <Grid item xs={12} lg={2}>
                                          <p style={{color: '#000'}}>{orderDatas.quantity}</p>
                                    </Grid>
                                    <Grid item xs={12} lg={2}>
                                          <p style={{color: '#000'}}>${orderDatas.amount}</p>
                                    </Grid>
                                    <Grid item xs={12} lg={2}>
                                          <p style={{color: '#000'}}>${orderDatas.total_amount}</p>
                                    </Grid>
                                </Grid>
                          ]);
                      })
                    }




                   <Grid container>
                         <Grid item xs={12} lg={3}>
                             <p style={{fontSize:12, color:'#999'}}>&nbsp;</p>
                         </Grid>
                         <Grid item xs={12} lg={3}>
                             <p style={{fontSize:12, color:'#999'}}>&nbsp;</p>
                         </Grid>
                         <Grid item xs={12} lg={2}>
                             <p style={{fontSize:12, color:'#999'}}>&nbsp;</p>
                         </Grid>
                         <Grid item xs={12} lg={2}>
                             <p style={{fontSize:12, color:'#999'}}>Tax</p>
                         </Grid>
                        <Grid item xs={12} lg={2}>
                            <p style={{color: '#000'}}>(+) ${this.state.tax}</p>
                        </Grid>
                </Grid>
                <Grid container>
                        <Grid item xs={12} lg={3}>
                            <p style={{fontSize:12, color:'#999'}}>&nbsp;</p>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <p style={{fontSize:12, color:'#999'}}>&nbsp;</p>
                        </Grid>
                        <Grid item xs={12} lg={2}>
                            <p style={{fontSize:12, color:'#999'}}>&nbsp;</p>
                        </Grid>
                        <Grid item xs={12} lg={2}>
                            <p style={{fontSize:12, color:'#999'}}>Discount</p>
                        </Grid>
                        <Grid item xs={12} lg={2}>
                            <p style={{color: '#000'}}>(-) ${this.state.discount}</p>
                        </Grid>
                </Grid>

                <Grid container>
                        <Grid item xs={12} lg={3}>
                            <p style={{fontSize:12, color:'#999'}}>&nbsp;</p>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <p style={{fontSize:12, color:'#999'}}>&nbsp;</p>
                        </Grid>
                        <Grid item xs={12} lg={2}>
                            <p style={{fontSize:12, color:'#999'}}>&nbsp;</p>
                        </Grid>
                        <Grid item xs={12} lg={2}>
                            <p style={{fontSize:12, color:'#999'}}>Total Amount</p>
                        </Grid>
                        <Grid item xs={12} lg={2}>
                            <p style={{color: '#000'}}>${this.state.total_amount}</p>
                        </Grid>
                 </Grid>



                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {this.displayHandleRequestClose()}} color="primary">
                    Close
                </Button>

            </DialogActions>
        </Dialog>
        { /***********end display drinks**********/ }



        <ReactTable
          data={this.state.OrderData}
          columns={[
            {
              Header: "Customer Orders",
              columns: [
                {
                  Header: "Order Code",
                  accessor: "order_code"
                },
                {
                  Header: "Customer Name",
                  accessor: "customer_name"
                },
                {
                  Header: "Quantity",
                  accessor: "quantity"
                },
                {
                  Header: "Tax ($)",
                  accessor: "tax"
                },
                {
                  Header: "Discount ($)",
                  accessor: "discount"
                },
                {
                  Header: "Total Amount ($)",
                  accessor: "total_amount"
                },

                {
                  Header: "Action",
                  accessor: "key",
                  Cell: row => (
                    <div>

                        <IconButton aria-label="View Details" style={{color: '#000'}}
                                    onClick={() => {
                                        this.displayOrderDetails(row.original.order_code)
                                    }}>
                            <OpenIcon />
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


CustomerOrders.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomerOrders);
