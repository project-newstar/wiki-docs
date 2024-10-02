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

这题考查的是 HTTP 报文的内容，你可能需要先了解这些内容：

- 什么是 Method、Header、请求体、响应体、状态码
- Cookie 是什么？他有什么作用和特性？
- User-Agent 的作用是什么？格式又是怎样的？

Header 中有各种各样的 Content-Type，每一种 Content-Type 所要求的请求体的格式可能是不一样的，你也需要了解其不同。

另外，Header 中的某些字段也用于「防盗链」，服务器检查请求来自哪里，如果不在白名单内就不给返回或返回其它内容，所以有时候在其他网站引用像 QQ 空间的图片会看到类似「图片无法显示」的内容。

JWT 在网页中经常用于存放一个数据<span data-desc>（例如你的登录凭据等）</span>，并被签名。只有知道签名所用到的 secret 值，才能够签名和验证签名正不正确。对于 JWT，分享一个好网站：[JWT.IO](https://jwt.io/).

<Container type='quote'>

Level 6 有什么用，还不是被神之右手所打败

</Container>

### 谢谢皮蛋

<Container type='info'>

本题所需要的前期知识储备较多，如果你从未了解和接触过数据库和 SQL 语句，你可能需要花费一定的时间快速了解并尝试。

</Container>

本题考查的是 SQL 注入的知识点。

做本题前你需要去了解一下这些内容：

- 什么是数据库，什么是 MySQL
- 一些 SQL 语法，如最常用的 SELECT 这些
- SQL 注入的原理

找一些 SQL 注入的技巧，比如最简单的引号，联合注入需要的 `UNION`、`ORDER BY` 等。

当你实现 SQL 注入后，一般我们需要进行信息搜集，看看当前数据库名称是什么，有哪些表，表里面有哪些列，表里面一共有多少个元素，等等。

你可以尝试自己搭建环境来熟悉 MySQL 和 SQL 语句。

### headach3

HTTP响应头是什么？https://developer.mozilla.org/zh-CN/docs/Glossary/Response_header

如何查看HTTP响应头？F12

### 智械危机

- https://zh.wikipedia.org/wiki/Robots.txt
- 先学会阅读简单php代码，包括函数定义、调用、变量定义、循环。
- 怎么接收HTTP POST参数？
- base64怎么编码和解码？https://base64.us/
- md5是什么，怎么计算md5值？
- 简单的linux命令，ls、cat、cd ...

## Misc

### WhereIsFlag

题目考查的是一些基本的 Linux 命令和知识，你可以先自己通过 WSL 等虚拟机中自行练习 Linux 使用技能。

题目中仅是模拟 Linux 命令，并不完全和你的 Linux 终端有一样效果。

### Labyrinth

建议您先了解一下 LSB、隐写等概念和原理，并熟悉 StegSolve 工具的使用。

StegSolve下载地址：https://github.com/Giotino/stegsolve

### 兑换码

本题考查 PNG 文件的字节码知识，你可以通过自行查阅 PNG 的二进制格式（如文件头、IHDR、宽、高、数据块等）来了解 PNG 文件的构成。

## Reverse

### ez_debug

- 学会使用ida进行动态调试
- 或者使用x64dbg进行调试：https://github.com/x64dbg/x64dbg

### begin

- 你需要学会使用 IDA 进行字符串搜索，根据字符串定位关键代码的位置。

- 下面列举一些 IDA 的常用快捷键：

  - <kbd>F5</kbd> 查看反编译之后的 C 语言代码
  - <kbd>⇧ Shift</kbd><kbd>F12</kbd> 查看程序中的所有字符串
  - 点击变量或者函数名，按下 <kbd>X</kbd>，可以看到这些变量或者函数被谁引用

### Simple_encryption

题目将你的输入进行了加密，你只能看见加密后的结果和加密算法。你需要根据加密结果和加密算法解出原始内容。

异或运算的逆向：符号 `^` 表示的就是异或运算（数学中采用符号 $\oplus$）。异或运算是可逆的，即若 $a \oplus b = c$，则 $c \oplus b = a$.

本题仅考查加减运算和异或运算的逆向。所谓运算的逆向，即类似数学中通过 $y = f(x)$，求 $x = f^{-1}(y)$ 的过程（或已知 $y$，求 $x$ 的过程）。

### ezAndroidStudy

本题主要考查对 APK 基本结构的掌握。

关于 APK 文件，可以使用反编译工具 jadx 打开。

`AndroidManifest.xml` 文件往往包含很多关键信息，如 `MainActivity`<span data-desc>（`MainActivity` 类似于 C 语言中的 `main` 方法，是整个程序的入口）。</span>
