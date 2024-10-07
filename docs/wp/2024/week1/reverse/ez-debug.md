---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# ez_debug

第一种解法，使用ida  
步入main函数，发现给的decrypt提示

![小情侣真该死啊](/assets/images/wp/2024/week1/ez-debug_1.png)

步入you函数，在循环处下断点

![小情侣真该死啊](/assets/images/wp/2024/week1/ez-debug_2.png)

f9开始调试，然后f8单步，循环结束点击v5

![小情侣真该死啊](/assets/images/wp/2024/week1/ez-debug_3.png)

第二种使用xdbg调试  
拖入xdbg64，搜索字符串，发现decrypt flag，下断点，f9即可

![小情侣真该死啊](/assets/images/wp/2024/week1/ez-debug_4.png)
