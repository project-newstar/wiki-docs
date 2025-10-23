---
titleTemplate: ":title | 参考文档 - NewStar CTF 2025"
---

<script setup>
import Container from '@/components/docs/Container.vue'
import Link from '@/components/docs/Link.vue'
import { ElTag, ElCollapse, ElCollapseItem, ElTooltip } from 'element-plus'
import 'element-plus/es/components/tag/style/css'
import 'element-plus/es/components/collapse/style/css'
import 'element-plus/es/components/collapse-item/style/css'
import 'element-plus/es/components/tooltip/style/css'
</script>

# Week 5

本周的考点已经相当接近于主流 CTF 赛事中的常见内容。

## Web

### 废弃的网站

<Container type='info'>

本题考查了「条件竞争」漏洞的简单利用。

</Container>

本题给出了服务的源码，你需要找出服务中存在的**条件竞争点**，并且通过条件竞争点来合理编写脚本来对服务进行攻击。

### 眼熟的计算器

<Container type='info'>

本题考查了选手对于 Java Spring 中的 jar 包进行分析的能力。

</Container>

在本题中，你需要学习如何将 Java Spring 题目中给出的 jar 包反编译成能够阅读的 java 伪代码。

推荐使用 JetBrains 公司的 [IDEA](https://www.jetbrains.com/zh-cn/idea/download/?section=windows) 来完成这个操作。

本题将会是你迈向 java 学习的一小步。

### 小 W 和小 K 的故事（最终章）

<Container type='info'>

本题考查了 nodejs 中的「原型链污染」漏洞。

</Container>

尝试找出服务中存在的各个模块中，可能造成原型链污染的方法，并且上网搜寻其相关内容。

当我们在对大多数服务<span data-desc>（特别是 go，nodejs，python 等强模块相关的语言）</span>进行渗透时，通常需要了解该服务中所利用到的模块的版本信息，并且根据模块版本信息来上网搜寻相关的 CVE，或者查询 github 上的历史 commit 中被修改掉的内容，很可能就是解题的关键。