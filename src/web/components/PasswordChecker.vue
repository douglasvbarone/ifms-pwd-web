<template>
  <div>
    <div class="font-weight-light mb-2">Regras para a nova senha:</div>
    <v-alert
      v-for="alert in alerts"
      :key="alert.text"
      :type="alertType(password, alert.rule)"
      class="mb-2 rule"
      variant="tonal"
      density="compact"
      :text="alert.text"
    />
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

<style scoped>
.rule {
  transition: all 0.2s ease-in-out;
}
</style>
