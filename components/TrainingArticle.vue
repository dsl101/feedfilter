<template>
  <div class="TrainingArticle">

  <div class="mdl-card mdl-shadow--4dp">
    <div class="mdl-card__meta">
      <mdl-button fab id="conf" :style="{backgroundColor: _computeConfColour}" class="confidence">{{article.conf}}%</mdl-button>
      <mdl-button raised colored 
        @click.native="_toggleClick"
        :class="[article.rejected ? 'mdl-color--green accept' : 'mdl-color--red reject']"
        >{{article.rejected ? 'Include' : 'Reject'}}
      </mdl-button>
    </div>
    <div class="mdl-card__title">
       <a class="mdl-card__title-text article" target="_blank" :href="article.link">{{article.title}}</h1>
    </div>
    <div class="mdl-card__supporting-text">
      from: <a class="from" target="_blank" :href="article.from">{{article.from}}</a>
    </div>
  </div>

  </div>
</template>

<script>
export default {
  name: 'TrainingArticle',
  props: [
    'article'
  ],
  computed: {
    _computeConfColour: function () {
      var norm = this.article.conf / 100;  // 0 to 1
      var hue = (norm * 120).toString(10);
      return ['hsl(', hue, ',100%, 75%)'].join('');
    }
  },
  methods: {
    _toggleClick: function () {
      console.log('Toggling:', this.article.title)
      this.$emit('toggle', this.article.id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mdl-card {
  width: 99%;
  margin: 5px;
  min-height: 100px;
  flex-direction: column;
  height: 1vh; /* 1 */
  padding-left: 180px;
}

.confidence {
  margin: 15px;
  font-size: 12pt;
}

.reject, .accept {
  font-weight: bold;
}

.mdl-card__title {
  padding-top, padding-left, padding-right: 16px;
  padding-bottom: 0
}

.mdl-card__meta {
  left: 0;
  position: absolute;
  width: 200px;
}
  
.mdl-card__supporting-text {
  flex: 1 1 auto;
  width: auto;
}

.article {
  font-size: 14pt;
  font-weight: normal;
  text-decoration: none;
}

a.from {
  all: unset;
}
</style>
