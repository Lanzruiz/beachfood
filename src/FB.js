/**
 * Created by BOSS on 11/4/2017.
 */

import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBmmd9J2m5N4NrtefEXLYq1QKilJrVBslc",
    authDomain: "credible-rex-168916.firebaseapp.com",
    databaseURL: "https://credible-rex-168916.firebaseio.com",
    projectId: "credible-rex-168916",
    storageBucket: "credible-rex-168916.appspot.com",
    messagingSenderId: "815060490703"
}

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const Storageref = firebase.storage().ref()
export const firebaseAuth = firebase.auth