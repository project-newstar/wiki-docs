<script lang="ts" setup>
import { ref } from "vue";
import { ElAlert } from "element-plus";
import { asURLParamBool } from "@/scripts/utils";

const getWindow = () => {
    try { return window } catch (_) { return globalThis }
}

const sp = new URLSearchParams((getWindow().location || {}).search);

const showAlert = ref<boolean>(false);

type AlertContent = {
    title: string;
    html: string;
    type: "success" | "warning" | "info" | "error";
    effect: "light" | "dark";
};

const ALERT_CONTENT = {
    title: "警告",
    html: `如果出现该提示，说明你正在使用浏览器访问题目地址。<strong>请改用 nc 连接该地址。</strong>`,
    type: "error",
    effect: "dark"
} satisfies AlertContent;

if (asURLParamBool(sp.get("alert"))) {
    showAlert.value = true;
}
</script>

<template>
    <div class="vp-doc__alert-box" v-if="showAlert">
        <ElAlert
            class="vp-doc__alert-element"
            :title="ALERT_CONTENT.title"
            :type="ALERT_CONTENT.type"
            :effect="ALERT_CONTENT.effect"
        >
            <span v-html="ALERT_CONTENT.html"></span>
        </ElAlert>
    </div>
</template>

<style lang="scss">
.vp-doc__alert-box .el-alert__title.with-description {
    font-weight: bold;
}
</style>

<style scoped lang="scss">
.vp-doc__alert-box {
    .vp-doc__alert-element {
        margin: 0 0 40px;
    }
}
</style>
