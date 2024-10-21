---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# 臭皮踩踩背

部分源码给出

```python
def ev4l(*args):
    print(secret)
inp = input("> ")
f = lambda: None
print(eval(inp, {"__builtins__": None, 'f': f, 'eval': ev4l}))
```

结合参考文档，再了解的`eval()`的原理就会明白，设置了`globals`参数导致内置函数为`None`后，需要逃离这个上下文。

刚好给了一个匿名函数，看似无用，实际上参考文档已经给出提示：python“一切皆对象”

故可以利用函数对象的`__globals__`来逃逸

注意：如果执行`f.__globals__['__builtins__'].eval()`是不行的，完整源码：

```python
print('你被豌豆关在一个监狱里，，，，，，') 
print('豌豆百密一疏，不小心遗漏了一些东西，，，')
print('''def ev4l(*args):\n\tprint(secret)\ninp = input("> ")\nf = lambda: None\nprint(eval(inp, {"__builtins__": None, 'f': f, 'eval': ev4l}))''')
print('能不能逃出去给豌豆踩踩背就看你自己了，臭皮，，')

def ev4l(*args):
    print(secret)

secret = '你已经拿到了钥匙，但是打开错了门，好好想想，还有什么东西是你没有理解透的？'

inp = input("> ")

f = lambda: None

if "f.__globals__['__builtins__'].eval" in inp:
    f.__globals__['__builtins__'].eval = ev4l
else:
    f.__globals__['__builtins__'].eval = eval  

try:
    print(eval(inp, {"__builtins__": None, 'f': f, 'eval': ev4l}))
except Exception as e:
    print(f"Error: {e}")
```

可以看python解释器的eval()的实现代码

![eval()的实现代码](/assets/images/wp/2024/week3/caicaibei_1.png)

会发现会检查 `globals` 中是否已经包含了 `builtins`。如果没有，则会通过 `PyEval_GetBuiltins()` 获取默认的内置函数，并将其添加到 `globals` 中。

又因为官方文档：

![官方文档](/assets/images/wp/2024/week3/caicaibei_2.png)

所以若是直接

```plaintext
>>> inp = '''f.__globals__['__builtins__'].eval('__import__("os").popen("ls /").read()')'''
>>> eval(inp, {"__builtins__": None, "f": f})
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<string>", line 1, in <module>
  File "<string>", line 1, in <module>
TypeError: 'NoneType' object is not subscriptable
```

原因就是：在这个已经禁用内置函数的上下文中，嵌套使用的 `eval()` 在底层实现中会尝试将 `builtins` 插入 `globals`，但已经显式地设置了 `builtins = None`，这使得 `eval()` 无法正确工作，最终导致错误。

但是 `open()` 函数能行的原因就是：这只是是普通的函数调用，不涉及也不依赖于 `eval()` 的执行上下文。只要你能从全局作用域中找到 `open()`，它就可以正常工作，不会被 `builtins = None` 所影响。

所以payload为：

```python
f.__globals__['__builtins__'].open('/flag').read()
```

![flag](/assets/images/wp/2024/week3/caicaibei_3.png)
