<script setup lang="ts">
import LoadingOverlayComponent from './coms/common/LoadingOverlayComponent.vue';

const { isLoading } = useLoadingIndicator()
</script>

<template>
  <div>
    <LoadingOverlayComponent :active="isLoading" />
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
