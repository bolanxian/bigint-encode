(function (root, factory) {
  typeof define == 'function' && define.amd ? define(factory) :
    typeof exports == 'object' && typeof module == 'object' ? module.exports = factory() :
      (root.BigIntEncoder = factory())
})(this, function () {
  'use strict';
  class Encoder {
    constructor(map) {
      this.map = map
      this.prefix = ''
      this.separator = null
    }
    get reverseMap() {
      const reverseMap = new Map(), { map } = this
      let i
      for (i = 0; i < map.length; i++) {
        reverseMap.set(map[i], i)
      }
      Object.defineProperty(this, 'reverseMap', {
        value: reverseMap, writable: false, enumerable: true, configurable: true
      })
      return reverseMap
    }
    *xencode(buffer, endFlag) {
      const { map } = this, redix = BigInt(map.length)
      if (typeof buffer === 'string') { buffer = this.textEncoder.encode(buffer) }
      for (const s of Encoder.xbigIntToArray(Encoder.bufferToBigInt(buffer, endFlag), redix)) {
        yield map[s]
      }
    }
    encode(buffer, endFlag = true) {
      buffer = Array.from(this.xencode(buffer, endFlag))
      buffer = buffer.join(this.separator != null ? this.separator : '')
      return this.prefix + buffer
    }
    decode(string, endFlag = true) {
      if (typeof string === 'string') {
        if (string.startsWith(this.prefix)) {
          string = string.slice(this.prefix.length)
        }
        string = this.separator != null ? string.split(this.separator) : Array.from(string)
      }
      return Encoder.bigIntToBuffer(Encoder.stringToBigInt(string, this.reverseMap), endFlag)
    }
    decodeString(string) {
      return this.textDecoder.decode(this.decode(string))
    }
  }
  Object.assign(Encoder, {
    highestOneBit(i) {
      // HD, Figure 3-1
      i |= (i >> 1);
      i |= (i >> 2);
      i |= (i >> 4);
      i |= (i >> 8);
      i |= (i >> 16);
      return i - (i >>> 1);
    },
    bufferToBigInt(buffer, endFlag = true) {
      if (buffer.length === 0) { return 1n }
      let value = 0n, i, len
      for (i = 0, len = buffer.length; i < len; i++) {
        value += BigInt(buffer[i]) << (BigInt(i) * 8n)
      }
      if (endFlag) {
        let lastIndex = buffer.length - 1, last = buffer[lastIndex]
        value += BigInt(last !== 0 ? this.highestOneBit(last) : 1) << (1n + BigInt(lastIndex) * 8n)
      }
      return value
    },
    arrayToBigInt(array, radix = 10n) {
      let value = 0n, i, len
      for (i = 0, len = array.length; i < len; i++) {
        value += BigInt(array[i]) * (radix ** BigInt(i))
      }
      return value
    },
    stringToBigInt(string, map) {
      let radix = BigInt(map.size), value = 0n, i
      for (i = 0; i < string.length; i++) {
        value += BigInt(map.get(string[i])) * (radix ** BigInt(i))
      }
      return value
    },
    *xbigIntToArray(value, radix = 10n) {
      do { yield value % radix } while (value /= radix)
    },
    *xbigIntToBuffer(value, endFlag = true) {
      while (value > 0xFFn) {
        yield Number(value & 0xFFn)
        value >>= 8n
      }
      if (value > 1n) {
        value = Number(value)
        if (endFlag) {
          value &= ~this.highestOneBit(value)
        }
        yield value
      }
    },
    bigIntToBuffer(value, endFlag) {
      return Uint8Array.from(this.xbigIntToBuffer(value, endFlag))
    }
  })
  Object.assign(Encoder.prototype, {
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder()
  })
  function* range(begin, end) {
    let i = begin; for (; i <= end; i++) { yield i }
  }
  for (let map of [
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    String.fromCharCode(...range(0x30a1, 0x30fa)),
    String.fromCharCode(...range(0x4e00, 0x9fef))
  ]) {
    Encoder[`base${map.length}`] = new Encoder(map)
  }
  Encoder['切噜LE'] = new Encoder('切咧哔唎啪啰啵噜拉蹦')
  Encoder['切噜LE'].prefix = '切噜\uff5e♪'
  return Encoder
})