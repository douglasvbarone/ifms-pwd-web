<template>
  <v-container>
    <v-row justify="center">
      <v-col xl="5" lg="6" md="7" sm="10">
        <logo class="mx-auto my-3" :style="{ maxWidth: '128px' }" />
        <main-form @submit="handleSubmit" :loading="loading" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Logo from '../components/Logo.vue'
import MainForm from '../components/MainForm.vue'
import { trpc } from '../trpc'

const loading = ref(false)

async function handleSubmit({
  username,
  currentPassword,
  newPassword
}: {
  username: string
  currentPassword: string
  newPassword: string
}) {
  try {
    loading.value = true
    await trpc.updatePassword.mutate({
      username,
      currentPassword,
      newPassword
    })
  } catch (error) {
    console.error(error)
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
}
</script>
