import React from 'react';
import { InputNumber, Layout, Input, Form, Button } from 'antd'
import { inject, observer } from 'mobx-react'
import './index.scss'

const FormItem = Form.Item

@inject('loginStore')
@observer
class Login extends React.PureComponent{
  constructor(props){
    super(props)
    this.state={

    }
  }

  onFinish = e => {
    const { name, password, code } = e
    const { loginStore, history } = this.props
    const { login } = loginStore
    const params = {
      name,
      password,
      code,
    }
    const successBack = () => {
      console.log('登录成功')
      window.electronApi.ipcRenderer.send('close');
      window.electronApi.ipcRenderer.send('open');
    }
    history.push('/anon/home')
    // login(params,successBack)
  }

  render(){
    return (<>
      <Layout className='app-login-layout'>
        <div className='login-content'>
          <Form
            name="validate_other"
            onFinish={ this.onFinish }
          >
            <FormItem name='name'>
              <InputNumber 
                className='login-name-input' 
                placeholder="输入账号" 
                min={ 1 }
                maxLength={ 11 } 
                controls={ false } 
              />
            </FormItem>
            <FormItem name='password'>
              <Input.Password
                placeholder="输入密码"
                className='login-pass-input'
                visibilityToggle={ false }
              />
            </FormItem>
            <FormItem name='code'>
              <Input
                placeholder="邀请码"
                className='login-pass-code'
              />
            </FormItem>
            <Button type="primary" htmlType="submit" className="login-btn">
              Submit
            </Button>
          </Form>
        </div>
      </Layout>
    </>)
  }
}

export default Login