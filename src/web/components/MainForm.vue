<template>
  <v-form ref="form" @submit.prevent="submit" validate-on="input lazy">
    <v-card :elevation="2" :loading="loading" :disabled="loading">
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
          :rules="[v => !!v || 'O usuário é obrigatório']"
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
          :rules="[v => !!v || 'A senha atual é obrigatória']"
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
          :rules="newPasswordRules"
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
            v => !!v || 'A confirmação da senha é obrigatória',
            v => v === newPassword || 'As senhas não coincidem'
          ]"
          required
          density="compact"
        />
        <password-checker class="mt-4" :password="newPassword" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          type="submit"
          color="primary"
          variant="flat"
          size="large"
          :disabled="!valid || loading"
        >
          Trocar senha
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import PasswordChecker from './PasswordChecker.vue'

const emit = defineEmits<{
  submit: [{ username: string; currentPassword: string; newPassword: string }]
}>()

defineProps<{
  loading: boolean
}>()

const username = ref('')
const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

// use form refs to validate
const form = ref<HTMLFormElement | null>(null)

const valid = computed(() => {
  return form.value?.isValid || false
})

const newPasswordRules = [
  (v: string) => !!v || 'A nova senha é obrigatória',
  (v: string) =>
    v != password.value || 'A nova senha deve ser diferente da atual',

  (v: string) =>
    /[a-z]/.test(v) || 'A nova senha deve ter pelo menos uma letra minúscula',
  (v: string) =>
    /[A-Z]/.test(v) || 'A nova senha deve ter pelo menos uma letra maiúscula',
  (v: string) => /\d/.test(v) || 'A nova senha deve ter pelo menos um número',
  (v: string) =>
    v.length >= 8 || 'A nova senha deve ter pelo menos 8 caracteres',
  (v: string) =>
    /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(v) ||
    'A nova senha deve ter pelo menos um caractere especial'
]

async function submit() {
  if (await form.value?.validate())
    emit('submit', {
      username: username.value,
      currentPassword: password.value,
      newPassword: newPassword.value
    })
}
</script>
