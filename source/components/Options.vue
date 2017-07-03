<template>
    <section class="wrapper">
        <options-header @addUser="addUser" :showBack="showBack" @back="resetActiveUser"></options-header>
        <section v-if="activeUser">
            <user-data :form="activeUser" :index="activeIndex" :key="activeIndex" @updateUser="updateData"></user-data>
        </section>
        <section v-else>
            <table class="user-list">
                <user-item v-for="(formData, index) in users"
                           :form="formData" :index="index" :key="index"
                           @editUser="idx => activeUser = users[idx]"
                           @deleteUser="deleteUser"></user-item>
            </table>
        </section>
    </section>
</template>

<script>

  import OptionsHeader from './OptionsHeader.vue';
  import UserItem from './UserItem.vue';
  import UserData from './UserData.vue';

  function setData(){
    return new Promise(function(resolve, reject) {
      chrome.runtime.sendMessage({ setFormData: true }, resolve)
    });
  }

  export default {
    data() {
      let users = JSON.parse(localStorage.getItem('users'));
      return {
        users,
        activeUser: users.length === 1 ? users[0] : false,
        showBack: users.length === 1 ? false : this.activeUser
      }
    },
    computed: {
      activeIndex(){
        return this.users.indexOf(this.activeUser);
      }
    },
    watch: {
      activeUser(val){
        this.showBack = val === 0 && this.users.length === 1 ? false : val;
      }
    },
    methods: {

      addUser(){
        let localData = JSON.parse(localStorage.users);
        localData.push({});
        localStorage.users = JSON.stringify(localData);
        this.updateData();
        this.resetActiveUser();
      },

      deleteUser(idx){
        let localData = JSON.parse(localStorage.users);
        localData.splice(idx, 1);
        localStorage.users = JSON.stringify(localData);
        this.updateData();
      },

      updateData(){
        setData().then( data => this.$set(this, 'users', data) );
      },

      resetActiveUser(){
        this.activeUser = false
      }
    },
    components: {
      OptionsHeader,
      UserItem,
      UserData
    }
  }
</script>