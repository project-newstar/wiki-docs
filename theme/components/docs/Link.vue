<script setup lang="ts">
withDefaults(
    defineProps<{
        href?: string;
        target?: string;
        icon?: string /* keyof typeof iconMap */;
        iconPos?: "left" | "right";
        /**
         * Theme of the link
         * - `plain [color]`
         * - `underline [color] [always|hover|blink]`
         */
        theme?: string;
        text?: string;
    }>(),
    {
        href: "",
        target: "_blank",
        iconPos: "right"
    }
);
function fmtClass(theme?: string, ...append: string[]): string {
    let classes: string[] = [];
    if (!theme) theme = "";
    theme.split(/\s+/).forEach(t => {
        t && classes.push(`link-${t}`);
    });
    if (append) classes.push(...append);
    return classes.join(" ");
}

// const iconMap = {
//     external: `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14"><g><path d="M13.25,14H.75c-.41,0-.75-.34-.75-.75V.75C0,.34,.34,0,.75,0H5.75c.41,0,.75,.34,.75,.75s-.34,.75-.75,.75H1.5V12.5H12.5v-4.25c0-.41,.34-.75,.75-.75s.75,.34,.75,.75v5c0,.41-.34,.75-.75,.75ZM7,7.75c-.19,0-.38-.07-.53-.22-.29-.29-.29-.77,0-1.06L11.44,1.5h-1.69c-.41,0-.75-.34-.75-.75s.34-.75,.75-.75h3.5c.41,0,.75,.34,.75,.75v3.5c0,.41-.34,.75-.75,.75s-.75-.34-.75-.75v-1.69L7.53,7.53c-.15,.15-.34,.22-.53,.22Z"/></g></svg>`
// };
</script>

<template>
    <a
        :data-link="theme ? '' : 'false'"
        :href="href"
        :target="target"
        :class="fmtClass(theme, icon ? `link-icon icon-${icon}` : '')"
        :data-icon-pos="icon ? iconPos : undefined"
    >
        <template v-if="text">{{ text }}</template>
        <template v-else><slot /></template>
        <!-- <span class="link-icon" :data-icon-pos="iconPos" v-html="iconMap[icon]" v-if="icon"></span> -->
    </a>
</template>

<style lang="scss">
@use "@/styles/utils/docs-link.scss" as link;
@use "@/assets/fonts/package.scss" as font;
@use "@/assets/fonts/docs/map.scss" as docs-map;

$current-color: currentColor;
// $primary-color: var(--vp-c-brand-1);
$primary-color: var(--docs-link-color);
// $primary-hover-color: var(--vp-c-brand-2);
$primary-hover-color: var(--docs-link-hover-color);

[data-link] {
    display: inline !important;
}

// no underline
.link-plain,
.link-plain[data-link] {
    @include link.plain($current-color, $primary-color);
}

// underline
.link-underline,
.link-underline[data-link] {
    color: $current-color;

    &:not(.link-always):not(.link-hover):not(.link-blink),
    &.link-always {
        @include link.underline("always", $current-color, $primary-color);
    }
    &.link-hover {
        @include link.underline("hover", $current-color, $primary-color);
    }
    &.link-blink {
        @include link.underline("blink", $current-color, $primary-color);
    }
}

.link-color,
.link-color[data-link] {
    color: $primary-color !important;
    &:hover {
        color: $primary-hover-color !important;
    }
}

// icon
.link-icon,
.link-icon[data-link] {
    @include link.icon-position("docs", "vp-docs");
    @include font.register-font("docs", "vp-docs");
    // @include font.apply-font("docs", "vp-docs");
    @include link.generate-position-map(docs-map.$map);
}
</style>
