import request from '@/utils/request'

export function fetchGoodsList(query) {
  return request({
    url: 'goods/list',
    method: 'get',
    params: query
  })
}

export function searchGoods(query) {
  return request({
    url: 'goods/search',
    method: 'get',
    params: query
  })
}
export function downUpGoods(data) {
  return request({
    url: 'goods/downUp',
    method: 'post',
    data
  })
}
export function deleteGoods(query) {
  return request({
    url: 'goods/delete',
    method: 'get',
    params: query
  })
}

export function fetchArticle() {
  return request({
    url: '/article/detail',
    method: 'get'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
