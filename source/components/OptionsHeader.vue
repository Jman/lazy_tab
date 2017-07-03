<template>
    <header>
        <h1>Magento Form Filler</h1>
        <template v-if="showBack">
            <button @click="back" class="back">Back</button>
        </template>
        <template v-else>
        <button @click="addUser">Create New User</button>
        </template>
    </header>
</template>

<script>
  export default {
    props: ['showBack'],
    methods: {
      addUser(){
        this.$emit('addUser');
      },
      back(){
        this.$emit('back');
      }
    }
  }
</script>