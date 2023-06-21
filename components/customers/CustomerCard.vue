<template>
  <v-container>
    <v-card elevation="10" shaped>
      <v-card-title primary-title>
        {{ customer.CustomerName }}
      </v-card-title>
      <v-card-subtitle>
        {{ customer.CustomerCode }}
      </v-card-subtitle>
      <v-list-item>
        <v-row>
          <v-col>
            Ciudad: {{ customer.City }}
          </v-col>
          <v-col>
            Telefono: {{ customer.Phone }}
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col>
            Delegado: {{ customer.sales_rep?.SalesRepName }} {{ customer.sales_rep?.FullName }}
          </v-col>
          <v-col>
            Telesales: {{ customer.telesales_rep?.SalesRepName }} {{ customer.sales_rep?.FullName }}
          </v-col>
          <v-col>
            Gestor Deuda: {{ customer.empcollection_manager?.EmployeeName }} {{ customer.empcollection_manager?.Name }}
          </v-col>
        </v-row>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>

export default {
  props: {
    customer: {}
  }
}
</script>

<style lang="scss" scoped></style>
