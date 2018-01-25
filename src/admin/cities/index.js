/**
 * Created by Thomas Woodfin on 11/17/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllCity from './AllCity'
import CityNew from './city_new'
import CityUpdate from './city_edit'

const Cities = () => (
    <Switch>
        <Route exact path='/cities' component={AllCity}/>
        <Route path='/cities/create' component={CityNew}/>
        <Route path='/cities/edit/:cityid' component={CityUpdate}/>
    </Switch>
)

export default Cities
