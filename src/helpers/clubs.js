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

export function updateClub(club) {
    return ref.child(`clubs/${club.thkey}`)
        .set({
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
