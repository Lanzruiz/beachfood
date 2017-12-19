/**
 * Created by Thomas Woodfin on 12/19/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Administrator from './administrator'
import NewAdministrator from './administrator_new'

const Cities = () => (
    <Switch>
        <Route exact path='/administrator' component={Administrator}/>
        <Route exact path='/administrator/create' component={NewAdministrator}/>
    </Switch>
)

export default Cities
