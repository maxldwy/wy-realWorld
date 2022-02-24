/*
 * @Author: 王越
 * @Date: 2022-02-15 16:30:15
 * @LastEditTime: 2022-02-22 16:21:58
 * @LastEditors: 王越
 * @Description:
 */
/*
 * @Author: 王越
 * @Date: 2022-02-15 16:30:15
 * @LastEditTime: 2022-02-22 11:12:13
 * @LastEditors: 王越
 * @Description:
 */
/**
 * 基于 axios 封装的请求模块
 */

import axios from "axios"

// 创建请求对象
export const request = axios.create({
  baseURL: "https://conduit.productionready.io",
})

// 通过插件机制获取到上下文对象（query、params、req、res、app、store...）
// 插件导出函数必须作为 default 成员
export default ({ store, redirect }) => {
  //Axios取消请求
  const CancelToken = axios.CancelToken
  // 请求拦截器
  // Add a request interceptor
  // 任何请求都要经过请求拦截器
  // 我们可以在请求拦截器中做一些公共的业务处理,例如统一设置 token
  request.interceptors.request.use(
    function(config) {
      let cancel
      // Do something before request is sent
      config.cancelToken = new CancelToken((c) => {
        cancel = c
      })

      // 请求就会经过这里
      const { user } = store.state

      //需要用户登录的请求，不符合跳转login并取消请求
      if (config.needAuthorization && !user) {
        redirect("/login")
        cancel()
      }

      if (user && user.token) {
        config.headers.Authorization = `Token ${user.token}`
      }

      // 返回 config 请求配置对象
      return config
    },
    function(error) {
      // 如果请求失败(此时请求还没有发出去)就会进入这里
      // Do something with request error
      return Promise.reject(error)
    }
  )

  request.interceptors.response.use(
    (data) => {
      return data
    },
    (error) => {
      try {
        if (error.response.status === 401) {
          redirect("/login")
        } else {
          return Promise.reject(error.response.data.message)
        }
      } catch (error) {}
    }
  )
}
