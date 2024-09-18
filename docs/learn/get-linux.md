---
titleTemplate: ':title | 快速入门 - NewStar CTF'
---

# 获取 Linux 发行版

该教程将以 VMware Workstation Pro 为例，介绍如何在虚拟机中运行 Linux 发行版操作系统。

## 下载和安装 VMware Workstation Pro

::: tip
VMware Workstation 公司被收购后，VMware 官网已经不再提供 VMware WorkStation 软件下载链接，点击下载会重定向到 VMware 现在的母公司 Broadcom 的页面，所以我们直接去 Broadcom 的官网下载就好。
:::

首先我们需要注册一个 Broadcom 的账号：[注册链接](https://profile.broadcom.com/web/registration)。

注册完成后，登录 Broadcom 账号，访问 [下载页面](https://support.broadcom.com/group/ecx/downloads)。

在右上角切换分类到 VMware Cloud Foundation：

![切换到 VMware Cloud Foundation](/assets/images/learn/vmware-download-1.png)

然后在产品目录里找到 VMware Workstation Pro.

然后选择和自己电脑操作系统还有用途都比较匹配的下载项，在下拉菜单里选择最新版，然后在跳出来的网页里点击下载按钮（可能要先同意一份什么协议），再填写一些个人信息，就可以点击按钮下载了！

随后进行安装即可。

## 安装并使用 Ubuntu 虚拟机

### 获取和安装 Ubuntu 镜像

下载 [Ubuntu 发行版](https://ubuntu.com/download/desktop)，建议选择最新的 LTS（长期支持）版本，本文以 22.04.03 LTS 为例。

在 VMware 中安装 Ubuntu 虚拟机：

![安装 Ubuntu 虚拟机](/assets/images/learn/vmware-create-1.png)

新建虚拟机，选择「自定义」，ISO 文件选择刚刚下载的镜像文件。

个性化 Linux 界面设置用户名，可随意填写，启动系统后会再次设置：

![配置安装信息](/assets/images/learn/vmware-create-2.png)

其余设置根据自己喜好调整。

::: warning 特别注意
磁盘空间大小建议至少 30G. 选择 CPU 核数等时，根据自己电脑的实际情况进行选择。如果不知道，可选择 2 核。
:::

随后启动新添加的虚拟机即可，首次进入会进行初始化系统，根据个人的喜好和需求填写即可。

### 初始化系统

选择语言：

![选择语言](/assets/images/learn/init-ubuntu_language.png)

选择时区，中国大陆地区选择「Asia/Shanghai」：

![选择时区](/assets/images/learn/init-ubuntu_timezone.png)

设置用户名及密码，即启动虚拟机时默认的用户：

![设置默认用户](/assets/images/learn/init-ubuntu_user.png)

剩余部分可全部选择 Continue.

## 相关功能拓展（可选）

参考 [这篇文章](https://blog.csdn.net/ZRongZH/article/details/129237476)，可实现虚拟机与宿主机之间的文件拖拽、剪贴板共享等功能。
