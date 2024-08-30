<script setup lang="ts">
import { VPButton } from "vitepress/theme";
import { useData } from "vitepress";
import * as docsRoot from "@docs/index";
import { ref } from "vue";

const { site } = useData();

const props = withDefaults(
    defineProps<{
        text?: string;
        link?: string;
        target?: "_blank" | "_self";
        type?: "primary" | "secondary" | "sponsor";
        size?: "normal" | "large";
        click?: (() => any) | string;
    }>(),
    {
        text: "",
        link: "",
        type: "secondary",
        size: "normal"
    }
);

let clickRef = ref(props.click);

if (props.click && typeof props.click === "string") {
    clickRef.value = (docsRoot as Record<string, any>)[props.click];
}
</script>

<template>
    <VPButton
        :text="props.text"
        :href="props.link"
        :target="props.target"
        :theme="{ primary: 'brand', secondary: 'alt', sponsor: 'sponsor' }[props.type]"
        :size="{ normal: 'medium', large: 'big' }[props.size]"
        @click="<CallableFunction>clickRef"
    />
</template>
