import React from 'react'
import { Switch, Route } from 'react-router-dom'
import CouponCode from './coupon_code'
import NewCouponCode from './coupon_code_new'
import UpdateCouponCode from './coupon_code_edit'

const Customers = () => (
    <Switch>
        <Route exact path='/coupon_code' component={CouponCode}/>
        <Route exact path='/coupon_code/create' component={NewCouponCode}/>
        <Route path='/coupon_code/edit/:couponid' component={UpdateCouponCode}/>
    </Switch>
)

export default Customers
