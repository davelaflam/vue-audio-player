<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-app-bar color="" dark>
      <v-app-bar-title>
        <router-link to="/" class="app-title-link">
          <v-icon class="mr-2">mdi-headphones</v-icon>
          Vue Audio Player App
        </router-link>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="mt-5">
        <RouterView />
      </v-container>
    </v-main>

    <v-footer height="40" app>
      <v-footer class="pa-2">
        <v-row justify="center">
          <v-col class="text-caption text-disabled text-center" cols="12">
            © {{ new Date().getFullYear() }}
            <span class="d-sm-inline-block">
              <v-icon class="mr-2">mdi-headphones</v-icon>
              Vue Audio Player App
            </span>
          </v-col>
        </v-row>
      </v-footer>
    </v-footer>
  </v-app>
</template>

<style scoped>
.v-app-bar-title {
  font-weight: bold;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

.app-title-link {
  text-decoration: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
