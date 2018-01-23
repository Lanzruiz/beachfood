/**
 * Created by BOSS on 11/17/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllUsers from './AllUsers'
import UpdateUser from './users_edit'

const Users = () => (
    <Switch>
        <Route exact path='/users' component={AllUsers}/>
        <Route path='/users/edit/:userid' component={UpdateUser}/>
    </Switch>
)

export default Users
