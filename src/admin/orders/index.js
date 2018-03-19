import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Orders from './orders'


const CustomerOrders = () => (
    <Switch>
        <Route exact path='/orders' component={Orders}/>
    </Switch>
)

export default CustomerOrders
