/**
 * Created by Thomas Woodfin on 12/13/2017.
 */
 import React from 'react'
  import matchSorter from 'match-sorter'
 import classNames from 'classnames';
 import PropTypes from 'prop-types';
 import { withStyles } from 'material-ui/styles';
 import { userSubscriptionRef, usersref } from '../../FB'
 import { updateUsers } from '../../helpers/users'
 import stylesm from '../../App.css'
 import swal from 'sweetalert';
 import ReactTable from "react-table";
 import "react-table/react-table.css";
 var dateFormat = require('dateformat');

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


class UserSubscription extends React.Component {
  constructor(props){
      super(props)
      this.state = {
          open: false,
          loadingData: false,
          userSubscriptionData: []
      }
  }

  componentDidMount(){
      var _ths = this;
     //console.log(_ths.state.userSubscriptionData.length);
     let theUserSubscriptionData = [];

      userSubscriptionRef.once('value', function(snapshot) {
          var totalCount = snapshot.numChildren();
          var counter = 0;
          //const userSubscriptionList = _ths.state.userSubscriptionData;

          snapshot.forEach(function(subscriptionItem) {
              var childKey = subscriptionItem.key;
              var childData = subscriptionItem.val();

              var userID = childData.user_id;
              var name = "";
              usersref.orderByChild('userid').equalTo(userID).once('child_added', function (snapshot) {
                 //console.log(snapshot.val().firstname);
                 if (snapshot.exists()) {

                   if (!childData.info){
                       //childData['key'] = snapshot.key;
                       let expirationDate = dateFormat(childData.date_end, "mmm dd, yyyy");
                       let startDate = dateFormat(childData.date_start, "mmm dd, yyyy");

                       theUserSubscriptionData.push({key: snapshot.key, date_end: expirationDate, amount: "$"+childData.amount.toFixed(2), date_start: startDate, freeDrinks: childData.freeDrinks,
                                                     paymentMethod: childData.paymentMethod, transactionID: childData.transactionID, type: childData.type,
                                                    firstname: snapshot.val().firstname, lastname: snapshot.val().lastname, emal: snapshot.val().email});

                       counter = counter + 1;

                       if (totalCount == counter) {
                         console.log(theUserSubscriptionData);
                           _ths.setState({
                               userSubscriptionData: theUserSubscriptionData,
                               loadingData: true
                           })
                      }
                   }
                 }
              });



          });

          //console.log(theUserSubscriptionData);


      });

  }


  render() {


    if(this.state.loadingData == false) {
       return "Loading...";
    }


      return (
          <div className="App">
          <div>
            <ReactTable
              data={this.state.userSubscriptionData}
              filterable
              columns={[
                {
                  Header: "Name",
                  columns: [
                    {
                      Header: "First Name",
                      accessor: "firstname",
                      filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["firstname"] }),
                      filterAll: true
                    },
                    {
                      Header: "Last Name",
                      id: "lastName",
                      filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["lastName"] }),
                      filterAll: true,
                      accessor: d => d.lastname
                    }
                  ]
                },
                {
                  Header: "Subscription",
                  columns: [
                    {
                      Header: "Subscription Type",
                      accessor: "type",
                      filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["type"] }),
                      filterAll: true
                    },
                    {
                      Header: "Date Start",
                      accessor: "date_start",
                      filterable: false
                    },
                    {
                      Header: "Expiration Date",
                      accessor: "date_end",
                      filterable: false
                    },
                    {
                      Header: "Amount",
                      accessor: "amount",
                      filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["amount"] }),
                      filterAll: true
                    },
                    {
                      Header: "Free Drinks",
                      accessor: "freeDrinks",
                      filterable: false

                    },
                    {
                      Header: "Payment Method",
                      accessor: "paymentMethod",
                      filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["paymentMethod"] }),
                      filterAll: true
                    },

                    {
                      Header: "Transaction ID",
                      accessor: "transactionID",
                      filterable: false
                    }
                  ]
                }
              ]}
              defaultPageSize={10}
              className="-striped -highlight"
            />

          </div>
          </div>
      );
  }

}




UserSubscription.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserSubscription);
