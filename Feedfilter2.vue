<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">

    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">

        <mdl-button :disabled="!loggedIn || otherProjects.length == 0" id="projectMenu" icon="more_vert"></mdl-button>
        <mdl-menu for="projectMenu">
          <mdl-menu-item v-for="project in otherProjects" :key="project" @click.native="changeProject">{{project}}</mdl-menu-item>
        </mdl-menu>

        <span class="mdl-layout__title">{{loggedIn ? (currentProject ? (loading ? 'Loading ' : '') + currentProject : 'No projects') : 'Please log in'}} {{dirty ? '*' : ''}}</span>
        <mdl-spinner v-if="loading" active></mdl-spinner>

        <mdl-button accent v-for="(label, id) in tabs"
          :id="id"
          :class="{activeTab: id == currentView}"
          @click.native="changeTab"
          :disabled="!ready">
          {{label}}
        </mdl-button>

        <div class="mdl-layout-spacer"></div>

        <mdl-button id="save" :disabled="!ready" icon="save" :class="{hidden: !dirty}" @click.native="saveChanges"></mdl-button>

        <!-- Add project should be v-if, but causes menu to stick open -->
        <!-- Event fires here regardless of disabled state, so need to guard in handler too. Meh. -->
        <mdl-button id="account" :disabled="!loggedIn" icon="account_circle"></mdl-button>
        <mdl-menu class="mdl-menu--bottom-right" for="account">
          <mdl-menu-item :disabled="!canAddProject" @click.native="newProject">New Project</mdl-menu-item>
          <mdl-menu-item @click.native="changePassword">Change Password</mdl-menu-item>
          <mdl-menu-item @click.native="logout">Logout</mdl-menu-item>
        </mdl-menu>

      </div>

    </header>

    <transition name="fade" mode="out-in">
      <component :project-data="projectData" :is="currentView" keep-alive></component>
    </transition>

    <!-- Snackbar for notifications -->
    <div class="mdl-snackbar mdl-js-snackbar">
      <div class="mdl-snackbar__text"></div>
      <button type="button" class="mdl-snackbar__action"></button>
    </div>    

    <!-- Dialog for new projects -->
    <mdl-dialog ref="newProject" title="Add new project">
      <mdl-textfield
        ref="name"
        v-model.trim="newProjectName"
        @keyup.native.enter="addProject"
        @keyup.native.esc="dontAddProject"
        floating-label="Project Name">
      </mdl-textfield>
      <template slot="actions">
        <mdl-button colored :disabled="!newProjectName" @click.native="addProject">Add Project</mdl-button>
        <mdl-button colored @click.native="dontAddProject">Cancel</mdl-button>
      </template>
    </mdl-dialog>

  </div>
</template>

<script>

import * as firebase from 'firebase'
import Login from './components/Login'
import AddProject from './components/AddProject'
import Accepted from './components/Accepted'
import Rejected from './components/Rejected'
import Training from './components/Training'
import Config from './components/Config'

var session  // Firebase session holder

