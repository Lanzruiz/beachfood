/**
 * Created by Thomas Woodfin on 12/13/2017.
 */
 import React from 'react'
import matchSorter from 'match-sorter'
 import classNames from 'classnames';
 import PropTypes from 'prop-types';
 import { withStyles } from 'material-ui/styles';
 import { contactusRef } from '../../FB'
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


class ContactUs extends React.Component {

  constructor(props){
      super(props)
      this.state = {
          loadingData: false,
          ContactUsData: []
      }
  }

  componentDidMount(){
      var _ths = this;

     let theContactUsData = [];

      contactusRef.once('value', function(snapshot) {

          var totalCount = snapshot.numChildren();
          var counter = 0;


          snapshot.forEach(function(subscriptionItem) {
            let contactData = subscriptionItem.val();
             theContactUsData.push({key: contactData.key, name: contactData.name, email: contactData.email, subject: contactData.description, message: contactData.message})
             counter = counter + 1;
          });


          if (totalCount == counter) {
            _ths.setState({
                ContactUsData: theContactUsData,
                loadingData: true
            })
          }

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
          data={this.state.ContactUsData}
          filterable
          columns={[
            {
              Header: "Contact Us",
              columns: [
                {
                  Header: "Name",
                  accessor: "name",
                  filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["name"] }),
                  filterAll: true
                },
                {
                  Header: "Email",
                  accessor: "email",
                  filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["email"] }),
                  filterAll: true
                },
                {
                  Header: "Subject",
                  accessor: "subject",
                  filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["subject"] }),
                  filterAll: true
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

                <div style={divStyle}>{row.original.message}</div>

              );
          }}
        />

      </div>

      </div>

    );

  }



}


ContactUs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContactUs);
