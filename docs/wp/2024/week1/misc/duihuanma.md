---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# 兑换码

使用十六进制编辑器直接加大图片的 **IHDR 高**即可看到 flag

![010 Editor 界面](/assets/images/wp/2024/week1/duihuanma_1.png)

PNG 文件头具体可以参考下面介绍：

![PNG 二进制示例](/assets/images/wp/2024/week1/duihuanma_2.png)

- <code><span style='color: #fd1010'>89 50 4E 47 0D 0A 1A 0A</span></code> 代表 PNG 文件头
- <code><span style='color: #0063bc'>49 48 44 52</span></code> 代表 IHDR 头，IHDR 是 PNG 文件的图像头信息
- <code><span style='color: #ff9900'>00 00 0A 6D</span></code> 代表宽度为 A6D（2669）像素
- <code><span style='color: #00af4e'>00 00 0C DE</span></code> 代表高度为 CDE（3294）像素

注：PNG 规范规定 IHDR 的高度可以任意修改，但宽度不能随意修改。
