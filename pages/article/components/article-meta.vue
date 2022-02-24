<!--
 * @Author: 王越
 * @Date: 2022-02-15 16:30:15
 * @LastEditTime: 2022-02-22 16:28:04
 * @LastEditors: 王越
 * @Description:收藏、关注  编辑、删除
-->
<template>
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
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>
    <template v-if="!isCreater">
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following,
        }"
        @click="onFollow()"
        :disabled="followDisabled"
      >
        <i class="ion-plus-round"></i>
        &nbsp; {{ article.author.following ? "Unfollow" : "Follow" }}
        {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
        @click="onFavorite()"
        :disabled="favoriteDisabled"
      >
        <i class="ion-heart"></i>
        &nbsp; {{ article.favorited ? "Unfavorite" : "Favorite" }} Article
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
    <template v-else-if="isCreater">
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'editor',
          params: {
            slug: article.slug,
          },
        }"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      <button class="btn btn-outline-danger btn-sm" @click="delArticle">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
  </div>
</template>

<script>
import { addFavorite, deleteFavorite, deleteArticle } from "@/api/article"
import { followUser, unFollowUser } from "@/api/profiles"
import { mapState } from "vuex"

export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      favoriteDisabled: false,
      followDisabled: false,
    }
  },
  computed: {
    ...mapState(["user"]),
    isCreater() {
      return this.user
        ? this.user.username === this.article.author.username
        : false
    },
  },
  methods: {
    async delArticle() {
      await deleteArticle(this.article.slug)
      this.$router.push({ name: "home" })
    },
    async onFollow() {
      this.followDisabled = true

      const res = this.article.author.following
        ? await unFollowUser(this.article.author.username)
        : await followUser(this.article.author.username)

      if (!res) return
      const { profile } = res.data
      $nuxt.$emit("bus", "onFollow", profile)
      this.followDisabled = false
    },
    async onFavorite() {
      this.favoriteDisabled = true

      const res = this.article.favorited
        ? await deleteFavorite(this.article.slug)
        : await addFavorite(this.article.slug)

      if (!res) return
      const { article } = res.data
      $nuxt.$emit("bus", "onFavorite", article)
      this.favoriteDisabled = false
    },
  },
}
</script>

<style></style>
