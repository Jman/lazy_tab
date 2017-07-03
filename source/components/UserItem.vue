<template>
    <tr @click.prevent="editUser">
        <td class="index">{{ index }}</td>
        <td class="name">{{form.email}}</td>
        <td class="actions">
            <a href="#">edit</a> |
            <a href="#" @click.stop.prevent="deleteUser">delete</a>
        </td>
    </tr>
</template>

<script>
  export default {
    props: ['form', 'index'],
    methods: {
      editUser(){
        this.$emit('editUser', this.index);
      },
      deleteUser(){

        this.$emit('deleteUser', this.index);
      }
    }
  }
</script>