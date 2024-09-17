<script setup lang="ts">
import { Content, useData } from "vitepress";
import { useRoute } from "vitepress";
import { computed, provide, useSlots, watch } from "vue";
import VPBackdrop from "vitepress/dist/client/theme-default/components/VPBackdrop.vue";
import IndexContent from "@/components/IndexContent.vue";
import VPFooter from "vitepress/dist/client/theme-default/components/VPFooter.vue";
import VPLocalNav from "vitepress/dist/client/theme-default/components/VPLocalNav.vue";
import IndexNav from "@/components/IndexNav.vue";
import VPSidebar from "vitepress/dist/client/theme-default/components/VPSidebar.vue";
import VPSkipLink from "vitepress/dist/client/theme-default/components/VPSkipLink.vue";
import { useSidebar } from "vitepress/theme";
import { VPButton } from "vitepress/theme";
import IndexButton from "@/components/IndexButton.vue";

// const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();

// const route = useRoute();
// watch(() => route.path, closeSidebar);

// useCloseSidebarOnEscape(isSidebarOpen, closeSidebar)

const { frontmatter } = useData();

const slots = useSlots();
const heroImageSlotExists = computed(() => !!slots["home-hero-image"]);

provide("hero-image-slot-exists", heroImageSlotExists);

function fmtActionsArray(actions: any) {
    if(!actions) return [];
    if(!Array.isArray(actions)) actions = [actions];
    if(actions.length === 0) return [];
    if(!Array.isArray(actions[0])) actions = [actions];
    return actions;
}
</script>

<template>
    <div class="Layout is-index" :class="frontmatter.pageClass">
        <slot name="layout-top" />
        <VPSkipLink />
        <!-- <VPBackdrop class="backdrop" :show="isSidebarOpen" @click="closeSidebar" /> -->
        <IndexNav />
        <!-- <VPLocalNav :open="isSidebarOpen" @open-menu="openSidebar" /> -->

        <!-- <VPSidebar :open="isSidebarOpen" /> -->

        <IndexContent class="layout-content">
            <div class="layout-center">
                <div class="grid-box">
                    <div class="content-logo"></div>
                    <div class="content-description">
                        <p v-for="line of frontmatter.information.split(/\r?\n/)" v-html="line"></p>
                    </div>
                    <div class="content-action">
                        <span class="action-line" v-for="a of fmtActionsArray(frontmatter.actions)">
                            <IndexButton v-for="b of a" :text="b.text" :link="b.link" :type="b.type" :size="b.size" :click="b.click" />
                        </span>
                    </div>
                    <Content class="content-doc" />
                </div>
            </div>
        </IndexContent>

        <VPFooter class="layout-index-footer" />
        <slot name="layout-bottom" />
    </div>
</template>

<style lang="scss" scoped>
.layout-center {
    display: grid;
    place-items: center;
    height: calc(100vh - var(--vp-nav-height));
}

.grid-box {
    display: grid;
    gap: 2rem;
    text-align: center;
}

.content-logo {
    $width: min(calc(100vw - 2rem), 512px);
    width: $width;
    height: calc($width / 512 * 223);
    background-image: var(--index-logo);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
}

.content-description {
    font-size: 1.3rem;
    font-weight: 300;
    p {
        margin: .5rem 0;
    }
}

.content-action {
    display: flex;
    gap: 1rem;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .action-line {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-direction: row;
        align-items: center;
    }
}

.content-doc {
    font-size: 1.1rem;
    font-weight: 300;
}

.layout-index-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border: none;
}
</style>
