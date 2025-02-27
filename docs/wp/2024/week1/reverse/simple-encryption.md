---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# Simple_encryption

将程序拖入 IDA 并按下 <kbd>F5</kbd> 得到主要代码

```c
int __cdecl main(int argc, const char **argv, const char **envp)
{
  int k; // [rsp+24h] [rbp-Ch]
  int j; // [rsp+28h] [rbp-8h]
  int i; // [rsp+2Ch] [rbp-4h]

  _main(argc, argv, envp);
  puts("please input your flag:");
  for ( i = 0; i < len; ++i )
    scanf("%c", &input[i]);
  for ( j = 0; j < len; ++j )
  {
    if ( !(j % 3) )
      input[j] -= 31;
    if ( j % 3 == 1 )
      input[j] += 41;
    if ( j % 3 == 2 )
      input[j] ^= 0x55u;
  }
  for ( k = 0; k < len; ++k )
  {
    printf("0x%02x ", input[k]);
    if ( input[k] != buffer[k] )
    {
      printf("error");
      return 0;
    }
  }
  putchar(10);
  printf("success!");
  return 0;
}
```

主要逻辑非常简单，首先输入 `len` 个字符，`len` 点击去可以看到是 30.

然后对输入每一位进行变换，其中当索引值是 3 的倍数时输入值就减 31，当索引值除 3 余 1 时，输入值加 41，索引值除 3 余 2 时，输入值与 0x55 进行异或。

最后将变换之后的输入值与密文 Buffer 数组进行比较。我们点进去 Buffer 数组，然后可以按下 <kbd>⇧ Shift</kbd><kbd>E</kbd> 即可提取数据。

![IDA 界面](/assets/images/wp/2024/week1/simple-encryption_1.png)

我们接下来就可以写出逆向脚本。

```c
#include <stdio.h>

unsigned char buffer[]={0x47,0x95,0x34,0x48,0xa4,0x1c,0x35,0x88,0x64,0x16,0x88,0x07,0x14,0x6a,0x39,0x12,0xa2,0x0a,0x37,0x5c,0x07,0x5a,0x56,0x60,0x12,0x76,0x25,0x12,0x8e,0x28};
int main(){
    int len=30;
    for(int i=0;i<len;i++){
        if(i%3==0){
            buffer[i]+=0x1f;
        }
        if(i%3==1){
            buffer[i]-=0x29;
        }
        if(i%3==2){
            buffer[i]^=0x55;
        }
    }
    printf("%s",buffer);

    return 0;
}
// flag{IT_15_R3Al1y_V3Ry-51Mp1e}
```
