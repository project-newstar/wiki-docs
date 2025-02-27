---
titleTemplate: ":title | 参考文档 - NewStar CTF 2024"
---

<script setup>
import Container from '@/components/docs/Container.vue'
import Text from '@/components/docs/NonTextDetectable.vue'
</script>

# Week 2

本周的题将继续在上周的基础上，注重入门知识基础、工具的使用等。从下周开始，题目将逐渐增加难度，希望大家把握好前两周的题目考查内容，为后面的题目做好准备。

## Pwn

### ez_game

<Container type='info'>

本题考查的是 ret2libc 的知识点。
</Container>

开始这个题目前，你需要先了解以下内容:

- 栈溢出的原理
- PLT 和 GOT 表的关系以及延迟绑定
- 偏移和基地址之间的关系<span data-desc>（如 `puts` 函数相对于 `libc` 基地址的偏移）</span>
- 在 64 位程序下如何实现控制程序的参数
- 了解栈对齐的实现
- 学会寻找 `/bin/sh` 的地址

内容有点多，希望大家能继续玩这个游戏。

### Inverted World

本题考查 ret2backdoor 以及基础的逆向能力。

程序中的 `_read` 函数为自定义的函数，需要分析<span data-desc>（IDA 可能会在反编译的 C 函数窗口把这个函数的名字前面的下划线去掉）</span>。

除此之外还要注意一下栈帧的结构以及函数调用时栈帧的变化。

### Bad Asm

<Container type='info'>

本题考查 shellcode 编写能力。
</Container>

题目对 shellcode 的要求是：

- 不能直接使用限制的汇编指令
- shellcode 中间不能有空字节。

想想办法绕过这些限制。

可以利用一些在线工具辅助解答：[Online x86 / x64 Assembler and Disassembler](https://defuse.ca/online-x86-assembler.htm#disassembly).

## Reverse

### Dirty_flowers

考虑到新生在 Week 2 就学会汇编和花指令可能还是有点奢望，因此本题考查的实际上是 IDA 的 nop 操作。

只做出这个题目实际上需要的前置知识非常少，只需要根据题目中的提示信息学会 IDA 如何 patch 汇编指令从而正确反编译。

当然希望同学们可以通过这个题多多学习汇编语言，了解花指令是如何让 IDA 无法正确反编译的。

### ezencrypt

安卓常见的加密手段。

- Java 层有两个加密<span data-desc>（感觉能看成一个呢）</span>
- so 层有两个加密<span data-desc>（感觉只能算一个呢）</span>

请查找有关 Java 层的标准加密方式，Java 层调用 so 层的调用值传递方式。（JNI 怎么传字符串呢？）

这次的题很简单呢。

### Ptrace

<Container type='info'>

本题考查对于调试器原理的理解，侧重对 ptrace 的了解。
</Container>

这里包含两个文件 `father` 和 `son`，请将两个文件放在同一目录下，并且只需要启动一个文件即可。

所以需要先理清这两个文件的关系，在此过程中，你可能还需要了解 `fork` `execl` 等函数的作用，它们可以帮助你理清文件的关系。

加密的方法很简单，重点关注 ptrace 到底做了什么，改变了什么。

### UPX

选手需要了解 UPX 以及它的加密算法。

## Web

### 你能在一秒内打出八句英文吗

考查对 Web 自动化脚本的撰写，可以了解下 Python 的 `Requests` 和 `BeautifulSoup` 库，以及 HTTP 会话控制。

### 复读机

<Container type='info'>

本题考查 Python 中 Flask 框架中，`render_template` 等函数导致的模板渲染注入（SSTI）的利用。
</Container>

对于 Python SSTI，一个简单的例子是，当你输入 `{{ '{'+'{ 3+4 }'+'}' }}`，它将输出了 `7`. 那么，通过精心构造 `{{ '{'+'{ }'+'}' }}` 中的表达式，可以实现任意命令执行。

<Container type='quote'>

在编辑这一段的时候直接写 `{{ '\u0060{'+'{ 3+4 }'+'}\u0060' }}`，导致 Vue 直接渲染了结果 `7`，可以说是现场复现了模板注入了。
</Container>

### 谢谢皮蛋 plus

还是 SQL 注入题，在 Week 1 的基础上增加了一点过滤。选手需要测试过滤了哪些字符，并尝试绕过。

这篇文章总结了一些常见的 SQL 注入：[SQL 注入绕过过滤总结](https://yang1k.github.io/post/sql%E6%B3%A8%E5%85%A5%E7%BB%95%E8%BF%87%E5%8E%9F%E7%90%86%E6%80%BB%E7%BB%93/)。

### PangBai 过家家（2）

了解 Git 是什么，以及它的常见命令。
互联网上有很多 `.git` `.svn` `.DS_Store` 等的泄露工具，但所支持的功能参差不齐。对于泄露 `.git` 的工具，有些不能泄露出提交历史、Stash、标签等。

## Misc

### 字里行间的秘密

考查一般的文字隐写形式，可自行搜索相关文字隐写的考点与考查方式。

### 热心助人的小明同学<Text class='desc-text' fontSize='16px' fontWeight='500' content='（内存取证入门）' />

内存取证本质就是解析内存获取计算机某个时间节点的状态信息<span data-desc>（如进程、文件、注册表、浏览记录等）</span>。

我们通常在 CTF 中遇到的内存取证题基本给了一个 `.raw` 文件，需要我们使用工具去解析<span data-desc>（工具用得熟练就赢了）</span>。

对于初学者来说，建议使用 Volatility 作为内存取证的入门工具，你需要做的就是想办法安装这个软件，搜索使用方法，根据题目的指引「一把梭」。

对于针对老旧系统的镜像取证，通常使用 Volatility 2，这也是用的比较多的版本；面对一些新系统的内存镜像可以尝试使用 Volatility 3，这个软件的具体用法，可以尝试使用 `-h` 命令行选项摸索，或自行上网了解。

当然，你也可以借助一些第三方取证工具。在某些题目下，使用一些第三方工具可能会有意想不到的效果。<span data-desc>不过 Week 2 暂时不需要就是了，很简单的。</span>
