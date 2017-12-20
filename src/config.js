/**
 * Created by BOSS on 11/4/2017.
 */

import {reactLocalStorage} from 'reactjs-localstorage';
var theuinfo = reactLocalStorage.get('isloggedin');

//reactLocalStorage.clear()
var conf = {
    sitename: 'Drynx',
    onlyAdmin: true,
    onlyClubs: true,
    login: theuinfo ? theuinfo : false,
}

export default conf;
