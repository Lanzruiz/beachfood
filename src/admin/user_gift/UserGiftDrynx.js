/**
 * Created by Thomas Woodfin on 12/13/2017.
 */
 import React from 'react'
  import matchSorter from 'match-sorter'
 import classNames from 'classnames';
 import PropTypes from 'prop-types';
 import { withStyles } from 'material-ui/styles';
 import { userGiftRef, usersref } from '../../FB'
 import { updateUsers } from '../../helpers/users'
 import stylesm from '../../App.css'
 import swal from 'sweetalert';
 import ReactTable from "react-table";
 import "react-table/react-table.css";

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


class UserGiftDrynx extends React.Component {

  constructor(props){
      super(props)
      this.state = {
          loadingData: false,
          userGiftData: []
      }
  }

  componentDidMount(){
      var _ths = this;

     let theUserGiftData = [];

      userGiftRef.once('value', function(snapshot) {



          var totalCount = snapshot.numChildren();
          var counter = 0;

          if(totalCount == 0) {
            _ths.setState({
                loadingData: true
            })
          }

          snapshot.forEach(function(subscriptionItem) {
               //console.log(subscriptionItem.key);
               ///console.log(subscriptionItem.numChildren());
               var drinksDetailsData = [];
               var detailsCounter = 0;
               subscriptionItem.forEach(function (drinkDetails) {

                  drinksDetailsData.push({key: drinkDetails.key, name: drinkDetails.val().firstname + " " + drinkDetails.val().lastname,
                                          type: drinkDetails.val().order_type, amount: "$"+drinkDetails.val().amount.toFixed(2),
                                          payment_method: drinkDetails.val().paymentMethod, transactionID: drinkDetails.val().transactionID,
                                          email: drinkDetails.val().email, date: drinkDetails.val().date});




               });

               usersref.orderByChild('userid').equalTo(subscriptionItem.key).once('child_added', function (snapshot) {
                   //console.log(snapshot.val());
                   theUserGiftData.push({key: snapshot.key, firstname: snapshot.val().firstname, lastname: snapshot.val().lastname,
                                         email: snapshot.val().email, giftCount: subscriptionItem.numChildren(), details: drinksDetailsData});

                   counter = counter + 1;

                  if (totalCount == counter) {
                     console.log(theUserGiftData);
                    _ths.setState({
                        userGiftData: theUserGiftData,
                        loadingData: true
                    })
                  }
               });



          });

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
          data={this.state.userGiftData}
          filterable
          columns={[
            {
              Header: "Drynx Gift",
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
                  accessor: d => d.lastname,
                  filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["lastName"] }),
                  filterAll: true
                },
                {
                  Header: "Email Address",
                  accessor: "email",
                  filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["email"] }),
                  filterAll: true
                },
                {
                  Header: "Gift Drynx Count",
                  accessor: "giftCount",
                  filterable: false
                },
              ]
            }
          ]}
          defaultPageSize={15}
          className="-striped -highlight"
          SubComponent = {row =>  {
             console.log(row.original);
              return (
                <div style={{padding: "20px"}}>
                <ReactTable
                  data={row.original.details}
                  columns={
                    [
                      {
                        Header: "Gift Details",
                        columns: [
                          {
                            Header: "To",
                            accessor: "name"
                          },
                          {
                            Header: "Email",
                            accessor: "email"
                          },
                          {
                            Header: "Type",
                            accessor: "type"
                          },
                          {
                            Header: "Amount",
                            accessor: "amount"
                          },
                          {
                            Header: "Payment Method",
                            accessor: "payment_method"
                          },
                          {
                            Header: "Transaction ID",
                            accessor: "transactionID"
                          }
                        ]
                      }]
                  }
                  defaultPageSize={row.original.details.length}
                  showPagination={false}

                />

                </div>

              );
          }}
        />

      </div>

      </div>

    );

  }



}


UserGiftDrynx.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserGiftDrynx);
