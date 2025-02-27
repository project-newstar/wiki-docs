---
titleTemplate: ":title | 快速入门 - NewStar CTF"
---

<script setup>
import NCAlert from './nc.vue'
import Container from '@/components/docs/Container.vue'
import Link from '@/components/docs/Link.vue'
</script>

<NCAlert />

# Netcat 使用指南

<Container type='info'>

本文部分内容摘自 [如何使用 netcat - 西电 CTF 终端](https://ctf.xidian.edu.cn/wiki/13)（作者：<Link theme="underline hover" href="https://github.com/koitococo">可可今天吃什么</Link>），并遵循 <Link theme="underline hover" href="https://creativecommons.org/licenses/by-sa/4.0/legalcode.zh-hans">CC-BY-SA 4.0</Link> 协议。

</Container>

## 什么是 Netcat

`nc`/`ncat` 是一个用于网络连接的工具，它可以连接到一个指定的 IP 地址和端口，并且可以发送和接收数据。在 CTF 比赛中，我们经常使用 `nc` 命令来连接到题目的服务端口。

`nc` 是 `netcat` 的缩写，而 `ncat` 是对 `nc` 的一个重写，两者间的行为差别可以忽略不计。当然，如果你 Pwn 题目做得多，或者你是 CTF 「牢玩家」的话，你可能会更常用 `pwntools` 这个 Python 库，它提供了更多的功能，但在这里我们只讨论 `nc`.

## 如何安装 Netcat

### Linux

大多数 Linux 发行版已经预装了 Netcat，你可以尝试在终端输入 `nc` 来判断是否已经安装 `nc` 工具，如果能正确显示 `nc` 的使用帮助，则说明已经正确安装。

如果你的 Linux 没有安装 `nc`，你可以根据对应的包管理器安装：

::: code-group

```bash [apt]
sudo apt install netcat-openbsd
```

```bash [pacman]
sudo pacman -S openbsd-netcat
```

```bash [dnf]
sudo dnf install -y nmap-ncat
```

:::

::: info 部分 Linux 发行版的默认包管理器

- Debian/Ubuntu: `apt`
- Arch Linux: `pacman`
- CentOS/RHEL/Fedora: `yum` `dnf`

:::

### Windows

Windows 系统中没有 `nc` 工具。但是你可以下载 `ncat` 工具，它是 `nc` 的一个重写，功能更强大。访问 [nmap 下载页面](https://nmap.org/download.html)，选择 Windows 版本并下载，然后安装时选择安装 `ncat`。

你也可以下载 `nc` 的独立版本<span data-desc>（请见 [netcat for Win32/Win64](https://eternallybored.org/misc/netcat/)）</span>，解压后将 `nc.exe` 所在目录添加到 `PATH` 环境变量中。

::: warning 注意
如果你使用 `ncat`，请将之后遇到的命令中的 `nc` 替换为 `ncat`.
:::

### MacOS

在 MacOS 中，`nc` 是被默认安装的。可以在终端输入 `nc` 来判断是否已经安装`nc`工具，如果能正确显示`nc`的使用帮助，则说明已经正确安装。

如果你的 MacOS 并没有安装 `nc`，你可以使用 Homebrew 安装：

```bash
brew install netcat
```

### 其他系统

如果你使用的是其它系统，那么想必你应该已经对计算机有着深入的理解和认识，你可以自行搜索如何安装 `nc` 获其替代工具。当然，你也可以自己写一个程序完成类似 `nc` 的 Socket 通信。

## 如何使用 Netcat

`nc` 的使用方法非常简单，你只需要在终端输入 `nc`，然后加上你要连接的地址和端口号，就可以连接到题目的服务端口了。

例如，如果题目的主机为 `hacker.akyuu.space`，端口为 `6668`<span data-desc>（或者以 `hacker.akyuu.space:6668` 等形式给出，请自行识别）</span>，那么你可以在终端输入：

```bash
nc hacker.akyuu.space 6668
```

然后按下 <kbd>↵ Enter</kbd> 回车键，你就可以连接到题目的服务端口了。

若连接成功，你会看到服务端返回的内容，并且可以使用命令行与远程进行交互。否则，你可能会看到一些错误信息，这时，你可以尝试检查一下你的网络连接，必要时寻求帮助。

## 为什么我不能用浏览器访问某些题目

浏览器访问一个链接使用的是 HTTP/HTTPS 协议。HTTP/HTTPS 协议构建于 TCP 协议之上，有其固定的 TCP 报文格式。而一些方向<span data-desc>（如 Pwn、Misc）</span>的题目使用的是原始的 TCP 协议，可能并没有进一步实现 HTTP 协议的内容。这时你需要直接用 TCP 协议与服务器通信（交互）。所以用浏览器访问会使得服务器接收到一个 HTTP/HTTPS 的报文内容，即使服务器作出响应，浏览器也无法正确解析。

接下来展示一个例子，以便更好地说明这两种不同的情况。假设题目给出的地址和端口为 `hacker.akyuu.space` `6668`，当你使用浏览器访问，浏览器会向服务器发一个 TCP 报文：

```HTTP
GET / HTTP/1.1
Host: hacker.akyuu.space:6668


```

而 nc 则仅仅是打开了一个 TCP 连接。

之后，服务器会返回给你一个 TCP 报文：

```plaintext
Input username:
```

而浏览器无法解析 `Input username:` 这个内容，因为它不是有效的 HTTP 响应报文，故显示出错。

::: tip
如果你用浏览器访问题目地址时出现了问题，不妨尝试使用 `nc` 命令连接到题目的服务端口。

有时使用浏览器访问题目地址显示页面或跳转到某个地址，这只是因为题目做了有关 HTTP 报文的处理，以使返回的内容能够被你的浏览器正确解析。
:::

## 参考链接

- [Netcat - Wikipedia](https://en.wikipedia.org/wiki/Netcat)
- [如何使用 netcat - 西电 CTF 终端](https://ctf.xidian.edu.cn/wiki/13)
