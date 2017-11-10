/**
 * Created by BOSS on 11/4/2017.
 */

import {reactLocalStorage} from 'reactjs-localstorage';
var theuinfo = reactLocalStorage.get('isloggedin');

//reactLocalStorage.clear()
var conf = {
    sitename: 'Drynx',
    onlyAdmin: true,
    login: theuinfo ? theuinfo : false,
}
console.log(conf);
export default conf;