<template>
    <ul>
        <li v-for="(formData, index) in users" @click="selectUser(formData)">{{ formData.email }}</li>
    </ul>
</template>

<script>
  export default {
    data() {
      let users = JSON.parse(localStorage.getItem('users'));
      return {
        users
      }
    },
    methods: {
      selectUser(formData){
        chrome.tabs.query({active:true}, (tabs) => {
          chrome.tabs.sendMessage( tabs[0].id, { FORMData: formData }, () => window.close())
        });
      }
    }
  }
</script>