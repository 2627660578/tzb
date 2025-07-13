<template>
  <nav class="navbar">
    <img src="../assets/vue.svg" alt="LOGO">

    <ul class="font">
      <li>
        <router-link to="/">首页</router-link>
      </li>
      <li v-if="!(mainStore.isLoggedin)">
        <router-link to="/login">登录</router-link>
      </li>
      <li v-if="mainStore.isLoggedin">
        <router-link to="/apply">申请</router-link>
      </li>
      <li v-if="mainStore.isLoggedin">
        <router-link to="/self">个人中心</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useMainStore } from '../stores/message'
const mainStore = useMainStore()
</script>

<style scoped>
img {
  width: 100%;
  margin: 10px 0px 10px 30px;
  max-width: 40px;
  max-height: 40px;
}

.font {
  /* display: flex; */
  width: 100%;
  float: left;
  font-size: 20px;
  margin-right: 20px;
  outline: none;
}

.navbar {
  display: flex;
  position: sticky;
  float: left;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  color: white;
  box-shadow: 0 5px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  align-items: center;
  /* justify-content: center; */
}

.navbar ul {
  list-style-type: none;
  margin: 0;
}

.navbar li {
  display: inline-block;
  margin-right: 20px;
}

.navbar a {
  text-decoration: none;
  color: black;
  transition: transform 0.3s ease;
}

.navbar a:hover {
  color: #007bff;
  transform: scale(1.15);
}
</style>