<script setup lang="ts">
import { ref, onUpdated } from 'vue';

// 1. 使用 defineEmits 定义组件可以发出的事件
const emit = defineEmits(['request-edit']);

// 定义单条消息的类型
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot'; // 'user' 代表用户, 'bot' 代表模拟的AI
}

// 对话历史记录
const messages = ref<Message[]>([]);
// 用户当前输入的内容
const userInput = ref<string>('');
// 用于生成唯一ID的计数器
let messageIdCounter = 0;

// 获取对话容器的 DOM 引用
const conversationArea = ref<HTMLElement | null>(null);

// 提交新消息的方法
const sendMessage = () => {
  const trimmedInput = userInput.value.trim();
  if (!trimmedInput) {
    return; // 如果输入为空，则不执行任何操作
  }

  // 1. 将用户输入的消息添加到对话历史中
  messages.value.push({
    id: messageIdCounter++,
    text: trimmedInput,
    sender: 'user',
  });
// 2. 检查用户的输入，如果是特定指令，则发出事件
  if (trimmedInput === '编辑文件') {
    emit('request-edit');
  }

  // 2. 清空输入框
  userInput.value = '';

  // 3. 模拟一个AI回复
  simulateBotResponse(trimmedInput);
};

// 模拟AI的回复
const simulateBotResponse = (userText: string) => {
  setTimeout(() => {
    // 3. 根据输入提供不同的回复
    const botReply = userText === '编辑文件'
      ? '文档编辑开启中'
      : `收到了你的消息： "${userText}"。这是一个模拟的回复。`;

    messages.value.push({
      id: messageIdCounter++,
      text: botReply,
      sender: 'bot',
    });
  }, 500); // 缩短回复时间以获得更好的体验
};

// 每次DOM更新后，自动滚动到底部
onUpdated(() => {
  if (conversationArea.value) {
    conversationArea.value.scrollTop = conversationArea.value.scrollHeight;
  }
});

</script>

<template>
  <div class="chat-container">
    <!-- 对话展示区域 -->
    <div class="conversation-area" ref="conversationArea">
      <div 
        v-for="message in messages" 
        :key="message.id" 
        class="message-wrapper"
        :class="message.sender === 'user' ? 'user-message' : 'bot-message'"
      >
        <div class="message-bubble">
          <p>{{ message.text }}</p>
        </div>
      </div>
    </div>

    <!-- 底部输入区域 -->
    <div class="input-area">
      <textarea
        v-model="userInput"
        class="input-box"
        placeholder="在这里输入您的消息..."
        @keydown.enter.prevent="sendMessage"
      ></textarea>
      <button @click="sendMessage" class="submit-button">
        提交
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 95vh; /* 占满整个视口高度 */
  width: 100%;
  background-color: #f0f2f5; /* 淡灰色背景 */
  font-family: Arial, sans-serif;
}

.conversation-area {
  flex-grow: 1; /* 占据所有可用空间 */
  overflow-y: auto; /* 内容超出时显示滚动条 */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px; /* 消息之间的间距 */
}

.message-wrapper {
  display: flex;
  max-width: 70%;
  font-size: 16px;
}

.message-bubble {
  padding: 0px 10px;
  border-radius: 10px;
  color: #333;
  line-height:28px;
}

/* 用户消息的样式 */
.user-message {
  align-self: flex-end; /* 靠右对齐 */
}
.user-message .message-bubble {
  background-color: #2d81c2; /* 蓝色气泡 */
  color: white;
  border-bottom-right-radius: 4px; /* 增加一点对话框的感觉 */
}

/* AI机器人消息的样式 */
.bot-message {
  align-self: flex-start; /* 靠左对齐 */
}
.bot-message .message-bubble {
  background-color: #e9e9eb; /* 浅灰色气泡 */
  border-bottom-left-radius: 4px;
}

.input-area {
  display: flex;
  padding: 15px;
  border-top: 1px solid #dcdcdc;
  background-color: #ffffff;
}

.input-box {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none; /* 禁止用户调整大小 */
  font-size: 16px;
  line-height: 1.5;
  margin-right: 10px;
  height: 50px; /* 初始高度 */
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