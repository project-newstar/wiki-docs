<script setup lang="ts">
import { inBrowser } from "vitepress";
import { computed, provide, watchEffect } from "vue";
import { useData } from "vitepress";
import { useNav } from "vitepress/dist/client/theme-default/composables/nav.js";
import IndexNavBar from "./IndexNavBar.vue";
import IndexNavScreen from "./IndexNavScreen.vue";

const { isScreenOpen, closeScreen, toggleScreen } = useNav();
const { frontmatter } = useData();

const hasNavbar = computed(() => {
  return frontmatter.value.navbar !== false;
});

provide("close-screen", closeScreen);

watchEffect(() => {
  if (inBrowser) {
    document.documentElement.classList.toggle("hide-nav", !hasNavbar.value);
  }
});
</script>

<template>
  <header v-if="hasNavbar" class="VPNav">
    <IndexNavBar :is-screen-open="isScreenOpen" @toggle-screen="toggleScreen">
      <template #nav-bar-title-before><slot name="nav-bar-title-before" /></template>
      <template #nav-bar-title-after><slot name="nav-bar-title-after" /></template>
      <template #nav-bar-content-before><slot name="nav-bar-content-before" /></template>
      <template #nav-bar-content-after><slot name="nav-bar-content-after" /></template>
    </IndexNavBar>
    <IndexNavScreen :open="isScreenOpen">
      <template #nav-screen-content-before><slot name="nav-screen-content-before" /></template>
      <template #nav-screen-content-after><slot name="nav-screen-content-after" /></template>
    </IndexNavScreen>
  </header>
</template>

<style scoped>
.VPNav {
  position: relative;
  top: var(--vp-layout-top-height, 0px);
  /*rtl:ignore*/
  left: 0;
  z-index: var(--vp-z-index-nav);
  width: 100%;
  pointer-events: none;
  transition: background-color 0.5s;
}

@media (min-width: 960px) {
  .VPNav {
    position: fixed;
  }
}
</style>
