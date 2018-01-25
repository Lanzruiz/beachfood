/**
 * Created by Thomas Woodfin on 11/10/2017.
 */
import { ref, eventsref, eventsStoreref } from '../FB'

export function saveEvent(evt) {
    return ref.child(`events/`)
        .push({
            address : evt.address,
            evstartdatetime : evt.evstartdatetime,
            evenddatetime : evt.evenddatetime,
            description : evt.description,
            image : evt.image,
            lat : evt.lat,
            lng : evt.lng,
            name : evt.name,
            state : evt.state,
            zip : evt.zip
        })
        .then(() => evt)
}

export function updateEvent(evt) {
    return ref.child(`events/${evt.evid}`)
        .set({
            address : evt.address,
            evstartdatetime : evt.evstartdatetime,
            evenddatetime : evt.evenddatetime,
            description : evt.description,
            image : evt.image,
            lat : evt.lat,
            lng : evt.lng,
            name : evt.name,
            state : evt.state,
            zip : evt.zip
        })
        .then(() => evt)
}
