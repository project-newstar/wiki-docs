---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# PlzLoveMe

音频采样数据一般就是 pcm ,根据所给采样率，我们可以直接找线上网站播放。

https://pcm.stanwind.com/

直接找个音乐软件，听歌识曲可以知道是 ``world.execute(me);``

![](/assets/images/wp/2024/week5/PlzLoveMe_1.png)

播放到 ``3.01`` 的歌词如下

![](/assets/images/wp/2024/week5/PlzLoveMe_2.png)

对照 ``LCD`` 图片

![](/assets/images/wp/2024/week5/PlzLoveMe_3.png)

仔细查看可以发现 LCD 上显示的是歌词 (其实 LCD 上的符号是特殊字体，感兴趣的同学可以看看 lvdc-secret-passage 字体)。

对照歌词可以得到符号的对应关系，歌词倒数第四排是 "``flag:``"。

后三排仔细对照可以知道是: 

``fhwdLd``

``mnwdOnV``

``mnwdOnV``

由题目可知 flag 是有意义的全英文字符串，我们还剩一个 axf 文件没有用到。

这是包含ARM符号信息的二进制文件，可以用 ida 打开。

题目里提到设备连上了电脑串口。（其实一般是 USB 来串口通信，这里为了降低难度直接说明是串口了)

```
file SD_MP3_RC.axf
SD_MP3_RC.axf: ELF 32-bit LSB executable, ARM, EABI5 version 1 (SYSV), statically linked, with debug_info, not stripped

```

![](/assets/images/wp/2024/week5/PlzLoveMe_4.png)

ida32 函数列表搜索 UART，看到一个 Callback 百度一下是串口回调，用于接收数据后的处理，按 f5 查看伪代码。

```
void __fastcall HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
  int v1; // r2
  unsigned int v2; // r0
  unsigned int v3; // r0

  if ( huart->Instance == (USART_TypeDef *)1073821696 )
  {
    v1 = UART1_temp[0];
    v2 = UART1_Rx_cnt;
    UART1_Rx_Buf[UART1_Rx_cnt] = UART1_temp[0] ^ 1;
    v3 = v2 + 1;
    UART1_Rx_cnt = v3;
    if ( v1 == 10 )
    {
      *((_BYTE *)&WavFile.lockid + v3 + 2) = 0;
      Show_String(0, 16 * offsety, UART1_Rx_Buf, 0x10u, 0xF800u);
      UART1_Rx_cnt = 0;
      ++offsety;
    }
    HAL_UART_Receive_IT(&huart1, UART1_temp, 1u);
  }
}
```

只有个异或 0x1，赛博厨子解密后包上 flag{} 上交。

Ans: flag{giveMeloveNoWloveNoW}