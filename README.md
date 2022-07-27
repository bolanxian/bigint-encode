# BigInt Encode
将二进制数据以小端字节序视为大整数，转换为任意进制  
[在线](https://bolanxian.github.io/bigint-encode/)
## Base20976
使用20976个汉字`/[\u4E00-\u9FEF]/`作为编码表
```javascript
let encoded = BigIntEncoder.base20976.encode('Hello World!')
//"觨鿊凂電踥鐽佡"
let decoded = BigIntEncoder.base20976.decodeString(encoded)
```
## Base2048
基于[BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md)
```javascript
let encoded,decoded
encoded = BigIntEncoder.base2048Bip39Cn.encode('Hello World!')
//"尊扫芽定罢网啊附从"
decoded = BigIntEncoder.base2048Bip39Cn.decodeString(encoded)

encoded = BigIntEncoder.base2048Bip39En.encode('Hello World!')
//"poverty ranch renew alone purity orange glory good around"
decoded = BigIntEncoder.base2048Bip39En.decodeString(encoded)
```
## 切噜LE
使用`切咧哔唎啪啰啵噜拉蹦`十个字作为编码表
```javascript
let encoded = BigIntEncoder['切噜LE'].encode('Hello World!')
//"切噜～♪啪哔哔唎噜啵哔啵啪哔唎拉啰哔拉唎啵咧咧啵啵切啰啪咧啪咧切唎"
let decoded = BigIntEncoder['切噜LE'].decodeString(encoded)
```