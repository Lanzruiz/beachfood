import React from 'react';
import ReactTable from "react-table";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, {
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import Slide from 'material-ui/transitions/Slide';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Save from 'material-ui-icons/Save';
import CheckIcon from 'material-ui-icons/Check';
import EditIcon from 'material-ui-icons/Edit';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import { LinearProgress } from 'material-ui/Progress';

import { CircularProgress } from 'material-ui/Progress';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';

import { restaurantRef, retaurantStoreref, firebaseAuth, Storageref, geoFireRef } from '../../FB'
import stylesm from '../../App.css'
import swal from 'sweetalert';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import ImageLoader from '../ImageLoader'
import OpenIcon from 'material-ui-icons/Visibility';
import { saveRestaurant, updateRestaurant } from '../../helpers/restaurant'
import {
    Link
} from 'react-router-dom'
import matchSorter from 'match-sorter'
import Avatar from 'material-ui/Avatar';
//import Background from '../images/clubs.jpg';
var geolocation = require('geolocation');
var geocoder = require('geocoder');


var i2b = require("imageurl-base64");
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
        float: 'right'
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 0,
        borderWidth: 2,
        borderColor: '#000'
    },
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    buttonProgress: {
        color: '#FAFAFA',
    },
    buttonSuccess: {
        backgroundColor: '#3ebd08',
        '&:hover': {
            backgroundColor: '#41bc08',
        }
    },
});

