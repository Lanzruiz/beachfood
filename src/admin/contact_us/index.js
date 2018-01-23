/**
 * Created by Thomas Woodfin on 12/14/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import ContactUs from './ContactUs'

const Contacts = () => (
    <Switch>
        <Route exact path='/contact-us' component={ContactUs}/>
    </Switch>
)

export default Contacts
