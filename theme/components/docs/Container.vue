<script setup lang="ts">
withDefaults(
    defineProps<{
        type: "info" | "tip" | "warning" | "danger";
        title?: string;
    }>(),
    {
        type: "info"
    }
);

function fmtClass(theme?: string, ...append: string[]): string {
    let classes: string[] = [];
    if (append) classes.push(...append);
    if (!theme) theme = "";
    theme.split(/\s+/).forEach(t => {
        classes.push(`link-${t}`);
    });
    return classes.join(" ");
}
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
