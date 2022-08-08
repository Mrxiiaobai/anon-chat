import axios from 'axios'
import { notification } from 'antd'
// import router from 'umi/router';
import { GetLocalStorage } from './local'
// import { Utils } from './utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

const instance = axios.create({
  timeout: 10000,
})

instance.defaults.headers.common.token = GetLocalStorage('token')

// // 请求拦截器
// instance.interceptors.request.use(req=>{

// }, err=>{

// });
// 响应拦截器
// instance.interceptors.reponse.use(req=>{
//   console.log(req, '-----响应拦截器---')
// }, err=>{
//   console.log(err, '-----响应拦截器err---')
// });

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const errortext = codeMessage[response.status] || response.statusText
  notification.error({
    message: errortext,
    duration:2,
  })
  const error = new Error(errortext)
  error.name = response.status
  error.response = response
  throw error
}

const checkCode = response => {
  const { data } = response
  const { code, message } = data
  if (code < 0) {
    return { data:'', message }
  }
  return data
}

const requestMethods = {
  'POST':(url, params, headers) => instance.post(url, params, { headers }),
  'GET':(url, params, headers) => instance.get(url, { ...params, ...headers }),
}

export default function request(url, option) {
  // let _url = ''
  const options = { ...option }
  // const token = GetGlobalToken()
  const headers = { ...option.headers }
  const newOptions = {  ...options, headers }
  // const headers = { ...(token ? { token } : {}) }

  // const newOptions = { ...options, headers }
  if (
    newOptions.method === 'POST'
    || newOptions.method === 'PUT'
    || newOptions.method === 'DELETE'
  ) {
    // _url = url
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      }
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      }
    }
  }
  const { body, method } = newOptions
  return requestMethods[method](url, body, newOptions.headers)
    .then(checkStatus)
    .then(checkCode)
    .then(response => {
      console.log(response, '-----response------')
      return response
    })
    .catch(e => {
      console.log(e)
    })
}