/* eslint-disable */
import React, { Component } from 'react'
import { Provider } from 'mobx-react'
import stores from "@/store"

// const { Provider } = React.createContext()

class AppContext extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  processNetwork() {
    window.addEventListener('online', () => {
      this.setState({ online: navigator.onLine })
    })
    window.addEventListener('offline', () => {
      this.setState({ online: navigator.onLine })
    })
    window.addEventListener('error', event => {
      // console.log('addEventListener event error----------->', event)
      const sourceType = event.target.localName
      if (sourceType === 'script') this.setState({ resourceError: true })
    }, true)
  }

  componentDidMount() {
    console.log('appContext')
  }

  render() {
    const { children } = this.props
    return (
      <Provider { ...stores } value={ this.props }>
        {children}
      </Provider>
    )
  }
}

export default AppContext