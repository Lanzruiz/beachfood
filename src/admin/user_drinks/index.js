/**
 * Created by Thomas Woodfin on 12/13/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import UserFreeDrinks from './UserFreeDrinks'

const FreeDrinks = () => (
    <Switch>
        <Route exact path='/user-drinks' component={UserFreeDrinks}/>
    </Switch>
)

export default FreeDrinks
