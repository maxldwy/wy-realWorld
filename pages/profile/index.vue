<!--
 * @Author: 王越
 * @Date: 2022-02-15 16:30:15
 * @LastEditTime: 2022-02-23 15:42:42
 * @LastEditors: 王越
 * @Description:用户信息
-->
<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button
              v-if="user.username !== profile.username"
              class="btn btn-sm  action-btn"
              :class="{
                'btn-outline-secondary': profile.following,
              }"
              @click="onFollow()"
              :disabled="followDisabled"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ profile.following ? "Unfollow" : "Follow" }} Eric Simons
            </button>
            <nuxt-link
              v-else
              ui-sref="app.settings"
              class="btn btn-sm btn-outline-secondary action-btn"
              to="/settings"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: $route.params.tab !== 'favorites',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: $route.params.tab === 'favorites',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                      tab: 'favorites',
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{
                  article.createdAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited,
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  v-for="tag in article.tagList"
                  :key="tag"
                  class="tag-default tag-pill tag-outline"
                >
                  {{ tag }}
                </li>
              </ul>
            </nuxt-link>
          </div>

          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="limit"
            layout="total, prev, pager, next, jumper"
            :total="articlesCount"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo, followUser, unFollowUser } from "@/api/profiles"
import { getArticles, addFavorite, deleteFavorite } from "@/api/article"
import { mapState } from "vuex"

export default {
  middleware: "authenticated",
  name: "UserProfile",
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    async "$route.params"() {
      if (this.$route.name === "profile") {
        if (this.profile.username !== this.$route.params.username) {
          const { data } = await getUserInfo(this.$route.params.username)
          const { profile } = data
          this.profile = profile
          this.getList()
        } else {
          this.page = 1
          this.getList()
        }
      }
    },
  },
  async created() {
    const { data } = await getUserInfo(this.$route.params.username)
    const { profile } = data
    this.profile = profile
    this.getList()
  },
  data() {
    return {
      limit: 2,
      page: 1,
      articlesCount: 0,
      articles: [],
      profile: {},
      followDisabled: false,
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    async getList() {
      this.articles = []

      const params =
        this.$route.params.tab === "favorites"
          ? { favorited: this.profile.username }
          : { author: this.profile.username }

      params.limit = this.limit
      params.offset = (this.page - 1) * this.limit
      const { data } = await getArticles(params)
      const { articles, articlesCount } = data
      articles.forEach((article) => (article.favoriteDisabled = false))

      this.articlesCount = articlesCount
      this.articles = articles
    },
    async onFollow() {
      this.followDisabled = true

      const res = this.profile.following
        ? await unFollowUser(this.profile.username)
        : await followUser(this.profile.username)

      if (!res) return
      const { profile } = res.data
      this.profile = profile
      this.followDisabled = false
    },
    async onFavorite(article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
  },
}
</script>

<style></style>
