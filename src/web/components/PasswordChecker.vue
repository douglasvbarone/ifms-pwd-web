<template>
  <div>
    <v-alert
      v-for="alert in alerts"
      :key="alert.text"
      :type="alertType(password, alert.rule)"
      class="rule"
      variant="plain"
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
    text: 'Ao menos uma letra minúscula.',
    rule: (password: string) => /[a-z]/.test(password)
  },
  {
    text: 'Ao menos uma letra maiúsculas.',
    rule: (password: string) => /[A-Z]/.test(password)
  },
  {
    text: 'Ao menos um número.',
    rule: (password: string) => /\d/.test(password)
  },
  {
    text: 'Ter 8 ou mais caracteres de comprimento.',
    rule: (password: string) => password.length >= 8
  }
  // {
  //   text: `Ao menos um símbolo especiai (!"#$%&'()*+,\\-./:;<=>?@[]^_\`{}|~).`,
  //   rule: (password: string) =>
  //     /[●!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password)
  // }
]
</script>

<style scoped>
.rule {
  transition: all 0.2s ease-in-out;
}
</style>
