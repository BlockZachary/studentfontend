<template>
  <div class="welcome-container">
    <div class="custom-card bg-white shadow rounded p-4 mb-5">
      <h2 class="text-center text-primary">欢迎来到本系统</h2>
      <p class="text-center mt-3">您好 <span :style="{ color: '#116ca9' }">{{ user.name }}</span>，祝您使用愉快！</p>
    </div>
  </div>
</template>

<script setup>
import request from "@/utils/request";

const user = JSON.parse(localStorage.getItem('student-user') || '{}')
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px); /* 根据实际项目需要调整高度 */
}

.custom-card {
  max-width: 400px;
  border: none;
}
</style>