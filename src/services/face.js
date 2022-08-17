import request from '@/utils/request'

/**
 * 获取accessToken
 * @param params
 */
export async function getAccessToken(params = {}, headers = {}) {
  return request('/api/v1/anonymous/getAccessToken', {
    method: 'POST',
    body: params,
    headers,
  })
}

/**
 * 人脸对比
 * @param params
 */
export async function faceMatch(params = {}, headers = {}) {
  return request('/api/v1/anonymous/faceMatch', {
    method: 'POST',
    body: params,
    headers,
  })
}

/**
 * 人脸检测
 * @param params
 */
export async function faceDetect(params = {}, headers = {}) {
  return request('/api/v1/anonymous/faceDetect', {
    method: 'POST',
    body: params,
    headers,
  })
}

/**
 * 人脸注册
 * @param params
 */
export async function faceAdd(params = {}, headers = {}) {
  return request('/api/v1/anonymous/faceAdd', {
    method: 'POST',
    body: params,
    headers,
  })
}

/**
 * 人脸搜索1:N
 * @param params
 */
export async function faceSearch(params = {}, headers = {}) {
  return request('/api/v1/anonymous/faceSearch', {
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
  return request('/api/v1/anonymous/facelogin', {
    method: 'POST',
    body: params,
    headers,
  })
}