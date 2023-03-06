import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        baseUrl: 'http://localhost:5000',
        user: null,
        access_token: null,
        refresh_token: null
    }),

    getters: {
        isLoggedIn: (state) => !!state.user
    },

    actions: {
        async initAuth() {
            let user = this.user
            let token = this.access_token
            let router = useRouter()

            if (!user) {
                const response = await $fetch('/api/user',{
                    method:'GET',
                    baseURL: this.baseUrl,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                
                this.updateUser(response)
                router.push({name:'index'})
            }
        },

        async login (payload:Object) {
            try {
                let response = await $fetch('/api/login', {
                    method: 'POST',
                    baseURL: this.baseUrl,
                    body: payload
                })
                this.updateToken(response)
                this.initAuth()
            } catch (error) {
                console.log(error)
            }
        },

        async register (payload:any) {
            // some register logic
        },

        async logOut() {
            this.updateUser(null)
        },

        updateUser(payload:any) {
            this.user = payload
        },
        updateToken(token:any | null) {
            this.access_token = token.access_token
            this.refresh_token = token.refresh_token
        }
    },
})
