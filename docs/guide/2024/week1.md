---
titleTemplate: ':title | 参考文档 - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# Week 1

本周的题目相对基础，主要通过考查的形式敦促大家配置基本环境、熟悉基础知识，为后续的题目做好准备。

如果你在做题时遇到了一些困难，可以阅读这里的内容，或许能够给你一些启发。

## Pwn

本周的 Pwn 考查一些工具的基本使用，可以阅读 [Pwn 环境配置](/learn/configure-pwn)，并熟悉其中提到的工具。

对于快速入门和解题样例，可以阅读 [Pwn 二进制安全 - 快速入门](/learn/pwn)。

## Web

### Pangbai 过家家（1）

<Container type='info'>

在做本题前，建议先完成题目：**Week1/Web/headach3**

</Container>

浏览器的开发者工具是个好东西，浏览器插件 HackBar 也是个好东西，另外你可能需要 BurpSuite、Yakit、curl 等发送 HTTP 请求的工具。

<Container type='tip'>

有关 Web 前端包括相关 Web 标准在内的知识，[MDN](https://developer.mozilla.org/zh-CN/) 非常齐全且易懂。

</Container>

这题考察的是 HTTP 报文的内容，你可能需要先了解这些内容：

- 什么是 Method、Header、请求体、响应体、状态码
- Cookie 是什么？他有什么作用和特性？
- User-Agent 的作用是什么？格式又是怎样的？

Header 中有各种各样的 Content-Type，每一种 Content-Type 所要求的请求体的格式可能是不一样的，你也需要了解其不同。

另外，Header 中的某些字段也用于「防盗链」，服务器检查请求来自哪里，如果不在白名单内就不给返回或返回其它内容，所以有时候在其他网站引用像 QQ 空间的图片会看到类似「图片无法显示」的内容。

JWT 在网页中经常用于存放一个数据<span data-desc>（例如你的登录凭据等）</span>，并被签名。只有知道签名所用到的 secret 值，才能够签名和验证签名正不正确。对于 JWT，分享一个好网站：[JWT.IO](https://jwt.io/).

<Container type='quote'>

Level 6 有什么用，还不是被神之右手所打败

</Container>

### 谢谢皮蛋🥚

<Container type='info'>

本题所需要的前期知识储备较多，如果你从未了解和接触过数据库和 SQL 语句，你可能需要花费一定的时间快速了解并尝试。

</Container>

本题考察的是 SQL 注入的知识点。

做本题前你需要去了解一下这些内容：

- 什么是数据库，什么是 MySQL
- 一些 SQL 语法，如最常用的 SELECT 这些
- SQL 注入的原理

找一些 SQL 注入的技巧，比如最简单的引号，联合注入需要的 `UNION`、`ORDER BY` 等。

当你实现 SQL 注入后，一般我们需要进行信息搜集，看看当前数据库名称是什么，有哪些表，表里面有哪些列，表里面一共有多少个元素，等等。

你可以尝试自己搭建环境来熟悉 MySQL 和 SQL 语句。

## Misc

### WhereIsFlag

题目考查的是一些基本的 Linux 命令和知识，你可以先自己通过 WSL 等虚拟机中自行练习 Linux 使用技能。

题目中仅是模拟 Linux 命令，并不完全和你的 Linux 终端有一样效果。
