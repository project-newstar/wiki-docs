---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# ezblockchain

本题是一题区块链题。

浏览器安装 MetaMask 插件，在 MetaMask里 添加网络，网络符号和货币符号可以随便输

![MetaMask](/assets/images/wp/2024/week4/ezblockchain_1.png)

通过自己的账号地址在 faucet 获得测试代币

![faucet](/assets/images/wp/2024/week4/ezblockchain_2.png)

nc 获得合约部署账号并使用 Metamask 转账

![nc](/assets/images/wp/2024/week4/ezblockchain_3.png)

![Metamask](/assets/images/wp/2024/week4/ezblockchain_4.png)

交互部署合约，获得合约地址和代码

![deploy](/assets/images/wp/2024/week4/ezblockchain_5.png)

![source](/assets/images/wp/2024/week4/ezblockchain_6.png)

将代码复制进 [Remix 编辑器](https://remix.ethereum.org) 内，在「Solidity 编译器」选项卡点击编译，然后切换到「部署 & 发交易」选项卡，环境选择 Injected Provider，选择你有 eth 的账户，合约选择你刚编译的合约，然后加载前面 nc 获得的合约地址

阅读合约代码可以知道，我们要调用 `unlock` 函数，传入 `re@1lY_eA3y_Bl0ckCh@1n` 并发送 0.0721 个 eth. 因此在「部署 & 发交易」选项卡的以太币数量填入 0.0721 eth，由于无法填入小数，需将其转为 72100000 Gwei，在 unlock 填入 `re@1lY_eA3y_Bl0ckCh@1n`，点击 unlock 进行交易。

![unlock](/assets/images/wp/2024/week4/ezblockchain_7.png)

交易确认后点击 `isSolved` 可发现已经变为 `true`. 此时再 nc 交互即可得到 flag

![flag](/assets/images/wp/2024/week4/ezblockchain_8.png)
