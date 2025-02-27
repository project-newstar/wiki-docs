---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# 洞 OVO

首先根据题目信息直接搜索 给定版本的 WinRAR，一搜就有。

确定漏洞为 WinRAR version 6.22 - Remote Code Execution via ZIP archive (CVE-2023-38831).

找点参考文章学一学：

- [WinRAR 代码执行漏洞（CVE-2023-38831）的原理分析](https://www.cnblogs.com/GoodFish-/p/17715977.html)
- [WinRAR（CVE-2023-38831）漏洞原理](https://mp.weixin.qq.com/s?__biz=MjM5NTc2MDYxMw==&mid=2458544969&idx=1&sn=473822d99738dc8c20cf0c7df866adea)

通过文章阅读了解主要流程：<strong>获取点击的文件 → 释放到临时目录 → 执行</strong>。

那么题目要求找的函数段大概率就是释放到临时目录这一段。

网上的文章一般来说都是给的这一段：

```c
// 0x140089948
char __fastcall compare(WCHAR *click_name, WCHAR *deFileName, int a3)

  ...
  if ( (_WORD)a3 )
  {
    v7 = -1i64;
    tName_len = -1i64;
    do
      ++tName_len;
    while ( click_name[tName_len] );
    if ( (unsigned int)(unsigned __int16)a3 - 2 > 2 )
    {
      if ( a3 >= 0 )
        v9 = sub_1400AF168(click_name, deFileName);
      else
        v9 = wcsncmp(click_name, deFileName, tName_len);
      if ( !v9 )
      {
        tail = deFileName[tName_len];
        if ( tail == '\\' || tail == '/' || !tail )
          return 1;
      }
      if ( v3 == 1 )
        return 0;
    }
    ...
}
```

题目当然没有这么简单，不过离答案也很接近了，向上溯源，再结合使用 bindiff，得到 `sub_1400EF508`.

流程如下：

> `sub_1400EF508` -> `sub_140009290` -> `sub_14000A650` -> `sub_1400D6070` -> `0x1400D6478` -> `0x1400D3474` -> `0x1400CEBF4` -> `0x140077054` -> `0x140089948`

<Container type='quote'>

预期做法难度可能较大，不过本题还有其他解法。

**PS:** 可疑函数并不多，锁定范围爆破提交一下基本就 easy 结束了。偷鸡做法：因为修复之处增加了 3 条汇编 所以把所有新旧对比改了 3 条汇编的地方 全交一遍估计也能成。
</Container>
