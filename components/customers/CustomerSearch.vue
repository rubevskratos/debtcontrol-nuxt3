<template>
  <v-navigation-drawer>
    <v-card variant="outlined" rounded="0">
        <v-card-title>
          Customer Search
        </v-card-title>
    </v-card>
    <v-form style="padding:5px">
      <v-text-field
        variant="underlined"
        name="SearchName"
        label="Nombre Cliente"
        v-model="params.CustomerName"
      ></v-text-field>

      <v-text-field
        variant="underlined"
        name="SearchAddr"
        label="Dirección"
        v-model="params.Address1"
      ></v-text-field>

      <v-text-field
        variant="underlined"
        name="SearchProvince"
        label="Provincia"
        v-model="params.Province"
      ></v-text-field>

      <v-text-field
        variant="underlined"
        name="SearchCity"
        label="Ciudad"
        v-model="params.City"
      ></v-text-field>

      <v-text-field
        variant="underlined"
        name="SearchCudstomerCode"
        label="Codigo M3"
        v-model="params.CustomerCode"
      ></v-text-field>

      <v-select
        variant="underlined"
        :items="RepNames"
        v-model="params.SalesRepName"
        label="Delegado"
      ></v-select>

      <v-select
        variant="underlined"
        :items="EmployeeNames"
        v-model="params.EmployeeName"
        label="Agente Deuda"
      ></v-select>

      <v-select
        variant="underlined"
        :items="CustomerGroupCodes"
        item-title="GroupLabel"
        item-value="CusGroupCode"
        v-model="SelectedGroup"
        return-object
        label="Customer Group"
      ></v-select>

      <v-btn variant="outlined" rounded="0" @click="getCustomers"> Buscar </v-btn>
    </v-form>
  </v-navigation-drawer>  
</template>

<script>
import { useAuthStore } from "@/store/auth";

export default {
  data() {
    return {
      SelectedGroup: "",
      params: {
        CustomerName: "",
        CustomerCode: "",
        City: "",
        SalesRepName: "",
        EmployeeName: "",
        CusGroupCode: "",
        Province: "",
        Address1: "",
      },
      limit: 0,
      RepNames: [],
      CustomerGroupCodes: [],
      EmployeeNames: [],
    };
  },
  mounted: async function () {
    const auth = useAuthStore();
    const options = auth.defineOptions('GET')
    try {
      let Reps = await $fetch("/api/salesrep", options);
      Reps.filter((rep) => rep.Status).forEach((rep, i) => {
        this.RepNames[i] = rep.SalesRepName;
      });
      let Agents = await $fetch("/api/employee", options);
      Agents.filter((agent) => agent.Status).forEach((agent, i) => {
        this.EmployeeNames[i] = agent.EmployeeName;
      });
      let CustomerGroups = await $fetch("/api/cusgroup", options);
      CustomerGroups.forEach((group, i) => {
        this.CustomerGroupCodes[i] = {
          CusGroupCode: group.CusGroupCode,
          GroupLabel: group.GroupLabel,
        };
      });
    } catch (error) {
      console.log("Error after mount:" + error);
    }
  },
  methods: {
    createParams(parent) {
      const child = {};
      for (const key in parent) {
        if (parent[key]) {
          child[key] = parent[key];
        }
      }
      return child;
    },
    async getCustomers() {
      const auth = useAuthStore();
      const options = auth.defineOptions('GET')

      try {
        if (this.limit > 0) {
          this.params.limit = this.limit;
        }
        if (this.SelectedGroup) {
          this.params.CusGroupCode = this.SelectedGroup.CusGroupCode;
        }
        const params = this.createParams(this.params);
        options.params = params;
        let customers = await $fetch("/api/customer", options);
        this.$emit("show-results", customers);
      } catch (error) {
        console.log("Error on getCustomers in CustomerSearch" + error);
      }
    },
  },
};
</script>
