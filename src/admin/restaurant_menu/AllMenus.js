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
import Background from '../images/drrinks.jpg';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import { CircularProgress } from 'material-ui/Progress';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';
import Switch from 'material-ui/Switch';
import { restaurantRef, restaurantMenuRef, Storageref } from '../../FB'
import OpenIcon from 'material-ui-icons/Visibility';
import swal from 'sweetalert';
import MenuItem from 'material-ui/Menu/MenuItem';
import stylesm from '../../App.css'
import ImageLoader from '../ImageLoader'
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
        width: '50%',
        height: 'auto',
        borderRadius: 0,
        borderWidth: 2,
        borderColor: '#000'
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

class AllMenus extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            open: false,
            loadingData: false,
            menuData: [],
            restaurantData: [],
            menuName: '',
            menuDesc: '',
            menuImg: '',
            menuImgName: '',
            menuImgtype: '',
            menuImgpreview: '',
            menuPrice: '',
            selectedrestaurantid: '',
            isSingle: false,
            isSingleID: '',
            isloading: false,
            issuccess: false,
            isPlaceChanged: false,
            uploadProgress: 0,
            issavingmenu: false,
            ismenuAdded: false,
            open_display: false
        }
    }

    componentDidMount(){
      //document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
      //document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";

        this.loadMenuData();
    }

    loadMenuData() {
      var _ths = this;
      let therestaurantData = [];

      _ths.setState({
          loadingData: true
      })
      restaurantRef.on('value', function(snapshot) {

          snapshot.forEach(function(eventItem) {
              var childKey = eventItem.key;
              var childData = eventItem.val();
              childData['key'] = childKey;
              if (!childData.info){
                  therestaurantData.push(childData)
              }
          });
          _ths.setState({
              restaurantData: therestaurantData
          })
      }).bind(this);

      var count = 0;
      var theMenuData = [];
      restaurantRef.once('value', function(snapshot) {

          var totalCount = snapshot.numChildren();
          snapshot.forEach(function(restaurantItem) {
            var childKey = restaurantItem.key;
            var childData = restaurantItem.val();
                var menuData = [];
                //search for drinks
                restaurantMenuRef.child(restaurantItem.key).once('value', function(menuSnapshot) {

                   menuSnapshot.forEach(function(menuItem) {
                      var menuRec = menuItem.val();

                       menuData.push({key: menuItem.key, name: menuRec.name, price: menuRec.price,
                                       description: menuRec.description,  restaurantID: childKey});

                   });
                });
                console.log(menuData);
                theMenuData.push({key: childKey, name: childData.name, city: childData.city, state: childData.state, menuList: menuData});
                //console.log(theDrinksData);
                count = count + 1;

                if (totalCount == count) {
                  _ths.setState({
                      menuData: theMenuData,
                      loadingData: false
                  })
                }

          });
      });


      //console.log(theMenuData);

    }

    saveMenus(){
        var _ths = this;
        var theFileid = this.makeid();
        var filenamearr = this.state.menuImgName.split('.');

        if(this.state.selectedrestaurantid == null || this.state.selectedrestaurantid == "") {
          swal ( "Oops" ,  "Please select restaurant!" ,  "error" );
        } else if(this.state.menuName == "") {
          swal ( "Oops" ,  "Please input your menu name!" ,  "error" );

        } else {
          restaurantMenuRef.child(`${this.state.selectedrestaurantid}`).push({
              name : _ths.state.menuName,
              description : _ths.state.menuDesc,
              image : theFileid+'.'+filenamearr[1],
              price : parseFloat(_ths.state.menuPrice)
          }).then((data) => {
              if (this.state.evtImg !== ''){
                  var uploadTask = Storageref.child('menus/'+theFileid+'.'+filenamearr[1]).put(this.state.menuImg);

                  uploadTask.on('state_changed', function(snapshot){
                      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                      if (progress === 100){
                          _ths.setState({
                              isloading: false,
                              issuccess: true,
                              ismenuAdded: true,
                          })
                          setTimeout(() => {
                              _ths.setState({
                                  loadingData: false,
                                  menuName: '',

                                  menuDesc: '',
                                  menuPrice: '',
                                  menuImg: '',
                                  menuImgName: '',
                                  menuImgtype: '',
                                  menuImgpreview: '',
                                  selectedrestaurantid: '',
                                  menuPrice: '',

                                  isSingle: false,
                                  isSingleID: '',
                                  isloading: false,
                                  isPlaceChanged: false,
                                  uploadProgress: 0,
                                  issavingmenu: false,
                                  ismenuAdded: false
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

    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                menuImg: file,
                menuImgName: file.name,
                menuImgtype: file.type,
                menuImgpreview: reader.result
            });
        }

        reader.readAsDataURL(file)
    }

    askDeleteConfirm(restaurantKey,key) {
        var _ths = this;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this menu!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                restaurantMenuRef.child(restaurantKey).child(key).remove();
            }
              this.loadMenuData();
        });
    };


    displayMenu(restaurantKey,menuKey) {
      var _ths = this;
      this.setState({open_display: true})

      restaurantMenuRef.child(restaurantKey).child(menuKey).on('value', function(snapshot) {
          let theMenuData = [];

          snapshot.forEach(function(menu) {
              var childKey = menu.key;
              var childData = menu.val();

              if ( childKey === 'description'){
                  _ths.setState({
                      menuDesc: childData
                  })
              }

              if ( childKey === 'image'){

                  Storageref.child('menus/'+childData).getDownloadURL().then(function(url) {

                      _ths.setState({
                          menuImgpreview: url
                      })
                  }).catch((err) => {
                      _ths.setState({
                          menuImgpreview: ''
                      })
                  })

              }

              if ( childKey === 'name'){
                  _ths.setState({
                      menuName: childData
                  })
              }

              if ( childKey === 'price'){
                  _ths.setState({
                      menuPrice: childData
                  })
              }




          });
      });
    }

    makeid = () => {
        var text = "";
        var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 12; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    handleToggle = value => () => {
        var _ths = this;
        // const { checked } = this.state;
        // const currentIndex = checked.indexOf(value);
        // const newChecked = [...checked];
        //
        // if (currentIndex === -1) {
        //     newChecked.push(value);
        //     _ths.setState({
        //         isFree: false
        //     })
        // } else {
        //     newChecked.splice(currentIndex, 1);
        //     _ths.setState({
        //         isFree: true
        //     })
        // }
        //
        // this.setState({
        //     checked: newChecked,
        // });
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleClickOpen = () => {
        this.setState({ open: true, menuName:'', menuPrice:'', menuDesc:'',menuImgpreview:'',open_display:false });
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };

    displayHandleRequestClose() {
      this.setState({open_display: false, menuImgpreview:''})
    }

    render() {
        const { classes } = this.props;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.isclubAdded,
        });

        if(this.state.issuccess == true) {
          swal ( "Success" ,  "Menu successfully saved!" ,  "success" );
            var _ths = this;
            _ths.setState({
                issuccess: false
            })
              this.loadMenuData();
        }

        return (
            <div className="App">

            {  /**********display drinks***************/ }
              <Dialog
                  open={this.state.open_display}
                  transition={Transition}
                  keepMounted
                  onRequestClose={this.handleRequestClose}>
                  <DialogTitle>Menus Information</DialogTitle>
                  <DialogContent>
                      <Grid container>
                          <Grid container>
                              <Grid item xs={12} lg={6}>
                                    <p style={{fontSize:12, color:'#999'}}>Name</p>
                                    <p style={{color: '#000'}}>{this.state.menuName}</p>
                              </Grid>
                              <Grid item xs={12} lg={6}>



                              </Grid>
                          </Grid>

                          <Grid container>

                              <Grid item xs={12} lg={6}>

                                  <p style={{fontSize:12, color:'#999'}}>Description</p>
                                  <p style={{color: '#000'}}>{this.state.menuDesc}</p>

                              </Grid>
                          </Grid>



                         <Grid container>

                              <Grid item xs={12} lg={6}>
                                  <p style={{fontSize:12, color:'#999'}}>Price</p>
                                  <p style={{color: '#000'}}>${this.state.menuPrice}</p>

                              </Grid>

                              <Grid item xs={12} lg={6}>

                              </Grid>

                          </Grid>

                          <Grid container>


                               <Grid item xs={12} lg={12}>
                               <p style={{fontSize:12, color:'#999'}}>Image</p>
                               <FormControl fullWidth className={stylesm.theFromControl} style={{justifyContent: 'center', alignItems: 'center'}}>
                                   {
                                       (this.state.menuImgpreview && this.state.menuImgpreview !== '') ?
                                       <ImageLoader
                                           src={this.state.menuImgpreview}
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
                      <Button onClick={() => {this.displayHandleRequestClose()}} color="primary">
                          Close
                      </Button>

                  </DialogActions>
              </Dialog>
              { /***********end display drinks**********/ }

                <Grid container spacing={24}>

                    <Grid item xs={6}>
                        {/*<Button href={`/orders/23`} color="primary" className={classes.button}>*/}
                        {/*<Save className={props.classes.leftIcon} />*/}
                        {/*<span>Save</span>*/}
                        {/*</Button>*/}
                    </Grid>
                    <Grid item xs={6} className="pageToolbarRight">
                        <Button onClick={() => {this.handleClickOpen()}} raised color="primary">Add Menus</Button>
                        <Dialog
                            open={this.state.open}
                            transition={Transition}
                            keepMounted
                            onRequestClose={this.handleRequestClose}>
                            <DialogTitle>Add New Menus</DialogTitle>
                            <DialogContent>
                                <Grid container>
                                    <Grid container>
                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth
                                            style={{
                                                marginTop: 15
                                            }}>
                                                <InputLabel htmlFor="clubName">Menus Name</InputLabel>
                                                <Input
                                                    id="menuName"
                                                    margin="normal"
                                                    value={this.state.menuName}
                                                    onChange={this.handleChange('menuName')}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth className={stylesm.theFromControl}>
                                                <TextField
                                                    id="selectedrestaurantid"
                                                    select
                                                    label="Select Restaurant"
                                                    value={this.state.selectedrestaurantid}
                                                    onChange={this.handleChange('selectedrestaurantid')}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            className: classes.menu,
                                                        },
                                                    }}
                                                    helperText="Please select restaurant"
                                                    margin="normal"
                                                >
                                                    {
                                                        this.state.restaurantData.map((restaurant, i) => {
                                                            return (
                                                                <MenuItem key={i} value={restaurant.key}>{restaurant.name}</MenuItem>
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
                                                    id="menuDesc"
                                                    label="Menus Description"
                                                    multiline
                                                    rows="4"
                                                    value={this.state.menuDesc}
                                                    onChange={this.handleChange('menuDesc')}
                                                    margin="normal"
                                                />
                                            </FormControl>
                                        </Grid>


                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth
                                                 style={{
                                                     marginTop: 15
                                                 }}>
                                                <InputLabel htmlFor="menuPrice">Menu Price</InputLabel>
                                                <Input
                                                    id="menuPrice"
                                                    margin="normal"
                                                    value={this.state.menuPrice}
                                                    onChange={this.handleChange('menuPrice')}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} lg={6}>
                                            <FormControl fullWidth className={stylesm.theFromControl}>

                                                <TextField
                                                    id="menuImg"
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
                                                }} src={this.state.menuImgpreview}/>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleRequestClose} color="primary">
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    className={buttonClassname}
                                    disabled={this.state.issavingmenu}
                                    onClick={() => {
                                        this.saveMenus()
                                    }}>
                                    {
                                        this.state.issavingmenu ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                            this.state.ismenuAdded ? <CheckIcon  className={classes.leftIcon}/> :
                                                <Save className={classes.leftIcon} />
                                    }
                                    {
                                        this.state.ismenuAdded ? 'Saving Menus' : 'Save Menus'
                                    }
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>

                    <Grid item xs={12}>

                            <LinearProgress mode="determinate" value={this.state.uploadProgress} />

                            <ReactTable
                              filterable
                              data={this.state.menuData}
                              columns={[
                                {
                                  Header: "Menu Information",
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
                                //console.log(row);
                                  return (
                                    <div style={{padding: "20px"}}>
                                    <ReactTable
                                      data={row.original.menuList}
                                      columns={
                                        [
                                          {
                                            Header: "Menu Details",
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
                                                    <IconButton aria-label="Delete" style={{color: '#000'}}
                                                                onClick={() => {
                                                                    this.displayMenu(row.original.restaurantID,row.value)
                                                                }}>
                                                        <OpenIcon />
                                                    </IconButton>

                                                        <Link to={'/restaurant_menu/edit/'+row.original.restaurantID+"/"+row.value} style={{color: '#000'}} aria-label="Edit">
                                                            <EditIcon />
                                                        </Link>

                                                      <IconButton aria-label="Delete" style={{color: '#000'}}
                                                                  onClick={() => {
                                                                      this.askDeleteConfirm(row.original.restaurantID,row.value)
                                                                  }}>
                                                          <DeleteIcon />
                                                      </IconButton>
                                                  </div>
                                                )
                                              }
                                            ]
                                          }]
                                      }
                                      defaultPageSize={row.original.menuList.length}
                                      showPagination={false}

                                      SubComponent = {row =>  {
                                        var divStyle = {
                                            background: "#eee",
                                            padding: "20px",
                                            margin: "20px"
                                          };
                                          return (

                                            <div style={divStyle}>
                                              <p><strong>Description:</strong> {row.original.description}</p>
                                              </div>

                                          );
                                      }}

                                    />
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

AllMenus.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllMenus);
