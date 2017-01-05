<template>
  <div class="config" v-if="projectData">

    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--4-col">
        <div class="config--label">Feed Timeout: {{feedTimeout}}ms</div>
        <mdl-slider @input="(v) => {this.feedTimeout = v}" :value="feedTimeout" min=500 max=10000 step=500></mdl-slider>
      </div>
      <div class="mdl-cell mdl-cell--4-col">
        <div class="config--label">Refresh Interval: {{updateInterval}}s</div>
        <mdl-slider @input="(v) => {this.updateInterval = v}" :value="updateInterval" min=300 max=3600 step=300></mdl-slider>
      </div>
      <div class="mdl-cell mdl-cell--4-col">
        <mdl-radio name="sort" @input="toggleSortOrder" val="sortAscending" :value="sortOrder">Show articles in ascending confidence order</mdl-radio>
        <mdl-radio name="sort" @input="toggleSortOrder" val="sortDescending" :value="sortOrder">Show articles in descending confidence order</mdl-radio>
      </div>
    </div>
<!--     <feed-list
      :feeds="feeds"
      @addFeed="addFeed">
    </feed-list> -->

    <!-- Successfully processed feeds -->
    <div v-if="successCount > 0">
      <h5>Successfully processed {{successCount}} feeds:</h5>
      <template v-for="feed in successFeeds">
        <div class="mdl-cell mdl-cell--12-col success">
          <processed-item
            :uid="feed.uid"
            :percentage="100 * feed.numAccepted / (feed.numAccepted + feed.numRejected)"
            buttonLabelFalse="Remove"
            buttonLabelTrue="Undo"
            :toggled="feed.removeMe"
            :dirty="feed.dirty"
            :mainText="feed.url"
            editable
            :subText="'(' + (feed.numAccepted + feed.numRejected) + ' articles, ' + feed.numAccepted + ' accepted, ' + feed.numRejected + ' rejected)'"
            @toggle="toggleSuccessFeed"
            @edit="editSuccessFeed"
          ></processed-item>
        </div>
      </template>
    </div>

    <!-- Feeds which returned errors -->
    <div v-if="errorCount > 0">
      <h5>Failed to process {{errorCount}} feeds:</h5>
      <template v-for="feed in errorFeeds">
        <div class="mdl-cell mdl-cell--12-col error">
          <processed-item
            :uid="feed.uid"
            buttonLabelFalse="Remove"
            buttonLabelTrue="Undo"
            :toggled="feed.removeMe"
            :dirty="feed.dirty"
            :mainText="feed.url"
            :mainLink="feed.url"
            :subText="feed.error"
            @toggle="toggleErrorFeed"
          ></processed-item>
        </div>
      </template>
    </div>

  </div>
</template>

<script>
// import FeedList from './FeedList'
import ProcessedItem from './ProcessedItem'

export default {
  name: 'Config',
  props: [
    'projectData'
  ],
  data () {
    return {
      feedTimeout: null,
      updateInterval: null,
      sortOrder: null,
      successFeeds: null,
      errorFeeds: null,
      newFeeds: null
    }
  },
  created () {
    this.successFeeds = _.filter(this.projectData.feeds, f => f.success === true)
    this.successFeeds.forEach(f => {
      this.$set(f, 'removeMe', false)
      this.$set(f, 'dirty', false)
    })
    this.errorFeeds = _.filter(this.projectData.feeds, f => f.success === false)
    this.errorFeeds.forEach(f => this.$set(f, 'removeMe', false))
    console.log('this.errorFeeds', this.errorFeeds)
    this.newFeeds = []
    this.feedTimeout = this.projectData.config.feedTimeout
    this.updateInterval = this.projectData.config.updateInterval
    this.sortOrder = this.projectData.config.sortOrder
  },
  computed: {
    successCount () {
      return _(this.successFeeds).size()
    },
    errorCount () {
      return _(this.errorFeeds).size()
    }
    // feeds () {
    //   // console.log(this.projectData.feeds)
    //   return _(this.projectData).has('feeds') ? this.projectData.feeds : null
    // }
    // feedHistory () {
    //   var history = {}
    //   history.errors = _(this.projectData).has('results.errors') ? this.projectData.results.errors : null
    //   history.successes = _(this.projectData).has('results.successes') ? this.projectData.results.successes : null
    //   return history
    // }
  },
  methods: {
    toggleSortOrder (v) {
      console.log(this.sortOrder, '→', v)
      this.sortOrder = v
    },
    toggleSuccessFeed (uid) {
      this._doToggle(this.successFeeds, uid)
    },
    toggleErrorFeed (uid) {
      this._doToggle(this.errorFeeds, uid)
    },
    _doToggle (feed, uid) {
      var f = _.find(feed, f => f.uid == uid)
      this.$set(f, 'removeMe', !f.removeMe)
    },
    editSuccessFeed (uid, newUrl) {
      var f = _.find(this.successFeeds, f => f.uid == uid)
      console.log('Updating feed:', f.url, ':', newUrl)
      f.url = newUrl
      f.dirty = true
    },
    addFeed (url) {
      console.log('Propagating new feed:', url)
      this.$parent.$emit('addFeed', url)
    }
    // toggleArticle (index) {
    //   // console.log('Toggling article:', index)
    //   this.$parent.$emit('toggleAccepted', index)
    // }
  },
  components: {
    ProcessedItem
  }
}
</script>

<style>
.config {
  margin: 15px;
  font-size: 16px;
}

.main-button {
  font-weight: bold;
  text-align: center;
}

.main-text {
  font-size: 14pt;
  text-decoration: none;
}

.main-text-dirty {
  font-weight: bold;
}

.main-text-toggled {
  text-decoration: line-through;
  font-style: italic;
}

.sub-text {
  font-size: 12pt;
  color: #607D8B;
}

</style>