export default {
  name: 'Feedfilter',
  created() {
    // Events which child components can raise here
    this.$on('login', this.login)
    this.$on('toggle', this.toggleArticle)
    this.$on('addFeed', this.addFeed)

    // Watch for authentication events
    firebase.auth().onAuthStateChanged((user) => {
      if(firebase.auth().currentUser) {  // Logged in
        console.log(' → logged in')
        this.onLoggedIn()
      } else {
        console.log(' → logged out')
        this.onLoggedOut()
      }
    })
  },
  data: () => ({
    loggedIn: false,
    currentUser: null,
    userRef: null,
    roles: null,
    currentProject: null,
    newProjectName: null,
    loading: false,
    currentView: null,
    isDirty: false,
    lastView: null,
    projectData: null,
    tabs: {
      accepted: 'Accepted Articles',
      rejected: 'Rejected Articles',
      training: 'Classifier Training',
      config: 'Feed Configuration',
      newsletter: 'Newsletter'
    },
    projects: [],
  }),
  computed: {
    // tabInvalid(id) {
    //   console.log('Checking for valid tab:', id)
    //   if(!this.ready) {
    //     return true  // All tabs are invalid if we're not 'ready'
    //   }
    //   switch(id) {
    //     case 'accepted', 'rejected':
    //       return _(this.projectData).has(['results'], id)  // Make sure we've got some results
    //       break;
    //     case 'training':
    //       return _(this.projectData).has([''])
    //   }
    //   return !this.ready && _(this.projectData).has([])
    // },
    canAddProject () {
      return _(this.roles).includes('addProjects')
    },
    otherProjects () {
      var current = this.currentProject
      return this.projects.filter(function (p) { return p !== current })
    },
    ready () {
      return this.loggedIn && this.projectData
    }
  },
  watch: {
    currentProject() {
      console.log('Got project switch:', this.currentProject)
      if(this.currentProject) {
        this.loading = true
        firebase.database().ref('/projects/').child(this.currentProject).once('value')
        .then(snapshot => {
          console.log('Updating projectData:', snapshot.val())
          console.log('from project:', this.currentProject)
          this.projectData = snapshot.val()
          console.log('Project Data:', this.projectData)
          this.loading = false
          this.currentView = this.lastView ? this.lastView : 'accepted'
        })
      } else {
        this.projectData = null
      }
    }
  },
  methods: {
    handleChildEvent (e, data) {
      console.log('Got event:', e, data)
    },
    changeTab (e) {
      // console.log('Activate:', e.target.id)
      // console.log('projectData:', this.projectData)
      this.currentView = e.target.id
      this.userRef.update({
        lastView: this.currentView
      })
    },
    newProject () {
      if(this.canAddProejct) {
        this.$refs.newProject.open()
      }
    },
    addProject () {
      if(this.newProjectName) {
        console.log('Add new project:', this.newProjectName)
        this.$refs.newProject.close()
      }
    },
    dontAddProject () {
      console.log('Cancel new project')
      this.$refs.newProject.close()
    },
    changeProject (e) {
      console.log('Changing from ' + this.currentProject + ' to ' + e.target.textContent)
      this.currentProject = e.target.textContent
      this.userRef.update({
        lastProject: this.currentProject
      })
    },
    changePassword () {
      console.log('Changing password')
    },
    login (email, password) {
      this.currentView = null
      // this.email = email  // Store for later so we can update the FB user record if login succeeds
      firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(e => {
        var ec = e.code
        var em = e.message
        // console.log(ec, em)
        if(ec == 'auth/user-not-found' || ec == 'auth/wrong-password') {
          notify('Wrong username / password')
        } else {
          notify(em)
        }
        this.currentView = 'login'
      })
    },
    logout () {
      firebase.auth().signOut()
    },
    onLoggedOut() {
      this.currentProject = null
      this.currentView = 'login'
      this.loggedIn = false
    },
    onLoggedIn () {
      // console.log('currentUser:', firebase.auth().currentUser)
      this.currentUser = firebase.auth().currentUser
      this.userRef = firebase.database().ref('/users/').child(this.currentUser.uid)
      this.userRef.once('value')
      .then(snapshot => {
        var userRec = snapshot.val()
        // Rather than test, just always update email, since we're updating lastLogin anyway
        this.userRef.update({
          email: this.currentUser.email,
          lastLogin: (new Date()).toString()
        })
        // console.log(snapshot.val())
        this.projects = _(userRec.projects).pickBy((p) => p == true).keys().value()
        this.roles = _(userRec.roles).pickBy((p) => p == true).keys().value()
        this.currentProject = userRec.lastProject ? userRec.lastProject : _.size(this.projects) > 0 ? this.projects[0] : null
        this.lastView = userRec.lastView
      })
      this.loggedIn = true
    },
    saveChanges () {
      console.log('Saving changes')
      notify('Changes saved.')
    },
    toggleArticle (dataRoot, index) {
      console.log('Toggling item ' + index + ' in ' + dataRoot)
      var cv = this.projectData.results[dataRoot][index].toggled
      this.$set(this.projectData.results[dataRoot][index], 'toggled', !cv)
    },
    addFeed (url) {
      console.log('Adding new feed:', url)
      if(this.projectData.feeds) {
        this.projectData.feeds.push({url: url})
      } else {
        this.$set(this.projectData, 'feeds', [{url: url}])
      }
    }
  },
  components: {
    Login,
    AddProject,
    Accepted,
    Rejected,
    Training,
    Config
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

.mdl-spinner {
  margin-right: 15px
}
.mdl-spinner::after {
  display: none;
}
.mdl-layout__header-row {
  padding-left: 15px
}

.activeTab {
  border-bottom: 2px solid rgb(255,171,64)
}

.mdl-layout__title {
  padding-right: 15px
}

.mdl-layout__content {
  margin: 15px;
}

.mdl-card {
  margin: 15px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter, .fade-leave-active {
  opacity: 0;
}

.mdl-dialog__title {
  font-size: 14pt;
}
</style>
