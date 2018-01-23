/**
 * Created by Thomas Woodfin on 12/21/2017.
 */
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
import OpenIcon from 'material-ui-icons/Visibility';
import Background from '../../admin/images/clubs.jpg';
import { clubssref, clubStoreref,firebaseAuth, Storageref } from '../../FB'
import stylesm from '../../App.css'
import swal from 'sweetalert';
import { saveClubOwner, updateClubOwner } from '../../helpers/clubs'
import {
    Link
} from 'react-router-dom'
import matchSorter from 'match-sorter'
import Avatar from 'material-ui/Avatar';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import ImageLoader from '../../admin/ImageLoader'
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
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 0,
        borderWidth: 2,
        borderColor: '#000'
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

class AllClubs extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            open: false,
            loadingData: false,
            isSingle: false,
            isSingleID: '',
            clubData: [],
            clubName: '',
            address: '',
            clubDesc: '',
            clubimage: '',
            icon: '',
            phone: '',
            lat: '',
            lng: '',
            city: '',
            zip: '',
            clubstate: '',
            ownerID: '',
            isloading: false,
            issuccess: false,
            isPlaceChanged: false,
            uploadProgress: 0,
            clubImgpreview: false,
            clubImg: '',
            clubImgName: '',
            clubImgtype: '',
            prevImg: '',
            ifImgChanged: true,
            openClubName: '',
            openClubDesc: '',
            openclubImgpreview: false,
            openClubimage:'',
            openClubstate:'',
            openAddress:''
        }

        var _ths = this;
        firebaseAuth.onAuthStateChanged(function(user) {
            if (user) {
                _ths.loadClubData();
            } else {
                // No user is signed in.
                console.log('There is no logged in user');
            }
        });
    }

    componentDidMount(){
        var _ths = this;
        document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
        document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";

        _ths.geoLocation();
        _ths.theGoolgePlaces()

    }

    geoLocation() {
      var _ths = this;
      geolocation.getCurrentPosition(function (err, position) {
          if (err) throw err
          //console.log();

          geocoder.reverseGeocode( position.coords.latitude, position.coords.longitude, function ( err, data ) {
             //console.log(data.results[0].formatted_address);
             //console.log(data);
              _ths.setState({address: data.results[0].formatted_address})
          });

        })
    }

    loadClubData() {
      var _ths = this;
      var userID = firebaseAuth.currentUser.uid;
      _ths.setState({
         ownerID: userID
      });

      clubssref.orderByChild('ownerID').equalTo(userID).once('value', function (snapshot) {
      //clubssref.on('value', function(snapshot) {
          let theclubData = [];
          _ths.setState({
              loadingData: true
          })
          snapshot.forEach(function(eventItem) {
              var childKey = eventItem.key;
              var childData = eventItem.val();
              childData['key'] = childKey;
              if (!childData.info){
                  theclubData.push(childData)
              }
          });
          _ths.setState({
              clubData: theclubData,
              loadingData: false
          })
      });
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                clubImg: file,
                clubImgName: file.name,
                clubImgtype: file.type,
                clubImgpreview: reader.result,
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
                    clubimage: pImg ? pImg : '',
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
                    clubimage: pImg ? pImg : '',
                    phone: place.international_phone_number,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    isPlaceChanged: false
                })
            }


            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] === "postal_code") {
                        _ths.setState({
                            zip: place.address_components[i].long_name
                        })
                    }
                    if (place.address_components[i].types[j] === "administrative_area_level_1") {
                        _ths.setState({
                            clubstate: place.address_components[i].long_name
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

    savetheClub(){

        var _ths = this;
        if (this.state.clubName !== ''){
            _ths.setState({
                isloading: true,
            })

            //var imageName = `${this.makeid()}.png`;
             var imageName = "";
              if (this.state.clubImg !== ''){
                var filenamearr = this.state.clubImgName.split('.');
                var theFileid = this.makeid();
                imageName = theFileid+'.'+filenamearr[1];
              } else {
                imageName = "";
              }


            //console.log(this.state.dimage);

            setTimeout(() => {
                saveClubOwner({
                    address : this.state.address,
                    city : this.state.city,
                    description : this.state.clubDesc,
                    image : imageName,
                    lat : this.state.lat,
                    lng : this.state.lng,
                    name : this.state.clubName,
                    clubstate : this.state.clubstate,
                    clzip : this.state.zip,
                    ownerID: this.state.ownerID
                }).then((club) => {
                  if (this.state.clubImg !== ''){
                      var uploadTask = Storageref.child('club_image/'+theFileid+'.'+filenamearr[1]).put(this.state.clubImg);

                      uploadTask.on('state_changed', function(snapshot){
                          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                          if (progress === 100){
                              _ths.setState({
                                  isloading: false,
                                  isclubAdded: true,
                                  issuccess: true
                              })

                                  _ths.setState({
                                    open: false,
                                    loadingData: false,
                                    isSingle: false,
                                    isSingleID: '',
                                    clubData: [],
                                    clubName: '',
                                    address: '',
                                    clubDesc: '',
                                    clubimage: '',
                                    icon: '',
                                    phone: '',
                                    lat: '',
                                    lng: '',
                                    city: '',
                                    zip: '',
                                    clubstate: '',
                                    ownerID: '',
                                    isloading: false,
                                    isPlaceChanged: false,
                                    uploadProgress: 0,
                                    clubImgpreview: false,
                                    clubImg: '',
                                    clubImgName: '',
                                    clubImgtype: '',
                                    clubImgpreview: '',
                                    ifImgChanged: true
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

    editClub(key){
        var _ths = this;

        _ths.setState({
            isSingleID: key,
            isSingle: true
        })

        var thref = clubssref.child(key);

        thref.on('value', (snap) => {
            snap.forEach((club) => {
              var childKey = club.key;
              var childData = club.val();

                _ths.setState({ [club.key]: club.val() });
                if (club.key === 'name' ){
                    _ths.setState({
                        clubName: club.val()
                    });
                }
                if (club.key === 'description' ){
                    _ths.setState({
                        clubDesc: club.val()
                    });
                }
                if (club.key === 'image' ){
                    // _ths.setState({
                    //     clubimage: club.val()
                    // });

                    Storageref.child('club_image/'+childData).getDownloadURL().then(function(url) {
                        _ths.setState({
                            clubImgpreview: url
                        })
                    }).catch((err) => {
                        _ths.setState({
                            clubImgpreview: ''
                        })
                    })
                }

                if (club.key === 'state' ){
                    _ths.setState({
                        clubstate: club.val()
                    });
                }

            })
        })
    }


    updatetheClub(){

        var _ths = this;
        if (this.state.clubName !== ''){
            _ths.setState({
                isloading: true,
            })

            //var imageName = _ths.state.isPlaceChanged ? `${this.makeid()}.png` : _ths.state.clubimage;

            //console.log(this.state.dimage);
            var imageName = "";
             if (this.state.clubImg !== ''){
               var filenamearr = this.state.clubImgName.split('.');
               var theFileid = this.makeid();
               imageName = theFileid+'.'+filenamearr[1];
             } else {
               imageName = "";
             }


            updateClubOwner({
                thkey: this.state.isSingleID,
                address : this.state.address,
                city : this.state.city,
                description : this.state.clubDesc,
                image : imageName,
                lat : this.state.lat,
                lng : this.state.lng,
                name : this.state.clubName,
                clubstate : this.state.clubstate,
                clzip : this.state.zip
            }).then((club) => {

              if (this.state.clubImg !== ''){
                  var uploadTask = Storageref.child('club_image/'+theFileid+'.'+filenamearr[1]).put(this.state.clubImg);

                  uploadTask.on('state_changed', function(snapshot){
                      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                      if (progress === 100){
                          _ths.setState({
                              isloading: false,
                              isclubAdded: true,
                              issuccess: true
                          })
                          setTimeout(() => {
                              _ths.editClub(_ths.state.isSingleID);


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
                    isclubAdded: true,
                    issuccess: true
                })
              }

            })
        }
    }

    cancelEdit(){
        this.setState({
            isSingle: false,
            isSingleID: '',
            clubName: '',
            address: '',
            clubDesc: '',
            clubimage: '',
            icon: '',
            phone: '',
            lat: '',
            lng: '',
            city: '',
            zip: '',
            clubstate: '',
            isPlaceChanged: false,
            isloading: false,
            issuccess: false,
            clubImgpreview: ''
        })
    }


    openDetails(key) {
        this.setState({open_display: true})

        var _ths = this;


        var thref = clubssref.child(key);

        thref.on('value', (snap) => {
            snap.forEach((club) => {
              var childKey = club.key;
              var childData = club.val();

                _ths.setState({ [club.key]: club.val() });
                if (club.key === 'name' ){
                    _ths.setState({
                        openClubName: club.val()
                    });
                }
                if (club.key === 'description' ){
                    _ths.setState({
                        openClubDesc: club.val()
                    });
                }
                if (club.key === 'address' ){
                    _ths.setState({
                        openAddress: club.val()
                    });
                }
                if (club.key === 'image' ){
                    Storageref.child('club_image/'+childData).getDownloadURL().then(function(url) {
                        _ths.setState({
                            openclubImgpreview: url
                        })
                    }).catch((err) => {
                        _ths.setState({
                            openclubImgpreview: ''
                        })
                    })
                }
                if (club.key === 'state' ){
                    _ths.setState({
                        openClubstate: club.val()
                    });
                }

                _ths.setState({address: ''})

            })
        })
    }

    handleRequestClose() {
      this.setState({open_display: false, openclubImgpreview: ''})
    }

    askDeleteConfirm(key) {
        var _ths = this;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this club!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                clubssref.child(key).remove();
            }
            _ths.loadClubData();
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
          swal ( "Success" ,  "Club successfully saved!" ,  "success" );
            var _ths = this;
            _ths.setState({
                issuccess: false
            })
            this.loadClubData();
        }

        return (
            <div className="App">

            {  /**********display club***************/ }
              <Dialog
                  open={this.state.open_display}
                  transition={Transition}
                  keepMounted
                  onRequestClose={this.handleRequestClose}>
                  <DialogTitle>Club Information</DialogTitle>
                  <DialogContent>
                      <Grid container>
                          <Grid container>
                              <Grid item xs={12} lg={6}>
                                    <p style={{fontSize:12, color:'#999'}}>Name</p>
                                    <p style={{color: '#000'}}>{this.state.openClubName}</p>
                              </Grid>
                              <Grid item xs={12} lg={6}>

                                  <p style={{fontSize:12, color:'#999'}}>Description</p>
                                  <p style={{color: '#000'}}>{this.state.openClubDesc}</p>

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
                                       (this.state.openclubImgpreview && this.state.openclubImgpreview !== '') ?
                                       <ImageLoader
                                           src={this.state.openclubImgpreview}
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
              { /***********end display clubs**********/ }

                <Grid container spacing={24}>

                    <Grid item xs={12} lg={8}>

                        <Grid container>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth className={stylesm.theFromControl}>
                                    <InputLabel htmlFor="clubName">Club Name</InputLabel>
                                    <Input
                                        id="clubName"
                                        value={this.state.clubName}
                                        onChange={this.handleChange('clubName')}
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
                                    id="clubDesc"
                                    label="Club Description"
                                    multiline
                                    rows="4"
                                    value={this.state.clubDesc}
                                    onChange={this.handleChange('clubDesc')}
                                    margin="normal"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                            <FormControl fullWidth className={stylesm.theFromControl}>
                                <InputLabel htmlFor="clubImg">Club Image</InputLabel>
                                <TextField
                                    id="clubImg"
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
                                }} src={this.state.clubImgpreview}/>
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
                                                this.updatetheClub()
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
                                            this.savetheClub()
                                        }}>
                                    {
                                        this.state.isloading ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                            this.state.issuccess ? <CheckIcon  className={classes.leftIcon}/> :
                                                <Save className={classes.leftIcon} />
                                    }
                                    {
                                        this.state.issuccess ? 'Club Added' : 'Add Club'
                                    }
                                </Button>
                            </Grid>

                    }


                    <Grid item xs={12}>

                            <LinearProgress mode="determinate" value={this.state.uploadProgress} />

                            <ReactTable
                              filterable
                              data={this.state.clubData}
                              columns={[
                                {
                                  Header: "Club Information",
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
                                        <IconButton aria-label="Open"
                                                    onClick={() => {
                                                        this.openDetails(row.value)
                                                    }}>
                                            <OpenIcon />
                                        </IconButton>

                                              <IconButton aria-label="Edit"
                                                  onClick={() => {
                                                      this.editClub(row.value)
                                                  }}>
                                                  <EditIcon />
                                              </IconButton>

                                            <IconButton aria-label="Delete"
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

AllClubs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllClubs);
