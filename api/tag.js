/*
 * @Author: 王越
 * @Date: 2022-02-15 16:30:15
 * @LastEditTime: 2022-02-21 10:58:20
 * @LastEditors: 王越
 * @Description:标签Api
 */
import { request } from "@/plugins/request"

// 获取文章标签列表
export const getTags = () => {
  return request({
    method: "GET",
    url: "/api/tags",
  })
}
