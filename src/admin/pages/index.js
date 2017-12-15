/**
 * Created by Thomas Woodfin on 12/14/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PAGES from './Pages'
import PAGESUpdate from './PagesUpdate'

const Pages = () => (
    <Switch>
        <Route exact path='/pages' component={PAGES}/>
        <Route path='/pages/edit/:pageid' component={PAGESUpdate}/>
    </Switch>
)

export default Pages
