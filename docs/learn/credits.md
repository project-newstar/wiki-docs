---
titleTemplate: ":title | 快速入门 - NewStar CTF"
comments: false
---

<script setup>
import Container from '@/components/docs/Container.vue'
import credits_json from "./credits.json";
import { ElCollapse, ElCollapseItem, ElTable, ElTableColumn } from "element-plus";

const credits = credits_json.map((item) => {
  return {
    section: item.section,
    contributors: item.contributors.join(", "),
  };
});
</script>

<style lang="scss">
.credits-list table {
    margin: initial;
    tr {
        border-top: initial;
    }
    th,
    td {
        border: initial;
    }
}

.credits-list th {
    --el-table-header-bg-color: var(--vp-c-bg-elv);
}

.credits-list tr {
    --el-table-tr-bg-color: var(--vp-c-bg);
    --el-fill-color-lighter: var(--vp-c-bg-soft);
}

.credits-list td {
    --el-table-border-color: var(--vp-c-divider);
}
</style>

# 贡献者

<Container type="info">

「快速入门」的建立和完善离不开各位师傅们的倾囊相助。这里展示参与该栏目的贡献者们。
</Container>

<div class="credits-list">

<ElTable :data="credits" stripe style="width: 100%">
    <ElTableColumn prop="section" label="版块" width="210" />
    <ElTableColumn prop="contributors" label="贡献者" />
</ElTable>

</div>
