<script lang="ts" setup>
import { ElButton, ElButtonGroup } from "element-plus";
import { ElPopover } from "element-plus";
import IndexButton from "@/components/IndexButton.vue";
import { signup, participate } from "./index";
</script>

<template>
  <div>
    <ElPopover placement="bottom" :width="270" trigger="click">
      <template #reference>
        <IndexButton text="报名参赛" type="primary" size="large" />
      </template>
      <div style="text-align: center">
        <ElButtonGroup class="group">
          <ElButton class="action-btn" style="width: 100%" @click="signup()">立即报名</ElButton>
        </ElButtonGroup>
        <ElButtonGroup class="group">
          <div class="group-label"><label>参赛</label></div>
          <ElButton class="action-btn" @click="participate('external')">公开赛道</ElButton>
          <ElButton class="action-btn" @click="participate('internal')">校内赛道</ElButton>
        </ElButtonGroup>
      </div>
    </ElPopover>
  </div>
</template>

<style lang="scss" scoped>
.top-radius {
  border-radius: var(--el-border-radius-base) var(--el-border-radius-base) 0 0 !important;
}
.bottom-radius {
  border-radius: 0 0 var(--el-border-radius-base) var(--el-border-radius-base) !important;
}

.group {
  display: flex;
  width: 100%;
  & + .group > * {
    &:first-child {
      border-top-left-radius: 0;
    }
    &:last-child {
      border-top-right-radius: 0;
    }
  }
  &:not(:last-child) > * {
    &:first-child {
      border-bottom-left-radius: 0;
    }
    &:last-child {
      border-bottom-right-radius: 0;
    }
  }

  & + .group {
    margin-top: -1px;
  }
}

.group-label {
  --label-bg-color: var(--el-color-info-light-9);
  .dark & {
    --label-bg-color: var(--el-color-info-light-8);
  }
  width: 100%;
  padding: 8px 15px;
  background-color: var(--label-bg-color);
  color: var(--el-color-info);
  border: var(--el-border);
  border-color: var(--el-border-color);
  border-radius: 0 0 0 var(--el-border-radius-base);
  border-right: none;
  align-items: center;
  box-sizing: border-box;
  display: inline-flex;
  font-weight: var(--el-button-font-weight);
  height: 32px;
  justify-content: center;
  line-height: 1;
  outline: none;
  text-align: center;
  transition: 0.1s;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}

.action-btn {
  position: relative;
  z-index: 10;
  &:hover {
    z-index: 11;
  }
  &:active {
    z-index: 12;
  }
}

.no-top-border {
  border-top: none;
}

.no-bottom-border {
  border-bottom: none;
}
</style>
