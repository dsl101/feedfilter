<template>
  <article-list
    :articles="articles"
    :order="projectData.config.sortOrder"
    :list="list"
    @toggle="toggleArticle">
  </article-list>
</template>

<script>
import ArticleList from './ArticleList'

export default {
  props: [
    'projectData'
  ],
  data ()  {
    return {
      list: 'accepted'
    }
  },
  computed: {
    articles () {
      return _(this.projectData).has(['results', this.list]) ? this.projectData.results[this.list] : null
    }
  },
  methods: {
    toggleArticle (index) {
      // console.log('Toggling ' + this.list + ' article:', index)
      this.$parent.$emit('toggle', this.list, index)
    }
  },
  components: {
    ArticleList
  }
}
</script>
