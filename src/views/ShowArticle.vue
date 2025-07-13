<template>
  <!-- 3. 使用动态 class 来控制布局 -->
  <div class="page-container" :class="{ 'editor-active': isEditorVisible }">
    
    <!-- 4. 监听来自 Chat 组件的自定义事件 -->
    <div class="chat-wrapper">
      <Chat @request-edit="handleRequestEdit" />
    </div>

    <!-- 5. 使用 Vue 的 Transition 组件来包裹 Par 组件以实现动画 -->
    <Transition name="slide-fade">
      <!-- 仅在编辑器可见且文章ID有效时显示 Par 组件 -->
      <div class="par-wrapper" v-if="isEditorVisible && articleId">
        <Par :article-id="articleId" />
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Par from "../components/article/Par.vue";
import Chat from '../components/article/Chat.vue';
const route = useRoute(); 
const articleId = ref<string | number | null>(null);

// 1. 新增一个状态来控制编辑器是否可见
const isEditorVisible = ref(false);

// 2. 定义一个处理函数，当接收到事件时调用
const handleRequestEdit = () => {
  isEditorVisible.value = true;
};

// 使用 watchEffect 来响应路由参数的变化
// 当 route.params.id 变化时，这个函数会自动重新运行
watchEffect(() => {
    const id = route.params.id;

    if (id) {
        // 将 id 转换为数字或保持为字符串，取决于你的需要
        articleId.value = Array.isArray(id) ? id[0] : id;
    } else {
        articleId.value = null;
    }
});
</script>

<style scoped>
@import "../style/ShowArticle.css";

.page-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 60px);  
  transition: all 0.5s ease-in-out;
}

.chat-wrapper {
  width: 100%; /* 默认占据全部宽度 */
  transition: width 0.5s ease-in-out;
}

.par-wrapper {
  width: 0; /* 默认宽度为0，不可见 */
  overflow: auto;
  transition: width 0.5s ease-in-out;
}

/* 当编辑器激活时的布局 */
.page-container.editor-active .chat-wrapper {
  width: 50%; /* 左半侧 */
}

.page-container.editor-active .par-wrapper {
  width: 50%; /* 右半侧 */
  border-left: 3px solid #cfcccc; /* 添加一个分割线 */
}

/* 6. 定义滑入动画的样式 */
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>