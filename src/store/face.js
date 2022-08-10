import { observable, action } from 'mobx'
import moment from 'moment'
import { notification } from 'antd'
import {
  getAccessToken, faceMatch, faceDetect, faceAdd, faceSearch, faceLogin,
} from '@services/face'
import { SetLocalStorage, RemoveLocalStorage } from '@/utils/local'

class faceStore {
  @observable
    groupInfo = []

  @action
    getAccessToken = async (params, callback) => {
      const response = await getAccessToken(params)
      SetLocalStorage('accessTokenInfo', {
        accessToken:response.access_token,
        times:new Date().getTime(),
      })
      callback(response.access_token)
    }

  @action
    matchFace = async (params, callback, access_token) => {
      const response = await faceMatch(params, { }, access_token)
      callback(response)
    }

  @action
    faceDetect = async (params, callback, access_token) => {
      const response = await faceDetect(params, { }, access_token)
      callback(response)
    }

  @action
    faceAdd = async (params, callback, access_token) => {
      const response = await faceAdd(params, { }, access_token)
      callback(response)
    }

  @action
    faceSearch = async (params, callback, access_token) => {
      const response = await faceSearch(params, { }, access_token)
      callback(response)
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
