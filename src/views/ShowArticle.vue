<template>
  <!-- 3. 使用动态 class 来控制布局 -->
  <div class="page-container" :class="{ 'editor-active': isEditorVisible }">
    
    <!-- 4. 监听来自 Chat 组件的自定义事件 -->
    <div class="chat-wrapper" ref="chatWrapperRef">
      <Chat @request-edit="handleRequestEdit" />
    </div>

    <!-- 新增：可拖动的分割线，并绑定 mousedown 事件 -->
    <div 
      class="resizer" 
      v-if="isEditorVisible" 
      @mousedown="startDrag"
    ></div>

    <!-- 5. 使用 Vue 的 Transition 组件来包裹 Par 组件以实现动画 -->
    <Transition name="slide-fade">
      <!-- 仅在编辑器可见且文章ID有效时显示 Par 组件 -->
      <div class="par-wrapper" v-if="isEditorVisible && articleId" ref="parWrapperRef">
        <Par :article-id="articleId" @close-editor="handleCloseEditor"  />
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect,onMounted ,onUnmounted} from 'vue';
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

// 1. 新增一个处理函数，用于关闭编辑器
const handleCloseEditor = () => {
    isEditorVisible.value = false;
      // 关键修复：重置由拖动操作添加的内联样式
    if (chatWrapperRef.value) {
        chatWrapperRef.value.style.width = ''; // 移除内联宽度，让CSS类生效
    }
    if (parWrapperRef.value) {
        parWrapperRef.value.style.width = ''; // 同理，也重置右侧面板
    }
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

// 获取 DOM 元素的引用
const chatWrapperRef = ref<HTMLElement | null>(null);
const parWrapperRef = ref<HTMLElement | null>(null);

// --- 拖动逻辑 ---
const isDragging = ref(false);

const startDrag = (event: MouseEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value || !chatWrapperRef.value || !parWrapperRef.value) return;

  // 获取父容器的宽度和左侧起始位置
  const container = chatWrapperRef.value.parentElement;
  if (!container) return;

  const containerRect = container.getBoundingClientRect();
  const containerLeft = containerRect.left;
  
  // 计算鼠标相对于父容器的位置
  const mouseX = event.clientX - containerLeft;

  // 设置左右面板的宽度
  const leftWidth = (mouseX / containerRect.width) * 100;
  const rightWidth = 100 - leftWidth;

  // 添加最小宽度限制，防止面板被拖得太小
  if (leftWidth > 20 && rightWidth > 20) {
    chatWrapperRef.value.style.width = `${leftWidth}%`;
    parWrapperRef.value.style.width = `${rightWidth}%`;
  }
};

const stopDrag = () => {
  isDragging.value = false;
};

// 在组件挂载时添加全局事件监听器
onMounted(() => {
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
});

// 在组件卸载时移除监听器，防止内存泄漏
onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
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
  /* transition: width 0.5s ease-in-out; */
}

.par-wrapper {
  width: 0; /* 默认宽度为0，不可见 */
  overflow: auto;
  /* transition: width 0.5s ease-in-out; */
}

/* 当编辑器激活时的布局 */
.page-container.editor-active .chat-wrapper {
  width: 50%; /* 左半侧 */
}

.page-container.editor-active .par-wrapper {
  width: 50%; /* 右半侧 */
}

/* 新增：拖动条的样式 */
.resizer {
  width: 5px;
  cursor: col-resize; /* 鼠标悬停时显示列拖动光标 */
  background-color: #cfcccc;
  transition: background-color 0.2s;
}
.resizer:hover {
  background-color: #007bff; /* 鼠标悬停时高亮 */
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