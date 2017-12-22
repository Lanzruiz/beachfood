
/**
 * Created by Thomas Woodfin on 12/22/2017.
 */
import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllDrinks from './drinks_list'

const Drinks = () => (
    <Switch>
        <Route exact path='/drynx_club/drinks' component={AllDrinks}/>
    </Switch>
)

export default Drinks
