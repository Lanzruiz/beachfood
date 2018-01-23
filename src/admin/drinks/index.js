/**
 * Created by BOSS on 11/17/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllDrinks from './AllDrinks'
import UpdateDrinks from './UpdateDrinks'

const Drinks = () => (
    <Switch>
        <Route exact path='/drinks' component={AllDrinks}/>
        <Route path='/drinks/edit/:clubid/:drinkid' component={UpdateDrinks}/>
    </Switch>
)

export default Drinks