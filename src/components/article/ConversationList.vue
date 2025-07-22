<script setup lang="ts">
import type { PropType } from 'vue';

// --- 类型定义 ---
interface Conversation {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
}

// --- Props & Emits ---
defineProps({
  conversations: {
    type: Array as PropType<Conversation[]>,
    required: true,
  },
  activeConversationId: {
    type: Number as PropType<number | null>,
    default: null,
  },
});

const emit = defineEmits(['select-conversation', 'new-conversation']);

// --- 事件处理 ---
const selectConversation = (id: number) => {
  emit('select-conversation', id);
};

const newConversation = () => {
  emit('new-conversation');
};
</script>

<template>
  <div class="conversation-list-container">
    <button @click="newConversation" class="new-chat-btn">
      ➕ 开启新对话
    </button>
    <ul class="conversation-list">
      <li
        v-for="convo in conversations"
        :key="convo.id"
        class="conversation-item"
        :class="{ active: convo.id === activeConversationId }"
        @click="selectConversation(convo.id)"
      >
        <span class="chat-icon">💬</span>
        <span class="chat-title">{{ convo.title }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.conversation-list-container {
  width: 260px;
  height: 100%;
  background-color: #e9e9eb;
  padding: 15px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #dcdcdc;
}

.new-chat-btn {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s;
}

.new-chat-btn:hover {
  background-color: #f8f9fa;
}

.conversation-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
}

.conversation-item {
  padding: 12px 15px;
  margin-bottom: 5px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-item:hover {
  background-color: #dcdcdc;
}

.conversation-item.active {
  background-color: #003153;
  color: white;
  font-weight: bold;
}

.chat-title {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>