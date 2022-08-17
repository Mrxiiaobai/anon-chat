import request from '@/utils/request'

/**
 * 获取聊天群组
 * @param params
 */
export async function getGroupInfo(params = {}, headers = {}) {
  return request('/api/v1/anonymous/getGroupInfo', {
    method: 'POST',
    body: params,
    headers,
  })
}

/**
 * 获取用户信息
 * @param params
 */
export async function getUserInfo(params = {}, headers = {}) {
  return request('/api/v1/anonymous/getUserInfo', {
    method: 'POST',
    body: params,
    headers,
  })
}