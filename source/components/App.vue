<template>
    <div>
        <user-data v-for="(formData, index) in users" :form="formData" :index="index" :key="index" @updateUser="updateUser"></user-data>
    </div>
</template>

<script>

  import UserData from './UserData.vue'

  function getData(index){
    return new Promise(function(resolve, reject) {
      chrome.extension.sendMessage({ getFormData: true, index: index  }, resolve)
    });
  }

  function setData(){
    return new Promise(function(resolve, reject) {
      chrome.extension.sendMessage({ setFormData: true }, resolve)
    });
  }

  export default {
    data() {
      let users = JSON.parse(localStorage.getItem('users'));
      return {
        users
      }
    },
    methods: {
      updateUser(){
        setData().then( data => this.$set(this, 'users', data) );
      }
    },
    components: {
      UserData
    }
  }
</script>