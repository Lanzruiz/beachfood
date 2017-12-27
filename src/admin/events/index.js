/**
 * Created by BOSS on 11/15/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllMenu from './AllEvents'
import Event from './Event'
import UpdteEvent from './UpdateEvent'
import DisplayEvent from './DisplayEvent'

const Events = () => (
    <Switch>
        <Route exact path='/events' component={AllMenu}/>
        <Route path='/events/addnew' component={Event}/>
        <Route path='/events/edit/:evid' component={UpdteEvent}/>
        <Route path='/events/display/:evid' component={DisplayEvent}/>
    </Switch>
)

export default Events
