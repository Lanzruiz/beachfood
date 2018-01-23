/**
 * Created by Thomas Woodfin on 12/13/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import UserGiftDrynx from './UserGiftDrynx'

const GiftDrynx = () => (
    <Switch>
        <Route exact path='/user-gifts' component={UserGiftDrynx}/>
    </Switch>
)

export default GiftDrynx
