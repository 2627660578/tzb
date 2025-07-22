<template>
    <div class="body">
      <div class="main">
        <LoginSign_in />
        <LoginSign_up />
        <LoginSwitch />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import LoginSign_in from '../components/login/sign_in.vue'
  import LoginSign_up from '../components/login/sign_up.vue'
  import LoginSwitch from '../components/login/switch.vue'
  </script>
  
  <style scoped>
  @import "../style/login.css";
  </style>
  