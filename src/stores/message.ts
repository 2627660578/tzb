import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode' // 1. 导入 jwt-decode

// 定义解码后的 token 结构
interface DecodedToken {
    'x-user-id': string; // 根据您的 token 示例，用户ID字段是 'x-user-id'
    // ... 其他可能的字段
}

export const useMainStore = defineStore('main', {
    state: () => ({
        showSignin: true,
        isLoggedin: false,
        username: "",
        account: "",
        password: "",
        id: "",
        accessToken: "" // 2. 添加 accessToken 状态
    }),
    getters: {
        // ...
    },
    actions: {
        toggleSignup() {
            this.showSignin = !this.showSignin
        },
        login(data: any) {
            this.isLoggedin = true
            this.username = data.username
            this.account = data.account
            this.password = data.password
            this.id = data.id
        },
        // 3. 添加一个新的 action 用于处理 token 登录
        loginWithToken(tokenData: { accessToken: string }) {
            try {
                const decodedToken: DecodedToken = jwtDecode(tokenData.accessToken);
                this.isLoggedin = true;
                this.accessToken = tokenData.accessToken;
                this.id = decodedToken['x-user-id']; // 从 token 中提取用户 ID
                // 清空其他不再需要的信息
                this.username = "";
                this.account = "";
                this.password = "";
            } catch (error) {
                console.error("无效的Token，无法登录:", error);
                this.logout(); // 如果 token 解码失败，则执行登出
            }
        },
        logout() {
            this.isLoggedin = false
            this.username = ""
            this.account = ""
            this.password = ""
            this.id = ""
            this.accessToken = "" // 4. 登出时清空 token
        }
    },
    persist: {
        key: 'my-custom-key',
        storage: localStorage,
        // 5. 将 accessToken 加入持久化列表
        pick: ['isLoggedin', 'username', 'account', 'password', "id", "accessToken"]
    }
})