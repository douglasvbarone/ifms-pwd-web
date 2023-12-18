<template>
  <div>
    <v-alert
      v-for="alert in alerts"
      :key="alert.text"
      :type="alertType(password, alert.rule)"
      class="mb-1"
      variant="tonal"
      density="compact"
    >
      {{ alert.text }}
    </v-alert>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  password: string
}>()

function alertType(password: string, rule: (password: string) => boolean) {
  if (password.length === 0) return 'info'

  return rule(password) ? 'success' : 'error'
}

const alerts = [
  {
    text: 'Uma ou mais letras minúsculas.',
    rule: (password: string) => /[a-z]/.test(password)
  },
  {
    text: 'Uma ou mais letras maiúsculas.',
    rule: (password: string) => /[A-Z]/.test(password)
  },
  {
    text: '8 ou mais caracteres.',
    rule: (password: string) => password.length >= 8
  },
  {
    text: `Um ou mais caracteres especiais (!"#$%&'()*+,\\-./:;<=>?@[]^_\`{}|~).`,
    rule: (password: string) =>
      /[●!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password)
  }
]
</script>
