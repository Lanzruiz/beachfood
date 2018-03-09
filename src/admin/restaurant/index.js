/**
 * Created by Thomas Woodfin on 11/17/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllRestaurant from './restaurant'

const Restaurant = () => (
    <Switch>
        <Route exact path='/restaurant' component={AllRestaurant}/>
    </Switch>
)

export default Restaurant
