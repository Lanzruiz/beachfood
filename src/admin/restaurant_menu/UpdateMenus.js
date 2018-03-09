import React from 'react'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {
    Link
} from 'react-router-dom'
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Save from 'material-ui-icons/Save';
import CheckIcon from 'material-ui-icons/Check';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import Switch from 'material-ui/Switch';
import KeyboardBackspace from 'material-ui-icons/KeyboardBackspace';
import { restaurantRef, restaurantMenuRef, Storageref } from '../../FB'
import Background from '../images/drrinks.jpg';
import swal from 'sweetalert';
import MenuItem from 'material-ui/Menu/MenuItem';
import stylesm from '../../App.css'

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

class UpdateMenus extends React.Component {

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
            prevImg: '',
            ifImgChanged: false,
            menuPrice: '',
            checked: [],
            selectedrestaurantid: '',
            isloading: false,
            issuccess: false,
            uploadProgress: 0,
            issavingmenu: false,
            ismenuAdded: false
        }
    }

    componentDidMount(){
        var _ths = this;
        let therestaurantData = [];
        _ths.setState({
            loadingData: true
        })

        //document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
        //document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";

        restaurantRef.on('value', function(snapshot) {

            snapshot.forEach(function(eventItem) {
                var childKey = eventItem.key;
                var childData = eventItem.val();
                childData['key'] = childKey;
                if (!childData.info){
                    therestaurantData.push(childData)
                }

                if (childKey === _ths.props.match.params.restaurantid){
                    _ths.setState({
                        selectedrestaurantid: _ths.props.match.params.restaurantid
                    })
                }

            });
            _ths.setState({
                restaurantData: therestaurantData
            })
        }).bind(this);

        restaurantMenuRef.child(`${_ths.props.match.params.restaurantid}/${_ths.props.match.params.menuid}/`).on('value', function(snapshot) {
            let theMenuData = [];

            snapshot.forEach(function(menus) {
                var childKey = menus.key;
                var childData = menus.val();

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
        }).bind(this);
    }

    updateMenus(){
        var _ths = this;
        var theFileid = this.makeid();
        var filenamearr = this.state.menuImgName.split('.');


        var imageName = "";
        var value = {};
         if (this.state.menuImg !== ''){
           var filenamearr = this.state.menuImgName.split('.');
           var theFileid = this.makeid();
           imageName = theFileid+'.'+filenamearr[1];
           value = {
               name : _ths.state.menuName,
               description : _ths.state.menuDesc,
               image : imageName,
               price : parseFloat(_ths.state.menuPrice)
           };
         } else {
           imageName = "";
           value = {
               name : _ths.state.menuName,
               description : _ths.state.menuDesc,
               price : parseFloat(_ths.state.menuPrice)
           }
         }



        restaurantMenuRef.child(`${_ths.props.match.params.restaurantid}/${_ths.props.match.params.menuid}`).update(value).then((club) => {
            if (this.state.menuImg !== "") {
                  var uploadTask = Storageref.child('menus/'+theFileid+'.'+filenamearr[1]).put(this.state.drinksImg);

                  uploadTask.on('state_changed', function(snapshot){
                      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                      if (progress === 100){
                          _ths.setState({
                              isloading: false,
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
                  issuccess: true
              })
              _ths.handleRequestClose()
            }
        });



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
                menuImgpreview: reader.result,
                ifImgChanged: true
            });
        }

        reader.readAsDataURL(file)
    }

    askDeleteConfirm(key) {
        var _ths = this;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this menus!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                restaurantMenuRef.child(key).remove();
            }
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
        // const { checked } = this.state;
        // const currentIndex = checked.indexOf(value);
        // const newChecked = [...checked];
        //
        // if (currentIndex === -1) {
        //     newChecked.push(value);
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
        this.setState({ open: true });
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: this.state.ismenuAdded,
        });

        if(this.state.issuccess == true) {
          swal ( "Success" ,  "Menu successfully saved!" ,  "success" );
            var _ths = this;
            _ths.setState({
                issuccess: false
            })
        }

        return (
            <div className="App">
                <Grid container spacing={24}>

                    <Grid item xs={6}>
                        <Link to={`/restaurant_menu`} className='linkBtn primary'>
                        <span>
                            <KeyboardBackspace />
                            Back
                        </span>
                        </Link>
                    </Grid>
                    <Grid item xs={6} className="pageToolbarRight">
                        <Button raised
                            color="primary"
                            className={buttonClassname}
                            disabled={this.state.issavingmenu}
                            onClick={() => {
                                this.updateMenus()
                            }}>
                            {
                                this.state.issavingmenu ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                    this.state.ismenuAdded ? <CheckIcon  className={classes.leftIcon}/> :
                                        <Save className={classes.leftIcon} />
                            }
                            {
                                this.state.isdrinksAdded ? 'Saving Menus' : 'Save Menus'
                            }
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
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
                                            helperText="Please select Restaurant"
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
                                        <InputLabel htmlFor="menuPrice">Menus Price</InputLabel>
                                        <Input
                                            id="menuPrice"
                                            margin="normal"
                                            value={this.state.menuPrice}
                                            onChange={this.handleChange('menuPrice')}
                                        />
                                    </FormControl>
                                </Grid>


                            </Grid>
                            <Grid container>
                            <Grid item xs={12} lg={12}>
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
                                        width: "50%",
                                        height: "auto"
                                    }} src={this.state.menuImgpreview}/>
                                </FormControl>
                            </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }

}

UpdateMenus.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpdateMenus);
