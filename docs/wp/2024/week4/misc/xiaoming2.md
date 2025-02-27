---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# 擅长音游的小明同学

主要是帮助新人了解一下磁盘取证仿真的过程，为了让它符合一点 Week4 的特质还附赠了一点图片隐写，还有~~出题人活全家~~小 trick.

如果有强大的必应搜索能力，除了 trick 需要动脑子，其他的按网上教程其实都有，不过下面也有就是了

先看题目简介：

> 小明是资深的音游玩家，有一天他游玩某知名街机音游后顺利使 rating 上 w5
>
> 当他将成绩图上传到电脑上时，**他的桌面【直接显现】了神秘的东西**
>
> 然而没等他反应过来，他的电脑就消失不见，只**剩下一个磁盘镜像**（？）
>
> 这时小明脑海中有一个声音告诉他，如果他找不出来神秘的东西就会抽走他的音游底力
>
> 小明顿时慌了，想希望你帮帮他<strong>【利用镜像启动系统】</strong>，找到找到令人头疼的秘密

首先我们能知道什么？

1. ~~小明是音游痴，底力没了会很伤心~~
2. **桌面**上有秘密，说白了就是 Flag，而且很明显
3. 你手里有一个**磁盘镜像**
4. 算是个提示：使用磁盘镜像启动系统

这个提示告诉我们解题流程类似于仿真取证。

---

<strong>预期解法：</strong>使用 FTK imager + 虚拟机进行仿真找出 flag.

:::tip
科普常用小工具：FTK imager ——可以制作镜像、挂载镜像、分析镜像，数据恢复等操作，不管是出题还是解题都十分好用，这里正常解法使用 4.2.0 版本，高版本可能会出现一些问题。
:::

想要进行仿真取证的话，了解系统的基本信息是非常必要的，这里我们使用最原始方法为例：

首先我们打开 FTK imager 加载拿到的镜像，我们看到所有分区都加载完毕，发现磁盘名称有提示，说明系统是 Windows7 x64.

![FTK imager](/assets/images/wp/2024/week4/xiaoming2_1.png)

由提示而来，看看桌面的背景图片和文档，能不能直接提取 Flag.

瞅一眼图片，路径在 `C:\Users\[用户名]\AppData\Roaming\Microsoft\Windows\Themes` 或 `C:\Windows\Web\Wallpaper\Windows` 可以看到十分抽象的壁纸，根本没有能明显看见的东西，瞅一眼桌面文件夹，只有一大坨文件，也没有什么直观能看见的，内容倒是有：

![桌面文件夹](/assets/images/wp/2024/week4/xiaoming2_2.png)

文件包含的一些内容：

::: code-group

```plaintext [要开始了哟~.txt]
今天舞萌彩框了好开心啊o(*￣▽￣*)ブ
我要把这一刻用照片保存下来
不过在拍摄rating变化的瞬间总感觉有什么东西藏进照片里了
打开也没发现什么异常，但是体积好像变大了一点
是错觉吗？
```

```plaintext [真相.txt]
真相会不经意间流入日常的点点滴滴……
真相在哪里?
```

:::

我们确定了有一张日常图片，而且一定是藏了东西的，我们可以在图片文件夹寻找到照片进行分析<span data-desc><s>（哎舞萌痴）</s></span>：

![舞萌](/assets/images/wp/2024/week4/xiaoming2_3.jpg)

使用 010 Editor 进行查看的话，可以发现除了正常的照片内容，还有意义不明的文字和一个压缩包<span data-desc>（实际上使用 binwalk 梭一下也很正常）</span>：

![010 Editor](/assets/images/wp/2024/week4/xiaoming2_4.png)

文字内容：

```plaintext
?????_DIMENSION_1200x800
```

压缩包可以使用 binwalk 提取并解压：

::: code-group

