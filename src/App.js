import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Frontend from "./home";
import Admin from "./admin";
import Clubs from "./clubs";
import conf from './config'


const App = () => (
    <Switch>
        <Route exact path='/drynx_admin' component={Admin}/>
        <Route exact path='/drynx_club' component={Clubs}/>
        <Route exact path='/drynx_club/settings' component={Clubs}/>
        <Route exact path='/drynx_club/clubs' component={Clubs}/>
        <Route exact path='/drynx_club/drinks' component={Clubs}/>
        <Route path='/' component={Admin}/>
    </Switch>
)

export default App
