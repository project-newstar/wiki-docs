<script setup lang="ts">
withDefaults(
    defineProps<{
        href?: string;
        target?: string;
        icon?: keyof typeof iconMap;
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
    if (append) classes.push(...append);
    if (!theme) theme = "";
    theme.split(/\s+/).forEach(t => {
        classes.push(`link-${t}`);
    });
    return classes.join(" ");
}
const iconMap = {
    external: `<svg fill="none" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 16 16" role="img" aria-labelledby="title-4744738674102027" xmlns="http://www.w3.org/2000/svg"><title id="title-4744738674102027">External link icon</title><path d="M6.75 1.75h-5v12.5h12.5v-5m0-4v-3.5h-3.5M8 8l5.5-5.5"></path></svg>`
};
</script>

<template>
    <a :data-link="theme ? '' : 'false'" :href="href" :target="target" :class="fmtClass(theme)">
        <template v-if="text">{{ text }}</template>
        <template v-else><slot /></template>
        <span class="link-icon" :data-icon-pos="iconPos" v-html="iconMap[icon]" v-if="icon"></span>
    </a>
</template>

<style lang="scss">
@use "@/styles/utils/docs-link.scss" as *;

$current-color: currentColor;
$primary-color: var(--vp-c-brand-1);
$primary-hover-color: var(--vp-c-brand-2);

[data-link] {
    display: inline !important;
}

// no underline
.link-plain,
.link-plain[data-link] {
    text-decoration: none;
    color: $current-color;
    &:hover {
        color: $primary-hover-color;
    }
}

// underline
.link-underline,
.link-underline[data-link] {
    color: $current-color;
    // always underline
    &:not(.link-always):not(.link-hover):not(.link-blink),
    &.link-always {
        text-decoration: none;
        @include underline-bg-color(currentColor, transparent);
        @include underline-bg-width(100%, 0%);
        @include underline-bg-posX(0%, 100%);
        &:hover {
            color: $primary-hover-color;
        }
    }
    &.link-hover {
        text-decoration: none;
        transition: color ease-in-out 0.25s, background-size ease-in-out 0.25s;
        @include underline-bg-color(currentColor, transparent);
        @include underline-bg-width(0%, 100%);
        @include underline-bg-posX(100%, 0%);
        &:hover,
        &:active {
            @include underline-bg-width(100%, 0%);
            @include underline-bg-posX(0%, 100%);
        }
    }
    &.link-blink {
        text-decoration: none;
        transition: color ease-in-out 0.25s, background-color ease-in-out 0.25s;
        @include underline-bg-color(currentColor, transparent);
        @include underline-bg-width(100%, 0%);
        @include underline-bg-posX(0%, 100%);
        &:hover,
        &:active {
            animation: underline-blink 0.5s ease-in-out;
        }
    }
    @keyframes underline-blink {
        0% {
            @include underline-bg-width(100%, 0%);
            @include underline-bg-posX(100%, 0%);
        }
        50% {
            @include underline-bg-width(0%, 100%);
            @include underline-bg-posX(100%, 0%);
        }
        51% {
            @include underline-bg-width(0%, 100%);
            @include underline-bg-posX(0%, 100%);
        }
        100% {
            @include underline-bg-width(100%, 0%);
            @include underline-bg-posX(0%, 100%);
        }
    }
}

.link-color,
.link-color[data-link] {
    color: $primary-color;
}

// icon
.link-icon,
.link-icon[data-link] {
    display: inline-block;
    vertical-align: middle;
    user-select: none;
    &[data-icon-pos="left"] {
        margin-left: 0.1rem;
        margin-right: 0.25rem;
    }
    &[data-icon-pos="right"] {
        margin-left: 0.25rem;
        margin-right: 0.1rem;
    }
    & > svg {
        height: 0.8rem;
    }
}
</style>
