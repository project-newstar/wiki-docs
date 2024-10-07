---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# base64

在开始之前，你需要知道什么是base64，我们密码学的朋友已经在Crypto的Base题目wp中详细讲解，我不再赘述。  
此题目是教大家定位主函数，base64的一个常见的魔改方式——换表，以及CTF一个编解码工具CyberChef  
双击打开程序，我们看到如下界面

![此处应有图片](/assets/images/wp/2024/week1/base64_1.png)

可以看到让你输入一个字符串，然后会判断对错。一般来说，"Enter the flag:"这个字符串会离主逻辑不远，所以我们找到这个字符串的位置就可以定位到主逻辑。  
在IDA PRO中，按shift+F12调出字符串界面。

![此处应有图片](/assets/images/wp/2024/week1/base64_2.png)

双击就可以转到对应的IDA View。

![此处应有图片](/assets/images/wp/2024/week1/base64_3.png)

双击DATA XREF 右边的地址加偏移，就可以到引用他的地方，按下F5，即可反编译这段逻辑。

![此处应有图片](/assets/images/wp/2024/week1/base64_4.png)

这就是主逻辑了。看到 ‘=’ 结尾的字符串可以想到base64（CTF常识）。但是直接解会出乱码。  
此处需要大家识别出Base64算法的魔改点。大家可以自行对比标准的base64编码算法，为了不过多增加难度我仅把码表换了。

![此处应有图片](/assets/images/wp/2024/week1/base64_5.png)

base64标准码表是
`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`
这里换成了
`WHydo3sThiS7ABLElO0k5trange+CZfVIGRvup81NKQbjmPzU4MDc9Y6q2XwFxJ/`
推荐使用`CyberChef`进行解密，这个工具用了的都说牛逼，你也来试试吧！

![此处应有图片](/assets/images/wp/2024/week1/base64_6.png)

把左边的from base64拖到recipe那一栏，然后把alphabet换成上面说的魔改后的码表，input处输入密文，output处就得到flag了。当然，编写脚本解码也是可以的。