class Restaurant extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            open: false,
            loadingData: false,
            isSingle: false,
            isSingleID: '',
            restaurantbData: [],
            restaurantName: '',
            address: '',
            restaurantDesc: '',
            restaurantimage: '',
            icon: '',
            phone: '',
            lat: '',
            lng: '',
            city: '',
            zip: '',
            restaurantstate: '',
            isloading: false,
            issuccess: false,
            isPlaceChanged: false,
            uploadProgress: 0,
            restaurantImgpreview: false,
            restaurantImg: '',
            restaurantImgName: '',
            restaurantImgtype: '',
            prevImg: '',
            open_display: false,
            ifImgChanged: true,
            openrestaurantName: '',
            openrestaurantDesc: '',
            openrestaurantImgpreview: false,
            openrestaurantimage:'',
            openrestaurantstate:'',
            openAddress:''
        }
    }

    componentDidMount(){
        var _ths = this;
        //document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
        //document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";
        console.log("componentDidMount");
        _ths.geoLocation();
        _ths.theGoolgePlaces();
        _ths.loadRestaurantData();

    }


    geoLocation() {
      var _ths = this;

      geolocation.getCurrentPosition(function (err, position) {
          if (err) throw err
          //console.log();
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
          geocoder.reverseGeocode( position.coords.latitude, position.coords.longitude, function ( err, data ) {
             //console.log(data.results[0].formatted_address);
             //console.log(data);
              //if (typeof data !== 'undefined') {
               if (data.results[0] != null) {
                _ths.setState({address: data.results[0].formatted_address, lat: position.coords.latitude, lng: position.coords.longitude})
              }
          });

        })
    }

    loadRestaurantData() {
      var _ths = this;
      console.log("Loading data...");
      restaurantRef.on('value', function(snapshot) {
          let therestaurantData = [];
          _ths.setState({
              loadingData: true
          })

          snapshot.forEach(function(eventItem) {
              var childKey = eventItem.key;
              var childData = eventItem.val();
              childData['key'] = childKey;
              if (!childData.info){
                  therestaurantData.push(childData)
              }
          });
          _ths.setState({
              restaurantData: therestaurantData,
              loadingData: false
          })
      }).bind(this);
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                restaurantImg: file,
                restaurantImgName: file.name,
                restaurantImgtype: file.type,
                restaurantImgpreview: reader.result,
                ifImgChanged: true
            });
        }

        reader.readAsDataURL(file)
    }

    theGoolgePlaces(){
        var _ths = this;
        var element = document.querySelector('#address');
        //var mapcontent = document.querySelector('#map');

        var autocomplete = new window.google.maps.places.Autocomplete(element);
        return autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();

            if (place.photos){
                var pImg = place.photos[0].getUrl({
                    'maxWidth': 1600
                });
                _ths.setState({
                    address: place.formatted_address,
                    icon: place.icon,
                    restaurantimage: pImg ? pImg : '',
                    phone: place.international_phone_number,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    isPlaceChanged: true
                })
            }
            else {
                _ths.setState({
                    address: place.formatted_address,
                    icon: place.icon,
                    restaurantimage: pImg ? pImg : '',
                    phone: place.international_phone_number,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    isPlaceChanged: false
                })
            }


            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                  console.log(place.address_components[i].types[j]);
                  console.log(place.address_components[i].long_name);
                    if (place.address_components[i].types[j] === "postal_code") {
                        _ths.setState({
                            zip: place.address_components[i].long_name
                        })
                    }
                    if (place.address_components[i].types[j] === "administrative_area_level_1") {
                        _ths.setState({
                            restaurantstate: place.address_components[i].long_name
                        })
                    }
                    if (place.address_components[i].types[j] === "locality") {
                        _ths.setState({
                            city: place.address_components[i].long_name
                        })
                    }

                }
            }
        })
    }

    savetheRestaurant(){

        var _ths = this;
        if (this.state.restaurantName !== ''){
            _ths.setState({
                isloading: true,
            })

            //var imageName = `${this.makeid()}.png`;
            var imageName = "";
             if (this.state.restaurantImg !== ''){
               var filenamearr = this.state.restaurantImgName.split('.');
               var theFileid = this.makeid();
               imageName = theFileid+'.'+filenamearr[1];
             } else {
               imageName = "";
             }

            //console.log(this.state.dimage);
            var lat = this.state.lat;
            var lng = this.state.lng;

            console.log("lat:"+lat);
            console.log("lng:"+lng);

            setTimeout(() => {
                saveRestaurant({
                    address : this.state.address,
                    city : this.state.city,
                    description : this.state.restaurantDesc,
                    image : imageName,
                    lat : this.state.lat,
                    lng : this.state.lng,
                    name : this.state.restaurantName,
                    restaurantstate : this.state.restaurantstate,
                    clzip : this.state.zip
                }).then((restaurant) => {
                  //save the location to geoFire
                  var restaurantname = restaurant.name;

                  restaurantRef.orderByChild('name').equalTo(restaurantname).once('child_added', function (snapshot) {
                      var restaurantkey = snapshot.key;
                      geoFireRef.set(restaurantkey, [lat, lng]).then(function() {
                         console.log("geofire was successfully added");
                      });
                  });



                  if (this.state.restaurantImg !== ''){
                      var uploadTask = Storageref.child('restaurant_image/'+theFileid+'.'+filenamearr[1]).put(this.state.restaurantImg);

                      uploadTask.on('state_changed', function(snapshot){
                          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                          if (progress === 100){
                              _ths.setState({
                                  isloading: false,
                                  isrestaurantAdded: true,
                                  issuccess: true
                              })


                          }

                          console.log(snapshot.state);
                      }, function(error) {
                          console.log('Filed');
                      }, function() {
                          var downloadURL = uploadTask.snapshot.downloadURL;
                          console.log(downloadURL);
                      });
                  }

                })

            }, 1000)
        }
    }

    toDataURL(url) {
        var _ths = this;

        return new Promise((resolve, reject) => {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                var dataURL;
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL("image/png");
                resolve(dataURL)
                reject('error')
                canvas = null;
            };
            img.src = url;
        })
    }

    b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    editRestaurant(key){
        window.location.hash = '';
        var _ths = this;

        _ths.setState({
            isSingleID: key,
            isSingle: true
        })

        var thref = restaurantRef.child(key);

        thref.on('value', (snap) => {
            snap.forEach((restaurant) => {
              var childKey = restaurant.key;
              var childData = restaurant.val();

                _ths.setState({ [restaurant.key]: restaurant.val() });
                if (restaurant.key === 'name' ){
                    _ths.setState({
                        restaurantName: restaurant.val()
                    });
                }
                if (restaurant.key === 'description' ){
                    _ths.setState({
                        restaurantDesc: restaurant.val()
                    });
                }
                if (restaurant.key === 'image' ){
                    Storageref.child('restaurant_image/'+childData).getDownloadURL().then(function(url) {
                        _ths.setState({
                            restaurantImgpreview: url
                        })
                    }).catch((err) => {
                        _ths.setState({
                            restaurantImgpreview: ''
                        })
                    })
                }
                if (restaurant.key === 'state' ){
                    _ths.setState({
                        restaurantstate: restaurant.val()
                    });
                }


                //ReactDOM.findDOMNode(_ths).scrollIntoView();
            })
        })

        //window.scrollTo(0, 0);
        //document.querySelector('#edit').scrollTop = 0;
        window.location.hash = '#edit';
    }

    openDetails(key) {
        this.setState({open_display: true})

        var _ths = this;


        var thref = restaurantRef.child(key);

        thref.on('value', (snap) => {
            snap.forEach((restaurant) => {
              var childKey = restaurant.key;
              var childData = restaurant.val();

                _ths.setState({ [restaurant.key]: restaurant.val() });
                if (restaurant.key === 'name' ){
                    _ths.setState({
                        openrestaurantName: restaurant.val()
                    });
                }
                if (restaurant.key === 'description' ){
                    _ths.setState({
                        openrestaurantDesc: restaurant.val()
                    });
                }
                if (restaurant.key === 'address' ){
                    _ths.setState({
                        openAddress: restaurant.val()
                    });
                }
                if (restaurant.key === 'image' ){
                    Storageref.child('restaurant_image/'+childData).getDownloadURL().then(function(url) {
                        _ths.setState({
                            openrestaurantImgpreview: url
                        })
                    }).catch((err) => {
                        _ths.setState({
                            openrestaurantImgpreview: ''
                        })
                    })
                }
                if (restaurant.key === 'state' ){
                    _ths.setState({
                        openrestaurantstate: restaurant.val()
                    });
                }

                _ths.setState({address: ''})

            })
        })
    }

    handleRequestClose() {
       this.setState({open_display: false, openrestaurantImgpreview:''})
    }


    updatetheRestaurant(){
        window.location.hash = '';
        var _ths = this;
        if (this.state.restaurantName !== ''){
            _ths.setState({
                isloading: true,
            })



            //console.log(this.state.dimage);
            var imageName = "";
             if (this.state.restaurantImg !== ''){
               var filenamearr = this.state.restaurantImgName.split('.');
               var theFileid = this.makeid();
               imageName = theFileid+'.'+filenamearr[1];
             } else {
               imageName = "";
             }


             var restaurantKey = this.state.isSingleID;
             var lat = this.state.lat;
             var lng = this.state.lng;

            updateRestaurant({
                thkey: this.state.isSingleID,
                address : this.state.address,
                city : this.state.city,
                description : this.state.restaurantDesc,
                image : imageName,
                lat : this.state.lat,
                lng : this.state.lng,
                name : this.state.restaurantName,
                restaurantstate : this.state.restaurantstate,
                clzip : this.state.zip
            }).then((restaurant) => {

              var restaurantname = restaurant.name;


                  geoFireRef.set(restaurantKey, [lat, lng]).then(function() {
                     console.log("geofire was successfully added");
                  });


              if (this.state.restaurantImg !== ''){
                  var uploadTask = Storageref.child('restaurant_image/'+theFileid+'.'+filenamearr[1]).put(this.state.restaurantImg);

                  uploadTask.on('state_changed', function(snapshot){
                      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                      if (progress === 100){
                          _ths.setState({
                              isloading: false,
                              isrestaurantAdded: true,
                              issuccess: true
                          })
                          setTimeout(() => {
                              _ths.editRestaurant(_ths.state.isSingleID);


                          }, 3000)
                      }

                      console.log(snapshot.state);
                  }, function(error) {
                      console.log('Filed');
                  }, function() {
                      var downloadURL = uploadTask.snapshot.downloadURL;
                      console.log(downloadURL);
                  });
              } else {
                _ths.setState({
                    isloading: false,
                    isrestaurantAdded: true,
                    issuccess: true
                })
              }


            })
        }
    }

    cancelEdit(){
      window.location.hash = '';
        this.setState({
            isSingle: false,
            isSingleID: '',
            restaurantName: '',
            address: '',
            restaurantDesc: '',
            restaurantimage: '',
            icon: '',
            phone: '',
            lat: '',
            lng: '',
            city: '',
            zip: '',
            restaurantstate: '',
            isPlaceChanged: false,
            isloading: false,
            issuccess: false,
            restaurantImgpreview: ''
        })
    }

    askDeleteConfirm(key) {
        var _ths = this;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this restaurant!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                restaurantRef.child(key).remove();
            }
            _ths.loadRestaurantData();
            _ths.cancelEdit();
        });
    };

    makeid = () => {
        var text = "";
        var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 12; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    handlePlaces = prop => event =>{
        this.setState({ address: event.target.value });
    }

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    render() {
        const { classes } = this.props;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.issuccess,
        });


        if(this.state.issuccess == true) {
          swal ( "Success" ,  "Restaurant successfully saved!" ,  "success" );
            var _ths = this;
            _ths.setState({
                issuccess: false
            })
            this.loadRestaurantData();
            this.cancelEdit();
        }

        return (
            <div className="App">

            {  /**********display restaurant***************/ }
              <Dialog
                  open={this.state.open_display}
                  transition={Transition}
                  keepMounted
                  onRequestClose={this.handleRequestClose}>
                  <DialogTitle>Restuarant Information</DialogTitle>
                  <DialogContent>
                      <Grid container>
                          <Grid container>
                              <Grid item xs={12} lg={6}>
                                    <p style={{fontSize:12, color:'#999'}}>Name</p>
                                    <p style={{color: '#000'}}>{this.state.openrestaurantName}</p>
                              </Grid>
                              <Grid item xs={12} lg={6}>

                                  <p style={{fontSize:12, color:'#999'}}>Description</p>
                                  <p style={{color: '#000'}}>{this.state.openrestaurantDesc}</p>

                              </Grid>
                          </Grid>



                         <Grid container>

                              <Grid item xs={12} lg={6}>
                                  <p style={{fontSize:12, color:'#999'}}>Address</p>
                                  <p style={{color: '#000'}}>{this.state.openAddress}</p>

                              </Grid>

                              <Grid item xs={12} lg={6}>

                              </Grid>

                          </Grid>


                          <Grid container>



                               <Grid item xs={12} lg={12}>
                               <p style={{fontSize:12, color:'#999'}}>Image</p>
                               <FormControl fullWidth className={stylesm.theFromControl} style={{justifyContent: 'center', alignItems: 'center'}}>
                                   {
                                       (this.state.openrestaurantImgpreview && this.state.openrestaurantImgpreview !== '') ?
                                       <ImageLoader
                                           src={this.state.openrestaurantImgpreview}
                                           className={classes.avatar}
                                           placeholder="Loading">
                                           <CircularProgress className={classes.progress} />
                                       </ImageLoader>
                                        : ''

                                   }
                               </FormControl>
                               </Grid>

                           </Grid>

                      </Grid>
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={() => {this.handleRequestClose()}} color="primary">
                          Close
                      </Button>

                  </DialogActions>
              </Dialog>
              { /***********end display restaurant**********/ }

                <Grid container spacing={24} id="edit">

                    <Grid item xs={12} lg={8}>

                        <Grid container>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth className={stylesm.theFromControl}>
                                    <InputLabel htmlFor="restaurantName">Restaurant Name</InputLabel>
                                    <Input
                                        id="restaurantName"
                                        value={this.state.restaurantName}
                                        onChange={this.handleChange('restaurantName')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth className={stylesm.theFromControl}>
                                    <InputLabel htmlFor="address">Place</InputLabel>
                                    <Input
                                        ref={(address) => { this.addr = address; }}
                                        id="address"
                                        value={this.state.address}
                                        onChange={this.handlePlaces('address')}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <TextField
                                    id="restaurantDesc"
                                    label="Restaurant Description"
                                    multiline
                                    rows="4"
                                    value={this.state.restaurantDesc}
                                    onChange={this.handleChange('restaurantDesc')}
                                    margin="normal"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                            <FormControl fullWidth className={stylesm.theFromControl}>

                                <TextField
                                    id="restaurantImg"
                                    onChange={(e)=>this._handleImageChange(e)}
                                    margin="normal"
                                    type="file"
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <Avatar style={{
                                    borderRadius: 0,
                                    width: "100%",
                                    height: "100%"
                                }} src={this.state.restaurantImgpreview}/>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {
                        this.state.isSingle ?
                            <Grid item container xs={12} lg={4}>

                                <Grid item xs={12} lg={6}>
                                    <Button raised
                                            color="primary"
                                            disabled={this.state.isloading}
                                            onClick={() => {
                                                this.updatetheRestaurant()
                                            }}>
                                        {
                                            this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                                this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                                    <Save className={classes.leftIcon} />
                                        }
                                        {
                                            this.state.issuccess ? 'Updated' : 'Update'
                                        }
                                    </Button>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Button raised
                                            color="primary"
                                            onClick={() => {
                                                this.cancelEdit()
                                            }}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid> :
                            <Grid item xs={12} lg={4}>
                                <Button raised
                                        color="primary"
                                        disabled={this.state.isloading}
                                        onClick={() => {
                                            this.savetheRestaurant()
                                        }}>
                                    {
                                        this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                            this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                                <Save className={classes.leftIcon} />
                                    }
                                    {
                                        this.state.issuccess ? 'Restaurant Added' : 'Add Restaurant'
                                    }
                                </Button>
                            </Grid>

                    }


                    <Grid item xs={12}>

                            <LinearProgress mode="determinate" value={this.state.uploadProgress} />

                            <ReactTable
                              filterable
                              data={this.state.restaurantData}
                              columns={[
                                {
                                  Header: "Restaurant Information",
                                  columns: [
                                    {
                                      Header: "Name",
                                      accessor: "name",
                                      filterMethod: (filter, rows) =>
                                            matchSorter(rows, filter.value, { keys: ["name"] }),
                                      filterAll: true
                                    },
                                    {
                                      Header: "City",
                                      accessor: "city",
                                      filterMethod: (filter, rows) =>
                                            matchSorter(rows, filter.value, { keys: ["city"] }),
                                      filterAll: true
                                    },
                                    {
                                      Header: "State",
                                      accessor: "state",
                                      filterMethod: (filter, rows) =>
                                            matchSorter(rows, filter.value, { keys: ["state"] }),
                                      filterAll: true
                                    },
                                    {
                                      Header: "Action",
                                      accessor: "key",
                                      filterable: false,
                                      Cell: row => (
                                        <div>
                                            <IconButton aria-label="Open" style={{color: '#000'}}
                                                        onClick={() => {
                                                            this.openDetails(row.value)
                                                        }}>
                                                <OpenIcon />
                                            </IconButton>

                                              <IconButton aria-label="Edit" style={{color: '#000'}}
                                                  onClick={() => {
                                                      this.editRestaurant(row.value)
                                                  }}>
                                                  <EditIcon />
                                              </IconButton>

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
                              SubComponent = {row =>  {
                                var divStyle = {
                                    background: "#eee",
                                    padding: "20px",
                                    margin: "20px"
                                  };
                                  return (

                                    <div style={divStyle}>
                                      <p>Address: {row.original.address} {row.original.city} {row.original.state} {row.original.zip}</p>
                                      <p>Description: {row.original.description}</p>
                                      </div>

                                  );
                              }}
                            />

                    </Grid>
                </Grid>
            </div>
        );
    }

}

Restaurant.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Restaurant);
