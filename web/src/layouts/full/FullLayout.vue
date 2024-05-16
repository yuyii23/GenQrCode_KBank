<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <v-locale-provider>
    <v-app>
      <v-main>
        <div class="bg-main">
          <RouterView />
        </div>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
