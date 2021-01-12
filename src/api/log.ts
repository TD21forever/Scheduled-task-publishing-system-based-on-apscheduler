import api from '../utils/request'
import { jobDelete } from "../utils/type"

// 获取员工信息
export function GetLogInfo() {
  return api.request({
    method: 'get',
    url: '/api/log/',
  })
}

export function DeleteLog(data: jobDelete) {
  return api.request({
    method: 'post',
    url: '/api/log/logdel',
    data
  })
}  
