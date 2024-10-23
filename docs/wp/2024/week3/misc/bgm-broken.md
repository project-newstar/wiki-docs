---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# BGM 坏了吗？

用 Audacity 打开音频很容易发现结尾处右声道有信息，而左声道是噪音

![audacity 1](/assets/images/wp/2024/week3/bgm-broken_1.png)

根据题目描述是拨号音，但是直接放解不出来，需要删掉噪音

选择 **分离立体音到单声道 » 关闭左声道 » 导出**

![audacity 2](/assets/images/wp/2024/week3/bgm-broken_2.png)

![audacity 3](/assets/images/wp/2024/week3/bgm-broken_3.png)

![audacity 4](/assets/images/wp/2024/week3/bgm-broken_4.png)

按键音（即DTMF）解密网站：[DTMF Decoder](https://dtmf.netlify.app/)

![dtmf](/assets/images/wp/2024/week3/bgm-broken_5.png)

包上 `flag{}` 即可
