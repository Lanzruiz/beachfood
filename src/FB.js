/**
 * Created by Thomas Woodfin on 11/4/2017.
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
