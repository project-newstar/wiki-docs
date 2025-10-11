---
titleTemplate: ":title | 参考文档 - NewStar CTF 2025"
---

<script setup>
import Container from '@/components/docs/Container.vue'
</script>

## Pwn

### only_read

<Container type='info'>

本题考查了 SROP、栈迁移、orw 的知识点。

</Container>

在开始此题之前，你需要先了解以下内容：

- 栈迁移的原理。
- 如何使用 `leave` `ret` 进行栈迁移。
- 什么是 sigreturn 函数，srop 的原理，如何用 sigreturn 函数进行 srop。

内容有点多，希望大家能多看看文章，自己动手调试。

## Web

### who'ssti

<Container type='info'>

本题考查了选手对于 SSTI 最基础的构造方法。

</Container>

本题给予了完整的 Docker 环境附件，你可以在 Linux 上安装 Docker 环境来进行使用<span data-desc>（官方安装教程：[Install Docker](https://docs.docker.com/engine/install/ubuntu/)）</span>。

## Misc

### jail-evil jail

<Container type='info'>

本题考查了选手对于 PyJail 的掌握，以及对过滤字符的绕过能力。

</Container>

可参阅 dummykitty 总结的文章 [CTF Pyjail 沙箱逃逸绕过合集](https://dummykitty.github.io/posts/python-沙箱逃逸绕过/)来进行学习。

本题有较多预期解法，你可以多找几个角度去尝试解出这道题目。