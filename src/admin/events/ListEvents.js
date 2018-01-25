/**
 * Created by Thomas Woodfin on 11/13/2017.
 */
import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllEvents from "./AllEvents";
import Editevents from "./Editevents";

// The Roster component matches one of two different routes
// depending on the full pathname
const ListEvents = () => (
    <Switch>
        <Route exact path='/allevents' component={AllEvents}/>
        <Route path='/editevent/:evid' component={Editevents}/>
    </Switch>
)


export default ListEvents
