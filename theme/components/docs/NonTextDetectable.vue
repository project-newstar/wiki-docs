<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    content?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    className?: string;
  }>(),
  {
    content: "",
    className: "",
  }
);

function getStyle() {
  let styles = {
    "--n-content": "'" + props.content.replace(/'/g, "\\'") + "'",
    "--n-font-size": props.fontSize || "unset",
    "--n-font-weight": props.fontWeight || "unset",
    "--n-color": props.color || "unset",
  };
  return styles;
}
</script>

<template>
  <span class="non-detectable" :class="className" :style="getStyle()"></span>
</template>

<style lang="scss" scoped>
.non-detectable::after {
  content: var(--n-content);
  font-size: var(--n-font-size);
  font-weight: var(--n-font-weight);
  color: var(--n-color);
}
</style>