```plaintext [secret.txt]
听好了听好了听好了听好了听好了听好了听好了：

1919年8月10日，世界就此陷落，
陷落的世界都将迎来一场漩涡，
为这个世界带来有关弗拉格尚未知晓的真相。

但发掘真相的道路被加诸混沌的历练
世界的宽高未被正确丈量
当真相被混沌打乱时
真相将不复存在

也许，在世界的重置和轮回中能找到发现真相的方法……

至此，尘埃落定
至此，一锤定音

#音游# #NewStarcaea# #Misc#
```

:::

这里可能就需要一些脑洞了，这个世界的宽高和上面的 Dimension 1200×800 能想到是分辨率吗？

实际上到这里信息刺探就已经结束了，下面开始进行仿真启动，这里使用了 Vmware，如果你想使用 HyperV 或者 VirtualBox 的话可以搜索：如何将 E01 转为 VHD / VDI.

:::warning 注意
FTK Imager 4.5.0.2 版本可能会出问题，建议使用 4.2.0 版本。
:::

进行以下选择，直接将镜像映射成物理磁盘，方便虚拟机直接使用启动：

![映射](/assets/images/wp/2024/week4/xiaoming2_5.png)

一定要选择挂载方式位 Writable 不然会因为无法写入而报错，点击 Mount 挂载，下面出现挂载结果表示成功：

![挂载](/assets/images/wp/2024/week4/xiaoming2_6.png)

挂载成功后我们打开虚拟机，这里使用 Vmware，由于使用物理硬盘需要管理员权限，所以我们需要使用管理员启动 Vmware，右击快捷方式，打开文件位置，再次右击选择兼容性，勾选以管理员权限启动：

![管理员启动 VMware](/assets/images/wp/2024/week4/xiaoming2_7.png)

启动之后新建虚拟机就可以了。

选择 Windows7 x64 配置，一路全选推荐，其中需要注意的如下：

![新建虚拟机 1](/assets/images/wp/2024/week4/xiaoming2_8.png)

![新建虚拟机 2](/assets/images/wp/2024/week4/xiaoming2_9.png)

![新建虚拟机 3](/assets/images/wp/2024/week4/xiaoming2_10.png)

![新建虚拟机 4](/assets/images/wp/2024/week4/xiaoming2_11.png)

:::tip 为什么要选择 UEFI？

结合搜索引擎和对挂载硬盘的研究，不难发现除放置文件的硬盘，还有两个小硬盘，对应的就是 ESP 分区 和 MSR 分区，这些特征符合 GPT 分区格式的硬盘，不同于 MBR，因此需要选择 UEFI，这里不展开讨论，有兴趣的师傅们可以慢慢了解。
:::

![新建虚拟机 5](/assets/images/wp/2024/week4/xiaoming2_12.png)

![新建虚拟机 6](/assets/images/wp/2024/week4/xiaoming2_13.png)

:::warning
这里选择要与挂载结果的显示物理磁盘的挂载位置要一致。
:::

接下来就可以启动了，<span data-desc><strong>如果提示被占用，可以检查挂载是否挂载为「可写」，也可以尝试重启系统</strong></span>，使用 FTK 直接挂载，再试一次。

当你进入系统后就不得不想起前面的提示：

```plaintext
但发掘真相的道路被加诸混沌的历练
世界的宽高未被正确丈量
当真相被混沌打乱时
真相将不复存在

1200x800
```

> Flag 其实是拿桌面图标堆的，要是不是 1200×800 的分辨率启动就会被重新排列，一旦被重新排列，图标就再也回不去了
>
> ![桌面](/assets/images/wp/2024/week4/xiaoming2_14.png)

你需要切换到 Guest 调整窗口到相应分辨率再切换到 Admin 账号，就看到了：

![Flag](/assets/images/wp/2024/week4/xiaoming2_15.png)

最终：`flag{wowgoodfzforensics}`

<Container type='quote'>

WriteUp 是出题人视角的解法，如果是新生想要解题，则大概率做题路径会先根据题目介绍先仿真启动虚拟机，然后发现桌面什么都没有，根据留下的引导发掘出真相，然后重新启动一遍虚拟机。<span data-desc><s>（一想到发现真相的新人们要重新开始笑容就到了我的脸上。）</s></span>
</Container>
