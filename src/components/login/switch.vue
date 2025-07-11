<template>
    <div id="switch-cnt" class="switch">
      <!-- 状态1 -->
      <div id="switch-c1" class="switch__container is-hidden">
        <h2 class="title">已持有账号？</h2>
        <p class="switch__description description">
          点击登录，开始您的旅程！
        </p>
        <button class="switch__button button switch-btn" @click="change">
          SIGN IN
        </button>
      </div>
      <!-- 状态2 -->
      <div id="switch-c2" class="switch__container">
        <h4 class="title">未持有账号？</h4>
        <p class="switch__description description">
          点击注册，加入我们！
        </p>
        <button class="switch__button button switch-btn" @click="change">
          SIGN UP
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useMainStore } from '../../stores/message'
  const mainStore = useMainStore()
  
  const change = () => {
    // 加上as any防止ts类型检查报错
    const switchC1 = document.querySelector('#switch-c1') as any
    const switchC2 = document.querySelector('#switch-c2') as any
  
    switchC1.classList.toggle('is-hidden')
    switchC2.classList.toggle('is-hidden')
    mainStore.showSignin = !mainStore.showSignin
  }
  </script>
  
  <style scoped>
  @import '../../style/login.css';
  /*
    将源码中的css样式单独存放,在各组件中导入就可以。
    后续整理代码时建议，将全局样式和局部样式分开。
    */
  </style>
  