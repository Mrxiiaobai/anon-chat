import Login from './login'
import Home from './home'
import Face from './face'

const loginStore = new Login()
const homeStore = new Home()
const faceStore = new Face()

const stores = {
  loginStore,
  homeStore,
  faceStore,
}
export default stores
