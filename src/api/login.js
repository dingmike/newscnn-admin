import request from '@/utils/request'
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    // url: '/login/login',
    url: 'auth/login',
    method: 'post',
    data
  })
}

export function getUserInfo(userId) {
  const data = {
    id: userId
  }
  return request({
    url: 'user/adminInfo',
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}
/*
export function getUserInfo(token) {
  return request({
    url: 'user/userInfo',
    method: 'get',
    params: { token }
  })
}*/

