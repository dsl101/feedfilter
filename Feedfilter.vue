<template>
  <div id="feedfilter">
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">

      <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">

          <mdl-button id="projectMenu" icon="more_vert"></mdl-button>
          <mdl-menu for="projectMenu">
            <mdl-menu-item v-for="project in otherProjects" :key="project" @click.native="changeProject">{{project}}</mdl-menu-item>
          </mdl-menu>

          <span class="mdl-layout__title">Project: {{currentProject}} {{dirty ? '*' : ''}}</span>
          <div class="mdl-layout-spacer"></div>

          <mdl-button id="save" icon="save" :class="{hidden: !dirty}" @click.native="saveChanges"></mdl-button>

          <mdl-button id="account" icon="account_circle"></mdl-button>
          <mdl-menu class="mdl-menu--bottom-right" for="account">
            <mdl-menu-item @click.native="changePassword">Change Password</mdl-menu-item>
            <mdl-menu-item @click.native="logout">Logout</mdl-menu-item>
          </mdl-menu>

        </div>

        <div class="mdl-layout__tab-bar mdl-js-ripple-effect">
          <a
            v-for="tab in tabs"
            :href="'#' + tab.id"
            class="mdl-layout__tab"
            :id="'tab-' + tab.id"
          >
          {{tab.label}}</a>
        </div>

      </header>

      <main class="mdl-layout__content">      
        <section class="mdl-layout__tab-panel" id="accepted">
          <template v-for="article in acceptedArticles">
            <processed-article :article="article" :key=article.id @toggle="toggleArticle"></processed-article>
          </template>
        </section>
        <section class="mdl-layout__tab-panel" id="rejected">
          <template v-for="article in rejectedArticles">
            <processed-article :article="article" :key=article.id @toggle="toggleArticle"></processed-article>
          </template>
        </section>
        <section class="mdl-layout__tab-panel" id="training">
          <div>Training data</div>
        </section>
        <section class="mdl-layout__tab-panel" id="config">
          <div>Configuration data</div>
        </section>
        <section class="mdl-layout__tab-panel" id="newsletter">
          <div>Newsletter data</div>
        </section>
      </main>

    </div>

    <div class="mdl-snackbar mdl-js-snackbar">
      <div class="mdl-snackbar__text"></div>
      <button type="button" class="mdl-snackbar__action"></button>
    </div>    

  </div>
</template>

<script>
import ProcessedArticle from './components/ProcessedArticle'
import TrainingArticle from './components/TrainingArticle'

export default {
  name: 'Feedfilter',
  mounted: function () {
    // FIXME - doesn't add - need to upgrade dom again? Or adjust how tabs are refreshed?
    // newArticles = [{
    //   id: 0,
    //   title: 'New format for articles',
    //   from: 'http://somewhere.com/made-up',
    //   conf: 100,
    //   rejected: false
    // }, {
    //   id: 1,
    //   title: 'Reality guide: A poster of how everything fits together',
    //   from: 'http://feeds.newscientist.com/space',
    //   conf: 75,
    //   rejected: false
    // }]

    // this.$set(this.processedArticles, 0, newArticles[0])
    // this.$set(this.processedArticles, 1, newArticles[1])

    // console.log('App ready:', $.fn.jquery)
    // console.log('qS: ' + '#tab-' + this.tabs[0].id + ' > span')

    // $('#tab-' + this.tabs[0].id).click()
    // var s = t.querySelectorAll(':scope > span')
    // console.log('s:', s)
    // document.querySelector('#tab-' + this.tabs[0].id).children[0].click()
    // this.tabs[0].active = true
  },
  data: function () {
    return {
      currentProject: 'KI',
      projects: [
        'KI',
        'NExSS',
        'Something else'
      ],
      // isDirty: false,
      tabs: [{
        id: 'accepted',
        label: 'Accepted Articles',
        active: true
      }, {
        id: 'rejected',
        label: 'Rejected Articles',
        active: false
      }, {
        id: 'training',
        label: 'Classifier Training',
        active: false
      }, {
        id: 'config',
        label: 'Feed Configuration',
        active: false
      }, {
        id: 'newsletter',
        label: 'Newsletter',
        active: false
      }],
      processedArticles:[
        {
          id: 0,
          title: 'New format for articles',
          from: 'http://somewhere.com/made-up',
          conf: 100,
          link: 'http://www.universetoday.com/33035/messier-27-dumbbell-nebula/',
          rejectedInitial: false,
          rejected: false
        }, {
          id: 1,
          title: 'Reality guide: A poster of how everything fits together',
          from: 'http://feeds.newscientist.com/space',
          conf: 42,
          link: 'http://www.universetoday.com/33035/messier-27-dumbbell-nebula/',
          rejectedInitial: false,
          rejected: false
        }, {
          id: 2,
          title: 'Reality guide: A poster of how everything fits together',
          from: 'http://feeds.newscientist.com/space',
          conf: 0,
          link: 'http://www.universetoday.com/33035/messier-27-dumbbell-nebula/',
          rejectedInitial: false,
          rejected: false
        }, {
          id: 3,
          title: 'Something else',
          from: 'http://somewhere.com/made-up',
          conf: 66,
          link: 'http://www.universetoday.com/33035/messier-27-dumbbell-nebula/',
          rejectedInitial: true,
          rejected: true
        }, {
          id: 4,
          title: 'Another thing',
          from: 'http://feeds.newscientist.com/space',
          conf: 33,
          link: 'http://www.universetoday.com/33035/messier-27-dumbbell-nebula/',
          rejectedInitial: true,
          rejected: true
        }
      ]
    }
  },
  computed: {
    otherProjects: function () {
      var current = this.currentProject
      return this.projects.filter(function (p) { return p !== current })
    },
    acceptedArticles: function() {
      return this.processedArticles.filter(function (a) { return a.rejectedInitial == false })
    },
    rejectedArticles: function() {
      return this.processedArticles.filter(function (a) { return a.rejectedInitial == true })
    },
    dirty: function () {
      return this.processedArticles.some(function (article) {
        return article.rejectedInitial != article.rejected
      })
    }
  },
  methods: {
    changeProject: function (e) {
      console.log('Changing from ' + this.currentProject + ' to ' + e.target.textContent)
      this.currentProject = e.target.textContent
      // this.isDirty = true
    },
    changePassword: function () {
      console.log('Changing password')
    },
    logout: function () {
      console.log('Logging out')
    },
    saveChanges: function () {
      console.log('Saving changes')
      // this.isDirty = false
      notify('Changes saved.')
    },
    toggleArticle: function (id) {
      console.log('Toggling:', id)
      this.processedArticles[id].rejected = !this.processedArticles[id].rejected
    }
  },
  components: {
    ProcessedArticle,
    TrainingArticle
  }
}

function notify (msg) {
  document.querySelector('.mdl-js-snackbar').MaterialSnackbar.showSnackbar({
    message: msg,
    timeout: 4000
  })
}
</script>

<style>
#feedfilter {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.mdl-layout__header-row {
  padding-left: 15px
}

.mdl-layout__content {
  margin: 15px;
}
</style>
