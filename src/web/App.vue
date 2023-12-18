<template>
  <v-app>
    <v-main>
      <router-view />
      <v-footer app class="text-grey">
        <span class="mr-2">v{{ version }}</span>
        <v-spacer />
        <span class="mr-2">SERTI-PP</span>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import packageInfo from '../../package.json'

const version = packageInfo.version
</script>
