import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Category from './category'
import NewCategory from './category_new'
import UpdateCategory from './category_edit'


const Categories = () => (
    <Switch>
        <Route exact path='/menu_category' component={Category}/>
        <Route exact path='/menu_category/create' component={NewCategory}/>
        <Route exact path='/menu_category/edit/:categoryid' component={UpdateCategory}/>
    </Switch>
)

export default Categories
