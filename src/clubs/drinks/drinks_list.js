/**
 * Created by Thomas Woodfin on 12/22/2017.
 */
import React from 'react'
import ReactTable from "react-table";
import matchSorter from 'match-sorter'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, {
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
} from 'material-ui/List';
import {
    Link
} from 'react-router-dom'
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
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import { LinearProgress } from 'material-ui/Progress';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import { CircularProgress } from 'material-ui/Progress';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';
import Switch from 'material-ui/Switch';
import { clubssref, drinksref, Storageref, firebaseAuth } from '../../FB'

import swal from 'sweetalert';
import MenuItem from 'material-ui/Menu/MenuItem';
import stylesm from '../../App.css'
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
    buttonProgress: {
        color: '#999',
    },
    buttonSuccess: {
        backgroundColor: '#3ebd08',
        '&:hover': {
            backgroundColor: '#41bc08',
        }
    },
    menu: {
        width: 200,
    },
});

class AllDrinks extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            open: false,
            loadingData: false,
            drinksData: [],
            clubData: [],
            drinksName: '',
            whatsinit: '',
            drinksDesc: '',
            drinksImg: '',
            drinksImgName: '',
            drinksImgtype: '',
            drinksImgpreview: '',
            drinkPrice: '',
            checked: ['isFreeDrink'],
            isFree: true,
            selectedclubid: '',
            isSingle: false,
            isSingleID: '',
            isloading: false,
            issuccess: false,
            isPlaceChanged: false,
            uploadProgress: 0,
            issavingdrinks: false,
            isdrinksAdded: false,
            ownerID: '',
            isEmpty: false,
            isEdit: false,
            drinksKey: ''
        }

        var _ths = this;
        firebaseAuth.onAuthStateChanged(function(user) {
            if (user) {
                _ths.loadDrinksData();
            } else {
                // No user is signed in.
                console.log('There is no logged in user');
            }
        });
    }

    componentDidMount(){



    }


    loadDrinksData() {
      var _ths = this;
      let theclubData = [];

      var userID = firebaseAuth.currentUser.uid;



      _ths.setState({
          loadingData: true,
          ownerID: userID
      })
      //clubssref.on('value', function(snapshot) {
        clubssref.orderByChild('ownerID').equalTo(userID).once('value', function (snapshot) {
          if(snapshot.numChildren() == 0) {
             _ths.setState({
                 isEmpty: true
             });
          } else {
            _ths.setState({
                isEmpty: false
            });
          }
          snapshot.forEach(function(eventItem) {
              var childKey = eventItem.key;
              var childData = eventItem.val();
              childData['key'] = childKey;
              if (!childData.info){
                  theclubData.push(childData)
              }
          });
          _ths.setState({
              clubData: theclubData
          })
      });

      var count = 0;
      var theDrinksData = [];
      //clubssref.once('value', function(snapshot) {
      clubssref.orderByChild('ownerID').equalTo(userID).once('value', function (snapshot) {
          var totalCount = snapshot.numChildren();
          snapshot.forEach(function(clubItem) {
            var childKey = clubItem.key;
            var childData = clubItem.val();
                var drinkData = [];
                //search for drinks
                drinksref.child(clubItem.key).once('value', function(drinkSnapshot) {

                   drinkSnapshot.forEach(function(drinkItem) {
                      var drinkRec = drinkItem.val();

                       drinkData.push({key: drinkItem.key, name: drinkRec.name, price: drinkRec.price, isFree: drinkRec.isFreeDrinks,
                                       description: drinkRec.description, whatsinit: drinkRec.whatsinit, clubID: childKey});

                   });
                });

                theDrinksData.push({key: childKey, name: childData.name, city: childData.city, state: childData.state, drinkList: drinkData});
                //console.log(theDrinksData);
                count = count + 1;

                if (totalCount == count) {
                  _ths.setState({
                      drinksData: theDrinksData,
                      loadingData: false
                  })
                }

          });
      });
    }

    saveDrinks(){
        var _ths = this;
        var theFileid = this.makeid();
        var filenamearr = this.state.drinksImgName.split('.');

        drinksref.child(`${this.state.selectedclubid}`).push({
            name : _ths.state.drinksName,
            whatsinit : _ths.state.whatsinit,
            description : _ths.state.drinksDesc,
            image : theFileid+'.'+filenamearr[1],
            isFreeDrinks : _ths.state.isFree,
            price : _ths.state.drinkPrice
        }).then((data) => {
            if (this.state.evtImg !== ''){
                var uploadTask = Storageref.child('Drinks/'+theFileid+'.'+filenamearr[1]).put(this.state.drinksImg);

                uploadTask.on('state_changed', function(snapshot){
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    if (progress === 100){
                        _ths.setState({
                            isloading: false,
                            isdrinksAdded: true,
                            issuccess: true
                        })
                        setTimeout(() => {
                            _ths.setState({
                                loadingData: false,
                                drinksName: '',
                                whatsinit: '',
                                drinksDesc: '',
                                drinksPrice: '',
                                drinksImg: '',
                                drinksImgName: '',
                                drinksImgtype: '',
                                drinksImgpreview: '',
                                selectedclubid: '',
                                drinkPrice: '',
                                isFree: false,
                                isSingle: false,
                                isSingleID: '',
                                isloading: false,
                                isPlaceChanged: false,
                                uploadProgress: 0,
                                issavingdrinks: false,
                                isdrinksAdded: false
                            })

                            _ths.handleRequestClose()
                        }, 3000)
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

    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                drinksImg: file,
                drinksImgName: file.name,
                drinksImgtype: file.type,
                drinksImgpreview: reader.result
            });
        }

        reader.readAsDataURL(file)
    }

    askDeleteConfirm(clubKey,key) {
        var _ths = this;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this drinks!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                drinksref.child(clubKey).child(key).remove();
            }
            this.loadDrinksData();
        });
    };

    makeid = () => {
        var text = "";
        var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 12; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    handleToggle = value => () => {
        var _ths = this;
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
            _ths.setState({
                isFree: false
            })
        } else {
            newChecked.splice(currentIndex, 1);
            _ths.setState({
                isFree: true
            })
        }

        this.setState({
            checked: newChecked,
        });
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleClickOpen = () => {
        if(this.state.isEmpty == false) {
           this.setState({ open: true });
        } else {
           swal ( "Oops" ,  "Club is empty!" ,  "error" );
        }
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };

    editDrinks(clubKey, drinksKey) {
        var _ths = this;


        drinksref.child(clubKey).child(drinksKey).on('value', function(snapshot) {
            let thedrinksData = [];

            if(snapshot.exists()) {
              _ths.setState({isEdit: true})
              let drinksData = snapshot.val();
              _ths.setState({
                  drinksDesc: drinksData.description,
                  drinksName: drinksData.name,
                  drinkPrice: drinksData.price,
                  whatsinit: drinksData.whatsinit,
                  selectedclubid: clubKey,
                  drinksKey: drinksKey
              })

              if (drinksData.isFreeDrinks == true) {
                _ths.setState({
                    checked: ['isFreeDrink'],
                    isFree: drinksData.isFreeDrinks
                })
              }

              if (drinksData.image != "") {
                Storageref.child('Drinks/'+drinksData.image).getDownloadURL().then(function(url) {
                    _ths.setState({
                        drinksImgpreview: url
                    })
                }).catch((err) => {
                    _ths.setState({
                        drinksImgpreview: ''
                    })
                })
              }

              _ths.handleClickOpen();
            }


        });


    }

    updateDrinks() {
        var _ths = this;
        var clubKey = _ths.state.selectedclubid;
        var drinksKey = _ths.state.drinksKey;

        var imageName = "";
        var value = {};
         if (this.state.drinksImg !== ''){
           var filenamearr = this.state.drinksImgName.split('.');
           var theFileid = this.makeid();
           imageName = theFileid+'.'+filenamearr[1];
           value = {
               name : _ths.state.drinksName,
               whatsinit : _ths.state.whatsinit,
               description : _ths.state.drinksDesc,
               image : imageName,
               isFreeDrinks : _ths.state.isFree,
               price : _ths.state.drinkPrice
           };
         } else {
           imageName = "";
           value = {
               name : _ths.state.drinksName,
               whatsinit : _ths.state.whatsinit,
               description : _ths.state.drinksDesc,
               isFreeDrinks : _ths.state.isFree,
               price : _ths.state.drinkPrice
           }
         }



        // console.log(`${_ths.props.match.params.clubid}/${_ths.props.match.params.drinkid}/isFreeDrinks/`);
        // drinksref.child(`${_ths.props.match.params.clubid}/${_ths.props.match.params.drinkid}/isFreeDrinks/`).set(_ths.state.isFree)
        drinksref.child(clubKey).child(drinksKey).update(value).then((club) => {
            if (this.state.drinksImg !== "") {
                  var uploadTask = Storageref.child('Drinks/'+theFileid+'.'+filenamearr[1]).put(this.state.drinksImg);

                  uploadTask.on('state_changed', function(snapshot){
                      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                      if (progress === 100){
                          _ths.setState({
                              isloading: false,
                              isEdit: false,
                              issuccess: true
                          })

                          _ths.handleRequestClose()

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
                  isEdit: false,
                  issuccess: true
              })
              _ths.handleRequestClose()
            }
        });



    }

    render() {
        const { classes } = this.props;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.isclubAdded,
        });

        if(this.state.issuccess == true) {
          swal ( "Success" ,  "Drinks successfully saved!" ,  "success" );
            var _ths = this;
            _ths.setState({
                issuccess: false
            })
            this.loadDrinksData();
        }

        return (
            <div className="App">
                <Grid container spacing={24}>

                    <Grid item xs={6}>
                        {/*<Button href={`/orders/23`} color="primary" className={classes.button}>*/}
                        {/*<Save className={props.classes.leftIcon} />*/}
                        {/*<span>Save</span>*/}
                        {/*</Button>*/}
                    </Grid>
                    <Grid item xs={6} className="pageToolbarRight">

                        <Button onClick={() => {this.handleClickOpen()}} raised color="primary" >Add Drinks</Button>

                        <Dialog
                            open={this.state.open}
                            transition={Transition}
                            keepMounted
                            onRequestClose={this.handleRequestClose}>
                            <DialogTitle>Add New Drinks</DialogTitle>
                            <DialogContent>
                                <Grid container>
                                    <Grid container>
                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth
                                            style={{
                                                marginTop: 15
                                            }}>
                                                <InputLabel htmlFor="clubName">Drinks Name</InputLabel>
                                                <Input
                                                    id="clubName"
                                                    margin="normal"
                                                    value={this.state.drinksName}
                                                    onChange={this.handleChange('drinksName')}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <TextField
                                                    id="selectedclubid"
                                                    select
                                                    label="Select Club"
                                                    value={this.state.selectedclubid}
                                                    onChange={this.handleChange('selectedclubid')}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            className: classes.menu,
                                                        },
                                                    }}
                                                    helperText="Please select club"
                                                    margin="normal"
                                                >
                                                    {
                                                        this.state.clubData.map((club, i) => {
                                                            return (
                                                                <MenuItem key={i} value={club.key}>{club.name}</MenuItem>
                                                            )
                                                        })
                                                    }

                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container>

                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <TextField
                                                    id="whatsinit"
                                                    label="What's in it"
                                                    multiline
                                                    rows="4"
                                                    value={this.state.whatsinit}
                                                    onChange={this.handleChange('whatsinit')}
                                                    margin="normal"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <TextField
                                                    id="drinksDesc"
                                                    label="Drinks Description"
                                                    multiline
                                                    rows="4"
                                                    value={this.state.drinksDesc}
                                                    onChange={this.handleChange('drinksDesc')}
                                                    margin="normal"
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} lg={6}>
                                            <InputLabel htmlFor="drinkPrice">Free Drink</InputLabel>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <Switch
                                                    onChange={this.handleToggle('isFreeDrink')}
                                                    checked={this.state.checked.indexOf('isFreeDrink') !== -1}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth
                                                 style={{
                                                     marginTop: 15
                                                 }}>
                                                <InputLabel htmlFor="drinkPrice">Drinks Price</InputLabel>
                                                <Input
                                                    id="drinkPrice"
                                                    margin="normal"
                                                    value={this.state.drinkPrice}
                                                    onChange={this.handleChange('drinkPrice')}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <InputLabel htmlFor="drinksImg">Event Images</InputLabel>
                                                <TextField
                                                    id="drinksImg"
                                                    onChange={(e)=>this._handleImageChange(e)}
                                                    margin="normal"
                                                    type="file"
                                                />
                                            </FormControl>
                                            <FormControl fullWidth>
                                                <Avatar style={{
                                                    borderRadius: 0,
                                                    width: 100,
                                                    height: 100
                                                }} src={this.state.drinksImgpreview}/>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleRequestClose} color="primary">
                                    Cancel
                                </Button>

                                {

                                    this.state.isEdit ?

                                    <Button raised
                                            color="primary"
                                            disabled={this.state.isloading}
                                            onClick={() => {
                                                this.updateDrinks()
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

                                :


                                <Button
                                    color="primary"
                                    className={buttonClassname}
                                    disabled={this.state.issavingdrinks}
                                    onClick={() => {
                                        this.saveDrinks()
                                    }}>
                                    {
                                        this.state.issavingdrinks ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                            this.state.isdrinksAdded ? <CheckIcon  className={classes.leftIcon}/> :
                                                <Save className={classes.leftIcon} />
                                    }
                                    {
                                        this.state.isdrinksAdded ? 'Saving Drinks' : 'Save Drinks'
                                    }
                                </Button>
                              }
                            </DialogActions>
                        </Dialog>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <LinearProgress mode="determinate" value={this.state.uploadProgress} />

                            <ReactTable
                              filterable
                              data={this.state.drinksData}
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
                                    }
                                  ]
                                }
                              ]}
                              defaultPageSize={15}
                              className="-striped -highlight"
                              SubComponent = {row =>  {
                                  return (
                                    <div style={{padding: "20px"}}>
                                    <ReactTable
                                      data={row.original.drinkList}
                                      columns={
                                        [
                                          {
                                            Header: "Drink Details",
                                            columns: [
                                              {
                                                Header: "Name",
                                                accessor: "name"
                                              },
                                              {
                                                Header: "Price",
                                                accessor: "price"
                                              },
                                              {
                                                Header: "Action",
                                                accessor: "key",
                                                filterable: false,
                                                Cell: row => (

                                                    <div>

                                                        <IconButton aria-label="Edit"
                                                                    onClick={() => {
                                                                        this.editDrinks(row.original.clubID,row.value)
                                                                    }}>
                                                            <EditIcon />
                                                        </IconButton>

                                                      <IconButton aria-label="Delete"
                                                                  onClick={() => {
                                                                      this.askDeleteConfirm(row.original.clubID,row.value)
                                                                  }}>
                                                          <DeleteIcon />
                                                      </IconButton>
                                                  </div>
                                                )
                                              }
                                            ]
                                          }]
                                      }
                                      defaultPageSize={row.original.drinkList.length}
                                      showPagination={false}

                                      SubComponent = {row =>  {
                                        var divStyle = {
                                            background: "#eee",
                                            padding: "20px",
                                            margin: "20px"
                                          };
                                          return (

                                            <div style={divStyle}>
                                              <p><strong>Whats In It:</strong> {row.original.whatsinit}</p>
                                              <p><strong>Description:</strong> {row.original.description}</p>
                                              </div>

                                          );
                                      }}

                                    />
                                    </div>
                                  );
                              }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }

}

AllDrinks.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllDrinks);
