<template>
  <v-container>
    <v-navigation-drawer expand-on-hover fill-height app>
      <v-list nav dense>
        <v-list-item link @click="listUsers">
          <v-list-item-title> 
            <v-icon>mdi-account</v-icon>
            Lista de usuarios 
          </v-list-item-title>
        </v-list-item>
        <v-list-item link @click="showCreateUser">
          <v-list-item-title> 
            <v-icon> mdi-account-plus </v-icon>
            Crear usuario 
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-row justify="center" align="center" class="mt-10">
      <!-- Draw the user list if user list button is clicked on the navigation drawer, enables the "delet user" function if user is not admin -->
      <v-col cols="6" v-if="usersPage">
        <v-card elevation="5" outlined class="ma-5" v-for="(user, i) in userList" :key="i" dense>
            <v-card-title>{{ user.Email }}</v-card-title>
            <v-card-subtitle>{{
              user.Admin ? 'Administrador' : 'Usuario'
            }}</v-card-subtitle>
         
            <v-card-actions>
              <v-spacer/>
              <v-btn v-if="loggedUser.Email == user.Email ? false : true" @click="deleteUser(i)">
                <v-icon>mdi-delete-forever</v-icon>
                Eliminar cuenta
              </v-btn>
            </v-card-actions>
         
          </v-card>
      </v-col>
      <!-- Draw the  user creation page, allows to create both standard and admin users. -->
      <v-col cols="6" v-if="createUser">
        <v-card>
          <v-card-title>Crear un nuevo usuario</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                name="userEmail"
                label="User Email - This will be used as login"
                v-model="userEmail"
              ></v-text-field>
              <v-text-field
                name="userPassword"
                label="User's password, please request user to change it after first login"
                v-model="userPassword"
                type="password"
              ></v-text-field>
              <v-checkbox
                v-model="createUserAdmin"
                label="Make user Admin?"
              ></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="submitUser"> Crear </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useAuthStore } from '@/store/auth'

export default {
  data() {
    return {
      loggedUser: useAuthStore().$state.user,
      usersPage: false,
      userList: [],
      createUser: false,
      createUserAdmin: false,
      userPassword: '',
      userEmail: '',
    }
  },
  methods: {
    async listUsers() {
      this.userList.splice(0)
      const auth = useAuthStore()
      const options = {
        method: 'get',
        baseURL: auth.$state.baseUrl,
        headers: {
          Authorization: `Bearer ${auth.$state.access_token}`
        }
      }
      try {
        let users = await $fetch('/api/users', options)
        users.forEach((user, i) => {
          this.userList.push(user)
        })
      } catch (error) {
        console.log(error)
      }
      this.usersPage = true
      this.createUser = false
    },
    showCreateUser() {
      this.usersPage = false
      this.createUser = true
    },
    async submitUser() {
      const auth = useAuthStore()
      const options = {
        method: 'post',
        baseURL: auth.$state.baseUrl,
        headers: {
          Authorization: `Bearer ${auth.$state.access_token}`
        }
      }
      try {
        const userData = {
          Email: this.userEmail,
          Password: this.userPassword,
          Admin: this.createUserAdmin,
        }

        options.body = userData

        let response = await $fetch('/api/register', options)
        this.listUsers()
      } catch (error) {
        console.log(error)
      }
    },
    async deleteUser(i) {
      const auth = useAuthStore()
      const options = {
        method: 'delete',
        baseURL: auth.$state.baseUrl,
        headers: {
          Authorization: `Bearer ${auth.$state.access_token}`
        }
      }
      try {
        let response = await $fetch(`/api/user/${this.userList[i].UserId}`, options)
        this.listUsers()
      } catch (error) {
        console.log(error)
      }
    }
  },
}
</script>

<style lang="scss" scoped></style>
