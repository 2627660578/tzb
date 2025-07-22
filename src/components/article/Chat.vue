<script setup lang="ts">
import { ref, onUpdated, computed } from 'vue';

const emit = defineEmits(['request-edit']);

// --- 类型定义 ---
interface FileInfo {
  name: string;
  size: number;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  files?: FileInfo[]; // 支持多文件
}

// --- 响应式状态 ---
const messages = ref<Message[]>([]);
const userInput = ref<string>('');
const stagedFiles = ref<File[]>([]); // 1. 文件暂存区
const conversationArea = ref<HTMLElement | null>(null);
const isDragOver = ref(false);
let dragCounter = 0;
let messageIdCounter = 0;

const MAX_FILES = 3; // 最多暂存3个文件

// --- 计算属性 ---
const canAddMoreFiles = computed(() => stagedFiles.value.length < MAX_FILES);

// --- 文件处理 ---
// 2. 将文件添加到暂存区
const addFilesToStage = (files: FileList) => {
  const availableSlots = MAX_FILES - stagedFiles.value.length;
  if (availableSlots <= 0) return;
  
  const filesToAdd = Array.from(files).slice(0, availableSlots);
  stagedFiles.value.push(...filesToAdd);
};

// 从暂存区移除文件
const removeStagedFile = (index: number) => {
  stagedFiles.value.splice(index, 1);
};

// --- 核心发送逻辑 ---
// 3. 重构发送方法，同时发送文本和暂存的文件
const sendMessage = () => {
  const text = userInput.value.trim();
  const files = stagedFiles.value;

  if (!text && files.length === 0) {
    return; // 文本和文件都为空，则不发送
  }

  // 在UI上即时显示用户发送的内容
  const sentFilesInfo: FileInfo[] = files.map(f => ({ name: f.name, size: f.size }));
  messages.value.push({
    id: messageIdCounter++,
    text: text,
    sender: 'user',
    files: sentFilesInfo.length > 0 ? sentFilesInfo : undefined,
  });

  // (这里可以准备 FormData 发送到后端)
  // const formData = new FormData();
  // formData.append('text', text);
  // files.forEach(file => formData.append('files', file));
  // axios.post('/api/chat', formData);

  // 清空输入框和文件暂存区
  userInput.value = '';
  stagedFiles.value = [];

  // 检查特殊指令
  if (text === '编辑文件') {
    emit('request-edit');
  }

  // 模拟AI回复
  setTimeout(() => {
    const replyText = `已收到您的消息${files.length > 0 ? `和 ${files.length} 个文件` : ''}。`;
    messages.value.push({
      id: messageIdCounter++,
      text: replyText,
      sender: 'bot',
    });
  }, 500);
};

// --- 拖拽和文件选择事件处理 ---
const handleDragEnter = (e: DragEvent) => {
  e.preventDefault();
  if (canAddMoreFiles.value) {
    dragCounter++;
    isDragOver.value = true;
  }
};
const handleDragOver = (e: DragEvent) => { e.preventDefault(); };
const handleDragLeave = () => {
  dragCounter--;
  if (dragCounter === 0) {
    isDragOver.value = false;
  }
};
const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  dragCounter = 0;
  const files = e.dataTransfer?.files;
  if (files && canAddMoreFiles.value) {
    addFilesToStage(files); // 4. 调用新的暂存方法
  }
};

const fileInputRef = ref<HTMLInputElement | null>(null);
const triggerFileSelect = () => { fileInputRef.value?.click(); };
const handleFileSelect = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files) {
    addFilesToStage(files); // 4. 调用新的暂存方法
  }
  if (fileInputRef.value) fileInputRef.value.value = '';
};

// --- 辅助函数 ---
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

onUpdated(() => {
  if (conversationArea.value) {
    conversationArea.value.scrollTop = conversationArea.value.scrollHeight;
  }
});
</script>

