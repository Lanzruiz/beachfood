import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { clubOwnerRef, firebaseAuth } from '../FB'
import Background from '../admin/images/clubimagelogin.jpg';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 30,
    },
    paper: {
        padding: 16,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});


class Dashboard extends React.Component {
  constructor(props){
      super(props)
      this.state = {
          firstname: '',
          lastname: ''

      }

      var _ths = this;
      firebaseAuth.onAuthStateChanged(function(user) {
          if (user) {
              _ths.loadSettingsData();
          } else {
              // No user is signed in.
              console.log('There is no logged in user');
          }
      });
  }

  loadSettingsData() {
    var _ths = this;
    //console.log(firebaseAuth.currentUser);
    var user = firebaseAuth.currentUser;

    var userID = user.uid;

    clubOwnerRef.orderByChild('userid').equalTo(userID).once('child_added', function (snapshot) {
    //usersref.child(userID).once('value', function(snapshot) {
        let userRec = snapshot.val();

        _ths.setState({
           firstname: userRec.firstname,
           lastname: userRec.lastname
        })
    });
  }

  componentDidMount(){

     document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
     document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";

  }





  render() {
    return(
        <p style={{padding: 15}}>Welcome {this.state.firstname}, </p>
    );
  }





}



Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
