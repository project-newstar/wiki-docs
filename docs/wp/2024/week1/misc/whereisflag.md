---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# WhereIsFlag

在后续，大家会接触到很多拿到服务器 Shell 后找到 flag 的场景。本题主要考查了这部分知识，在各个常见位置设置了或真或假的 flag。并且介绍了 `cd` `ls` `cat` 等常用命令的基础用法。

<Container type='quote'>

其实这题的后端是个 Python 程序<s>（嘛，都说了是 Virtual Linux 了啦）（喜欢椰奶精心设计的雌小鬼版 Linux 吗）</s>
</Container>

真正的 flag 在 `/proc/self/environ` 文件（可用于获取当前进程的环境变量）内，只要执行下面的命令就能拿到 flag.

```shell
cat /proc/self/environ
```

`proc` 目录是对当前操作系统进程的虚拟映射，在许多攻击场景中都有妙用，在此不展开。
