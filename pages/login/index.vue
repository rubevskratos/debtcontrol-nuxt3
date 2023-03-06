<template>
  <v-container fluid full-height>
    <v-row>
      <v-col cols="12" md="6">
        <v-img src="/img/galderma_login.jpeg" style="height: 100%"></v-img>
      </v-col>
      <v-col cols="12" md="6">
        <v-card text style="margin: 10%">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ headLine }}</h3>
              <v-text-field
                name="disclaimer"
                :label="disclaimerText"
                disabled
              ></v-text-field>
            </div>
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid" ref="loginForm" lazy-validation>
              <v-text-field
                outlined
                label="User Name"
                v-model="login.Email"
                required
              ></v-text-field>
              <v-text-field
                outlined
                name="name"
                label="Enter your password"
                hint="At least 8 characters"
                min="8"
                v-model="login.Password"
                type="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click.prevent="userLogin">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useAuthStore } from "@/store/auth";

export default {
  data() {
    return {
      valid: true,
      headLine:
        "Bienvenido(a) a la solución de control de deuda de clientes de Galderma",
      disclaimerText: "Debes iniciar sesión para utilizar esta aplicación",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) =>
          /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/.test(v) ||
          "E-mail must be valid",
      ],
      login: {
        Email: "",
        Password: "",
      },
    };
  },
  methods: {
    async userLogin() {
      const auth = useAuthStore()
      try {
        let response = await auth.login(this.login);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
