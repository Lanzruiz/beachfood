/**
 * Created by BOSS on 11/17/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllClubs from './AllClubs'

const Users = () => (
    <Switch>
        <Route exact path='/clubs' component={AllClubs}/>
    </Switch>
)

export default Users