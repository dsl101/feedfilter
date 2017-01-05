<template>
  <div v-if="articles !== null">
    <template v-for="(article, index) in sortedArticles">
      <processed-article
        :article="article"
        :index="index"
        :state="list == 'accepted' ? article.toggled : !article.toggled"
        @toggle="toggleArticle">
      </processed-article>
    </template>
  </div>
  <div v-else>
    <h5>No articles found</h5>
  </div>

</template>

<script>
import ProcessedArticle from './ProcessedArticle'

export default {
  props: [
    'articles',
    'list',  // So we can determine the default button state 'Reject' or 'Include'
    'order'
  ],
  data () {
    return {

    }
  },
  computed: {
    sortedArticles () {
      // FIXME rely on original index values, so sort makes it imposssible to toggle correct item
      // Need a uid for articles other than array index
      // return _.sortBy(this.projectData.results.accepted, ['confidence'])
      // console.log('Fake sorting by:', this.order)
      return this.articles
    }
  },
  methods: {
    toggleArticle (index) {
      // console.log('List toggling article:', index)
      this.$emit('toggle', index)
    }
  },
  components: {
    ProcessedArticle
  }
}
</script>

<style scoped>
h5 {
  margin: 15px;
}
</style>