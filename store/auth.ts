// Código del store de Pinia
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

interface User {
  // Define las propiedades de tu objeto de usuario aquí
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    baseUrl: 'http://localhost:5000',
    user: null as User | null,
    loggedIn: false,
  }),
  getters: {
    isLoggedIn(): boolean {
      return this.loggedIn;
    },
  },
  actions: {
    async initAuth() {
      const user = this.user
      const token = Cookies.get('access_token')

      if (user && token) {
        try {
          const response = await fetch(`${this.baseUrl}/api/user`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if (response.ok) {
            const data = await response.json();
            this.updateUser(data)
            this.loggedIn = true;
          } else {
            await this.logOut();
          }
        } catch (error) {
          console.log(error)
          await this.logOut();
        }
      }
    },
    async login(payload: Object) {
      try {
        const response = await fetch(`${this.baseUrl}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          const data = await response.json();
          this.updateUser(data)
          this.loggedIn = true;
          Cookies.set('user', JSON.stringify(data));
        } else {
          console.log('Error al iniciar sesión');
        }
      } catch (error) {
        console.log(error)
      }
    },
    async logOut() {
      Cookies.remove('user');
      this.updateUser(null);
      this.loggedIn = false;
    },
    updateUser(payload: User | null) {
      this.user = payload;
    },
    // Resto de acciones...
  },
})
