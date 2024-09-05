---
title: 快速入门
titleTemplate: ':title - NewStar CTF'
---
<script setup>
import Container from '@/components/docs/Container.vue'
import Link from '@/components/docs/Link.vue'
import { ElTag } from 'element-plus'
import 'element-plus/es/components/tag/style/css'

</script>

# 快速入门

如果你曾经从未接触过 CTF，或者对该赛事还不是很熟悉，这份文档可能会帮助到你。

## 什么是 CTF

CTF 是一种比赛形式，你会得到一个题面<span style="color: #7c7c7c">（可能是一段话、一个压缩包、一张图片、一个网站、一个链接、一份源码、一个程序等）</span>，你需要根据题面，通过各种手法找到或得到诸如 `flag{xxx}` 的内容，这便是此题的答案。

## 走出洞穴的第一步

如果你此前从未接触过 CTF，你可能需要先了解其形式，即通过一些在线靶场或新生赛的低门槛题目进行适应。下面的一些公益新生赛事或平台或许会对你有所帮助：

- <ElTag type="primary" size="small">赛事</ElTag> <Link icon="external" theme="underline hover" href="https://ctf.xidian.edu.cn/">西电 MoeCTF</Link>
- <ElTag type="primary" size="small">赛事</ElTag> <Link icon="external" theme="underline hover" href="https://basectf.fun/">BaseCTF</Link>
- <ElTag type="info" size="small">平台</ElTag> <Link icon="external" theme="underline hover" href="https://www.ctfhub.com/">CTFHub</Link>
- <ElTag type="info" size="small">平台</ElTag> <Link icon="external" theme="underline hover" href="https://ctf.show/">CTFSHOW</Link>
- <ElTag type="info" size="small">平台</ElTag> <Link icon="external" theme="underline hover" href="https://buuoj.cn">BUUOJ</Link>
- <ElTag type="info" size="small">平台</ElTag> <Link icon="external" theme="underline hover" href="https://www.nssctf.cn">NSSCTF</Link>

随后，你应当选定一个方向，作为你主攻方向。例如，对网络感兴趣、有基础的同学可能更适合 Web 方向，而对程序运行底层逻辑、二进制感兴趣的可能更适合逆向（Reverse）和 Pwn，等等。

然后，当你接触到特定的题目时，你会遇到特定的知识点。设计得当的引导会控制好你所接触的「新事物」的量。这个时候，辅以实践，你再通过搜索、询问等各种方式学习知识细节，或许会轻松许多。

如果你在寻求更细节和全面的指导，可以查看 <Link icon="external" theme="underline blink" href="https://ctf-wiki.org/">CTF Wiki</Link> 或由探姬师傅主导的 <Link icon="external" theme="underline blink" href="https://hello-ctf.com/">Hello CTF</Link> 等网站。注意，与传统的课堂教育模式不同，这些网站并不要求你立即并全部掌握其中的内容，而是充当一个手册供你速查。

对于自己无能为力的题，记得在赛后根据题解（WriteUp）进行复现。温故而知新，可以为师矣。

## 我还没有准备好

<Container type='warning'>
参与 CTF 赛事，是一个不断在历练中成长的过程，是对自我螺旋上升式的提升，是理论与实践相结合的又一深入尝试。请时刻铭记：<strong>充分发挥自己的主观能动性，在实践中成长。</strong>
</Container>

搜索引擎是你生涯中最重要的伙伴之一，请珍爱并善于使用它。如何高效使用搜索引擎是对信息搜集和快速查找知识的考察，你需要通过大量实践和碰壁以养成该能力。推荐的搜索引擎有：

- 必应（Bing）国际版
- Google 搜索
- DuckDuckGo
- 带有联网或搜索功能的 AI（Bing Copilot、SearchGPT）

此外，BiliBili 也是不错的选择。

常见的搜索技巧有：

- 搜索时采用关键词搜素，以便能最大限度匹配到需要的内容
- 中文无法搜素到资源时考虑使用英文关键词
- 借用 AI 得知具体的搜索方向和关键词

此外，必备的知识迁移能力和动手尝试（试错）能力是不可或缺的。

在这趟旅途中，请收藏对你帮助巨大或需要日后查阅的链接或文档。值得一提的是，偶尔的旅途记录或许将在某些时刻发挥意想不到的作用，例如知识速查、快速回顾等。
