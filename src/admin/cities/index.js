/**
 * Created by BOSS on 11/17/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllCity from './AllCity'

const Cities = () => (
    <Switch>
        <Route exact path='/city' component={AllCity}/>
    </Switch>
)

export default Cities