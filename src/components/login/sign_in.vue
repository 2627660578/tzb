<template>
    <div id="b-container" class="container b-container ">
      <form class="form">
        <h2 class="title">Sign in to Website</h2>
        <input class="form__input" type="text" placeholder="用户名" v-model="account" @input="validateAccount" />
        <span class="error-message" v-if="accountError">{{ accountError }}</span>
        <input class="form__input" type="password" placeholder="密码" v-model="password" @input="validatePassword" />
        <span class="error-message" v-if="passwordError">{{ passwordError }}</span>
        <button class="form__button button submit" @click="handleSignin" type="button">SIGN IN</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref,watch} from 'vue'
  import { useMainStore } from '../../stores/message'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const account = ref('')
  const password = ref('')
  // const username = ref('')
  
  const accountError = ref('')
  const passwordError = ref('')
  
  const accountRegex = /^[a-zA-Z0-9._]+$/;
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=$${};':"\\|,.<>\/?]+$/;
  
  const mainStore = useMainStore()
  // const { showSignin, isLoggedin,login } = storeToRefs(mainStore)
  const { showSignin} = storeToRefs(mainStore)
  //  const {cookies} = useCookies();
  
  const validateAccount = () => {
    if (!accountRegex.test(account.value)) {
      accountError.value = '账号只能包含字母、数字、下划线和点'
    } else {
      accountError.value = ''
    }
    if (account.value.length < 5 || account.value.length > 20) {
      accountError.value = '账号长度必须在6到20位之间'
    }
  }
  
  const validatePassword = () => {
    if (!passwordRegex.test(password.value)) {
      passwordError.value = '密码必须包含字母、数字，长度在6到20位之间'
    } else {
      passwordError.value = ''
    }
    if (password.value.length < 5 || password.value.length > 20) {
      passwordError.value = '密码长度必须在6到20位之间'
    }
  }
  
  watch(showSignin, () => {
    const bContainer = document.querySelector('#b-container') as any
    bContainer.classList.toggle('is-txl')
    bContainer.classList.toggle('is-hidden')
  
  })
  
  const handleSignin = async (event: any) => {
    // event.preventDefault()
    if (account.value === '' || password.value === '') { 
      alert('账号或密码不能为空')
      event.preventDefault()
      return
    }
  
    if (accountError.value !== ''|| passwordError.value !== '') {
      alert('账号或密码格式有误')
      event.preventDefault()
      return
    }
  
    try {
      const response = await axios.post('/api/usercenter/v1/user/login', {
        mobile:account.value,
        password:password.value
      })
      
      // 3. 检查响应状态和 accessToken 是否存在
      if (response.status === 200 && response.data.accessToken) {
        alert('登录成功');
        
        // 4. 调用 store 中的 loginWithToken action
        mainStore.loginWithToken({ accessToken: response.data.accessToken });

        // 5. 跳转到首页，让 App.vue 的 watch 接管后续流程
        router.push('/');
      } else {
        // 处理成功但响应数据不符合预期的情况
        alert('登录失败：服务器返回数据异常。');
        event.preventDefault();
      }
    }
    catch (error:any) {
       // 6. 优化错误处理
      if (error.response) {
        // 服务器返回了错误状态码 (如 400, 401, 404)
        console.error("登录失败: ", error.response.data);
        alert('登录失败: ' + (error.response.data.message || '账号或密码错误'));
      } else if (error.request) {
        // 请求已发出，但没有收到任何响应
        console.error("服务器无响应: ", error.request);
        alert('登录失败: 服务器无响应，请检查网络连接。');
      } else {
        // 在设置请求时触发了一个错误
        console.error("请求设置错误: ", error.message);
        alert('登录失败: 请求发送失败。');
      }
      event.preventDefault();
    }
  }
  
  
  </script>
  
  <style scoped>
  @import '../../style/login.css';
  /* 将源码中的css样式单独存放,在各组件中导入就可以。*/
  </style>
  