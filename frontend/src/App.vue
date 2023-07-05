<template>
  <div>
    <v-card>
      <v-row>
        <v-toolbar color="success">
          <v-toolbar-title>Composable</v-toolbar-title>
        </v-toolbar>

        <v-col :cols="3">
          <v-tabs v-model="activeTab" direction="vertical" color="success">
            <v-tab v-for="tab in tabs" :key="tab.id" :value="tab.id">
              <v-icon start>{{ tab.icon }}</v-icon>
              <router-link
                :to="tab.path"
                style="text-decoration: none; color: inherit"
              >
                {{ tab.title }}
              </router-link>
            </v-tab>
          </v-tabs>
        </v-col>

        <v-col :cols="9">
          <v-window v-model="activeTab">
            <v-window-item
              v-for="tab in tabs"
              :key="tab.id"
              :value="tab.id"
              v-show="activeTab === tab.id"
            >
              <v-card flat>
                <v-card-text>
                  <router-view />
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
interface Tab {
  id: number;
  title: string;
  icon: string;
  path: string;
}

export default defineComponent({
  setup() {
    const tabs = ref<Tab[]>([
      {
        id: 0,
        title: "Loja",
        icon: "mdi-cart-plus",
        path: "/",
      },
      {
        id: 1,
        title: "Pomodoro",
        icon: "mdi-timer",

        path: "/pomodoro",
      },
      {
        id: 2,
        title: "Sorteador",
        icon: "mdi-shuffle",

        path: "/picker",
      },
    ]);
    const activeTab = ref(0);

    return {
      tabs,
      activeTab,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
