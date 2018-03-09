import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Customer from './customer'
import NewCustomer from './customer_new'
import UpdateCustomer from './customer_edit'

const Customers = () => (
    <Switch>
        <Route exact path='/customer' component={Customer}/>
        <Route exact path='/customer/create' component={NewCustomer}/>
        <Route path='/customer/edit/:adminid' component={UpdateCustomer}/>
    </Switch>
)

export default Customers
