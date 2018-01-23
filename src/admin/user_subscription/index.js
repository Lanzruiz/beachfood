/**
 * Created by Thomas Woodfin on 12/13/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import UserSubscription from './UserSubscription'

const Subscription = () => (
    <Switch>
        <Route exact path='/user-subscription' component={UserSubscription}/>
    </Switch>
)

export default Subscription
