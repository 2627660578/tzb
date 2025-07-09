<script setup lang="ts">
import { ref, reactive } from 'vue'

// 定义段落类型
interface Paragraph {
  id: number
  content: string
}

// 文章数据
const article = reactive<Paragraph[]>([
  {
    id: 1,
    content: "这是文章的第一段内容。在这里我们可以描述文章的主要内容和背景信息。当你将鼠标移动到这段文字上时，你会看到它变成可编辑状态。"
  },
  {
    id: 2,
    content: "这是文章的第二段内容。这一段可能包含更多的详细信息或者具体的描述。每个段落都可以独立编辑，互不影响。"
  },
  {
    id: 3,
    content: "这是文章的第三段内容。在实际应用中，这些段落可能来自数据库或者其他数据源。编辑功能让用户能够实时修改内容。"
  },
  {
    id: 4,
    content: "这是文章的最后一段内容。当你完成编辑后，点击确定按钮即可保存修改。这个功能对于内容管理系统非常有用。"
  }
])


const editingParagraph = ref<number | null>(null)
const editingContent = ref<string>('')


const startEdit = (paragraph: Paragraph) => {
  editingParagraph.value = paragraph.id
  editingContent.value = paragraph.content
}


const saveEdit = () => {
  if (editingParagraph.value !== null) {
    const paragraph = article.find(p => p.id === editingParagraph.value)
    if (paragraph) {
      paragraph.content = editingContent.value
    }
    cancelEdit()
  }
}


const cancelEdit = () => {
  editingParagraph.value = null
  editingContent.value = ''
}


const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && event.ctrlKey) {
    saveEdit()
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <div class="body">
    <h1 class="title">可编辑文章系统</h1>
    <div class="article-content">
      <div v-for="paragraph in article" :key="paragraph.id" class="paragraph-wrapper">
        <p v-if="editingParagraph !== paragraph.id" class="paragraph" @click="startEdit(paragraph)">
          {{ paragraph.content }}
        </p>
        <div v-else class="edit-mode">
          <textarea v-model="editingContent" class="edit-textarea" @keydown="handleKeydown" rows="4" placeholder="输入段落内容..." />
          <div class="edit-buttons">
            <button @click="saveEdit" class="save-btn">确定</button>
            <button @click="cancelEdit" class="cancel-btn">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../style/ShowArticle.css"
</style>