<script setup lang="ts">
import { watch } from 'vue'; // 1. 导入 watch
import { useMainStore } from './stores/message';
import { useRouter, useRoute } from 'vue-router'; // 2. 导入 useRoute

const store = useMainStore();
const router = useRouter();
const route = useRoute(); // 获取当前路由信息，用于防止重复跳转

// 封装跳转逻辑为一个函数
const redirectToArticle = async () => {
  // 确保用户已登录并且有ID
  if (store.isLoggedin && store.id) {
    try {
      const response = await fetch(`http://localhost:3000/articles?userId=${store.id}`);
      if (!response.ok) throw new Error('获取文章失败');
      
      const userArticles = await response.json();
      
      if (userArticles && userArticles.length > 0) {
        const article = userArticles[0];
        // 只有当目标路径和当前路径不同时才跳转，避免冗余导航
        if (String(route.params.id) !== String(article.id)) {
          router.push({ name: 'ShowArticle', params: { id: article.id } });
        }
      } else {
        // 如果用户没有文章，可以留着Home页，或导航到其他页面
        console.log("用户已登录，但名下没有文章。");
      }
    } catch (error) {
      console.error('跳转到文章时出错:', error);
    }
  }
};

// 3. 使用 watch 监视登录状态
watch(() => store.isLoggedin, (isLoggedIn) => {
  if (isLoggedIn) {
    redirectToArticle();
  }
}, { immediate: true }); // 4. immediate: true 确保组件加载时立即执行一次

</script>

<template>
  <router-view />
</template>

<style scoped>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
</style>