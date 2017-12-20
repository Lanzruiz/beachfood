/**
 * Created by Thomas Woodfin on 12/19/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Administrator from './administrator'
import NewAdministrator from './administrator_new'
import UpdateAdministrator from './administrator_edit'

const Administrators = () => (
    <Switch>
        <Route exact path='/administrator' component={Administrator}/>
        <Route exact path='/administrator/create' component={NewAdministrator}/>
        <Route path='/administrator/edit/:adminid' component={UpdateAdministrator}/>
    </Switch>
)

export default Administrators
