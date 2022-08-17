import { observable, action } from 'mobx'
import { notification } from 'antd'
import { queryLogin, regeisterUser } from '@services/login'
import { SetLocalStorage } from '@/utils/local'

class loginStore {
  @observable
    loginInfo = null

  @action
    login = async (params, callback) => {
      const response = await queryLogin(params)
      if (response && response.code === 0) {
        SetLocalStorage('userInfo', response.data.userInfo)
        SetLocalStorage('token', response.data.token)
        this.loginInfo = response.data
        callback(response)
        return
      }
      // window.electronApi.ipcRenderer.send('notifications', response.message)
      notification.error({
        message:'错误通知',
        description:response.message,
      })
      // message.error(response.message)
    }

  @action
    regeister = async (params, callback) => {
      const response = await regeisterUser(params)
      if (response && response.code === 0) {
        SetLocalStorage('userInfo', response.data.userInfo)
        SetLocalStorage('token', response.data.token)
        // this.loginInfo = response.data
        callback(response)
        return
      }
      notification.error({
        message:'错误通知',
        description:response.message,
      })
      // message.error(response.message)
    }
}
export default loginStore
