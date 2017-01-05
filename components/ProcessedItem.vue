<template>
  <div class="mdl-card mdl-shadow--4dp">
    <div class="mdl-card__meta">

      <!-- Coloured Percentage -->
      <mdl-button v-if="percentage"
        fab
        :style="{backgroundColor: computeColour}"
        class="percentage">
        {{percentage.toFixed(1)}}%
      </mdl-button>
      <mdl-button v-else
        fab
        class="percentage">
      </mdl-button>

      <!-- Toggle Button -->
      <mdl-button raised colored 
        @click.native="toggleClick"
        :class="[toggled ? 'mdl-color--red' : 'mdl-color--green', 'main-button']">
        {{toggled ? buttonLabelTrue : buttonLabelFalse}}
      </mdl-button>
    </div>

    <!-- Main text -->
    <div class="mdl-card__title">
      <!-- Editable -->
      <mdl-textfield v-if="editable"
        v-model="mainText"
        :class="[{'main-text-dirty': dirty}, {'main-text-toggled': toggled}, 'mdl-card__title-text', 'main-text']"
        @input="edit"
      ></mdl-textfield>
      <!-- Not Editable -->
      <a v-else
        :class="[isClean() ? 'main-text-clean' : 'main-text-dirty', 'mdl-card__title-text', 'main-text']"
        target="_blank"
        :href="mainLink"
      >{{mainText}}</a>
    </div>

    <!-- Sub text -->
    <div class="mdl-card__supporting-text">
      <a
        class="sub-text"
        target="_blank"
        :href="subLink"
      >{{subText}}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    uid: null,
    percentage: null,
    toggled: Boolean,  // The 'toggled' flag
    buttonLabelFalse: String,  // Toggle button label when toggled is false
    buttonLabelTrue: String,  // Toggle button label when toggled is true
    dirty: Boolean,  // Maintains the dirty flag for text style
    mainText: String,
    mainLink: String,  // If the main text should be a link - can't be used with editable
    editable: {  // If the main text should be editable (default no)
      type: Boolean,
      default: false
    },
    subText: String,
    subLink: String
  },
  computed: {
    computeColour () {
      var norm = this.percentage / 100;  // 0 to 1
      var hue = (norm * 120).toString(10);
      return ['hsl(', hue, ',100%, 75%)'].join('');
    }
  },
  methods: {
    isClean () {
      // console.log('computing isClean()')
      return !this.dirty
    },
    toggleClick () {
      // console.log('state:', Boolean(this.state))
      // console.log('initialState:', Boolean(this.initialState))
      // console.log('Toggling:', this.uid)
      this.$emit('toggle', this.uid)
    },
    edit (e) {
      this.$emit('edit', this.uid, e.target.innerText)
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

.percentage {
  margin: 15px;
  font-size: 12pt;
}

.mdl-card__title {
  padding-top, padding-left, padding-right: 16px;
  padding-bottom: 0
}

.mdl-textfield {
  width: 100%;
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

</style>
