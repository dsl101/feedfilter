<template>
  <article-list
    :articles="articles"
    :order="projectData.config.sortOrder"
    @toggle="toggleArticle">
  </article-list>
</template>

<script>
import ArticleList from './ArticleList'
const list="rejected"

export default {
  props: [
    'projectData'
  ],
  computed: {
    articles () {
      return _(this.projectData).has(['results', list]) ? this.projectData.results[list] : null
    }
  },
  methods: {
    toggleArticle (index) {
      // console.log('Toggling ' + list + ' article:', index)
      this.$parent.$emit('toggle', list, index)
    }
  },
  components: {
    ArticleList
  }
}
</script>
