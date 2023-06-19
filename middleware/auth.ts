import { useAuthStore } from "@/store/auth"


export default defineNuxtRouteMiddleware( () => {
  const auth = useAuthStore()
  
  if (!auth.isLoggedIn) {
    console.log(auth.isLoggedIn)
    return navigateTo('/login')
  }
})