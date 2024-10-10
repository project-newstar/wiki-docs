---
titleTemplate: ':title | 参考文档 - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# Week 3

从本周开始，题目将逐渐增加难度，并注重知识点的考察，希望大家好好学习相关内容。若仍有相关问题，请参考[快速入门](/learn/)。

## Pwn

### One Last B1te

在解题之前，你需要了解 `RELRO` 保护以及动态链接与延迟绑定的流程以及细节，除此之外还有沙箱机制。

程序中提供了任意地址写的机会，但是我们已知的只有 ELF 地址。

那一个字节写到哪里好呢? ELF 中可写的段只有 `0x404000` 开始的段，仔细规划规划那一个字节写在哪里，写什么吧 ~

除此之外，如果没有思路的话建议多动态调试看看，注意 `call close` 函数时寄存器的状态。

如果你苦恼于 ELF 中没有好用的 `gadget` ，不妨看看别的可执行段中的 `gadget` 。

如果你苦恼于 `gadget` 没法设置 `rdx` 寄存器，不妨看看别的 `gadget` ，能设置 `rdx` 寄存器的 `gadget` 不只有 `pop rdx; ret;`.

## Reverse

### SMc_math

`SMC` ，即 `Self Modifying Code` ，动态代码加密技术，指通过修改代码或数据，阻止别人直接静态分析，然后在动态运行程序时对代码进行解密，达到程序正常运行的效果。

`SMC` 的一般破解方法是，通过动态调试，在代码解密完之后下断点并查看解密之后的代码。

`Z3` 是由微软开发的一个高性能定理证明器，用于解决逻辑约束、符号执行、模型检测等问题。`Python` 版本的 `Z3` 提供了接口，可以方便地在 Python 中使用 `Z3` 求解逻辑问题，特别是在 `SMT(Satisfiability Modulo Theories)`求解方面。

### flowering_shrubs

`IDAPython` 是一个将 Python 集成到 `IDA Pro（Interactive DisAssembler` 中的插件。它允许你使用 Python 脚本来自动化逆向工程任务，从而提高分析效率。

如果你在使用 ida 过程中发现了许多同样的混淆，你可以编写 `idapython` 脚本来批量去除。

### simpleAndroid

关于安卓，了解一下 `JNI` 的静态注册和动态注册。

加密的算法不难，主要就是识别出 java 层和 so 层分别起到什么作用，它们是怎么进行交互的。

### SecretOfKawaii

使用 Jeb 解控制流混淆，so 层普通压缩壳用 UPX 解。

解密涉及到端序转化，建议查找相关资料，理解后再做题，同时还需要有点补码的知识呢。加密算法在 CTF 比赛还是比较常见的。

### 011vm

`ollvm` 混淆需要使用 `d810` 去除，但可能还面临着部分控制流难以去除的问题，最好结合动调做题。

本题只有常见加密，细心观察逻辑即可解出。

## Web

### 臭皮的计算机

<Container type='tip'>

本题考查 Python 的命令执行和输入过滤绕过。
</Container>

了解 Python 3 的一些特性，`eval()` 可以执行字符串中的任意 Python 表达式，包括算术运算、函数调用，甚至系统命令。灵活利用 ByPass 技巧，不要拘泥于单一使用，可以组合，嵌套使用。

### 臭皮踩踩背

<Container type='tip'>

本题考查对 Python 中「一切皆对象」的理解。
</Container>

字符串，数字，函数等等都是"对象",都有自己的属性，对可利用对象和属性的积累，是 python 沙箱逃逸的基础。

理解什么是内建函数 `__builtins__` `eval()` 函数的进阶用法，什么是命名空间,以及常用的命令执行的函数对解开这题至关重要。

推荐去 Python 官方文档了解 `eval()` 函数：

- [Built-in Functions](https://docs.python.org/3/library/functions.html#eval)
- [Python/bltinmodule.c](https://github.com/python/cpython/blob/main/Python/bltinmodule.c#L937)

强烈建议先自己本地试试。大部分源代码题目已经给出。

### 这照片是你吗

<Container type='tip'>

本题考查常见的漏洞：路径穿越漏洞，并且考查 Python 的代码审计。
</Container>

解题需要：

- 理解密钥复杂度与安全性之间的相关性
- 有写脚本的重要基本功
- 对 SSRF 漏洞有一个基本认识

### Include Me

这题主要考查远程文件包含漏洞，PHP 伪协议，理解什么是转换流是本题的关键，同时还需了解一下 Base64 编码 的格式以及 URL 解码 和编码时的保留字符和非保留字符。

### blindsql1

与前几周的题一样，考察 SQL 注入的相关知识。可继续参考文章：[SQL 注入绕过过滤总结](https://yang1k.github.io/post/sql%E6%B3%A8%E5%85%A5%E7%BB%95%E8%BF%87%E5%8E%9F%E7%90%86%E6%80%BB%E7%BB%93/)。

## Crypto

### 不用谢喵

更加明确的考点指向，参见：[Block cipher mode of operation | Wikipedia](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation).
