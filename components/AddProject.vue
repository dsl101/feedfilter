<template>
  <div class="mdl-card mdl-shadow--6dp">
    <div class="mdl-card__supporting-text">
      <form action="#">
        <mdl-textfield ref="name" v-model.trim="projectName" @keyup.native.enter="onEnter" floating-label="Project Name"></mdl-textfield>
      </form>
    </div>
    <mdl-button colored :disabled="!projectName" @click.native="addProject">Add Project</mdl-button>
  </div>
</template>

<script>
export default {
  name: 'AddProject',
  data () {
    return {
      projectName: null
    }
  },
  methods: {
    onEnter (e) {
      if(this.projectName) {  // Ready to go
        this.addProject()
      }
    },
    addProject () {
      this.$parent.$emit('addProject', this.projectName)
    }
  }
}
</script>

<style scoped>
.mdl-card {
  height: 100px;
}
