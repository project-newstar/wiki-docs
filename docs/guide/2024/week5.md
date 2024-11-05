---
titleTemplate: ':title | 参考文档 - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# Week 5

收官之战，感谢陪伴。每一个坚持到本周的选手，都将创造属于自己的神话。再接再厉！

## Pwn

### C_or_CPP

本题的难点主要在于程序的逆向和分析，和以往不同的是，本题需要找到漏洞点，并思考如何利用。

如果没有思路，不妨对危险函数多加留意。

### Simple_Shellcode

建议可以阅读下 `vector` 的源码喵 ~

### No_Output

没有输出，可以看看侧信道。

### EldenRing

可以先学习 `strcmp` 的绕过，和基础的堆知识。

推荐 [hack1s.fun](https://hack1s.fun) 的《从零开始的 Linux 堆利用》系列文章进行学习，本题建议的学习路线如下：

- **1 House of Force:** 学习基础及调试命令
- **2/3 FastBin Dup:** 学习 FastBin 的利用
- **8 Off-By-One:** 学习 Off-By-One 的利用

另外，对于本题具体的漏洞，可能需要注意涉及 Base64 的部分。

## Reverse

### Pangbai 泰拉记（2）

一份 PDF：[VM 逆向学习](http://www.giraffexiu.love/wp-content/uploads/2024/03/VM%E9%80%86%E5%90%91%E5%AD%A6%E4%B9%A0.pdf)。

可以学习通过 <kbd>Y</kbd> 键修改类型，修正结构体。

可以先搞清题目写了哪些指令，再研究 opcode 是什么，最后通过 opcode 还原加密。

### Pangbai 泰拉记（3）

iOS 逆向，比赛中极其罕见的题目，可以作为挑战题试试。

个人做所有逆向题思路：找判断，找密文，找密钥，找算法，写正向，写逆向。

可以通过字符串去查找关键函数，多使用 <kbd>R</kbd> 键去转化类型，不必花太长时间去研究 mach-o 的结构。

### MY_ARM

QEMU 是一个托管的虚拟机，它使用动态二进制转换技术来模拟处理器，并且提供多种硬件和外设模型，这使它能够运行多种未修改的客户机操作系统，能与 KVM 配合以接近本地速度运行虚拟机（接近真实电脑的速度）。

QEMU 可以执行用户级的进程仿真，从而可以使为某一架构编译的程序在另一架构上运行（通过 VMM 的形式实现）。

QEMU 的远程调试方法可参见下面的文章：

- [QEMU 四种远程调试方法](https://xz.aliyun.com/t/10214)

### ohn_flutter

使用 blutter 解析 `app.so`，导入符号与头文件配合 IDA 分析，需要动调获取密钥。

## Web

### PangBai 过家家（5）

<Container type='info'>

本题考查 XSS 基本原理以及简单的正则表达式绕过。
</Container>

作为《PangBai 过家家》系列第一季的收官之作，本题相对简单。主要希望新生能够认识 XSS 这种攻击方式。

题目在渲染时对用户的输入经过了一层较为简单的过滤，试图过滤掉用户输入中的 HTML 标签。这类 XSS 往往要求选手想办法使页面能够构造出能够执行命令的 `<script>` 标签。题目往往会有一个 Bot，当你将页面地址发送给 Bot，Bot 将会以「受害者」的身份去访问这个地址，而 flag 一般在 Bot 的 Cookie 中<span data-desc>（总之只有 Bot 能够获取 flag）</span>。

XSS 的全称为「跨站脚本攻击」<span data-desc>（Cross-Site Scripting）</span>，攻击者通过构造使得一个页面能够执行任意的脚本代码，然后将该页面地址通过社会工程学等方法使特定目标访问，从而在对方的设备上执行该代码，窃取 Cookie 等用户凭据或页面数据等。

### 臭皮的网站

本题比较侧重综合能力，这种题目的流程一般如下：

1. 对网站进行全面的信息收集，寻找可能存在的线索；
2. 通过利用 CVE 或者文件泄露等手段，获取到源码或关键文件进行分析，寻找可能的利用点。

本题涉及的单个考点并不难。

### 臭皮吹泡泡

上一周，你可能已经接触到了 PHP 反序列化的过程和原理，这一次让我们更进一步。

你需要学习如何构造 pop 链子——在这之前，你需要先了解各个魔术方法的触发条件，下面是一些举例：

| 魔术方法         | 描述 |
| :------------:  | :--- |
| `invoke()`      | 当尝试以调用函数的方式调用对象的时候，就会调用该方法 |
| `__construst()` | 具有构造函数的类在创建新对象的时候，回调此方法 |
| `destruct()`    | 反序列化的时候，或者对象销毁的时候调用 |
| `__wakeup()`    | 反序列化的时候调用 |
| `__toString()`  | 把类当成字符串的时候调用，一般在echo处生效 或者作为字符串处理的时候 |
| `set()`         | 在给不可访问<span data-desc>（protected、private）</span>或不存在的属性赋值的时候，会被调用 |
| `get()`         | 读取不可访问或者不存在的属性的时候，进行赋值 |
| `__call()`      | 在对象中调用一个不可访问的方法的时候，会被执行 |

你需要寻找出本题目中的链子起点和利用终点 构造对应的反序列化输出触发这些函数 构造出一条可能的 pop 链，完成最终操作。

本题内需要一些简单的 PHP 小 trick 来完成这次奇妙的吹泡泡之旅。

### sqlshell

本题考查使用 MySQL 进行写文件的知识。

## Crypto

### 学以致用

题目描述里提供的 PDF 就是 WP 捏，上世纪的小短文，相信大家能学以致用的。

整理一下题目信息，找到 PDF 中对应的解决方法，然后搜 SageMath 参考文档或者问问 GPT.

### 格格你好棒

<Container type='info'>

本题考查有关格密码的代码编写和对格密码基础的理解。
</Container>

可参阅文章：[格密码基础](https://happy-superman.github.io/2024/08/02/2024-08-02-%E6%A0%BC%E5%AF%86%E7%A0%81%E7%9B%B8%E5%85%B3/index.html)。

## Misc

### pyjail

`match case` 是 Python 3.10 才有的语法，可以用来获取一个对象的属性。

```python
class Dog:
    def __init__(self, name):
        self.name = name

def describe_pet(pet):
    match pet:
        case Dog(name=name1):
            print(name1) # 这个位置会输出 Rover，原因是 pet 对象的属性 name 被传给了 name1

pet = Dog("Rover")
describe_pet(pet)

# str() 是一个空字符串对象，下面这部分等价于 `bfc = ''.join([chr(37), chr(99),])`，也就是 `bfc = %c`.
match str():
    case str(join=join):
        bfc = join(list((chr(37),chr(99),)))
```

后面拿到了 `%c`，就可以使用 `%` 构造字符串。

### PlzLoveMe

题目给了三个文件。

RAW 记录了音频采样数据（采样率已在题目提示），需要以适合的方式解析音频。

AXF 文件是带符号的固件，使用 Linux 的 `file` 命令可查看其相关信息。请用 IDA 分析。
