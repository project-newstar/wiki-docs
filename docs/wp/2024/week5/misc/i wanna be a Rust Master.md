---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# i wanna be a Rust Master

其实禁了不少东西，看附件给的 server 源码，可以看到检测大致分成两个部分，一个明文检测，一个是基于 syn，quote 库检测 TokenStream （指令流）

先说检测 TokenStream 这块

比如下面这个，就是在检测是否有字面量(字面量是用于表达源代码中一个固定值，比如 123, "abc", true, 114.514)

```
#[derive(Default)]
pub struct LitChecker {
    has_lit: bool,
}

impl<'a> Visit<'a> for LitChecker {
    fn visit_lit(&mut self, i: &'a syn::Lit) {
        self.has_lit = true;
        syn::visit::visit_lit(self, i);
    }
}
```

然而由于 rust 的宏在解析的时候，都是有一套自定义的解析逻辑，而 syn 库本身并不能直接获取宏定义的解析逻辑，所以，如果有尝试去看过 syn 的源码，就会发现在处理 macro 的时候，都是直接返回 TokenStream，也就是没有被解析的原始指令流（就是因为前面说过 syn 本身不知道一个宏是怎么展开的）。

换言之，如果使用者没有人为去解析这些指令流，那么 syn 本身就不会检测宏里面有啥指令。

这样就可以把一些恶意的代码塞进宏里面。

比如：

```
vec![println!("Hello")]
```

这个毫无疑问是有一个字面量 "Hello" 的，但是由于在宏里面，所以 syn 无法检测。

对于这道题而言，使用 syn 进行检测的其他逻辑，比如我有检测 std， unsafe 等等，其实都可以利用这一点来绕过。

但是很可惜的，我还写了明文匹配的检测，也就是在源码中类似这段的代码：

```
    if input.contains("std") {
        println!("[-] std detected");
        return Ok(());
    }
```

所以 std，unsafe 这些还是很难能够使用。

那么如果不用标准库的东西，还能怎么读取文件呢？

其实 rust 本身自带了很多有趣的宏，对于这道题，可以使用 include_str! 或者 include_bytes! 

以 include_str! 为例，它会在编译期，读取指定路径的文件（如果路径不存在，无法通过编译），然后会把读出来的内容作为字符串进行编译。

比如有一个 a 文件，里面内容是  Hello 那么 println!("{}", include_str!("a")) 就完全等价于 println!("{}", "Hello")

``所以我们就可以通过 include_str!("/flag") 来直接读取 flag 文件！``

但是，令人难过的是，题目还检测了代码中是否包含 "flag" 这个字符串，可能大家的第一反应是套一层变量去绕过，类似这样：

```
let a = "/fl".to_string() + "ag";
let f = include_str!(a);
```

但是这是不行的！！

大家如果运行应该会看到 error: argument must be a string literal 这样的报错

因为 include_str! 这个宏解析的时候需要接受字符串字面量！

那么这该怎么办呢？别慌，还有办法！这就不得不提 concat! 这个宏了（大家可以多翻翻标准库里自带的那些宏，有很多很有意思的宏），concat! 可以编译期拼接字符串字面量（是的！concat! 也要求提供的值是字面量），所以就可以使用这个来绕过本题的检测读取 flag 了。

```
let f = include_str!(concat!("/fl", "ag"));
```

接下来就是另一个问题了：怎么样输出 flag 呢？

要知道，在 rust 中，输出都是依赖于 println! , dbg!, panic! 之类的宏，而这些宏本质是对 std::io 中的对象进行的封装，所以想要输出（IO），要么能够使用这些封装好的宏（但是都被我 ban 啦，哇哈哈哈哈），要么能够访问到 std::io 这个模块中的东西（也被我 ban 了，嘻嘻）。

那么还有什么办法呢？

``其实有个很常见的思路：使用报错来带出输出！``

至于如果报错，如果大家能做到这一步，应该也是很容易写出来了吧！

比如随便构造一个整数溢出？比如数组越界？比如对 None 调用 .unwrap()  ？ 比如对 Ok 对象调用 .unwrap_err() ? 等等，非常多的报错，``但是我们要让报错信息能够被控制！``毕竟我们需要输出我们想要输出的内容。这里我们就很容易想到使用 Option 或者 Result，下面我就随便给几个例子，大家可以参考一下：

```
let a: Option<i32> = None;
a.expect("a is None");
```

```
let a: Result<(), String> = Err("a is Err".into());
a.unwrap();
```

```
let a: Result<(), ()> = Err(());
a.expect("expect a is Ok");
```

综合上述的思路，就可以整理出下面这段 payload 啦！

```
fn main() {
    Option::<()>::None.expect(include_str!(concat!("/fl","ag")));
}
//
```