---
titleTemplate: ':title | 参考文档 - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# Week 4

本周题目难度已经很大了，希望大家不要焦躁，好好学习考查内容。

## Pwn

### Sign in

本题是个小游戏，程序逻辑很简单，拿够分就行。

但是胜负确实随机的🤔，有没有什么办法能让我输了不掉分呢🤔.

### MAZE_Rust

本题有后门🤓.

### MakeHero

本题有两次任意写的机会，想想看使用 `open("/proc/self/mem")`、lseek、write 实现任意写和用 `*addr=byte` 有什么不同。

## Reverse

### MazE

推荐一篇有关 Linux 下 pipe 通信的文章：[Linux下进程间通信方式—— pipe（管道）](https://www.cnblogs.com/wuyepeng/p/9747557.html).

如果你已经找到了迷宫地图，但是苦于迷宫过大，那可以去学习一下[搜索算法](https://blog.csdn.net/qq_40258761/article/details/88678093)。

### easygui

关于 Windows 消息循环 的一篇文章：[深入理解 Windows 消息机制](https://blog.csdn.net/liulianglin/article/details/14449577)

## Web

### ezcmsss

<Container type='info'>

本题考查的是对于 CMS 站点的测试利用。
</Container>

针对一些站点，一般通过收集该站点所采用的框架及其版本，通过一些[在线漏洞平台](https://avd.aliyun.com/)搜索历史漏洞并完成利用。

遇到没思路的题，可以先找几个常见的路径测试一下，如 `/robots.txt` `/upload` 等，或者看看有没有源码泄露。

### ezpollute

<Container type='info'>

本题在 JavaScript 原型链污染漏洞的基础上考查了一个 RCE 技巧。
</Container>

关于原型链污染漏洞，可以参考下面两篇文章：

- [JavaScript 原型链污染](https://www.yuque.com/cnily03/tech/js-prototype-pollution)
- [深入理解 JavaScript Prototype 污染攻击](https://www.leavesongs.com/PENETRATION/javascript-prototype-pollution-attack.html)

在了解原型链污染漏洞后，如果你想不到需要污染的变量，这里有一份可能对解题有帮助的[官方文档](https://nodejs.cn/api/cli/node_options_options.html)。

::: tip
建议想要深入学习 Web 的选手准备一台具有公网 IP 的云服务器用于反弹 Shell，以方便 RCE.
:::

### chocolate

<Container type='info'>

本题考查了对 PHP 代码的基础审计和反序列化的利用示范, 很多地方可能并不需要很强的脚本编写能力就能在网上找到参考脚本, 但是希望你能把别人的方法转换为自己的思考, 这将有利于你未来的学习
</Container>

同时本题看似是「套娃」，实则一点都不难，也希望坚持到 Week 4 的师傅们能从中体会到一些上升的乐趣。

### blindsql2

遇到要自己手写注入脚本的题，为了防止出错，可以分多步完成。

1. 写一个 SQL 语句，能够查出所有的表名，并且合在一行

    ```sql
    (select(group_concat(table_name))from(infOrmation_schema.tables)where((table_schema)like(database())))
    ```

2. 写一个 SQL 语句，返回一个字符串的第 i 个字符 `(select substr(%s,i,1))`，其中 `%s` 替换为你需要的字符串，比如和上面写出来的表名合在一起:

    ```sql
    (select substr(
      (Select(group_concat(table_name))from(infOrmation_schema.tables)where((table_schema)like(database()))),
      i,1
    ))
    ```

3. 写一个 SQL 语句，判断一个字符的 ASCII 值是否等于某个值：`select (ascii ( %c ) =%d )`

4. 假如某个值是 1 的时候，程序延时 1 秒：`select (if ( %s , sleep(1) , 0 ))`

   以上 4 个合在一起，就变成了：

   当表名字符串的第 i 个字符的 ASCII 值等于 %d 的时候，程序延时 1 秒

    ```sql
    if ((ascii(
      substr(
        (Select(group_concat(table_name))from(infOrmation_schema.tables)where((table_schema)like(database()))),
      i,1)
    )=%d),sleep(1),0)
    ```

   希望选手编写脚本，以避免每次尝试都需要进行上述繁琐的过程。

### 隐藏的密码

出题思路主要来源于两篇文章:

- [Spring Boot Fat Jar 写文件漏洞到稳定 RCE 的探索](https://forum.butian.net/share/99)
- [最全 Spring Boot 相关漏洞学习汇总](https://forum.butian.net/share/103)

作为给新生入门的 Java 题，由于要降低难度，没有设置 SpringBoot 的 RCE 解法，但是思路其实都是 SpringBoot 在不解析 JSP 的情况下，如何进行 RCE 的问题，如果不从 SpringBoot 本身出发，就从系统层面出发，这里没有限制利用的方式，计划任务和系统命令劫持均可。

### PangBai 过家家（4）

<Container type='info'>

本题主要考查 GoLang 中 SSTI 的利用，并考查了 SSRF（服务端请求伪造）的常见技巧。
</Container>

题目给出了源码，并自带 Hint 文件。选手需要阅读并理解 main.go 中的不同路由的逻辑。

对于 `curl` 命令，选手可以自行了解 `curl` 所支持的协议，不止 HTTP、FTP、File 等协议。本题不需要出网。

完整的利用链步骤可能较多，希望选手能够自己写一个脚本完成自动化过程。例如，只需要修改脚本中的一个文件地址的字符串，就能完成对这个文件的任意文件读利用。

::: tip
推荐选手通过源码自行开启 Docker 环境，并先在本地打通题目。
:::

## Crypto

### 俱以我之名

<Container type='quote'>

编辑者并不知道出题人想表达什么，出题人只留下了下面的内容。

`[我是谁？]`
</Container>

## Misc

### CRC

本题考查了对 PNG 格式文件的识别和修复，对一些常见文件二进制特征敏感，会在某些时候发挥关键作用（比如在流量分析中看到 JPG 文件头等）
