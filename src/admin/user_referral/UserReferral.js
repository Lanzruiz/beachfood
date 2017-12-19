/**
 * Created by Thomas Woodfin on 12/15/2017.
 */
 import React from 'react'
 import matchSorter from 'match-sorter'
 import classNames from 'classnames';
 import PropTypes from 'prop-types';
 import { withStyles } from 'material-ui/styles';
 import { userReferralRef, usersref } from '../../FB'
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


class UserReferral extends React.Component {

  constructor(props){
      super(props)
      this.state = {
          loadingData: false,
          userReferralData: []
      }
  }

  componentDidMount(){
      var _ths = this;

     let theUserReferralData = [];

      userReferralRef.once('value', function(snapshot) {



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
               var referralDetailsData = [];
               var detailsCounter = 0;
               subscriptionItem.forEach(function (referralDetails) {

                 let date = dateFormat(referralDetails.val().date, "mmm dd, yyyy");

                 usersref.orderByChild('userid').equalTo(referralDetails.val().userid).once('child_added', function (snapshot) {
                     referralDetailsData.push({key: referralDetails.key, date: date, name: snapshot.val().firstname + ' ' + snapshot.val().lastname});
                 });






               });

               //console.log(referralDetailsData);
               counter = counter + 1;
               usersref.orderByChild('userid').equalTo(subscriptionItem.key).once('child_added', function (snapshot) {
                   //console.log(snapshot.val());
                   theUserReferralData.push({key: snapshot.key, firstname: snapshot.val().firstname, lastname: snapshot.val().lastname,
                                         email: snapshot.val().email, referralCount: subscriptionItem.numChildren(), details: referralDetailsData});



                  if (totalCount == counter) {

                    _ths.setState({
                        userReferralData: theUserReferralData,
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
          data={this.state.userReferralData}
          filterable
          columns={[
            {
              Header: "User Referral",
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
                  Header: "Referral Count",
                  accessor: "referralCount",
                  filterable: false
                },
              ]
            }
          ]}
          defaultPageSize={15}
          className="-striped -highlight"
          SubComponent = {row =>  {
            
              return (
                <div style={{padding: "20px"}}>
                <ReactTable
                  data={row.original.details}
                  columns={
                    [
                      {
                        Header: "Referral Details",
                        columns: [
                          {
                            Header: "Name",
                            accessor: "name"
                          },
                          {
                            Header: "Date",
                            accessor: "date"
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


UserReferral.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserReferral);
