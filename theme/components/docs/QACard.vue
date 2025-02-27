<script setup lang="ts">
import { ElCard } from "element-plus";
// import 'element-plus/es/components/card/style/css'
</script>

<template>
  <p>
    <ElCard class="qa-card" shadow="never">
      <template #header>
        <div class="qa-question"><slot name="question" /></div>
      </template>
      <div class="qa-answer"><slot name="answer" /></div>
    </ElCard>
  </p>
</template>

<style lang="scss">
.qa-card {
  p,
  ul {
    margin-bottom: 0;
    &:first-child {
      margin-top: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
.qa-card {
  --el-card-padding: 15px;
}
.qa-question::before,
.qa-answer::before {
  font-size: 1.5em;
  font-weight: bold;
  float: left;
  margin-right: 10px;
  line-height: 1;
  width: 20px;
  text-align: center;
}

.qa-question::before {
  content: "Q";
}

.qa-answer::before {
  content: "A";
}
</style>
