---
titleTemplate: ":title - NewStar CTF"
---

## 什么是WSL
WSL（windows subsystem for linux），指的是windows的一个子系统，这个子系统的作用是在windows下运行linux操作系统。

简单来说，WSL和传统虚拟机（如 VMware/VirtualBox）虽然都能实现在 Windows 主机里通过启动一个 Linux 操作系统来运行 Linux 程序的效果，但底层实现完全不同：

- 工作原理不同

WSL1 是"翻译官"模式：直接把 Linux 命令转成 Windows 能理解的指令，没有真正的虚拟化

WSL2 是"轻量级虚拟机"：基于微软自家的 Hyper-V 虚拟化技术，但做了大量优化

传统虚拟机是"完整套娃"：完全模拟整套硬件环境，运行完整操作系统

- 性能消耗不同

WSL1 几乎零负担：像运行普通 Windows 程序一样省资源

WSL2 内存占用约500MB起：比传统虚拟机（通常2GB+）轻得多

传统虚拟机需要预留大量资源：完整系统运行开销大

- 使用体验差异

WSL 启动秒开：像打开记事本一样快

虚拟机启动要等：就像正常开机需要时间

文件系统性能：  
WSL1 访问 Windows 文件快，但 Linux 文件操作慢  
WSL2 正好相反  
虚拟机需要配置共享文件夹才能实现跨系统访问文件

- 兼容性平衡

WSL1 对 Windows 兼容更好，但部分 Linux 功能不支持

WSL2 几乎完整支持 Linux 内核功能，但对 GPU/USB 等外设支持有限

传统虚拟机能实现完整硬件支持

开发选 WSL，生产环境用虚拟机，日常轻度使用 WSL2 体验最佳。两者可以共存，根据需求切换使用。

## WSL的安装及安装时可能有的报错
- 必要条件

Windows 10 2020年5月(2004) 版, Windows 10 2019年5月(1903) 版，或者 Windows 10 2019年11月(1909) 版

WSL 2 使用了 Hyper-V 架构的一部分功能，但对 Windows 11 的版本并没有限制。家庭版、教育版、专业版和企业版都可以安装。

确保你的计算机是最新版本

- 需要配置的环境和工具（win10下）

首先确保电脑打开了**适用于 linux 的 windows 子系统**和**虚拟机平台**{

打开**设置**，搜索**可选功能**，下划找到**更多windows功能**

在里边找到适用于linux的windows子系统和虚拟机平台}

win10系统用商店下载**终端**（推荐使用）


- 安装WSL

**启用WSL**

以管理员身份运行终端

```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```



此步可能报错：无法解析服务器的名称或地址

解决办法是修改域名DNS

windows + i快捷键打开设置，在左侧菜单栏找到网络和internet

点击高级网络设置</font>

选中当前使用的网络，点击查看其它属性，之后点击编辑

修改dns，将自动代理改为手动IPv4，输入114.114.114.114



**启用虚拟机平台**

在 Windows 10（2004）上启用虚拟机平台

```
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

在 Windows 10（1903，1909）上启用虚拟机平台

```
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
```



可能报错：0x800701bc

终端输入wsl --update即可，更新一下wsl

可能报错：wsl更新进度为一直为0或者不变

```
wsl --install --web-download
```

让他从github下载，或者重启一下试试

**设置 WSL 2 为默认值**

```
wsl --set-default-version 2
```



**安装一个 Linux 发行版**

微软应用商店搜索ubuntu20.04下载即可

下载好后打开设置用户名密码，WSL的安装到这里就结束了owo





