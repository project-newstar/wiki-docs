---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# wireshark_secret

学会怎么从一个http响应的流量中导出图片。

点击secret.png这个数据包。

左下角找到File Data 这个字段，右键，点击导出分组字节流，然后文件保存为png，就可以打开图片了。

![导出图片](/assets/images/wp/2024/week2/wireshark_secret_1.png)
![flag](/assets/images/wp/2024/week2/wireshark_secret_2.png)
