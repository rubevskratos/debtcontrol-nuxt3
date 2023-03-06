<template>
        <v-app-bar fixed outlined elevation="5" style="top: 100px">
            
        </v-app-bar>
</template>

<script>
export default {
    data() {
        return {
            user: this.$auth.user.Email
        }
    },
    methods: {
        async logout() {
            try {
                let response = await this.$auth.logout()
                this.$router.push('/login')
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
