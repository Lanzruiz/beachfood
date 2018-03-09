import React from 'react'
import { Switch, Route } from 'react-router-dom'
import RetaurantOwner from './restaurant_owner'
import NewRestaurantOwner from './restaurant_owner_new'
import UpdateRestaurantOwner from './restaurant_owner_edit'


const RestaurantOwners = () => (
    <Switch>
        <Route exact path='/restaurant_owner' component={RetaurantOwner}/>
        <Route exact path='/restaurant_owner/create' component={NewRestaurantOwner}/>
        <Route exact path='/restaurant_owner/edit/:restoid' component={UpdateRestaurantOwner}/>
    </Switch>
)

export default RestaurantOwners
