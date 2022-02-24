<!--
 * @Author: 王越
 * @Date: 2022-02-17 21:25:04
 * @LastEditTime: 2022-02-21 11:14:35
 * @LastEditors: 王越
 * @Description:评论功能
-->
<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          v-model="comment"
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
        ></textarea>
      </div>
      <div class="card-footer">
        <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
        <button
          type="button"
          @click="postComment"
          class="btn btn-sm btn-primary"
        >
          Post Comment
        </button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
        >
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{
          comment.createdAt | date("MMM DD, YYYY")
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, postComments } from "@/api/article"

export default {
  name: "ArticleComments",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comment: "", //评论
      comments: [], // 文章列表
    }
  },
  async mounted() {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  },
  methods: {
    async postComment() {
      const { data } = await postComments(this.article.slug, {
        comment: {
          body: this.comment,
        },
      })
      this.comments.push(data.comment)
    },
  },
}
</script>

<style></style>
