import React from 'react'
import {
  InputNumber, Layout, Input, Form, Button,
} from 'antd'
import { inject, observer } from 'mobx-react'

import { SmileOutlined } from '@ant-design/icons'

import './index.scss'

const FormItem = Form.Item

@inject('loginStore')
@observer
class Login extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loginPage:true,
    }
  }

  onFinish = e => {
    const { loginPage } = this.state
    if (loginPage) {
      this.loginFinish(e)
      return
    }
    this.regeisterFinish(e)
  }

  successBack = () => {
    const { history } = this.props
    if (!window.electronApi) history.push('/anon/home')
    window.electronApi.ipcRenderer.send('close')
    window.electronApi.ipcRenderer.send('openMainWindow')
  }

  regeisterFinish = value => {
    const { name, password, code } = value
    console.log(value, '000')
    const { loginStore } = this.props
    const { regeister } = loginStore
    const params = {
      name,
      password,
      code,
    }
    regeister(params, this.successBack)
  }

  loginFinish = value => {
    const { name, password, code } = value
    const { loginStore } = this.props
    const { login } = loginStore
    const params = {
      name,
      password,
      code,
    }
    login(params, this.successBack)
  }

  handleChangePage = boole => {
    this.setState({
      loginPage:boole,
    })
  }

  handleGoFacePage = () => {
    const { history } = this.props
    history.replace('/anon/face')
  }

  render() {
    const { loginPage } = this.state
    return (
      <Layout className='app-login-layout'>
        <div className='login-content'>
          <Form
            className='app-login-form'
            name='validate_other'
            onFinish={ this.onFinish }
          >
            <FormItem name='name'>
              <InputNumber
                className='login-name-input'
                placeholder='输入账号'
                min={ 1 }
                maxLength={ 11 }
                controls={ false }
              />
            </FormItem>
            <FormItem name='password'>
              <Input.Password
                placeholder='输入密码'
                className='login-pass-input'
                visibilityToggle={ false }
              />
            </FormItem>
            { !loginPage ? (
              <FormItem name='code'>
                <Input
                  placeholder='请输入邀请码'
                  className='login-pass-code'
                />
              </FormItem>
            ) : '' }
            <Button type='primary' htmlType='submit' className='login-btn'>
              Submit
            </Button>
          </Form>
          { loginPage ? (
            <p onClick={ () => { this.handleChangePage(false) }  }>去注册 </p>
          ) : <p onClick={ () => { this.handleChangePage(true) }  }>去登录</p> }
          <div className='app-face-login'>
            <SmileOutlined className='app-face-icon' onClick={ this.handleGoFacePage } />
            <span>人脸登录</span>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Login