import Login from './login'
import Home from './home'

const loginStore = new Login()
const homeStore = new Home()

const stores = {
  loginStore,
  homeStore,
}
export default stores
