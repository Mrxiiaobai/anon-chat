import { observable, action } from 'mobx'
import { notification } from 'antd'
import { getGroupInfo } from '@services/home'

class homeStore {
  @observable
    groupInfo = []

  @action
    getGroupInfo = async (params, callback) => {
      const response = await getGroupInfo(params)
      if (response && response.code === 0) {
        this.groupInfo = response.data
        callback(response.data)
        return
      }
      notification.error({
        message:'错误通知',
        description:response.message,
      })
    }
}
export default homeStore
