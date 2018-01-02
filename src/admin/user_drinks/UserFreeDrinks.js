/**
 * Created by Thomas Woodfin on 12/13/2017.
 */
 import React from 'react'
  import matchSorter from 'match-sorter'
 import classNames from 'classnames';
 import PropTypes from 'prop-types';
 import { withStyles } from 'material-ui/styles';
 import { userDrinksRef, usersref, clubssref, drinksref } from '../../FB'
 import { updateUsers } from '../../helpers/users'
 import stylesm from '../../App.css'
 import swal from 'sweetalert';
 import ReactTable from "react-table";
  import Background from '../images/drrinks.jpg';
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


class UserGiftDrynx extends React.Component {

  constructor(props){
      super(props)
      this.state = {
          loadingData: false,
          userDrinkData: []
      }
  }

  componentDidMount(){
      var _ths = this;

      document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
      document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";
      
     let theUserDrinkData = [];

      userDrinksRef.once('value', function(snapshot) {

          var totalCount = snapshot.numChildren();
          var counter = 0;

          if(totalCount == 0) {
            _ths.setState({
                loadingData: true
            })
          }

          snapshot.forEach(function(subscriptionItem) {
              var totalSavings = 0;
               //console.log(subscriptionItem.val());
               ///console.log(subscriptionItem.numChildren());
               var drinksDetailsData = [];
               //var detailsCounter = 0;
               subscriptionItem.forEach(function (drinkDetails) {
                  //console.log(drinkDetails.val());
                  var clubID = drinkDetails.val().club_id;
                  var drinkID = drinkDetails.val().drink_id;
                  var date = dateFormat(drinkDetails.val().date, "mmm dd, yyyy hh:MM:ss");

                  //get clubname
                  var clubName = "";
                  var price = "";
                  var drinkName = "";
                  clubssref.child(clubID).once('value', function(clubDetails) {
                      //console.log(clubDetails.val());
                      if (clubDetails.exists()) {
                          clubName = clubDetails.val().name;
                      }

                  });

                  //get drinks name and price
                  drinksref.child(clubID).child(drinkID).once('value', function(drinkDetails) {

                    if(drinkDetails.exists()) {
                      price = drinkDetails.val().price;
                      drinkName = drinkDetails.val().name;

                      totalSavings = totalSavings + price;
                      //console.log(totalSavings);

                      drinksDetailsData.push({key: drinkDetails.key, club_name: clubName, drink_name: drinkName, amount: "$"+price, date: date})

                    }

                  });



               });
              counter = counter + 1;
               usersref.orderByChild('userid').equalTo(subscriptionItem.key).once('child_added', function (snapshot) {
                   //console.log(snapshot.val());
                   theUserDrinkData.push({key: snapshot.key, firstname: snapshot.val().firstname, lastname: snapshot.val().lastname,
                                         email: snapshot.val().email, drinkCount: subscriptionItem.numChildren(), totalSavings: "$"+(totalSavings.toFixed(2)).toString(), details: drinksDetailsData});


                  if (totalCount == counter) {

                    _ths.setState({
                        userDrinkData: theUserDrinkData,
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
          data={this.state.userDrinkData}
          filterable
          columns={[
            {
              Header: "User Information",
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
                  Header: "Free Drinks Consumed",
                  accessor: "drinkCount",
                  filterable: false
                },
                {
                  Header: "Total Savings",
                  accessor: "totalSavings",
                  filterable: false
                }
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
                        Header: "Free Drink Details",
                        columns: [
                          {
                            Header: "Club name",
                            accessor: "club_name"
                          },
                          {
                            Header: "Drink Name",
                            accessor: "drink_name"
                          },
                          {
                            Header: "Date",
                            accessor: "date"
                          },
                          {
                            Header: "Amount",
                            accessor: "amount"
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
