<template>
  <div class="mdl-grid">

    <!-- Successfully processed feeds -->
    <div v-if="successCount > 0">
      <h5>Successfully processed {{successCount}} feeds:</h5>
      <template v-for="(feed, index) in successFeeds">
        <div class="mdl-cell mdl-cell--12-col">
          <processed-item
            :uid="index"
            :percentage="100 * feed.numAccepted / (feed.numAccepted + feed.numRejected)"
            :toggleA="Remove"
            :toggleB="Undo"
            initialState="true"
            state="true"
            :mainText="feed.url"
            :mainLink="feed.url"
            mainClassA="clean"
            mainClassB="dirty"
            :subText="'(' + (feed.numAccepted + feed.numRejected) + ' articles, ' + feed.numAccepted + ' accepted, ' + feed.numRejected + ' rejected)'"
            subClass="history"
          ></processed-item>
        </div>
      </template>
    </div>

    <!-- Feeds which returned errors -->
    <div v-if="errorCount > 0">
      <h5>Failed to process {{errorCount}} feeds:</h5>
      <template v-for="(feed, index) in errorFeeds">
        <div class="mdl-cell mdl-cell--12-col">
          <processed-item
            :toggleA="Remove"
            :toggleB="Undo"
            :initialState="true"
            :state="true"
            :mainText="feed.url"
            :mainLink="feed.url"
            :subText="feed.error"
            :uid="index">
          </processed-item>
        </div>
      </template>
    </div>

    <!-- New feeds added but not saved yet -->
    <div v-if="newFeedsCount > 0">
      <h5>Not yet processed {{newFeedsCount}} new feeds:</h5>
      <template v-for="(feed, index) in newFeeds">
        <div class="mdl-cell mdl-cell--12-col">
          <processed-item
            :toggleA="Remove"
            :toggleB="Undo"
            :initialState="true"
            :state="true"
            :mainText="feed.url"
            :mainLink="feed.url"
            :uid="index">
          </processed-item>
        </div>
      </template>
    </div>

    <!-- Label for no feeds -->
    <div v-if="successCount == 0 && errorCount == 0" class="mdl-cell mdl-cell--12-col">
      <h5>No processed feeds found</h5>
    </div>

    <div class="mdl-cell mdl-cell--12-col">
      <h5>Add new feed</h5>
      <mdl-textfield
        ref="newFeed"
        v-model.trim="newFeed"
        @keyup.native.enter="onEnter"
        floating-label="Enter new feed URL">
      </mdl-textfield>
      <mdl-button colored :disabled="!newFeed" @click.native="addFeed">Add feed</mdl-button>
    </div>
  </div>
</template>

<script>
import ProcessedItem from './ProcessedItem'

export default {
  props: [
    'feeds'
  ],
  data () {
    return {
      newFeed: null
    }
  },
  created () {
    console.log('feeds: ', this.feeds)
    console.log('successFeeds:', this.successFeeds)
    console.log('errorFeeds:', this.errorFeeds)
    console.log('newFeedsCount:', this.newFeedsCount)
    console.log('newFeeds:', this.newFeeds)
  },
  computed: {
    successFeeds () {
      return _.filter(this.feeds, f => f.success === true)
    },
    successCount () {
      return _(this.successFeeds).size()
    },
    errorFeeds () {
      return _.filter(this.feeds, f => f.success === false)
    },
    errorCount () {
      return _(this.errorFeeds).size()
    },
    newFeeds () {
      return _.filter(this.feeds, f => f.success === undefined)
    },
    newFeedsCount () {
      return _(this.newFeeds).size()
    }
    // sortedArticles () {
    //   // FIXME rely on original index values, so sort makes it imposssible to toggle correct item
    //   // Need a uid for articles other than array index
    //   // return _.sortBy(this.projectData.results.accepted, ['confidence'])
    //   // console.log('Fake sorting by:', this.order)
    //   return this.articles
    // }
  },
  methods: {
    onEnter (e) {
      if(this.newFeed) {  // Ready to go
        this.addFeed()
      }
    },
    addFeed () {
      // console.log('email', this.loginEmail)
      console.log('Adding feed:', this.newFeed)
      this.$emit('addFeed', this.newFeed)
    }
  },
  components: {
    ProcessedItem
  }
}
</script>

<style scoped>
h5 {
  margin: 15px;
}

.feed {
  padding: 5px;
}

.clean {
  font-size: 14pt;
  font-weight: normal;
  text-decoration: none;
}

.dirty {
  font-weight: bold;
}

.history {
  font-size: 12pt;
  color: #607D8B;
}
.error {
  font-size: 12pt;
  color: #f01010;
}
</style>