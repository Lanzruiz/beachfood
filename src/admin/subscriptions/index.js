/**
 * Created by Thomas Woodfin on 11/17/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllSubscriptions from './AllSubscriptions'
import EditSubscription from './EditSubscription'

const Subscriptions = () => (
    <Switch>
        <Route exact path='/subscriptions' component={AllSubscriptions}/>
        <Route exact path='/subscriptions/edit/:subsId' component={EditSubscription}/>
    </Switch>
)

export default Subscriptions
