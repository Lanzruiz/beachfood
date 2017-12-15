/**
 * Created by Thomas Woodfin on 12/15/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import UserReferral from './UserReferral'

const UserReferralData = () => (
    <Switch>
        <Route exact path='/user-referral' component={UserReferral}/>
    </Switch>
)

export default UserReferralData
