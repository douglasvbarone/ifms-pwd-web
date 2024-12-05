<template>
  <v-app>
    <v-main>
      <router-view />
      <v-footer app class="text-grey">
        <span class="mr-2">
          <v-btn
            variant="text"
            href="https://git.pp.ifms.edu.br/1839811/ifms-pwd-web"
            target="_blank"
          >
            <v-icon class="mr-2">mdi-git</v-icon> {{ version }}
          </v-btn>
        </span>
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
