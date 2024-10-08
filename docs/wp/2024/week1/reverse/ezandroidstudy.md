---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# ezAndroidStudy

<Container type='tip'>

本题主要考察对 APK 基本结构的掌握
</Container>

## 第一部分

查看 `AndroidManifest.xml` 可以发现 activity 只有 `Homo` 和 `MainActivity`

我们用 Jadx 打开 `work.pangbai.ezandroidstudy.Homo` 就可以获得 flag1

![旁白酱可爱捏嘿嘿(～o￣3￣)～](/assets/images/wp/2024/week1/ezandroidstudy_1.png)

## 第二部分

`resources.arsc/res/value/string.xml` 打开搜索 flag2 即可

![旁白酱可爱捏嘿嘿(～o￣3￣)～](/assets/images/wp/2024/week1/ezandroidstudy_2.png)

## 第三部分

按描述到 `/layout/activity_main.xml` 找即可

![旁白酱可爱捏嘿嘿(～o￣3￣)～](/assets/images/wp/2024/week1/ezandroidstudy_3.png)

## 第四部分

`/res/raw/flag4.txt` 里

![旁白酱可爱捏嘿嘿(～o￣3￣)～](/assets/images/wp/2024/week1/ezandroidstudy_4.png)

## 第五部分

IDA64 打开 `lib/x86_64/libezandroidstudy.so`，找到以 Java 开始的函数，按 <kbd>F5</kbd> 即可

![旁白酱可爱捏嘿嘿(～o￣3￣)～](/assets/images/wp/2024/week1/ezandroidstudy_5.png)

Ans: `flag{Y0u_@r4_900d_andr01d_r4V4rs4r}`
