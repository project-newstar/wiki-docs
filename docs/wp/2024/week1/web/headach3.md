---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# headach3

题目源码如下：

```php
<?php
header("fl3g: flag{You_Ar3_R3Ally_A_9ooD_d0ctor}");
echo "My HEAD(er) aches!!!!!<br>HELP ME DOCTOR!!!<br>";
?>
```

打开浏览器开发者工具的「网络」（Network）选项卡，刷新网页，点击第一个请求，查看响应头，可以看到 flag.
