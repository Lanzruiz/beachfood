/**
 * Created by BOSS on 11/17/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllDrinks from './AllDrinks'

const Drinks = () => (
    <Switch>
        <Route exact path='/drinks' component={AllDrinks}/>
    </Switch>
)

export default Drinks