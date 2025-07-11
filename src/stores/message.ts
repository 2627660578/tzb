import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => ({
        showSignin: true,

        isLoggedin: false,
        username: "",
        account: "",
        password: "",
        id: ""
    }),
    getters: {
        // isLoggedIn(state) {
        //   return state.isLoggedin
        // }
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
        logout() {
            this.isLoggedin = false
            this.username = ""
            this.account = ""
            this.password = ""
            this.id = ""
        }
    },
    persist: {
        key: 'my-custom-key',
        storage: localStorage,
        pick: ['isLoggedin', 'username', 'account', 'password', "id"]//持久化的内容
    }

})
