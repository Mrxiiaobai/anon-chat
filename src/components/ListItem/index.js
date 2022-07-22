import React from 'react'
import './index.scss'

const ListItem = props => {
  const { name, text, logo } = props
  return (<li className='app-li app-li-active'>
  <div className='app-left-li'>
    <img src={ logo } alt='' />
  </div>
  <div className='app-right-li'>
    <p>{ name }</p>
    <p>{ text }</p>
  </div>
</li>)
}

export default ListItem