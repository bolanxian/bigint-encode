(function(root,factory){
  typeof define=='function'&&define.amd?define(factory):
  typeof exports=='object'&&typeof module=='object'?module.exports=factory():
  (root.BigIntEncoder=factory())
})(this,function(){
  'use strict';
  class Encoder{
    constructor(map){
      const that=Encoder
      this.map=map
    }
    get reverseMap(){
      const reverseMap=new Map(),{map}=this
      for(let i=0;i<map.length;i++){
        reverseMap.set(map[i],i)
      }
      Object.defineProperty(this,'reverseMap',{
        value:reverseMap,writable:false,enumerable:true,configurable:true
      })
      return reverseMap
    }
    encode(buffer){
      const that=Encoder,{map}=this,redix=BigInt(map.length)
      if(typeof buffer==='string'){buffer=this.textEncoder.encode(buffer)}
      var value=''
      for(var s of that.xbigIntToArray(that.bufferToBigInt(buffer),redix)){
        value+=map[s]
      }
      return value
    }
    decode(string){
      const that=Encoder
      return that.bigIntToBuffer(that.stringToBigInt(string,this.reverseMap))
    }
    decodeString(string){
      return this.textDecoder.decode(this.decode(string))
    }
  }
  Object.assign(Encoder,{
    highestOneBit(i){
      // HD, Figure 3-1
      i |= (i >>  1)
      i |= (i >>  2)
      i |= (i >>  4)
      i |= (i >>  8)
      i |= (i >> 16)
      return i - (i >>> 1)
    },
    bufferToBigInt(buffer){
      if(buffer.length===0){return 1n}
      let value=0n
      for(let i=0,len=buffer.length;i<len;i++){
        value+=BigInt(buffer[i])<<(BigInt(i)*8n)
      }
      let lastIndex=buffer.length-1,last=buffer[lastIndex]
      if(last===0){
        value+=1n<<(BigInt(buffer.length)*8n)
      }else{
        value+=BigInt(this.highestOneBit(last))<<(1n+BigInt(lastIndex)*8n)
      }
      return value
    },
    arrayToBigInt(array,radix=10n){
      let value=0n
      for(let i=0,len=array.length;i<len;i++){
        value+=BigInt(array[i])*(radix**BigInt(i))
      }
      return value
    },
    stringToBigInt(string,map){
      let radix=BigInt(map.size),value=0n
      for(let i=0;i<string.length;i++){
        value+=BigInt(map.get(string[i]))*(radix**BigInt(i))
      }
      return value
    },
    *xbigIntToArray(value,radix=10n){
      do{yield value%radix}while(value/=radix)
    },
    *xbigIntToBuffer(value){
      while(value>0xFFn){
        yield Number(value&0xFFn)
        value>>=8n
      }
      if(value>1n){
        value=Number(value)
        value&=~this.highestOneBit(value)
        yield value
      }
    },
    bigIntToBuffer(value){
      return Uint8Array.from(this.xbigIntToBuffer(value))
    }
  })
  Object.assign(Encoder.prototype,{
    textEncoder:new TextEncoder(),
    textDecoder:new TextDecoder()
  })
  Encoder.Prefix=class extends Encoder{
    constructor(map,prefix){
      super(map)
      this.prefix=prefix
    }
    encode(buffer){
      return this.prefix+super.encode(buffer)
    }
    decode(string){
      if(string.startsWith(this.prefix)){
        string=string.slice(this.prefix.length)
      }
      return super.decode(string)
    }
  }
for(let map of [
  '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  String.fromCharCode(...(function*(){
    for(var i=0x4e00;i<=0x9fef;i++){yield i}
  })()),
  //BIP39
  "的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严首底液官德随病苏失尔死讲配女黄推显谈罪神艺呢席含企望密批营项防举球英氧势告李台落木帮轮破亚师围注远字材排供河态封另施减树溶怎止案言士均武固叶鱼波视仅费紧爱左章早朝害续轻服试食充兵源判护司足某练差致板田降黑犯负击范继兴似余坚曲输修故城夫够送笔船占右财吃富春职觉汉画功巴跟虽杂飞检吸助升阳互初创抗考投坏策古径换未跑留钢曾端责站简述钱副尽帝射草冲承独令限阿宣环双请超微让控州良轴找否纪益依优顶础载倒房突坐粉敌略客袁冷胜绝析块剂测丝协诉念陈仍罗盐友洋错苦夜刑移频逐靠混母短皮终聚汽村云哪既距卫停烈央察烧迅境若印洲刻括激孔搞甚室待核校散侵吧甲游久菜味旧模湖货损预阻毫普稳乙妈植息扩银语挥酒守拿序纸医缺雨吗针刘啊急唱误训愿审附获茶鲜粮斤孩脱硫肥善龙演父渐血欢械掌歌沙刚攻谓盾讨晚粒乱燃矛乎杀药宁鲁贵钟煤读班伯香介迫句丰培握兰担弦蛋沉假穿执答乐谁顺烟缩征脸喜松脚困异免背星福买染井概慢怕磁倍祖皇促静补评翻肉践尼衣宽扬棉希伤操垂秋宜氢套督振架亮末宪庆编牛触映雷销诗座居抓裂胞呼娘景威绿晶厚盟衡鸡孙延危胶屋乡临陆顾掉呀灯岁措束耐剧玉赵跳哥季课凯胡额款绍卷齐伟蒸殖永宗苗川炉岩弱零杨奏沿露杆探滑镇饭浓航怀赶库夺伊灵税途灭赛归召鼓播盘裁险康唯录菌纯借糖盖横符私努堂域枪润幅哈竟熟虫泽脑壤碳欧遍侧寨敢彻虑斜薄庭纳弹饲伸折麦湿暗荷瓦塞床筑恶户访塔奇透梁刀旋迹卡氯遇份毒泥退洗摆灰彩卖耗夏择忙铜献硬予繁圈雪函亦抽篇阵阴丁尺追堆雄迎泛爸楼避谋吨野猪旗累偏典馆索秦脂潮爷豆忽托惊塑遗愈朱替纤粗倾尚痛楚谢奋购磨君池旁碎骨监捕弟暴割贯殊释词亡壁顿宝午尘闻揭炮残冬桥妇警综招吴付浮遭徐您摇谷赞箱隔订男吹园纷唐败宋玻巨耕坦荣闭湾键凡驻锅救恩剥凝碱齿截炼麻纺禁废盛版缓净睛昌婚涉筒嘴插岸朗庄街藏姑贸腐奴啦惯乘伙恢匀纱扎辩耳彪臣亿璃抵脉秀萨俄网舞店喷纵寸汗挂洪贺闪柬爆烯津稻墙软勇像滚厘蒙芳肯坡柱荡腿仪旅尾轧冰贡登黎削钻勒逃障氨郭峰币港伏轨亩毕擦莫刺浪秘援株健售股岛甘泡睡童铸汤阀休汇舍牧绕炸哲磷绩朋淡尖启陷柴呈徒颜泪稍忘泵蓝拖洞授镜辛壮锋贫虚弯摩泰幼廷尊窗纲弄隶疑氏宫姐震瑞怪尤琴循描膜违夹腰缘珠穷森枝竹沟催绳忆邦剩幸浆栏拥牙贮礼滤钠纹罢拍咱喊袖埃勤罚焦潜伍墨欲缝姓刊饱仿奖铝鬼丽跨默挖链扫喝袋炭污幕诸弧励梅奶洁灾舟鉴苯讼抱毁懂寒智埔寄届跃渡挑丹艰贝碰拔爹戴码梦芽熔赤渔哭敬颗奔铅仲虎稀妹乏珍申桌遵允隆螺仓魏锐晓氮兼隐碍赫拨忠肃缸牵抢博巧壳兄杜讯诚碧祥柯页巡矩悲灌龄伦票寻桂铺圣恐恰郑趣抬荒腾贴柔滴猛阔辆妻填撤储签闹扰紫砂递戏吊陶伐喂疗瓶婆抚臂摸忍虾蜡邻胸巩挤偶弃槽劲乳邓吉仁烂砖租乌舰伴瓜浅丙暂燥橡柳迷暖牌秧胆详簧踏瓷谱呆宾糊洛辉愤竞隙怒粘乃绪肩籍敏涂熙皆侦悬掘享纠醒狂锁淀恨牲霸爬赏逆玩陵祝秒浙貌役彼悉鸭趋凤晨畜辈秩卵署梯炎滩棋驱筛峡冒啥寿译浸泉帽迟硅疆贷漏稿冠嫩胁芯牢叛蚀奥鸣岭羊凭串塘绘酵融盆锡庙筹冻辅摄袭筋拒僚旱钾鸟漆沈眉疏添棒穗硝韩逼扭侨凉挺碗栽炒杯患馏劝豪辽勃鸿旦吏拜狗埋辊掩饮搬骂辞勾扣估蒋绒雾丈朵姆拟宇辑陕雕偿蓄崇剪倡厅咬驶薯刷斥番赋奉佛浇漫曼扇钙桃扶仔返俗亏腔鞋棱覆框悄叔撞骗勘旺沸孤吐孟渠屈疾妙惜仰狠胀谐抛霉桑岗嘛衰盗渗脏赖涌甜曹阅肌哩厉烃纬毅昨伪症煮叹钉搭茎笼酷偷弓锥恒杰坑鼻翼纶叙狱逮罐络棚抑膨蔬寺骤穆冶枯册尸凸绅坯牺焰轰欣晋瘦御锭锦丧旬锻垄搜扑邀亭酯迈舒脆酶闲忧酚顽羽涨卸仗陪辟惩杭姚肚捉飘漂昆欺吾郎烷汁呵饰萧雅邮迁燕撒姻赴宴烦债帐斑铃旨醇董饼雏姿拌傅腹妥揉贤拆歪葡胺丢浩徽昂垫挡览贪慰缴汪慌冯诺姜谊凶劣诬耀昏躺盈骑乔溪丛卢抹闷咨刮驾缆悟摘铒掷颇幻柄惠惨佳仇腊窝涤剑瞧堡泼葱罩霍捞胎苍滨俩捅湘砍霞邵萄疯淮遂熊粪烘宿档戈驳嫂裕徙箭捐肠撑晒辨殿莲摊搅酱屏疫哀蔡堵沫皱畅叠阁莱敲辖钩痕坝巷饿祸丘玄溜曰逻彭尝卿妨艇吞韦怨矮歇"
]){
  Encoder[`base${map.length}`]=new Encoder(map)
}
  Encoder['切噜LE']=new Encoder.Prefix('切咧哔唎啪啰啵噜拉蹦','切噜LE\uff5e♪')
  return Encoder
})