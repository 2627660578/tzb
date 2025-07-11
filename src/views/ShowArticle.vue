<template>
    <div>
        <!-- 仅当 articleId 有效时才渲染 Par 组件，并传递 ID -->
        <Par v-if="articleId" :article-id="articleId" />
        <div v-else>
            <p>正在加载或文章 ID 无效...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Par from "../components/Par.vue";

const route = useRoute(); 
const articleId = ref<string | number | null>(null);

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
</style>