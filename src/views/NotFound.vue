<template>
    <div class="not-found">
      <h1>404</h1>
      <p>页面未找到</p>
      <router-link to="/" class="home-link">返回首页</router-link>
    </div>
  </template>
  
  <script setup lang="ts">
  // 404页面逻辑
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    padding: 100px 20px;
  }
  
  .not-found h1 {
    font-size: 4rem;
    color: #999;
    margin-bottom: 20px;
  }
  
  .home-link {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 20px;
  }
  </style>