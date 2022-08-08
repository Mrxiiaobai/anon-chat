import React, { Component } from 'react'
import { GetLocalStorage } from '@/utils/local'

const AuthRoute = RouterComponent => {
  class WrapComponent extends Component {
    constructor(props) {
      super(props)
      this.state = {

      }
    }

    componentDidMount() {
      const { history } = this.props
      const token = GetLocalStorage('token')
      if (!token) {
        history.push('/anon/login')
      }
    }

    render() {
      return <RouterComponent />
    }
  }
  return WrapComponent
}

export default AuthRoute