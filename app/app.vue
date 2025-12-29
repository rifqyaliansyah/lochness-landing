<script setup>
import { useAppLoading } from '~/composables/useAppLoading'

const { isAppLoading } = useAppLoading()
</script>

<template>
  <div>
    <div v-show="isAppLoading">
      <TerminalLoading />
    </div>

    <div v-show="!isAppLoading">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>