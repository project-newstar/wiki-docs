---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# ezblockchain

浏览器安装MetaMask插件，在MetaMask里添加网络，网络符号和货币符号可以随便输

![MetaMask](/assets/images/wp/2024/week4/ezblockchain_1.png)

通过自己的账号地址在faucet获得测试代币

![faucet](/assets/images/wp/2024/week4/ezblockchain_2.png)

nc获得合约部署账号并使用Metamask转账

![nc](/assets/images/wp/2024/week4/ezblockchain_3.png)
![Metamask](/assets/images/wp/2024/week4/ezblockchain_4.png)

交互部署合约，获得合约地址和代码

![deploy](/assets/images/wp/2024/week4/ezblockchain_5.png)
![source](/assets/images/wp/2024/week4/ezblockchain_6.png)

将代码复制进Remix编辑器(<https://remix.ethereum.org/>)内，在"Solidity 编译器"选项卡点击编译，然后切换到"部署 & 发交易"选项卡，环境选择Injected Provider，选择你有eth的账户，合约选择你刚编译的合约，然后加载前面nc获得的合约地址

阅读合约代码可以知道，我们要调用unlock函数，传入"re@1lY_eA3y_Bl0ckCh@1n"并发送0.0721个eth。因此在"部署 & 发交易"选项卡的以太币数量填入0.0721eth，由于无法填入小数，需将其转为72100000Gwei，在unlock填入"re@1lY_eA3y_Bl0ckCh@1n"，点击unlock进行交易。

![unlock](/assets/images/wp/2024/week4/ezblockchain_7.png)

交易确认后点击isSolved可发现已经变为true。此时再nc交互即可得到flag

![flag](/assets/images/wp/2024/week4/ezblockchain_8.png)
