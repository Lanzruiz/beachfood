/**
 * Created by BOSS on 11/17/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllSubscriptions from './AllSubscriptions'

const Subscriptions = () => (
    <Switch>
        <Route exact path='/subscriptions' component={AllSubscriptions}/>
    </Switch>
)

export default Subscriptions