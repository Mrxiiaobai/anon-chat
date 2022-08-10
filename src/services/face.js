import request from '@/utils/request'

/**
 * 获取accessToken
 * @param params
 */
export async function getAccessToken(params = {}, headers = {}) {
  return request('https://aip.baidubce.com/oauth/2.0/token', {
    method: 'GET',
    body: params,
    headers,
  })
}

/**
 * 人脸对比
 * @param params
 */
export async function faceMatch(params = {}, headers = {}, access_token = '') {
  return request(`https://aip.baidubce.com/rest/2.0/face/v3/match?access_token=${ access_token }`, {
    method: 'POST',
    body: params,
    headers,
  })
}

/**
 * 人脸检测
 * @param params
 */
export async function faceDetect(params = {}, headers = {}, access_token = '') {
  return request(`https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=${ access_token }`, {
    method: 'POST',
    body: params,
    headers,
  })
}

/**
 * 人脸注册
 * @param params
 */
export async function faceAdd(params = {}, headers = {}, access_token = '') {
  return request(`https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token=${ access_token }`, {
    method: 'POST',
    body: params,
    headers,
  })
}

/**
 * 人脸搜索1:N
 * @param params
 */
export async function faceSearch(params = {}, headers = {}, access_token = '') {
  return request(`https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=${ access_token }`, {
    method: 'POST',
    body: params,
    headers,
  })
}

/**
 * 人脸登录
 * @param params
 */
export async function faceLogin(params = {}, headers = {}) {
  return request('/api/v1/anonymous/login', {
    method: 'POST',
    body: params,
    headers,
  })
}