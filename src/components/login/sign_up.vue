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
        <!-- <div>
          <input class="form__input" type="text" placeholder="输入姓名" v-model="username" @input="validateUsername" />
          <span class="error-message" v-if="usernameError">{{ usernameError }}</span>
        </div> -->
  
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
  
  // const student_id = ref('')
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
  // const usernameRegex = /^[a-zA-Z\u4e00-\u9fa5\s._]+$/; // 允许中文
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
  
  // const validateUsername = () => {
  //   if (!usernameRegex.test(username.value)) {
  //     usernameError.value = '姓名只能包含字母、中文字符、空格、下划线和点'
  //   } else {
  //     usernameError.value = ''
  //   }
  //   if (username.value.length < 2 || username.value.length > 20) {
  //     usernameError.value = '姓名长度必须在2到20位之间'
  //   }
  // }
  
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
  
    // if (account.value == "" || password.value == "" || confirmPassword.value == "" || username.value == "") {
    if (account.value == "" || password.value == "" || confirmPassword.value == "" ) {
      alert('请填写所有必填项')
      event.preventDefault()
      return
    }
  
    if (accountError.value != "" || passwordError.value != "" || confirmPasswordError.value != "" || usernameError.value != "") {
      alert('存在输入错误，请检查提示信息')
      event.preventDefault()
      return
    }
  
    // const signupData = {
    //   username: username.value,
    //   mobile: account.value,
    //   password: password.value,
    //   student_id: student_id.value,
    //   identity: 'user'
    // }
      // 1. 构建符合新接口要求的数据对象
    // 注意：我们将表单中的 "account" 字段用作新接口的 "mobile"
    const signupData = {
      mobile: account.value,
      password: password.value,
      // 如果新接口也需要用户名，可以在这里加上
      // username: username.value 
    }
    try {
      const response = await axios.post('/api/usercenter/v1/user/register', signupData)
      
      // 检查响应状态码和返回的数据中是否包含 accessToken
      if ((response.status === 200 || response.status === 201) && response.data.accessToken) {
        alert('注册并登录成功！')
        
        // 1. 调用 store 中的 loginWithToken action 来处理 token
        mainStore.loginWithToken({ accessToken: response.data.accessToken });

        // 2. 跳转到首页，App.vue 中的 watch 会接管后续的智能跳转
        mainStore.toggleSignup()

      } else {
        // 处理成功但响应数据不符合预期的情况
        alert('注册成功，但服务器返回数据异常。')
      }
  
    } catch (error:any) {
       // 4. 优化错误处理，提供更明确的提示
       if (error.response) {
        // 服务器返回了错误状态码 (如 400, 409, 500)
        console.error('注册失败:', error.response.data)
        alert('注册失败: ' + (error.response.data.message || '该手机号可能已被注册'))
      } else if (error.request) {
        // 请求已发出，但没有收到响应
        console.error('服务器无响应:', error.request)
        alert('注册失败: 无法连接到服务器，请检查网络')
      } else {
        // 请求设置时出错
        console.error('请求错误:', error.message)
        alert('注册失败: 请求发送时发生错误')
      }
    }
  }
  </script>

  <style scoped>
  @import '../../style/login.css';
  /* 将源码中的css样式单独存放,在各组件中导入就可以。*/
  </style>
  