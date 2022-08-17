import { observable, action } from 'mobx'
import moment from 'moment'
import { notification } from 'antd'
import {
  getAccessToken,
  faceMatch,
  faceDetect,
  faceAdd,
  faceSearch,
  faceLogin,
} from '@services/face'
import { SetLocalStorage, RemoveLocalStorage } from '@/utils/local'

class faceStore {
  @observable
    groupInfo = []

  @action
    getAccessToken = async (params, callback) => {
      const response = await getAccessToken(params)
      const { code, message, data } = response
      if (code !== 0) {
        notification.error({
          message:'错误通知',
          description:message,
        })
        return
      }

      SetLocalStorage('accessTokenInfo', {
        accessToken:data.access_token,
        times:new Date().getTime(),
      })
      callback(data.access_token)
    }

  @action
    matchFace = async (params, callback, access_token) => {
      const response = await faceMatch(params, { }, access_token)
      const { code, message, data } = response
      if (code !== 0) {
        notification.error({
          message:'错误通知',
          description:message,
        })
        return
      }

      callback(data)
    }

  @action
    faceDetect = async (params, callback, access_token) => {
      const response = await faceDetect(params, { }, access_token)
      const { code, message, data } = response
      if (code !== 0) {
        notification.error({
          message:'错误通知',
          description:message,
        })
        return
      }

      callback(data)
    }

  @action
    faceAdd = async (params, callback, access_token) => {
      const response = await faceAdd(params, { }, access_token)
      const { code, message, data } = response
      if (code !== 0) {
        notification.error({
          message:'错误通知',
          description:message,
        })
        return
      }

      callback(data)
    }

  @action
    faceSearch = async (params, callback, access_token) => {
      const response = await faceSearch(params, { }, access_token)
      const { code, message, data } = response
      if (code !== 0) {
        notification.error({
          message:'错误通知',
          description:message,
        })
        return
      }

      callback(data)
    }

  @action
    handleDelAccessToken = async (accessTokenInfo, callback) => {
      if (accessTokenInfo) {
        const day = moment().diff(moment(accessTokenInfo.times), 'day')
        if (day >= 20) {
          RemoveLocalStorage('accessTokenInfo')
          this.handleDelAccessToken(null, callback)
          return
        }
        callback(accessTokenInfo.accessToken)
      } else {
        this.getAccessToken({
          grant_type:'client_credentials',
          client_id: 'lYn1sOce6pkcT0OE0FhxfYi6',
          client_secret: 'mVk4auR7Oe138UAKLKicFe6aQm01i3WI',
        }, accessToken => {
          callback(accessToken)
        })
      }
    }

  @action
    faceLogin = async (params, callback) => {
      const response = await faceLogin(params)
      if (response && response.code === 0) {
        SetLocalStorage('userInfo', response.data.userInfo)
        SetLocalStorage('token', response.data.token)
        callback(response)
        return
      }
      notification.error({
        message:'错误通知',
        description:response.message,
      })
    }
}
export default faceStore
