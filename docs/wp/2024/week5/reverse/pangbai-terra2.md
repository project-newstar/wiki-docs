---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Pangbai泰拉记（2）

最普通的 vm，加密是换表，防止约束爆破直接出了

opcode 打印还原流程图

![opcode还原流程](/assets/images/wp/2024/week5/pangbai-terra2_1.png)

前面有个针对表的伪随机，可以动调出，也可以这么出

```c
#include <stdio.h>
#include <stdlib.h>
int main() {
    unsigned char array[128];
    for (int i = 0; i < 128; i++) {
        array[i] = i;
    }
    srand(0x114514);
    for (int i = 127; i > 0; i--) {
        int j = rand() % (i + 1);
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    unsigned char pw[24]={0x28,0x79,0x17,0x4,0xc,0x73,0x26,0x36,0x50,0x39,0x7e,0x24,0x51,0x17,0x44,0x25,0x6,0x70,0x4d,0x40,0x79,0x35,0x73,0x21};
    for(int i=0;i<24;i++)
    {
        for(int j=0;j<128;j++)
        {
            if(pw[i]==(array[j]^i))
            {
                printf("%c",(j-i+128)%128);
            }
        }
    }
    return 0;
}
// flag{W0w_y0u_$01v3_VM!!}
```
