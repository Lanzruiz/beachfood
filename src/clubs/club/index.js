/**
 * Created by Thomas Woodfin on 12/21/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Club from './club'

const Clubs = () => (
    <Switch>
        <Route exact path='/drynx_club/clubs' component={Club}/>

    </Switch>
)

export default Clubs
