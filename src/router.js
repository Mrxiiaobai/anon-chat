/* eslint-disable */
import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import { Provider } from 'mobx-react'
import AppContext from '@/common/appContext/appContext'
// import stores from '@/store'

import Login from '@pages/login'
import Home from '@pages/home'
// const Login = lazy(() => import('@pages/login'))
// const Home = lazy(() => import('@pages/home'))

import '@/assets/styles/common.scss'


const noRoute = () => (
  <div>no file</div>
)

const Routers = () => (
  <BrowserRouter>
    <AppContext>
      <Switch>
        <Route exact path='/anon/home' component={ Home } root={ true } />
        <Route exact path='/anon/login' component={ Login } />
        <Route exact path='*' component={ noRoute } />
      </Switch>
    </AppContext>
  </BrowserRouter>
)

export default Routers