<template>
    <div id="a-container" class="container a-container is-hidden">
      <form class="form">
        <h2 class="title">Create Account</h2>

        <div>
          <input class="form__input" type="text" placeholder="输入账号" v-model="account" @input="validateAccount" />
          <span class="error-message" v-if="accountError">{{ accountError }}</span>
        </div>
        <div>
          <input class="form__input" type="password" placeholder="输入密码" v-model="password" @input="validatePassword" />
          <span class="error-message" v-if="passwordError">{{ passwordError }}</span>
        </div>
        <div>
          <input class="form__input" type="password" placeholder="确认密码" v-model="confirmPassword"
            @input="validateConfirmPassword" />
          <span class="error-message" v-if="confirmPasswordError">{{ confirmPasswordError }}</span>
        </div>
        <div>
          <input class="form__input" type="text" placeholder="输入姓名" v-model="username" @input="validateUsername" />
          <span class="error-message" v-if="usernameError">{{ usernameError }}</span>
        </div>
  
        <button class="form__button button submit" @click="handleSignup" type="button">SIGN UP</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useMainStore } from '../../stores/message'
  import { storeToRefs } from 'pinia'
  import { watch, ref } from 'vue'
  import axios from 'axios'
  
  const mainStore = useMainStore()
  const { showSignin } = storeToRefs(mainStore)
  
  const student_id = ref('')
  const account = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const username = ref('')
  
  // const idError = ref('')
  const accountError = ref('')
  const passwordError = ref('')
  const confirmPasswordError = ref('')
  const usernameError = ref('')
  
  // const idRegex = /^\d{10}$/;
  const accountRegex = /^[a-zA-Z0-9._]+$/;
  const usernameRegex = /^[a-zA-Z\u4e00-\u9fa5\s._]+$/; // 允许中文
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=$${};':"\\|,.<>\/?]+$/;
  
  const validateAccount = () => {
    if (!accountRegex.test(account.value)) {
      accountError.value = '账号只能包含字母、数字、下划线和点'
    } else {
      accountError.value = ''
    }
    if (account.value.length < 6 || account.value.length > 20) {
      accountError.value = '账号长度必须在6到20位之间'
    }
  }
  
  const validatePassword = () => {
    if (!passwordRegex.test(password.value)) {
      passwordError.value = '密码只能包含字母、数字'
    } else {
      passwordError.value = ''
    }
    if (password.value.length < 6 || password.value.length > 20) {
      passwordError.value = '密码长度必须在6到20位之间'
    }
  }
  
  const validateConfirmPassword = () => {
    if (password.value !== confirmPassword.value) {
      confirmPasswordError.value = '确认密码与输入密码不一致'
    } else {
      confirmPasswordError.value = ''
    }
  }
  
  const validateUsername = () => {
    if (!usernameRegex.test(username.value)) {
      usernameError.value = '姓名只能包含字母、中文字符、空格、下划线和点'
    } else {
      usernameError.value = ''
    }
    if (username.value.length < 2 || username.value.length > 20) {
      usernameError.value = '姓名长度必须在2到20位之间'
    }
  }
  
  watch(showSignin, () => {
    // document.querySelector方法可以查找页面中的DOM元素。定位id为a-container的容器
    // any 类型用于忽略TypeScript的类型检查
    const aContainer = document.querySelector('#a-container') as any
    // 方法用于切换类：如果元素已经有 is-txl 类，则移除它；如果没有，则添加它
    aContainer.classList.toggle('is-hidden')
  })
  
  // 定义一个方法来处理表单提交
  // async表示axios请求是异步的
  const handleSignup = async (event: any) => {
  
    if (account.value == "" || password.value == "" || confirmPassword.value == "" || username.value == "") {
      alert('请填写所有必填项')
      event.preventDefault()
      return
    }
  
    if (accountError.value != "" || passwordError.value != "" || confirmPasswordError.value != "" || usernameError.value != "") {
      alert('存在输入错误，请检查提示信息')
      event.preventDefault()
      return
    }
  
    const signupData = {
      username: username.value,
      account: account.value,
      password: password.value,
      student_id: student_id.value,
      identity: 'user'
    }
  
    try {
      await axios.post('http://localhost:3000/users', signupData)
      alert('注册成功')
      mainStore.showSignin = false
  
    } catch (error) {
      console.error('注册失败:', error)
      alert('注册失败，请重试')
    }
  }
  </script>
  
  <style scoped>
  @import '../../style/login.css';
  /* 将源码中的css样式单独存放,在各组件中导入就可以。*/
  </style>
  