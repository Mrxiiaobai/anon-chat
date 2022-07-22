import { observable, action} from "mobx";
import { queryLogin } from '@services/login'
import { SetLocalStorage } from '@/utils/local'

class loginStore {
  @observable
  oneNum = 3333;

  @observable
  loginInfo = null

  @action
  login = async (params, callback)=>{
    const response = await queryLogin(params)
    if(response && response.code ===0) {
      const { token } = response.data
      SetLocalStorage(token)
      this.loginInfo = response.data
      callback(response)
    }
  }
}
export default loginStore;
