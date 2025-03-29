---
titleTemplate: ":title - NewStar CTF"
outline: [2, 4]
---

<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# WSL 安装教程

## WSL 简介

WSL（Windows Subsystem for Linux）是 Windows 操作系统下的一个轻量虚拟机，支持运行 Ubuntu、Debian 等 Linux 子系统。以其与 Windows 操作系统的高度交互性（例如文件系统、网络、部分通用应用程序的无障碍互通等），使用起来更为简便。

WSL 的底层虚拟化实现与传统虚拟机的「完整套娃」不同，WSL 1 将底层系统调用或 API 将转化为 Windows 层；WSL 2 基于微软自家的 Hyper-V 虚拟化技术，做了大量优化。也因此 WSL 的性能开销（内存、CPU）更小，启动速度更快。

WSL 2 比 WSL 1 更接近于完整的 Linux 内核，但对 GPU/USB 等外设支持有限。

关于 WSL 和虚拟机的使用。建议日常开发等需求轻度使用 WSL2 体验最佳。两者可以共存，根据需求切换使用。

## 安装 WSL 2

### 必要条件

Windows 10 1903 及以上版本。

WSL 2 使用了 Hyper-V 架构的一部分功能，你的 PC 须支持虚拟化技术，并在 BIOS 中开启。

使用 WSL 需要开启一些 Windows 功能。下面几种方式都可以开启，选择你喜欢的方式即可。

#### 方式一：图形界面

在 Windows 的搜索栏或设置的搜索栏中搜索「功能」，打开「启用或关闭 Windows 功能」，确保以下功能已启用：

- 适用于 Linux 的 Windows 子系统
- 虚拟机平台（Virtual Machine Platform）

![启用或关闭 Windows 功能](/assets/images/learn/wsl-enable-windows-feature.png)

<Container type="tip">
建议在微软商店搜索「终端」或「Terminal」，它是一个支持多标签页、功能更强大的官方终端工具，推荐使用。

</Container>

#### 方式二：命令行

以**管理员身份**运行终端<span data-desc>（按下 <kbd>Win</kbd><kbd>X</kbd> 并选择「终端管理员」可快速打开）</span>。

使用下面的命令，启用功能「适用于 Linux 的 Windows 子系统」：

```shell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

::: tip 可能的报错
若报错：无法解析服务器的名称或地址。请在网络和 Internet 设置中检查你的 DNS 设置。

:::

使用下面的命令，启用功能「虚拟机平台」：

::: code-group

```shell [任意终端]
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

```shell [PowerShell]
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
```

:::

::: tip 可能的报错
若报错且报错代码为 `0x800701bc`，请在终端输入下面的命令更新 WSL：

```shell
wsl --update
```

若报 WSL 的更新进度为一直为 0 或者不变，可尝试重启计算机，或尝试从 Github 下载<span data-desc>（须确保你的终端网络环境能访问 Github）</span>：

```shell
wsl --install --web-download
```

:::

### 设置 WSL 2 为默认值

在管理员终端中输入下面的命令：

```shell
wsl --set-default-version 2
```

### 安装一个 Linux 发行版

打开微软应用商店，搜索一个你喜欢的 Linux 发行版（如 Ubuntu、Debian 等），点击安装。

::: tip
若无法正常使用微软商店，请尝试关闭你的代理或 VPN 软件，并检查你的网络环境。

:::

例如：

![Ubuntu](/assets/images/learn/wsl-store-ubuntu.png)

![Debian](/assets/images/learn/wsl-store-debian.png)

安装完成后，你可以打开它，或者在终端中输入 `wsl` 命令来启动它<span data-desc>（如果你使用的是微软商店的终端，在终端的新建标签卡中应当也可以找到你安装的 Linux 发行版）</span>。

随后，按照提示信息设置用户名、密码等即可。

## 相关命令

启动 WSL 并以 ROOT 用户身份登录：

```shell
wsl --user root
```
