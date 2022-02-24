<!--
 * @Author: 王越
 * @Date: 2022-02-15 16:30:15
 * @LastEditTime: 2022-02-23 09:41:03
 * @LastEditors: 王越
 * @Description:设置页面
-->
<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="data.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="data.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="data.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="data.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="data.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  required
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { updateUser } from "@/api/user"
// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require("js-cookie") : undefined

export default {
  middleware: "authenticated",
  name: "SettingsIndex",
  data() {
    return {
      data: { password: "" },
    }
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    Object.assign(this.data, this.user)
  },
  methods: {
    async onSubmit() {
      const { data } = await updateUser({ user: this.data })
      const { user } = data

      this.$store.commit("setUser", user)

      // 为了防止刷新页面数据丢失，我们需要把数据持久化
      Cookie.set("user", user)

      // 跳转到首页
      this.$router.push({
        name: "profile",
        params: {
          username: user.username,
        },
      })
    },
    logout() {
      this.$store.commit("clearUser")
      Cookie.remove("user")
      this.$router.push({ path: "/" })
    },
  },
}
</script>

<style></style>
