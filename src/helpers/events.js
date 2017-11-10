/**
 * Created by BOSS on 11/10/2017.
 */
import { ref } from '../FB'

export function saveEvent(evt) {
    return ref.child(`events/`)
        .push({
            address : evt.address,
            evdatetime : evt.evdatetime,
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
