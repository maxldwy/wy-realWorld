<!--
 * @Author: 王越
 * @Date: 2022-02-15 16:30:15
 * @LastEditTime: 2022-02-21 11:15:03
 * @LastEditors: 王越
 * @Description:添加、编辑 文章
-->
<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="article.body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <!-- <fieldset class="form-group">
                  <input type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
              </fieldset> -->
              <button
                @click="submit"
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postArticle, editArticle, getArticle } from "@/api/article"
export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: "authenticated",
  name: "EditorIndex",
  data() {
    return {
      article: {
        title: "",
        description: "",
        body: "",
      },
    }
  },
  async mounted() {
    if (this.$route.params.slug) {
      const { data } = await getArticle(this.$route.params.slug)
      const { article } = data
      this.article = article
    }
  },
  methods: {
    async submit() {
      const { data } = this.$route.params.slug
        ? await editArticle(this.$route.params.slug, { article: this.article })
        : await postArticle({ article: this.article })

      this.$router.push({
        name: "article",
        params: {
          slug: data.article.slug,
        },
      })
    },
  },
}
</script>

<style></style>
