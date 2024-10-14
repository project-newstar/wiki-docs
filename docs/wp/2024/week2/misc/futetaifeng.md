---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# 用溯流仪见证伏特台风

第一步，打开新闻链接

<https://www.bilibili.com/video/BV1Ny411i7eM>

![bilibili1](/assets/images/wp/2024/week2/futetaifeng_1.png)
![bilibili2](/assets/images/wp/2024/week2/futetaifeng_2.png)

根据视频，我们获得以下信息：

所需报告：The Rise of Dark Power……

对应版本：最初4月15日版本

现状：所需信息已经被篡改

我们直接谷歌搜索报告名称

![google](/assets/images/wp/2024/week2/futetaifeng_3.png)

可以看到第一个链接就是我们需要的PDF文件，但是视频中又提到报告内容已经被篡改

![篡改](/assets/images/wp/2024/week2/futetaifeng_4.png)

所以现版本肯定是没有我们所需的信息的

出题人之前运气好，搜到过可以直接下载的原始版本PDF，直接就可以开做。

但运气不好怎么办呢?我们请出我们的网站时光机，wayback machine

![wayback](/assets/images/wp/2024/week2/futetaifeng_5.png)
![wayback2](/assets/images/wp/2024/week2/futetaifeng_6.png)

输入官网链接，启动溯流仪，正好有4月15日的版本

![wayback3](/assets/images/wp/2024/week2/futetaifeng_7.png)

下载文件，剩下的内容就和视频中演示的一样了

移开封底图片，拿到domain框里的东西，然后md5，

当然，你要是能用肉眼直接把视频里的模糊信息读出来，我也认了。

![domain](/assets/images/wp/2024/week2/futetaifeng_8.png)
![md5](/assets/images/wp/2024/week2/futetaifeng_9.png)

包上flag，得到`flag{6c3ea51b6f9d4f5e}`
