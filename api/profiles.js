/*
 * @Author: 王越
 * @Date: 2022-02-21 11:08:43
 * @LastEditTime: 2022-02-22 17:25:58
 * @LastEditors: 王越
 * @Description:用户信息Api
 */
import { request } from "@/plugins/request"

// 获取个人资料
export const getUserInfo = (username) => {
  return request({
    method: "GET",
    url: `/api/profiles/${username}`,
    needAuthorization: true,
  })
}
// 关注用户
export const followUser = (username) => {
  return request({
    method: "POST",
    url: `/api/profiles/${username}/follow`,
    needAuthorization: true,
  })
}
// 取消关注用户
export const unFollowUser = (username) => {
  return request({
    method: "DELETE",
    url: `/api/profiles/${username}/follow`,
    needAuthorization: true,
  })
}
