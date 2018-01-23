/**
 * Created by BOSS on 11/24/2017.
 */
import { ref, clubssref } from '../FB'

export function saveClub(club) {
    return ref.child(`clubs/`)
        .push({
            address : club.address,
            city : club.city,
            description : club.description,
            image : club.image,
            lat : club.lat,
            lng : club.lng,
            name : club.name,
            state : club.clubstate,
            zip : club.clzip
        })
        .then(() => club)
}


export function saveClubOwner(club) {
    return ref.child(`clubs/`)
        .push({
            address : club.address,
            city : club.city,
            description : club.description,
            image : club.image,
            lat : club.lat,
            lng : club.lng,
            name : club.name,
            state : club.clubstate,
            zip : club.clzip,
            ownerID: club.ownerID
        })
        .then(() => club)
}

export function updateClub(club) {
  if (club.image != "") {
    return ref.child(`clubs/${club.thkey}`)
        .update({
            address : club.address,
            city : club.city,
            description : club.description,
            image : club.image,
            lat : club.lat,
            lng : club.lng,
            name : club.name,
            state : club.clubstate,
            zip : club.clzip
        })
        .then(() => club)
  } else {
    return ref.child(`clubs/${club.thkey}`)
        .update({
            address : club.address,
            city : club.city,
            description : club.description,
            lat : club.lat,
            lng : club.lng,
            name : club.name,
            state : club.clubstate,
            zip : club.clzip
        })
        .then(() => club)
  }

}

export function updateClubOwner(club) {
   if (club.image != "") {
     return ref.child(`clubs/${club.thkey}`)
         .update({
             address : club.address,
             city : club.city,
             description : club.description,
             image : club.image,
             lat : club.lat,
             lng : club.lng,
             name : club.name,
             state : club.clubstate,
             zip : club.clzip
         })
         .then(() => club)
   } else {
     return ref.child(`clubs/${club.thkey}`)
         .update({
             address : club.address,
             city : club.city,
             description : club.description,
             lat : club.lat,
             lng : club.lng,
             name : club.name,
             state : club.clubstate,
             zip : club.clzip
         })
         .then(() => club)
   }

}
