<template>
  <v-container>
    <v-row justify="center">
      <v-col :style="{ maxWidth: '420px' }">
        <logo class="mx-auto my-3" :style="{ maxWidth: '128px' }" />
        <v-scale-transition>
          <v-alert
            class="mb-2"
            variant="tonal"
            closable
            type="error"
            v-if="errorMsg"
          >
            {{ errorMsg }}
          </v-alert>
        </v-scale-transition>
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

const errorMsg = ref('')

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
    errorMsg.value = ''

    await trpc.updatePassword.mutate({
      username,
      currentPassword,
      newPassword
    })

    alert('Senha alterada com sucesso!')

    location.reload()
  } catch (error: any) {
    console.error(error)

    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}
</script>
