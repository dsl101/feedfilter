<template>
  <div class="mdl-card mdl-shadow--6dp">
    <div class="mdl-card__supporting-text">
      <form action="#">
        <mdl-textfield
          ref="email"
          v-model.trim="loginEmail"
          @keyup.native.enter="onEnter"
          floating-label="Email Address">
        </mdl-textfield>
        <mdl-textfield
          ref="password"
          v-model.trim="loginPassword"
          @keyup.native.enter="onEnter"
          floating-label="Password"
          type="password">
          </mdl-textfield>
      </form>
    </div>
    <mdl-button colored :disabled="!loginEmail || !loginPassword" @click.native="login">Log in</mdl-button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginEmail: null,
      loginPassword: null
    }
  },
  methods: {
    onEnter (e) {
      if(this.loginEmail && this.loginPassword) {  // Ready to go
        this.login()
      } else if(e.target.type == "text") {  // Move to password
        this.$refs.password.focus().select()
      } else {  // Move to password if it's still blank
        this.$refs.email.focus().select()
      }
    },
    login () {
      // console.log('email', this.loginEmail)
      // console.log('password', this.loginPassword)
      this.$parent.$emit('login', this.loginEmail, this.loginPassword)
    }
  }
}
</script>
