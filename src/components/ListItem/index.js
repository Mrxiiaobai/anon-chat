import React from 'react'
import './index.scss'

function ListItem(props) {
  const {
    data, text, logo, onClick, activeKey,
  } = props
  const { name, value } = data
  return (
    <li className={ ` app-li ${ Number(activeKey) === Number(value) ? 'app-li-active' : '' }` } onClick={ () => { onClick(data) } }>
      <div className='app-left-li'>
        <img src={ logo } alt='' />
      </div>
      <div className='app-right-li'>
        <p>{ name }</p>
        <p>{ text }</p>
      </div>
    </li>
  )
}

export default ListItem