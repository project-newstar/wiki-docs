<script setup lang="ts">
withDefaults(
  defineProps<{
    type: "info" | "tip" | "warning" | "danger" | "quote";
    title?: string;
  }>(),
  {
    type: "info",
  }
);
</script>

<template>
  <div :class="`${type} custom-block`">
    <p class="custom-block-title" v-if="title">{{ title }}</p>
    <p><slot /></p>
  </div>
</template>

<style lang="scss" scoped>
.custom-block {
  padding: 16px 16px 16px;
  &:has(.custom-block-title) {
    padding: 16px 16px 8px;
  }
}
</style>
