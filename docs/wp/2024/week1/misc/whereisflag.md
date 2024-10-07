---
title: WriteUp
titleTemplate: ':title - NewStar CTF 2024'
---

# WhereIsFlag

~~（喜欢椰奶精心设计的雌小鬼版Linux吗）~~  
在后续，大家会接触到很多拿到服务器shel后找到flag的场景。本题主要考察了这部分知识，在各个常见位置设置了或真或假的flag。并且介绍了cd、ls、cat等常用命令的基础用法。~~其实这题的后端是个python程序（嘛，都说了是virtual linux了啦）~~  
真正的flag在`/proc/self/environ`文件内，只要执行`cat /proc/self/environ`就能拿到flag。`proc`文件夹是对当前操作系统进程的虚拟映射，在许多攻击场景中都有妙用，在此不展开。
