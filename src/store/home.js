import { observable, action } from 'mobx'
import { notification } from 'antd'
import { getGroupInfo, getUserInfo } from '@services/home'

class homeStore {
  @observable
    groupInfo = []

  @observable
    faceloginStatus = false

  @action
    getGroupInfo = async (params, callback) => {
      const response = await getGroupInfo(params)
      if (response && response.code === 0) {
        this.groupInfo = response.data
        if (callback) callback(response.data)
        return
      }
      notification.error({
        message:'错误通知',
        description:response.message,
      })
    }

   @action
     getUserInfo = async (params, callback) => {
       const response = await getUserInfo(params)
       if (response && response.code === 0) {
         this.faceloginStatus = response.data.facelogin
         if (callback) callback(response.data)
         return
       }
       notification.error({
         message:'错误通知',
         description:response.message,
       })
     }
}
export default homeStore
