import api from '../utils/request'

import { loginPost } from "../utils/type"

export function LoginPost(data: loginPost) {
  api.defaults.auth = {
    username: data.username,
    password: data.password,
  }
  return api.request({
    method: "post",
    url: "/api/auth/login",
  })
}


export function TestLogin() {
  return api.request({
    method: "get",
    url: "/api/auth/testlogin",
  })
}