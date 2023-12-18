<template>
  <v-form @submit.prevent="submit">
    <v-card :elevation="2">
      <v-card-title class="mb-6 pa-6 text-center">
        <span class="headline font-weight-light text-h4">Trocar senha</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          class="mb-4"
          v-model="username"
          label="Usuário"
          :variant="'outlined'"
          autocomplete="username"
          hint="SIAPE para servidores, CPF para alunos."
          prepend-inner-icon="mdi-account"
          :rules="[v => !!v || 'Campo obrigatório']"
          required
          density="compact"
        />
        <v-text-field
          class="mb-4"
          v-model="password"
          label="Senha atual"
          :type="showCurrent ? 'text' : 'password'"
          hint="Sua senha atual"
          :variant="'outlined'"
          prepend-inner-icon="mdi-form-textbox-password"
          :append-inner-icon="showCurrent ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showCurrent = !showCurrent"
          :rules="[v => !!v || 'Campo obrigatório']"
          required
          density="compact"
        />

        <v-text-field
          class="mb-4"
          v-model="newPassword"
          label="Nova senha"
          :type="showNew ? 'text' : 'password'"
          hint="A nova senha que você deseja usar"
          :variant="'outlined'"
          prepend-inner-icon="mdi-lock-check"
          :append-inner-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showNew = !showNew"
          :rules="[v => !!v || 'Campo obrigatório']"
          required
          density="compact"
        />
        <v-text-field
          v-model="confirmPassword"
          label="Confirme a nova senha"
          :type="showConfirm ? 'text' : 'password'"
          hint="Digite a nova senha mais uma vez"
          :variant="'outlined'"
          prepend-inner-icon="mdi-lock-check"
          :append-inner-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showConfirm = !showConfirm"
          :rules="[
            v => !!v || 'Campo obrigatório',
            v => v === newPassword || 'As senhas não coincidem'
          ]"
          required
          density="compact"
        />
        <password-checker class="mt-4" :password="newPassword" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn type="submit" color="primary">Trocar senha</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import PasswordChecker from './PasswordChecker.vue'

const emit = defineEmits<{
  submit: [{ username: string; currentPassword: string; newPassword: string }]
}>()

const username = ref('')
const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const submit = () => {
  emit('submit', {
    username: username.value,
    currentPassword: password.value,
    newPassword: newPassword.value
  })
}
</script>
