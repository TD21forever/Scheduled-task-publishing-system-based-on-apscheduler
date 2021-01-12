import api from '../utils/request'
import { jobPostData, sqlPost } from "../utils/type"
/*
与定时任务相关的接口
*/

/*
新建任务
*/
export function AddJob<T>(data: T) {
  return api.request({
    method: "post",
    url: "api/job/add",
    data
  })
}
/*
删除任务
*/
export function DeleteJob(data: jobPostData) {
  return api.request({
    method: "post",
    url: "/api/job/remove",
    data

  })
}
/*
暂停任务
*/
export function PauseJob(data: jobPostData) {
  return api.request({
    method: "post",
    url: "/api/job/pause",
    data

  })
}
/*
恢复任务
*/
export function ResumeJob(data: jobPostData) {
  return api.request({
    method: "post",
    url: "/api/job/resume",
    data

  })
}
/*
获取当前所有任务
*/
export function ShowJobs() {
  return api.request({
    method: "get",
    url: "/api/job/show",
  })
}
/*
获取当前任务
*/
export function ShowJob(data: string) {
  return api.request({
    method: "get",
    url: "/api/job/show?jobid=" + data,
  })
}

/*
获取当前任务
*/
export function TestSql(data: sqlPost) {
  return api.request({
    method: "post",
    url: "/api/job/testsql",
    data
  })
}