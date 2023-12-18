<template>
  <v-container>
    <v-row>
      <v-col cols="8" offset="2">
        <logo class="mx-auto mb-12" :style="{ maxWidth: '256px' }" />

        <main-form @submit="submit" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import Logo from '../components/Logo.vue'
import MainForm from '../components/MainForm.vue'

function submit({
  username,
  currentPassword,
  newPassword
}: {
  username: string
  currentPassword: string
  newPassword: string
}) {
  console.log('submit', { username, currentPassword, newPassword })
}
</script>
