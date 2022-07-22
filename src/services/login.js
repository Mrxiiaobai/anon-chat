import request from '@/utils/request';

/**
 * 登录
 * @param params 
 */
export async function queryLogin(params={}, headers={}) {
  return request('/api/v1/Anon Chat/login', {
    method: 'POST',
    body: params,
    headers,
  })
};