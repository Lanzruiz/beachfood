/**
 * Created by Thomas Woodfin on 12/20/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import ClubOwner from './club_owner'
import NewClubOwner from './club_owner_new'
import UpdateClubOwner from './club_owner_edit'


const ClubOwners = () => (
    <Switch>
        <Route exact path='/club_owner' component={ClubOwner}/>
        <Route exact path='/club_owner/create' component={NewClubOwner}/>
        <Route exact path='/club_owner/edit/:clubid' component={UpdateClubOwner}/>
    </Switch>
)

export default ClubOwners
