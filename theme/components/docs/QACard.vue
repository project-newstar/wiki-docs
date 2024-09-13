<script setup lang="ts">
import { ElCard } from "element-plus";
// import 'element-plus/es/components/card/style/css'
</script>

<template>
    <p>
        <ElCard class="qa-card" shadow="never">
            <template #header>
                <div class="card-header"><span class="front-text">Q</span><slot name="question" /></div>
            </template>
            <span class="front-text">A</span><slot name="answer" />
        </ElCard>
    </p>
</template>

<style lang="scss" scoped>
.qa-card {
    --el-card-padding: 15px;
}
.front-text {
    font-size: 1.5em;
    font-weight: bold;
    float: left;
    margin-right: 10px;
    line-height: 1;
}
</style>
