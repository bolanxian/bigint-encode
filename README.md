# BigInt Encode
将二进制数据以小端字节序视为大整数，转换为任意进制 [在线](https://bolanxian.github.io/bigint-encode/)
## Base20976
使用20976个汉字/[\u4E00-\u9FEF]/作为编码表
```javascript
let encoded = BigIntEncoder.base20976.encode('Hello World!')
//"觨鿊凂電踥鐽佡"
let decoded = BigIntEncoder.base20976.decodeString(encoded)
```