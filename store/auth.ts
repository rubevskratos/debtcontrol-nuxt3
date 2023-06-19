import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { routerKey } from 'vue-router';

interface User {
  // Define las propiedades de tu objeto de usuario aquí
}

interface Token {
  access_token: string;
  refresh_token: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        baseUrl: 'http://localhost:5000',
        user: Cookies.get('user') as User | null,
        access_token: Cookies.get('access_token') as string | null,
        refresh_token: Cookies.get('refresh_token') as string | null,
        loggedIn: ref(false)
    }),
    getters: {
        isLoggedIn(): boolean {
            if (this.user && this.access_token && this.refresh_token) {
                return true;
            }
            return false;
        },
    },
    actions: {
        async initAuth() {
            let user = this.user
            let token = this.access_token
            let router = useRouter()
          
            if (!user && token) { // Asegúrate de que hay un token de acceso antes de hacer la solicitud
              const response = await fetch(`${this.baseUrl}/api/user`,{
                method:'GET',
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
              
              const data = await response.json();
              this.updateUser(data)
              if (this.user && this) {
                router.push('/')
              }
            }
          },
        async login (payload: Object) {
            try {
                const response = await fetch(`${this.baseUrl}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                const data: Token = await response.json();
                this.updateToken(data)
                await this.initAuth()
            } catch (error) {
                console.log(error)
            }
        },

        async register (payload: any) {
            // some register logic
        },

        async logOut() {
            Cookies.remove('user');
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            this.updateUser(null)
            this.updateToken(null)
        },

        updateUser(payload: User | null) {
            this.user = payload
            if (payload) {
                Cookies.set('user', JSON.stringify(payload));
            }
        },
        updateToken(token: Token | null) {
            if (token) {
                this.access_token = token.access_token
                this.refresh_token = token.refresh_token
                Cookies.set('access_token', token.access_token);
                Cookies.set('refresh_token', token.refresh_token);
            } else {
                this.access_token = null
                this.refresh_token = null
            }
        },
        defineOptions (type: "GET" | "PATCH" | "PUT" | "DELETE") {
            const options = {
                method: type,
                headers: {
                  Authorization: `Bearer ${this.access_token}`,
                },
            }
            return options
        }
    },
})
