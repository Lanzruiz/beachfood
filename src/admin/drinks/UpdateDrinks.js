/**
 * Created by Thomas Woodfin on 12/4/2017.
 */

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
import { clubssref, drinksref, Storageref } from '../../FB'
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

class UpdateDrinks extends React.Component {

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
            prevImg: '',
            ifImgChanged: false,
            drinkPrice: '',
            checked: [],
            isFree: false,
            selectedclubid: '',
            isloading: false,
            issuccess: false,
            uploadProgress: 0,
            issavingdrinks: false,
            isdrinksAdded: false
        }
    }

    componentDidMount(){
        var _ths = this;
        let theclubData = [];
        _ths.setState({
            loadingData: true
        })

        document.getElementsByClassName("pageInner")[0].style.backgroundImage = `url(${Background})`;
        document.getElementsByClassName("pageInner")[0].style.backgroundSize = "cover";

        clubssref.on('value', function(snapshot) {

            snapshot.forEach(function(eventItem) {
                var childKey = eventItem.key;
                var childData = eventItem.val();
                childData['key'] = childKey;
                if (!childData.info){
                    theclubData.push(childData)
                }

                if (childKey === _ths.props.match.params.clubid){
                    _ths.setState({
                        selectedclubid: _ths.props.match.params.clubid
                    })
                }

            });
            _ths.setState({
                clubData: theclubData
            })
        }).bind(this);

        drinksref.child(`${_ths.props.match.params.clubid}/${_ths.props.match.params.drinkid}/`).on('value', function(snapshot) {
            let thedrinksData = [];

            snapshot.forEach(function(drinks) {
                var childKey = drinks.key;
                var childData = drinks.val();

                if ( childKey === 'description'){
                    _ths.setState({
                        drinksDesc: childData
                    })
                }

                if ( childKey === 'image'){

                    Storageref.child('Drinks/'+childData).getDownloadURL().then(function(url) {

                        _ths.setState({
                            drinksImgpreview: url
                        })
                    }).catch((err) => {
                        _ths.setState({
                            drinksImgpreview: ''
                        })
                    })

                }

                if ( childKey === 'name'){
                    _ths.setState({
                        drinksName: childData
                    })
                }

                if ( childKey === 'price'){
                    _ths.setState({
                        drinkPrice: childData
                    })
                }

                if ( childKey === 'whatsinit'){
                    _ths.setState({
                        whatsinit: childData
                    })
                }

                if ( childKey === 'isFreeDrinks'){
                    if (childData === true) {
                        console.log(childData);
                        _ths.setState({
                            checked: ['isFreeDrink'],
                            isFree: childData
                        })
                    }
                }
            });
        }).bind(this);
    }

    updateDrinks(){
        var _ths = this;
        var theFileid = this.makeid();
        var filenamearr = this.state.drinksImgName.split('.');


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
               price : parseFloat(_ths.state.drinkPrice)
           };
         } else {
           imageName = "";
           value = {
               name : _ths.state.drinksName,
               whatsinit : _ths.state.whatsinit,
               description : _ths.state.drinksDesc,
               isFreeDrinks : _ths.state.isFree,
               price : parseFloat(_ths.state.drinkPrice)
           }
         }



        drinksref.child(`${_ths.props.match.params.clubid}/${_ths.props.match.params.drinkid}`).update(value).then((club) => {
            if (this.state.drinksImg !== "") {
                  var uploadTask = Storageref.child('Drinks/'+theFileid+'.'+filenamearr[1]).put(this.state.drinksImg);

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
                drinksImg: file,
                drinksImgName: file.name,
                drinksImgtype: file.type,
                drinksImgpreview: reader.result,
                ifImgChanged: true
            });
        }

        reader.readAsDataURL(file)
    }

    askDeleteConfirm(key) {
        var _ths = this;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this event!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                clubssref.child(key).remove();
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
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
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
        this.setState({ open: true });
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };

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
        }

        return (
            <div className="App">
                <Grid container spacing={24}>

                    <Grid item xs={6}>
                        <Link to={`/drinks`} className='linkBtn primary'>
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
                            disabled={this.state.issavingdrinks}
                            onClick={() => {
                                this.updateDrinks()
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
                    </Grid>

                    <Grid item xs={12}>
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


                            </Grid>
                            <Grid container>
                            <Grid item xs={12} lg={12}>
                                <FormControl fullWidth className={stylesm.theFromControl}>

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
                                        width: "50%",
                                        height: "auto"
                                    }} src={this.state.drinksImgpreview}/>
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

UpdateDrinks.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpdateDrinks);
