/**
 * Created by Thomas Woodfin on 11/4/2017.
 */

import firebase from 'firebase'
var GeoFire = require('geofire');

var config = {
    apiKey: "AIzaSyDjNYwKHOIAizMhZdoHYwdR--uQNRtfon4",
    authDomain: "beacheatz-e9e25.firebaseapp.com",
    databaseURL: "https://beacheatz-e9e25.firebaseio.com",
    projectId: "beacheatz-e9e25",
    storageBucket: "beacheatz-e9e25.appspot.com",
    messagingSenderId: "1043846171454"
  }

firebase.initializeApp(config)
//var geoFire = new GeoFire(firebase.database().ref('club_location/'));

export const ref = firebase.database().ref()
export const geoFireRef = new GeoFire(firebase.database().ref('restaurant_location/'));
export const eventsref = firebase.database().ref('events/')
export const usersref = firebase.database().ref('users/')
export const administratorRef = firebase.database().ref('administrator/')
export const clubOwnerRef = firebase.database().ref('club_owner/')
export const superAdminRef = firebase.database().ref('superadmin/')
export const clubssref = firebase.database().ref('clubs/')
export const drinksref = firebase.database().ref('drinks/')
export const subsref = firebase.database().ref('subscription/')
export const subscriptionref = firebase.database().ref('subscription/')
export const userSubscriptionRef = firebase.database().ref('user_subscription/')
export const userGiftRef = firebase.database().ref('user_gift/')
export const userDrinksRef = firebase.database().ref('user_free_drinks/')
export const contactusRef = firebase.database().ref('contact_us/')
export const faqRef = firebase.database().ref('faq/')
export const pagesRef = firebase.database().ref('pages/')
export const userReferralRef = firebase.database().ref('user_referral/')
export const cityRef = firebase.database().ref('city/')
export const Storageref = firebase.storage().ref()
export const clubStoreref = firebase.storage().ref('club_image/')
export const eventsStoreref = firebase.storage().ref('events/')
export const firebaseAuth = firebase.auth()
export const RestaurantOwnerRef = firebase.database().ref('restaurant_owner/')
export const restaurantRef = firebase.database().ref('restaurant/')
export const restaurantMenuRef = firebase.database().ref('restaurant_menu/')
export const retaurantStoreref = firebase.storage().ref('restaurant_image/')
export const customerRef = firebase.database().ref('customer/')
export const menuCategoryRef = firebase.database().ref('menu_category/')
