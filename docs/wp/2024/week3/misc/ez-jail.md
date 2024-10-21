---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# ez_jail

本题的原意是只考查`{}`在C++里的替代运算符这个知识，只要关键词用得对，网上一搜就能搜到，但是被出题人执行坏了，测题时出现了一堆非预期。后面考虑了一下各个知识点的难度，感觉非预期的难度和预期解相差不大，就索性变成了一道半开放性的题目。我们看到代码check函数

```python
def cpp_code_checker(code):
    if "#include" in code:
        return False, "Code is not allowed to include libraries"
    if "#define" in code:
        return False, "Code is not allowed to use macros"
    if "{" in code or "}" in code:
        return (
            False,
            "Code is not allowed to use `{` or `}`,but it needs to be a single function",
        )
    if len(code) > 100:
        return False, "Code is too long"
    return True, "Code is valid"
```

这段代码看似过滤了`#include`、`#define`。不知道同学们有没有意识到`#`后加空格就能绕过这里，也就是说可以通过宏定义来做到编译前预处理

所以payload可以是这样（感谢yuro师傅提供解法）

```c++
# define user_code() write(STDOUT_FILENO, "Hello, World!", 13);
```

预期解是找到C++的替代运算符的相关资料，然后使用`<%%>` 替换`{}`其payload如下

```c++
void user_code()<%write(1, "Hello, World!\n", 14);%>
```

除此之外，还可以使用指针，把`user_code()`变成一个空函数。输出的话可以通过定义一个全局变量接收输出函数的返回值来实现，其payload如下（感谢c_lby师傅提供解法）

```c++
int a=puts("Hello, World!");
int (*user_code)()=rand;
```

或者可以这样（感谢KAMIYA提供解法）

```c++
int x = (printf("Hello, World!\n"), 0);
using user_code = void(*)();
```
