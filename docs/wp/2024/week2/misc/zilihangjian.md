---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# 字里行间的秘密

题目描述为：

> 我横竖睡不着，仔细看了半夜，才从字缝里看出字来

打开附件，一个名为 flag 的 Word 文件，一个 `key.txt`.

Word 文件被加密，打开 `key.txt`，文字有明显的水印特征，放到 vim 或 VSCode 就能看出存在零宽隐写，放到[在线网站](https://www.mzy0.com/ctftools/zerowidth1/)默认参数，可以拿到 key `it_is_k3y`.

然后打开 Word 发现没有flag，但 <kbd>^ Ctrl</kbd><kbd>A</kbd> 全选发现第二行还是有内容的，将字体改为黑色就可发现 flag.
