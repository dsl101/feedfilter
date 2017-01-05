import VueMdl from 'vue-mdl'
import Vue from 'vue'
import Feedfilter from './Feedfilter2'
import * as firebase from 'firebase'

Vue.use(VueMdl)

var fbConfig = {
  apiKey: 'AIzaSyD-8ufIk2M7Hbpmr8ulgDvMhykJUoK6Qmo',
  authDomain: 'feedfilter-hub-ki.firebaseapp.com',
  databaseURL: 'https://feedfilter-hub-ki.firebaseio.com',
};
// var fbConfig = {
//   apiKey: 'AIzaSyAFXGUXxxwoUz98eeocPlswYl8VYSTTBwU',
//   authDomain: 'tests3lambda.firebaseapp.com',
//   databaseURL: 'https://tests3lambda.firebaseio.com',
// };
firebase.initializeApp(fbConfig);

/* eslint-disable no-new */
new Vue({
  el: '#feedfilter',
  template: '<Feedfilter/>',
  components: { Feedfilter }
})
