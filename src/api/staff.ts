/*
与员工信息相关的接口
*/
import api from "../utils/request"

// 获取员工信息
export function GetStaffInfo() {
  return api.request({
    method: 'get',
    url: '/api/staff/',
  })
}  
