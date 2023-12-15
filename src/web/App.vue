<template>
  <v-app>
    <v-main>
      {{ data }}
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import { trpc } from "./trpc";

const data = ref<string>("");

onMounted(async () => {
  data.value = await trpc.hello.query();
});
</script>
