/**
 * Created by Thomas Woodfin on 11/20/2017.
 */
import { ref, usersref } from '../FB'

export function updateUsers(user) {
    return ref.child(`users/${user.thekey}`)
        .set({
            email: user.email,
            password: user.password,
            username: user.username
        })
        .then(() => user)
}
