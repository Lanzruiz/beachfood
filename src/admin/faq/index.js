/**
 * Created by Thomas Woodfin on 12/14/2017.
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import FAQ from './FAQ'
import FAQNew from './FAQNew'
import FAQUpdate from './FAQUpdate'

const Faq = () => (
    <Switch>
        <Route exact path='/faq' component={FAQ}/>
        <Route path='/faq/create' component={FAQNew}/>
        <Route path='/faq/edit/:faqid' component={FAQUpdate}/>

    </Switch>
)

export default Faq
