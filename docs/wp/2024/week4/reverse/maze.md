---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# MazE

出题思路是这样的，搞了两个进程，两个进程中使用pipe通信，父进程作为客户端显示界面，子进程作为服务端计算数据。

地图的数据是以加密加压缩的方式存储在全局变量里的。

运行过程中，会对已经走到的位置所在的3*3矩形进行解密，并传输给父进程输出出来。

因此总体做题思路是分析出地图解密算法，然后将全部地图数据复制下来全部解密，然后跑一个搜索算法即可。

之后就是分析main函数部分。仔细分析一下，关键点在于子进程中的while循环里。

![main](/assets/images/wp/2024/week4/maze_1.png)

这里对某些函数进行了重命名，帮助同学们理解代码。

get_location的功能就是通过用户输入的路径来判断最终的位置。

tostr就是通过最终的位置解密地图数据得到3*3区域的地图。

![get_location](/assets/images/wp/2024/week4/maze_2.png)

tobinary函数是关键的解密函数。

![tobinary](/assets/images/wp/2024/week4/maze_3.png)
![decrypt](/assets/images/wp/2024/week4/maze_4.png)

decrypt就是对map中的特定字节进行xor解密，解密之后再将该字节分解成二进制从而提取出特定位置的地图数据。

map的存放思路就是对原先只有0和1的地图数据压缩成字节数组，然后对字节数组进行xor加密，因此解密只需要反过来即可。

提取出地图数据即可写出dfs脚本得到答案。

```c
//decrypt.c
//这里只展示关键部分
unsigned char decrypt(unsigned char* buffer,int index){
    unsigned char t;
    const unsigned char key[]="tgrddf55";
    t=buffer[index]^key[index%8];
    return t;
}

int tobinary(unsigned char* buffer,int x,int y){
    int index1=(x*99+y)/8;
    int index2=(x*99+y)%8;
    unsigned char t=decrypt(buffer,index1);
    int bin=t>>(7-index2);
    bin&=1;
    return bin;
}
unsigned char mapbyte[]={0x8b,0x98,0x8d,0x9b,0x9b,0x99·······};//省略地图数据
int main(){
   int maptest[99][99]={0};
   for(int i=0;i<99;i++){
    for(int j=0;j<99;j++){
        int bin=tobinary((unsigned char*)mapbyte,i,j);
        maptest[i][j]=bin;
    }
    return 0;
}
```

```cpp
//dfs.cpp
// 即使不会dfs，随便找一个走迷宫的脚步改一改就可以了
#include<iostream>
using namespace std;
int Map[]={
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1····};
int map[99][99];
char t[10000];
int r=0;
int dx[4]={-1,0,1,0};
int dy[4]={0,1,0,-1};
char op[4]={'w','d','s','a'};
bool check(int qx,int qy){
        if(qx>=0&&qx<99&&qy>=0&&qy<99){
                if(map[qx][qy]==0)return 1;
        }
        return 0;
} 
void dfs(int x,int y){
    //printf("%d %d\n",x,y);
        if(x==97 && y==97){
        //printf("yes!");
                for(int i=0;i<r;i++)cout<<t[i];
                cout<<endl;
                cout<<r;
                cout<<endl;
                return;
        }
        for(int i=0;i<4;i++){
                int qx=dx[i]+x;
                int qy=dy[i]+y;
                if(check(qx,qy)){                
                        t[r]=op[i];
                        r++;                 
                        map[x][y]=1;                
                        dfs(qx,qy);         
                        map[x][y]=0;                         
                        r--;                        
                        t[r]=0;
                }
        }
}
int main(){
        for(int i=0;i<99;i++){
                for(int j=0;j<99;j++){
                        map[i][j]=Map[99*i+j];
                }
        }
    
        }
        dfs(1,1); 
        return 0;
}
/*
ddddssssddssaassssddddssssddssssssssddssaaaawwaawwwwwwaaaawwddwwaaaassssssssddssddssssddddssddwwddssddwwddwwaawwwwwwaawwddddssddddddwwaaaawwwwwwddddddddddssssddssssssaassssaassssddddddddssaassddddssssddwwwwddssssssddddwwddwwaawwaawwwwaawwddwwaawwaawwddddssddwwddddssddwwddwwaaaawwwwddwwwwaaaawwddddddddwwwwaawwaawwddddddddddddssaassssssssaassssssaaaassssssaassddddwwddwwddssssddddssssssssssssssssddwwwwwwwwwwwwwwwwwwaawwddwwddwwddssssssssaassddddwwwwwwddwwwwwwddssssddwwwwwwddddddddddssaaaaaassddddssssaassaaaawwaassaassddssssddwwddwwddddssddddwwwwddddwwwwaaaassaawwwwddwwwwwwaawwwwwwaassssssaaaawwwwaawwwwddwwddssddwwddddddddssaassddssssssddssssssssssssssaassssaassssaassssddssaassssssddddddssssssaassssaaaaaawwwwddddwwwwaassaaaaaaaawwwwaaaassddssssssssssddddssssssssaaaassssaaaassssssssssddddddwwwwwwaaaawwddddwwddwwddwwddddddddddssssaassssaassddssssaaaaaassaaaaaassddddddssddwwddssssaaaaaassddssssaawwaaaaaassssssddwwddddddddddddssdd
936
*/
```

最终随便找一个在线网站或者使用python都可以得到md5了，最后的flag:`flag{4ed5a17ee7aeb95fcf12a3b96a9d4e6f}`
