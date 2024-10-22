---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# SMc_math

静态看是很难看出来的，除非使用 IDAPython 进行解密，如果不会 IDAPython 的话也可以动调起来直接看。

![动调下断点](/assets/images/wp/2024/week3/smc-math_1.png)

这个断点设置在 for 循环结束即可，此时是解密完成的状态，我们可以点进 `encrypt` 函数查看。

点进来看虽然还是一堆乱码，但是这只是 IDA 没有识别出来而已。

在指令开头处按下 <kbd>C</kbd> 键即可识别出这个指令。如果失败，那么可以再按一下 <kbd>U</kbd> 或者 <kbd>P</kbd> 键，总之最后一定可以使用 <kbd>C</kbd> 键得到正确的指令。

之后在函数头处按下 <kbd>U</kbd> 和 <kbd>P</kbd> 键，再按下 <kbd>F5</kbd> 即可得到正确的加密函数。

![加密函数](/assets/images/wp/2024/week3/smc-math_2.png)

可以看到是七元一次方程组，当然可以使用在线网站解方程，但是这里更推荐使用 z3 来进行解决。

```python
# exp.py
from z3 import *
import struct

x1,x2,x3,x4,x5,x6,x7=Ints('x1 x2 x3 x4 x5 x6 x7')
s=Solver()
s.add(5*x1 + 5*x2 + 4*x3 + 6*x4 + x5 + 2*x6 + 9*x7 - 57391174911 == 0)
s.add(9*x1 + 10*x2 + 6*x3 + 3*x4 + 3*x5 + 9*x6 + 4*x7 - 69310186571 == 0)
s.add(4*x1 + 5*x2 + 4*x3 + 4*x4 + 9*x5 + 10*x6 + 3*x7 - 57272085433 == 0)
s.add(5*x1 + 9*x2 + 2*x3 + 4*x4 + 10*x5 + 2*x6 + 9*x7 - 66739156986 == 0)
s.add(7*x1 + 2*x2 + x3 + 9*x4 + 5*x5 + 9*x6 + 3*x7 - 57213499403 == 0)
s.add(6*x1 + 5*x2 + 10*x3 + 6*x4 + 9*x5 + 3*x6 + 8*x7 - 76815456371 == 0)
s.add(x1 + 4*x2 + 4*x3 + 8*x4 + 9*x5 + x6 + 3*x7 - 48137765857 == 0)
s.check()
m=s.model()
x=[0]*7
x[0]=m[x1].as_long()
x[1]=m[x2].as_long()
x[2]=m[x3].as_long()
x[3]=m[x4].as_long()
x[4]=m[x5].as_long()
x[5]=m[x6].as_long()
x[6]=m[x7].as_long()

byte_data = b''.join(struct.pack('<I', value) for value in x)
result_string = byte_data.decode('ascii')
print(result_string)
```
