import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllMenus from './AllMenus'
import UpdateMenus from './UpdateMenus'

const RestaurantMenu = () => (
    <Switch>
        <Route exact path='/restaurant_menu' component={AllMenus}/>
        <Route path='/restaurant_menu/edit/:restaurantid/:menuid' component={UpdateMenus}/>
    </Switch>
)

export default RestaurantMenu
