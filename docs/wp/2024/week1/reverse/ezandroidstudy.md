---
title: WriteUp
titleTemplate: ':title - NewStar CTF 2024'
---

# ezAndroidStudy

本题主要考察对apk基本结构的掌握

## 第一部分

查看AndroidManifest.xml可以发现activity只有Homo和MainActivity  
我们Jadx打开work.pangbai.ezandroidstudy.Homo就可以获得flag1

![旁白酱可爱捏嘿嘿(～o￣3￣)～](/assets/images/wp/2024/week1/reverse/ezandroidstudy_1.png)

## 第二部分

resources.arsc/res/value/string.xml打开搜索flag2即可

![旁白酱可爱捏嘿嘿(～o￣3￣)～](/assets/images/wp/2024/week1/reverse/ezandroidstudy_2.png)

## 第三部分

按描述到/layout/activity_main.xml找即可

![旁白酱可爱捏嘿嘿(～o￣3￣)～](/assets/images/wp/2024/week1/reverse/ezandroidstudy_3.png)

## 第四部分

/res/raw/flag4.txt里

![旁白酱可爱捏嘿嘿(～o￣3￣)～](/assets/images/wp/2024/week1/reverse/ezandroidstudy_4.png)

## 第五部分

IDA64打开lib/x86_64/libezandroidstudy.so，找到以"Java"开始的函数，按f5即可

![旁白酱可爱捏嘿嘿(～o￣3￣)～](/assets/images/wp/2024/week1/reverse/ezandroidstudy_5.png)

`Ans: flag{Y0u_@r4_900d_andr01d_r4V4rs4r}`
