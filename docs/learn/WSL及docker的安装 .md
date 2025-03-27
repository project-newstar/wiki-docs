---
titleTemplate: ":title - NewStar CTF"
---
## 目录
### 一.什么是WSL
### 二.WSL的安装及安装时可能会报的错
### 三.安装docker及安装时可能会报的错
## 正文
### 一.什么是WSL
<font style="color:rgb(77, 77, 77);">WSL（windows subsystem for linux），指的是windows10的一个子系统，这个子系统的作用是在windows下运行linux操作系统。</font>

简单来说，WSL和传统虚拟机（如VMware/VirtualBox）虽然都能在Windows里跑Linux程序，但底层实现完全不同：

1. 工作原理不同

WSL1是"翻译官"模式：直接把Linux命令转成Windows能理解的指令，没有真正的虚拟化

WSL2是"轻量级虚拟机"：基于微软自家的Hyper-V虚拟化技术，但做了大量优化

传统虚拟机是"完整套娃"：完全模拟整套硬件环境，运行完整操作系统

2. 性能消耗不同

WSL1几乎零负担：像运行普通Windows程序一样省资源

WSL2内存占用约500MB起：比传统虚拟机（通常2GB+）轻得多

传统虚拟机需要预留大量资源：完整系统运行开销大

3. 使用体验差异

WSL启动秒开：像打开记事本一样快

虚拟机启动要等：就像正常开机需要时间

文件系统性能：  
WSL1访问Windows文件快，但Linux文件操作慢  
WSL2正好相反  
虚拟机需要配置共享文件夹

4. 兼容性平衡

WSL1对Windows兼容更好，但部分Linux功能不支持

WSL2几乎完整支持Linux内核功能，但对GPU/USB等外设支持有限

传统虚拟机能实现完整硬件支持

开发选WSL，生产环境用虚拟机，日常轻度使用WSL2体验最佳。两者可以共存，根据需求切换使用。

### 二.WSL的安装及安装时可能有的报错
1.必要条件

<font style="color:rgb(25, 27, 31);">Windows 10 2020年5月(2004) 版, Windows 10 2019年5月(1903) 版，或者 Windows 10 2019年11月(1909) 版</font>

WSL 2 使用了 Hyper-V 架构的一部分功能，但对 Windows 11 的版本并没有限制。家庭版、教育版、专业版和企业版都可以安装。

确保你的计算机是最新版本

2.需要配置的环境和工具（win10下）

首先确保电脑打开了**适用于linux的windows子系统**和**虚拟机平台**{

win+i打开**设置**，搜索**可选功能**，下划找到**更多windows功能**

在里边找到适用于linux的windows子系统和虚拟机平台}

微软应用商店下载**终端**（推荐使用）

还得有把~~梯子~~

3.安装WSL

**启用WSL**

以管理员身份运行终端

`dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart`



此步可能报错：<font style="color:rgb(79, 79, 79);">无法解析服务器的名称或地址</font>

<font style="color:rgb(77, 77, 77);">解决办法是修改域名DNS</font>

按`<font style="background-color:#FFFFFF;">windows + i</font>`快捷键打开设置，在左侧菜单栏找到网络和internet

<font style="color:rgba(0, 0, 0, 0.75);">点击高级网络设置</font>

<font style="color:rgba(0, 0, 0, 0.75);">选中当前使用的网络，点击查看其它属性，之后点击编辑</font>

<font style="color:rgba(0, 0, 0, 0.75);">修改dns，将自动代理改为手动IPv4，输入114.114.114.114</font>

<font style="color:rgba(0, 0, 0, 0.75);"></font>

**<font style="color:rgba(0, 0, 0, 0.75);">启用虚拟机平台</font>**

<font style="color:rgb(25, 27, 31);">在 Windows 10（2004）上启用虚拟机平台</font>

`dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`

<font style="color:rgb(25, 27, 31);">在 Windows 10（1903，1909）上启用虚拟机平台</font>

`Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart`



可能报错：0x800701bc

终端输入wsl --update即可，更新一下wsl

可能报错：wsl更新进度为一直为0或者不变

`wsl --install --web-download`

让他从github下载，或者重启一下试试



**<font style="color:rgb(25, 27, 31);">设置 WSL 2 为默认值</font>**

`wsl --set-default-version 2`



**<font style="color:rgb(25, 27, 31);">安装一个 Linux 发行版</font>**

<font style="color:rgb(25, 27, 31);">微软应用商店搜索ubuntu20.04下载即可</font>

<font style="color:rgb(25, 27, 31);">下载好后打开设置用户名密码，WSL的安装到这里就结束了</font>

<font style="color:rgb(25, 27, 31);"></font>

### <font style="color:rgb(25, 27, 31);">三.安装docker及安装时可能有的报错</font>
建议装的时候全程开代理TUN模式

**首先卸载可能会冲突的软件包**

打开下载的ubuntu后输入

`for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc;do sudo apt-get remove $pkg;done`



**使用存储库安装apt**

```powershell
# Add Docker's official GPG key
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://mirrors.openctf.dev/https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://mirrors.openctf.dev/https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```



**安装 Docker 软件包**

`sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`



可能的报错：_**GPG error**_

下载gpg

```powershell
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://mirrors.openctf.dev/https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

[GPG（GnuPG）的安装和使用_gpg软件安装-CSDN博客](https://blog.csdn.net/huangjc0715/article/details/114778912)

下载好后回到再从安装apt这一步开始即可



之后就可以使用docker啦owo！