<template>
  <div class="chat-container">
    <div 
      class="conversation-area" 
      ref="conversationArea"
      :class="{ 'drag-over': isDragOver }"
      @dragenter="handleDragEnter"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div v-if="isDragOver" class="drag-overlay">
        <div class="drag-hint">
          📁 释放文件以上传 (还可添加 {{ MAX_FILES - stagedFiles.length }} 个)
        </div>
      </div>
      
      <div 
        v-for="message in messages" 
        :key="message.id" 
        class="message-wrapper"
        :class="message.sender === 'user' ? 'user-message' : 'bot-message'"
      >
        <div class="message-bubble">
          <!-- 5. 同时显示文本和文件列表 -->
          <p v-if="message.text">{{ message.text }}</p>
          <div v-if="message.files && message.files.length > 0" class="files-list">
            <div v-for="(file, index) in message.files" :key="index" class="file-item">
              <span class="file-icon">📄</span>
              <span class="file-name">{{ file.name }} ({{ formatFileSize(file.size) }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. 文件暂存区 -->
    <div v-if="stagedFiles.length > 0" class="staged-files-area">
      <div v-for="(file, index) in stagedFiles" :key="index" class="staged-file">
        <span class="file-icon">📎</span>
        <span class="file-name">{{ file.name }}</span>
        <button @click="removeStagedFile(index)" class="remove-file-btn" title="移除文件">&times;</button>
      </div>
    </div>

    <!-- 底部输入区域 -->
    <div class="input-area">
      <input 
        type="file" 
        ref="fileInputRef" 
        multiple 
        @change="handleFileSelect"
        style="display: none;"
      />
      
      <button @click="triggerFileSelect" :disabled="!canAddMoreFiles" class="file-button" title="上传文件">
        ➕
      </button>
      
      <textarea
        v-model="userInput"
        class="input-box"
        placeholder="输入消息，或拖拽文件到上方..."
        @keydown.enter.prevent="sendMessage"
      ></textarea>
      <button @click="sendMessage" class="submit-button">
        提交
      </button>
    </div>
  </div>
</template>

<style scoped>
/* --- 基础和对话区样式 (与之前类似) --- */
.chat-container { 
  display: flex; 
  flex-direction: column; 
  height: 95vh; 
  width: 100%; 
  background-color: #f0f2f5; 
}
.conversation-area { 
  flex-grow: 1; 
  overflow-y: auto; 
  padding: 20px; 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
  position: relative; 
}
.conversation-area.drag-over { 
  background-color: #e3f2fd; 
}
.drag-overlay { 
  position: absolute; 
  top: 0; 
  left: 0; 
  right: 0; 
  bottom: 0; 
  background: rgba(33, 150, 243, 0.1); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  z-index: 10; 
  border: 2px dashed #2196F3; 
  border-radius: 8px; 
}
.drag-hint { 
  text-align: center; 
  font-size: 20px; 
  color: #2196F3; 
  font-weight: bold; 
}
.message-wrapper { 
  display: flex; 
  max-width: 70%; 
  font-size: 16px; 
}
.message-bubble { 
  padding: 10px 15px; 
  border-radius: 18px; 
  color: #333; 
  line-height: 1.5; 
}
.user-message { 
  align-self: flex-end; 
}
.user-message .message-bubble { 
  background-color: #2d81c2; 
  color: white; 
  border-bottom-right-radius: 4px; 
}
.bot-message { 
  align-self: flex-start; 
}
.bot-message .message-bubble { 
  background-color: #e9e9eb; 
  border-bottom-left-radius: 4px; 
}
p:not(:last-child) { 
  margin-bottom: 8px; 
}

/* --- 消息内文件列表样式 --- */
.files-list { 
  margin-top: 8px; 
  border-top: 1px solid rgba(255, 255, 255, 0.2); 
  padding-top: 8px; 
  display: flex; 
  flex-direction: column; 
  gap: 5px; 
}
.bot-message .files-list { 
  border-top-color: rgba(0, 0, 0, 0.1); 
}
.file-item { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-size: 14px; 
}
.file-icon { 
  font-size: 16px; 
}
.file-name { 
  opacity: 0.9; 
}

/* --- 7. 文件暂存区样式 --- */
.staged-files-area {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 15px;
  border-top: 1px solid #dcdcdc;
  background-color: #f8f9fa;
}
.staged-file {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  background-color: #e9ecef;
  border-radius: 15px;
  font-size: 14px;
}
.remove-file-btn {
  background: #ced4da;
  color: #495057;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-weight: bold;
}
.remove-file-btn:hover { 
  background-color: #adb5bd; 
}

/* --- 底部输入区样式 --- */
.input-area { 
  display: flex; 
  padding: 15px; 
  border-top: 1px solid #dcdcdc; 
  background-color: #ffffff; 
  gap: 10px; 
}
.file-button { 
  padding: 0 15px; 
  border: 1px solid #ccc; 
  background-color: #f8f9fa; 
  border-radius: 8px; 
  cursor: pointer; 
  font-size: 20px; 
  transition: background-color 0.2s; 
}
.file-button:hover { 
  background-color: #e9ecef; 
}
.file-button:disabled { 
  cursor: not-allowed; 
  background-color: #e9ecef; 
  opacity: 0.6; 
}
.input-box { 
  flex-grow: 1; 
  padding: 10px; 
  border: 1px solid #ccc; 
  border-radius: 8px; 
  resize: none; 
  font-size: 16px; 
  line-height: 1.5; 
  height: 50px; 
}
.input-box:focus { 
  outline: none; 
  border-color: #003153; 
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); 
}
.submit-button { 
  padding: 0 25px; 
  border: none; 
  background-color: #003153; 
  color: white; 
  border-radius: 8px; 
  cursor: pointer; 
  font-size: 16px; 
  transition: background-color 0.2s; 
}
.submit-button:hover { 
  background-color: #0056b3; 
}
</style>