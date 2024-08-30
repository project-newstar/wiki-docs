<script setup lang="ts">
import NotFound from 'vitepress/dist/client/theme-default/NotFound.vue';
import { useData } from 'vitepress';
import { useSidebar } from 'vitepress/theme';

const { page, frontmatter } = useData()
const { hasSidebar } = useSidebar()
</script>

<template>
  <div
    class="VPContent"
    id="VPContent"
    :class="{
      'has-sidebar': hasSidebar,
    }"
  >
    <slot name="not-found" v-if="page.isNotFound"><NotFound /></slot>

    <slot />

  </div>
</template>

<style scoped>
.VPContent {
  flex-grow: 1;
  flex-shrink: 0;
  margin: var(--vp-layout-top-height, 0px) auto 0;
  width: 100%;
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-height: calc(100vh - var(--vp-nav-height));
}

.VPContent.has-sidebar {
  margin: 0;
}

@media (min-width: 960px) {
  .VPContent {
    padding-top: var(--vp-nav-height);
    min-height: 100vh;
  }

  .VPContent.has-sidebar {
    margin: var(--vp-layout-top-height, 0px) 0 0;
    padding-left: var(--vp-sidebar-width);
  }
}

@media (min-width: 1440px) {
  .VPContent.has-sidebar {
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2);
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
  }
}
</style>
