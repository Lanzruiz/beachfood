/**
 * Created by Thomas Woodfin on 12/13/2017.
 */
 import React from 'react'
 import classNames from 'classnames';
 import PropTypes from 'prop-types';
 import { withStyles } from 'material-ui/styles';
 import { pagesRef } from '../../FB'
 import { updateUsers } from '../../helpers/users'
 import stylesm from '../../App.css'
 import swal from 'sweetalert';
 import EditIcon from 'material-ui-icons/Edit';
 import ReactTable from "react-table";
  import Background from '../images/login.jpg';
 import "react-table/react-table.css";
 import {
     Link
 } from 'react-router-dom'

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


class Pages extends React.Component {

  constructor(props){
      super(props)
      this.state = {
          loadingData: false,
          PagesData: []
      }
  }



  componentDidMount(){
      var _ths = this;
      document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
      document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";
      
     let thePagesData = [];

      pagesRef.once('value', function(snapshot) {

          var totalCount = snapshot.numChildren();
          var counter = 0;


          snapshot.forEach(function(subscriptionItem) {
            let pagesRec = subscriptionItem.val();
            console.log(pagesRec);
             thePagesData.push({key: subscriptionItem.key, description: pagesRec.description})
             counter = counter + 1;
          });


          if (totalCount == counter) {
            _ths.setState({
                PagesData: thePagesData,
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


        <ReactTable
          data={this.state.PagesData}
          columns={[
            {
              Header: "Pages",
              columns: [
                {
                  Header: "Title",
                  accessor: "key"
                },{
                  Header: "Action",
                  accessor: "key",
                  Cell: row => (
                    <div>
                        <Link to={`/pages/edit/`+row.value} style={{color: '#757575'}} aria-label="Edit">
                            <EditIcon />
                        </Link>

                    </div>
                  )
                }
              ]
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
          SubComponent = {row =>  {
            var divStyle = {
                background: "#eee",
                padding: "20px",
                margin: "20px"
              };
              return (

                <div style={divStyle}>{row.original.description}</div>

              );
          }}
        />

      </div>



    );

  }



}


Pages.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Pages);
