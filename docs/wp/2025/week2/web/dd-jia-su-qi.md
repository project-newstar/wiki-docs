---
titleTemplate: ":title | WriteUp - NewStar CTF 2025"
---

# DD加速器

打开题目，我们得到这样一个页面。

![web_dd_1](/assets/images/wp/2025/week2/web_dd_1.png)
![web_dd_2](/assets/images/wp/2025/week2/web_dd_2.png)

点击开始，可以看到系统ping命令产生的输出。我们可以猜测，这个功能就是执行了类似下面的**系统命令**实现的。

```sh
ping -c 1 127.0.0.1
```

那么，我们想要攻入这台服务器，获取 flag，是不是可以想一想，有没有方法一行执行多个命令？有的兄弟，有的。

## 介绍一下 `|` 和 `&`:

### `|` — 管道（pipe）

作用：**把左边命令的标准输出（stdout）连接到右边命令的标准输入（stdin）。**

### `&` — 后台运行符（**ampersand**）

作用：把命令放到**后台执行**，shell 立即返回提示符，继续执行后面的命令或接受输入。

### 还有两个逻辑处理

```sh
cmd1 && cmd2 # cmd1 成功 (exit 0) 时才执行 cmd2
cmd1 || cmd2 # cmd1 失败时执行 cmd2
```

这些都可以让一行执行多个命令。

回到这题来：
我们的输入填在了 IP 的位置，也就是说可以往后添加一个管道符 `|`，就能注入命令了。

```sh
ping -c 1 127.0.0.1 | ls
```

> 这题的非预期是用 `env`，出题人失误忘记清环境变量了

这题的flag存在于一个隐藏文件夹。所以我们要用 `ls -la <路径>` 的方式查看。

![web_dd_3](/assets/images/wp/2025/week2/web_dd_3.png)

尝试 `cat`：限制了长度。那该怎么办呢？这个时候就该用通配符 `*` 了。

通配符是 **shell 用来匹配文件名的特殊符号**。

当你输入一个命令（如 ls \*.txt ）时，shell 在执行命令之前会先展开通配符，把它替换成所有匹配的文件名，再把结果传给命令。

例如：

```sh
ls *.txt
```

→ Shell 会自动展开成:（假设存在 a.txt b.txt notes.txt ）

```sh
ls a.txt b.txt notes.txt
```

然后执行这个命令。

所以我们只需要 `cat .<首字母>*/flag` 就能读取到 flag 了。
