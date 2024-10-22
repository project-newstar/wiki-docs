---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# OSINT-MASTER

给了图片，先看图片的 EXIF 信息，拍摄时间是 2024-8-18 14:30，照片中可以在机翼上看到一个标号 `B-2419`

直接在 flightaware 中搜索这个标号，应该是飞机的注册号

可以搜到这是一架东航的飞机

![flightaware 搜索结果](/assets/images/wp/2024/week3/osint-master_1.png)

在下面可以找到历史航班

![历史航班](/assets/images/wp/2024/week3/osint-master_2.png)

可以看到，在 2024 年 8 月 18 日这四架航班中，只有红框中这架符合 14:30 在飞行中，点进去看一下详细信息

找到航班号 `MU5156`

![航班号](/assets/images/wp/2024/week3/osint-master_3.png)

下面根据照片拍摄时间和航行轨迹来找照片拍摄时飞机经过的地级市，我这里使用航班管家，有了航班号直接搜

14:30 在 14:13 和 14:51 中间偏左的位置

![航班轨迹](/assets/images/wp/2024/week3/osint-master_4.png)

放大来看，此时飞机大致经过邹城市

![邹城市](/assets/images/wp/2024/week3/osint-master_5.png)

经过搜索，邹城市属于济宁市，济宁市是地级市

![济宁市](/assets/images/wp/2024/week3/osint-master_6.png)

所以答案是 `flag{MU5156_济宁市}`
