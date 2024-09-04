---
titleTemplate: ':title | 快速入门 - NewStar CTF'
---
<script setup>
import Link from '@/components/docs/Link.vue'
</script>

# Reverse

逆向工程通常是在没有源代码的情况下对软件进行分析，相对于正向的代码编程来说，逻辑通常是反过来的，需要有好的代码分析和反向思维能力。

## 0x01. 学习 C 语言代码

C 语言是逆向工程的基础，务必重点学习以下内容。

1. 流程控制: if、switch、goto、break
2. 指针操作: 引用，解引用，取地址，数组与指针转化
3. 数据类型: 熟记 char、int、int64 等类型大小
4. 可逆运算: 异或运算、算数运算、移位与循环移位运算

## 0x02. 学习常见加密

加密是逆向工程对抗的核心,务必熟记加密算法原理和特征,这样在面对混淆和魔改加密时才能游刃有余。

1. TEA 系列加密: TEA、XTEA、XXTEA
2. RC4 加密
3. AES/DES加密
4. 16进制编码
5. Base64编码

加密特征识别可参阅：<Link icon="external" theme="underline blink" href="https://pangbai.work/IT/re/ctf_encode/">常见加密算法特征识别</Link>

常见加密不是一成不变的模板，死记硬背不可能通杀，请务必读懂加密过程和大致原理。

## 0x03. 脚本代码编写

脚本编写是一项很重要的能力，你需要熟悉 C 语言和 Python，并且减少代码出错的可能性。平时的解题脚本一定要收集好，并找时间整理，比赛争分夺秒，好的解题模板可以帮你快速夺得一血。

## 0x04. 逆向工具的使用

1. IDA: 二进制方向工具，90%的题都会用到，务必熟悉使用
2. Jadx-gui: Java 代码反编译工具，安卓软件和 Java 程序都会用到。
3. Jeb: 面相安卓逆向的利器，有 Java 代码反混淆功能
4. Pyinstxtractor: 解包 Python 编写的 exe 文件
5. Uncompyle6: 反编译 Python 大部分版本字节码（pyc 文件）
