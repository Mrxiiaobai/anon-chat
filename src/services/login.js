import request from '@/utils/request'

/**
 * 登录
 * @param params
 */
export async function queryLogin(params = {}, headers = {}) {
  return request('/api/v1/anonymous/login', {
    method: 'POST',
    body: params,
    headers,
  })
}

/**
 * 注册
 * @param params
 */
export async function regeisterUser(params = {}, headers = {}) {
  return request('/api/v1/anonymous/regeister', {
    method: 'POST',
    body: params,
    headers,
  })
}