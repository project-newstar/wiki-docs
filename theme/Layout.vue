<!-- .vitepress/theme/Layout.vue -->

<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { nextTick, provide } from "vue";
import LayoutIndex from "@/layouts/LayoutIndex.vue";
import "element-plus/theme-chalk/dark/css-vars.css";

import Comments from "./components/Comments.vue";

const { isDark, frontmatter } = useData();

// const DefaultLayoutList = ["home", "page", "docs", false, undefined];

// Theme transition

const enableTransitions = () =>
  "startViewTransition" in document && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`,
  ];

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: "ease-in",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
    }
  );
});
</script>

<template>
  <template v-if="frontmatter.layout === 'index'">
    <LayoutIndex />
  </template>
  <template v-else>
    <DefaultTheme.Layout>
      <template #doc-after>
        <Comments />
      </template>
    </DefaultTheme.Layout>
  </template>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}

*::selection {
  background-color: rgba(61, 170, 194, 0.25);
}
</style>
