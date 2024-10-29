---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# 扫码领取 flag

`hint.jpg` 的图片信息（属性，详细信息）中隐藏了一句 Base64 加密的提示，解码后意为「阿兹特克文明」，则题目考点与阿兹特克码有关

四张 `flag.png` 进行 CRC 宽高修复，可以还原成四张碎片

脚本参考：

```python
import zlib
import struct
import argparse
import itertools

parser = argparse.ArgumentParser()
parser.add_argument("-f", type=str, default=None, required=True,
                    help="输入同级目录下图片的名称")
args  = parser.parse_args()

bin_data = open(args.f, 'rb').read()
crc32key = zlib.crc32(bin_data[12:29]) # 计算 crc
original_crc32 = int(bin_data[29:33].hex(), 16) # 原始 crc

if crc32key == original_crc32: # 计算 crc 对比原始 crc
    print('宽高正确')
else:
    input_ = input("宽高有问题，是否 CRC 爆破宽高? (Y/n):")
    if input_ not in ["Y", "y", ""]:
        exit()
    else:
        # 理论上 0x FF FF FF FF，但考虑到屏幕实际/CPU，0x 0F FF 就差不多了，也就是 4095 宽度和高度
        for i, j in itertools.product(range(4095), range(4095)):
            data = bin_data[12:16] + struct.pack('>i', i) + struct.pack('>i', j) + bin_data[24:29]
            crc32 = zlib.crc32(data)
            # 计算当图片大小为 i:j 时的 CRC 校验值，与图片中的 CRC 比较，当相同，则图片大小已经确定
            if(crc32 == original_crc32):
                print(f"\nCRC32: {hex(original_crc32)}")
                print(f"宽度: {i}, hex: {hex(i)}")
                print(f"高度: {j}, hex: {hex(j)}")
                exit(0)
```

根据 `F` `1` `4` `9` 的顺序可以组成一张阿兹特克码

根据提示信息 找到对应的解码网页或工具，即可解开
