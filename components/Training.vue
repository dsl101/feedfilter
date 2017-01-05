<template>
  <div v-if="projectData">
    <h3>Included articles</h3>
    <template v-for="(title, index) in projectData.training.include">
      <training-item :title="title" :index="index" :state="article.toggled" :key=index @toggle="toggleArticle"></processed-article>
      <!-- <p>{{index}} : {{title}}</p> -->
    </template>

    <h3>Excluded articles</h3>
    <template v-for="(title, index) in projectData.training.exclude">
      <!-- <processed-article :article="article" :index="index" :state="article.toggled" :key=index @toggle="toggleArticle"></processed-article> -->
      <p>{{index}} : {{title}}</p>
    </template>

  </div>
</template>

<script>
import TrainingItem from './TrainingItem'

export default {
  name: 'Training',
  props: [
    'projectData'
  ],
  // created () {
  //   this.$on('toggleArticle', toggleArticle)
  // },
  computed: {
    sortedArticles () {
      // FIXME rely on original index values, so sort makes it imposssible to toggle correct item
      // Need a uid for articles other than array index
      // return _.sortBy(this.projectData.results.accepted, ['confidence'])
      return this.projectData.results.accepted
    }
  },
  methods: {
    toggleArticle (index) {
      // console.log('Toggling article:', index)
      this.$parent.$emit('toggleAccepted', index)
    }
  },
  components: {
    TrainingItem
  }
}
</script>
