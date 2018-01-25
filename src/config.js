/**
 * Created by Thomas Woodfin on 11/4/2017.
 */

import {reactLocalStorage} from 'reactjs-localstorage';
var theuinfo = reactLocalStorage.get('isloggedin');
var theuinfoClub = reactLocalStorage.get('isloggedinClub');

//reactLocalStorage.clear()
var conf = {
    sitename: 'Drynx',
    onlyAdmin: true,
    login: theuinfo ? theuinfo : false,
    loginClub: theuinfoClub ?  theuinfoClub : false
}

export default conf;
