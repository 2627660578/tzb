<script setup lang="ts">
import { ref,watch, nextTick } from 'vue'
import axios from 'axios'
import { marked } from 'marked'

// 定义 props 来接收父组件传递的文章 ID
const props = defineProps<{
  articleId: string | number
}>()

// 配置 marked 选项
marked.setOptions({
  breaks: true,
  gfm: true,
})

// 定义文章类型
interface Article {
  id: number
  title: string
  content: string
}

// 定义段落类型
interface Paragraph {
  id: number
  content: string
  renderedContent: string
}

// 文章数据
const article = ref<Article | null>(null)
const paragraphs = ref<Paragraph[]>([])
const editingParagraph = ref<number | null>(null)
const editingContent = ref<string>('')
const loading = ref<boolean>(false)
const editTextarea = ref<HTMLTextAreaElement | null>(null)

// 将 markdown 内容按大标题拆分为段落
const splitContentIntoParagraphs = async (content: string): Promise<Paragraph[]> => {
  const sections = content.split(/(?=^# )/m).filter(section => section.trim())
  return Promise.all(sections.map(async (section, index) => ({
    id: index + 1,
    content: section.trim(),
    renderedContent: await marked(section.trim())
  })))
}

// 从 json-server 获取文章数据
const fetchArticle = async (id: string | number) => {
  if (!id) return
  loading.value = true
  try {
    const response = await axios.get(`http://localhost:3000/articles/${id}`)
    if (response.data && response.data.content) {
      article.value = response.data
      paragraphs.value = await splitContentIntoParagraphs(response.data.content)
    } else {
      console.error('文章数据格式不正确')
      article.value = null
      paragraphs.value = []
    }
  } catch (error) {
    console.error('获取文章失败:', error)
    article.value = null
    paragraphs.value = []
  } finally {
    loading.value = false
  }
}

// 保存单个段落
const saveParagraph = async (paragraphId: number) => {
  if (!article.value || !editingContent.value.trim()) {
    cancelEdit()
    return
  }
  
  try {
    const paragraphIndex = paragraphs.value.findIndex(p => p.id === paragraphId)
    if (paragraphIndex !== -1) {
      paragraphs.value[paragraphIndex].content = editingContent.value
      paragraphs.value[paragraphIndex].renderedContent = await marked(editingContent.value)
    }
    
    const mergedContent = paragraphs.value.map(p => p.content).join('\n\n')
    
    await axios.put(`http://localhost:3000/articles/${article.value.id}`, {
      ...article.value,
      content: mergedContent
    })
    
    article.value.content = mergedContent
    cancelEdit()
  } catch (error) {
    console.error('保存段落失败:', error)
  }
}

// 开始编辑指定段落
const startEdit = (paragraphId: number) => {
  const paragraph = paragraphs.value.find(p => p.id === paragraphId)
  if (paragraph) {
    editingParagraph.value = paragraphId
    editingContent.value = paragraph.content
    // 使用 nextTick 确保 DOM 更新后再聚焦
    nextTick(() => {
      editTextarea.value?.focus()
    })
  }
}

// 取消编辑
const cancelEdit = () => {
  editingParagraph.value = null
  editingContent.value = ''
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    if (editingParagraph.value) {
      saveParagraph(editingParagraph.value)
    }
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}

// 监听 articleId prop 的变化，如果变化了就重新获取文章
watch(() => props.articleId, (newId) => {
  fetchArticle(newId)
}, { immediate: true }) // immediate: true 确保组件初始加载时也执行

</script>

<template>
  <div class="body">
    <h1 class="title">{{ article?.title || (loading ? '加载中...' : '加载失败') }}</h1>
    <div class="article-content">
      <div v-if="loading" class="loading">
        正在加载文章...
      </div>

      <div v-else-if="article && paragraphs.length > 0" class="paragraphs-container">
        <div 
          v-for="paragraph in paragraphs" 
          :key="paragraph.id" 
          class="paragraph-wrapper"
        >
          <!-- 显示模式 -->
          <div 
            v-if="editingParagraph !== paragraph.id" 
            class="paragraph" 
            @click="startEdit(paragraph.id)"
            title="点击编辑"
          >
            <div v-html="paragraph.renderedContent" class="markdown-content"></div>
          </div>

          <!-- 编辑模式 -->
          <div v-else class="edit-mode">
            <textarea 
              v-model="editingContent" 
              class="edit-textarea" 
              @keydown="handleKeydown" 
              rows="10" 
              placeholder="输入 Markdown 内容..." 
              ref="editTextarea"
            />
            <div class="edit-buttons">
              <button @click="saveParagraph(paragraph.id)" class="save-btn">确定 (Ctrl+Enter)</button>
              <button @click="cancelEdit" class="cancel-btn">取消 (Esc)</button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="error">
        文章加载失败或内容为空，请刷新页面重试。
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../style/ShowArticle.css"
</style>