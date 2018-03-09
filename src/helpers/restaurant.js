/**
 * Created by Thomas Woodfin on 11/24/2017.
 */
import { ref, restaurantRef } from '../FB'

export function saveRestaurant(restaurant) {

    return ref.child(`restaurant/`)
        .push({
            address : restaurant.address,
            city : restaurant.city,
            description : restaurant.description,
            image : restaurant.image,
            lat : restaurant.lat,
            lng : restaurant.lng,
            name : restaurant.name,
            state : restaurant.restaurantstate,
            zip : restaurant.clzip
        })
        .then(() => restaurant)
}




export function updateRestaurant(restaurant) {
  if (restaurant.image != "") {
    return ref.child(`restaurant/${restaurant.thkey}`)
        .update({
            address : restaurant.address,
            city : restaurant.city,
            description : restaurant.description,
            image : restaurant.image,
            lat : restaurant.lat,
            lng : restaurant.lng,
            name : restaurant.name,
            state : restaurant.restaurantstate,
            zip : restaurant.clzip
        })
        .then(() => restaurant)
  } else {
    return ref.child(`restaurant/${restaurant.thkey}`)
        .update({
            address : restaurant.address,
            city : restaurant.city,
            description : restaurant.description,
            lat : restaurant.lat,
            lng : restaurant.lng,
            name : restaurant.name,
            state : restaurant.restaurantstate,
            zip : restaurant.clzip
        })
        .then(() => restaurant)
  }

}
