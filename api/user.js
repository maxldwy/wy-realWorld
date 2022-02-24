/*
 * @Author: 王越
 * @Date: 2022-02-15 16:30:15
 * @LastEditTime: 2022-02-21 11:08:50
 * @LastEditors: 王越
 * @Description:用户Api
 */
import { request } from "@/plugins/request"

// 用户登录
export const login = (data) => {
  return request({
    method: "POST",
    url: "/api/users/login",
    data,
  })
}

// 用户注册
export const register = (data) => {
  return request({
    method: "POST",
    url: "/api/users",
    data,
  })
}

// 获取当前用户
export const getUser = () => {
  return request({
    method: "GET",
    url: "/api/user",
  })
}

// 更新用户
export const updateUser = (data) => {
  return request({
    method: "PUT",
    url: "/api/user",
    data,
  })
}
