---
titleTemplate: ':title | 快速入门 - NewStar CTF'
---

# 更换软件源

本文以 Ubuntu 操作系统为例，介绍如何更换软件源。

## 更改软件源文件

访问 [清华大学 Ubuntu 软件源](https://mirror.tuna.tsinghua.edu.cn/help/ubuntu/)，选择操作系统等配置，然后复制代码块中的内容<span data-desc>（一般安装的 Ubuntu 桌面版使用「传统格式」的即可）</span>。

打开终端，输入以下命令<span data-desc>（将以下高亮的部分替换为你复制的内容，下面仅列举了默认配置下的部分 Ubuntu 版本参考代码）</span>：

::: code-group

<<< @/assets/code/ubuntu-software-source/24.04-lts.sh{2-16 bash} [Ubuntu 24.04 LTS]

<<< @/assets/code/ubuntu-software-source/23.10-lts.sh{2-16 bash} [Ubuntu 23.10 LTS]

<<< @/assets/code/ubuntu-software-source/22.04-lts.sh{2-16 bash} [Ubuntu 22.04 LTS]

:::

## 应用更改

随后更新软件包列表即可：

```bash
sudo apt-get update
```
