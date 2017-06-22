<template>
    <div v-if="loaded">
        <user-data v-for="(form, index) in users" :form="form" :index="index" :key="index" @updateUser="updateUser"></user-data>
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
      return {
        users: [
          {}
        ],
        loaded: false
      }
    },
    beforeCreate(){
      getData().then(data => {
        this.$set(this, 'users', data);
        this.loaded = true;
      });
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