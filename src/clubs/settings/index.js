/**
 * Created by Thomas Woodfin on 12/21/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import UpdateSettings from './settings'

const Settings = () => (
    <Switch>
        <Route exact path='/drynx_club/settings' component={UpdateSettings}/>
    </Switch>
)

export default Settings
