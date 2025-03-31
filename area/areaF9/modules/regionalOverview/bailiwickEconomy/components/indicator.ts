import { selectItem } from '@/components/transferSelect/types';
const enum unitEnum {
  NULL = '',
  YI = '(亿元)',
  DOLLARYI = '(亿美元)',
  YUAN = '(元)',
  PERCENT = '(%)',
  TENTHOUSAND = '(万人)',
  SQUARE = '(元/㎡)',
  HUNDRED = '(上年=100)',
}
interface IDicatorConfig {
  title: string;
  key?: string;
  children: ItemConfig[];
}
interface ItemConfig extends selectItem {
  title: string; // 筛选项名称
  value?: string; // 筛选项值
  secondTitle?: string; // 筛选项对应的表格标题
  secondTitleUnit?: string; // 表格标题的单位
  key?: string;
  active?: boolean; // 选中
  describe?: string; // 悬浮框描述文字
}

type RelativeObj = { [a: string]: string };

/** 指标数据 */
// 如果value、secondTitle的值和title的值是一致的，就不用赋值；数据会统一赋值处理
const indicatorList: IDicatorConfig[] = [
  {
    title: '常用指标',
    children: [
      {
        title: 'GDP',
        ignoreIndicator: true,
        key: 'use_GDP',
        associatedKey: ['地区生产总值'],
      },
      {
        title: 'GDP增速',
        ignoreIndicator: true,
        key: 'use_GDP增速',
        associatedKey: ['地区生产总值增速:同比'],
      },
      {
        title: '人均GDP',
        ignoreIndicator: true,
        key: 'use_人均GDP',
        associatedKey: ['人均地区生产总值'],
      },
      {
        title: '第一产业增加值',
        ignoreIndicator: true,
        key: 'use_第一产业增加值',
        associatedKey: ['第一产业'],
      },
      {
        title: '第二产业增加值',
        ignoreIndicator: true,
        key: 'use_第二产业增加值',
        associatedKey: ['第二产业'],
      },
      {
        title: '第三产业增加值',
        ignoreIndicator: true,
        key: 'use_第三产业增加值',
        associatedKey: ['第三产业'],
      },
      {
        title: '人口',
        ignoreIndicator: true,
        key: 'use_人口',
        associatedKey: ['人口1'],
      },
      {
        title: '工业增加值',
        ignoreIndicator: true,
        key: 'use_工业增加值',
        associatedKey: ['工业增加值2'],
      },
      {
        title: '工业总产值',
        ignoreIndicator: true,
        key: 'use_工业总产值',
        associatedKey: ['工业总产值'],
      },
      {
        title: '固定资产投资',
        ignoreIndicator: true,
        key: 'use_固定资产投资',
        associatedKey: ['固定资产投资'],
      },
      {
        title: '进出口总额',
        ignoreIndicator: true,
        key: 'use_进出口总额',
        associatedKey: ['进出口总额'],
      },
      {
        title: '社会消费品零售总额',
        ignoreIndicator: true,
        key: 'use_社会消费品零售总额',
        associatedKey: ['社会消费品零售总额'],
      },
      {
        title: '城镇居民人均可支配收入',
        ignoreIndicator: true,
        key: 'use_城镇居民人均可支配收入',
        associatedKey: ['城镇居民人均可支配收入'],
      },
      {
        title: '金融机构存款余额(本外币)',
        ignoreIndicator: true,
        key: 'use_金融机构存款余额(本外币)',
        associatedKey: ['各项存款余额(本外币)'],
      },
      {
        title: '金融机构贷款余额(本外币)',
        ignoreIndicator: true,
        key: 'use_金融机构贷款余额(本外币)',
        associatedKey: ['各项贷款余额(本外币)'],
      },
      {
        title: '一般公共预算收入',
        ignoreIndicator: true,
        key: 'use_一般公共预算收入',
        associatedKey: ['一般公共预算收入'],
      },
      {
        title: '一般公共预算收入增速',
        ignoreIndicator: true,
        key: 'use_一般公共预算收入增速',
        associatedKey: ['一般公共预算收入:同比'],
      },
      {
        title: '一般公共预算收入:税收收入',
        ignoreIndicator: true,
        key: 'use_一般公共预算收入:税收收入',
        associatedKey: ['税收收入'],
      },
      {
        title: '一般公共预算支出',
        ignoreIndicator: true,
        key: 'use_一般公共预算支出',
        associatedKey: ['一般公共预算支出'],
      },
      {
        title: '政府性基金收入',
        ignoreIndicator: true,
        key: 'use_政府性基金收入',
        associatedKey: ['政府性基金收入'],
      },
      {
        title: '政府性基金收入:土地出让收入',
        ignoreIndicator: true,
        key: 'use_土地出让收入',
        associatedKey: ['土地出让收入'],
      },
      {
        title: '政府性基金支出',
        ignoreIndicator: true,
        key: 'use_政府性基金支出',
        associatedKey: ['政府性基金支出'],
      },
      {
        title: '国有资本经营收入',
        ignoreIndicator: true,
        key: 'use_国有资本经营收入',
        associatedKey: ['国有资本经营收入'],
      },
      {
        title: '国有资本经营支出',
        ignoreIndicator: true,
        key: 'use_国有资本经营支出',
        associatedKey: ['国有资本经营支出'],
      },
      {
        title: '财政自给率',
        ignoreIndicator: true,
        key: 'use_财政自给率',
        associatedKey: ['财政自给率'],
      },
      {
        title: '地方政府债务余额',
        ignoreIndicator: true,
        key: 'use_地方政府债务余额',
        associatedKey: ['地方政府债务余额'],
      },
      {
        title: '一般债余额',
        ignoreIndicator: true,
        key: 'use_一般债余额',
        associatedKey: ['地方政府债务余额:一般债务'],
      },
      {
        title: '专项债余额',
        ignoreIndicator: true,
        key: 'use_专项债余额',
        associatedKey: ['地方政府债务余额:专项债务'],
      },
      {
        title: '地方政府债务限额',
        ignoreIndicator: true,
        key: 'use_地方政府债务限额',
        associatedKey: ['地方政府债务限额'],
      },
      {
        title: '城投平台有息债务',
        ignoreIndicator: true,
        key: 'use_城投平台有息债务',
        associatedKey: ['融资平台有息债务'],
      },
      {
        title: '负债率',
        ignoreIndicator: true,
        key: 'use_负债率',
        associatedKey: ['负债率1'],
      },
      {
        title: '负债率(宽口径)',
        ignoreIndicator: true,
        key: 'use_负债率(宽口径)',
        associatedKey: ['负债率2'],
      },
      {
        title: '债务率',
        ignoreIndicator: true,
        key: 'use_债务率',
        associatedKey: ['债务率1'],
      },
      {
        title: '债务率(宽口径)',
        ignoreIndicator: true,
        key: 'use_债务率(宽口径)',
        associatedKey: ['债务率2'],
      },
    ],
  },
  {
    title: '国民经济核算',
    children: [
      {
        title: 'GDP',
        value: '地区生产总值',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_GDP'],
      },
      {
        title: 'GDP增速',
        value: '地区生产总值增速:同比',
        secondTitleUnit: unitEnum.PERCENT,
        active: true,
        associatedKey: ['use_GDP增速'],
      },
      {
        title: '人均GDP',
        value: '人均地区生产总值',
        secondTitleUnit: unitEnum.YUAN,
        active: true,
        associatedKey: ['use_人均GDP'],
      },
      {
        title: '第一产业增加值',
        value: '第一产业',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_第一产业增加值'],
      },
      {
        title: '第二产业增加值',
        value: '第二产业',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_第二产业增加值'],
      },
      {
        title: '第三产业增加值',
        value: '第三产业',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_第三产业增加值'],
      },
      {
        title: '第一产业增速',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '第二产业增速',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '第三产业增速',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '第一产业占比',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '第二产业占比',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '第三产业占比',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: 'GDP:农林牧渔业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:工业',
        value: '工业增加值1',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:建筑业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:批发和零售业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:交通运输、仓储和邮政业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:住宿和餐饮业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:信息传输、软件和信息技术服务业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:金融业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:房地产业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:租赁与商务服务业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:科学研究和技术服务业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:水利、环境和公共设施管理业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:居民服务、修理和其他服务业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:教育',
        value: 'GDP:教育业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:卫生和社会工作',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:文化、体育和娱乐业',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:公共管理、社会保障和社会组织',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: 'GDP:其他',
        value: 'GDP:其他行业',
        secondTitleUnit: unitEnum.YI,
      },
    ],
  },
  {
    title: '人口',
    children: [
      {
        title: '人口',
        secondTitleUnit: unitEnum.TENTHOUSAND,
        active: true,
        key: '人口1',
        associatedKey: ['use_人口'],
      },
      {
        title: '常住人口',
        secondTitleUnit: unitEnum.TENTHOUSAND,
      },
      {
        title: '常住人口变动数',
        secondTitleUnit: unitEnum.TENTHOUSAND,
        describe: '常住人口变动数=本年常住人口-去年同期常住人口',
      },
      {
        title: '常住人口增长率',
        secondTitleUnit: unitEnum.PERCENT,
        describe: '常住人口增长率=(本年常住人口-去年同期常住人口) *100%/去年同期常住人口',
      },
      {
        title: '户籍人口',
        secondTitleUnit: unitEnum.TENTHOUSAND,
      },
      {
        title: '户籍人口变动数',
        secondTitleUnit: unitEnum.TENTHOUSAND,
        describe: '户籍人口变动数=本年户籍人口-去年同期户籍人口',
      },
      {
        title: '户籍人口增长率',
        secondTitleUnit: unitEnum.PERCENT,
        describe: '户籍人口增长率=(本年户籍人口-去年同期户籍人口) *100%/去年同期户籍人口',
      },
    ],
  },
  {
    title: '工业',
    children: [
      {
        title: '工业增加值',
        value: '工业增加值2',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_工业增加值'],
      },
      {
        title: '工业总产值',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_工业总产值'],
      },
      {
        title: '工业总产值增速',
        secondTitleUnit: unitEnum.PERCENT,
      },
    ],
  },
  {
    title: '投资与房地产',
    children: [
      {
        title: '固定资产投资',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_固定资产投资'],
      },
      {
        title: '固定资产投资增速',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '房地产开发投资',
        value: '房地产投资',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '新房销售价格',
        secondTitleUnit: unitEnum.SQUARE,
      },
      {
        title: '二手房平均价格',
        secondTitleUnit: unitEnum.SQUARE,
      },
      {
        title: '住宅土地楼面价',
        secondTitleUnit: unitEnum.SQUARE,
      },
    ],
  },
  {
    title: '对外贸易',
    children: [
      {
        title: '进出口总额',
        secondTitleUnit: unitEnum.DOLLARYI,
        active: true,
        associatedKey: ['use_进出口总额'],
      },
      {
        title: '出口总额',
        value: '出口额',
        secondTitleUnit: unitEnum.DOLLARYI,
      },
      {
        title: '进口总额',
        value: '进口额',
        secondTitleUnit: unitEnum.DOLLARYI,
      },
    ],
  },
  {
    title: '消费、收入和存贷款',
    children: [
      {
        title: '社会消费品零售总额',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_社会消费品零售总额'],
      },
      {
        title: '社会消费品零售总额增速',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '城镇居民人均可支配收入',
        secondTitleUnit: unitEnum.YUAN,
        active: true,
        associatedKey: ['use_城镇居民人均可支配收入'],
      },
      {
        title: '农村居民人均可支配收入',
        secondTitleUnit: unitEnum.YUAN,
      },
      {
        title: '金融机构存款余额(本外币)',
        value: '各项存款余额(本外币)',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_金融机构存款余额(本外币)'],
      },
      {
        title: '金融机构贷款余额(本外币)',
        value: '各项贷款余额(本外币)',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_金融机构贷款余额(本外币)'],
      },
      {
        title: '金融机构存款余额(人民币)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '金融机构贷款余额(人民币)',
        secondTitleUnit: unitEnum.YI,
      },
    ],
  },
  {
    title: '价格指数',
    children: [
      {
        title: '居民消费价格指数',
        secondTitleUnit: unitEnum.HUNDRED,
      },
      {
        title: '工业生产者出厂价格指数',
        secondTitleUnit: unitEnum.HUNDRED,
      },
      {
        title: '工业生产者购进价格指数',
        secondTitleUnit: unitEnum.HUNDRED,
      },
    ],
  },
  {
    title: '一般公共预算收支',
    children: [
      {
        title: '一般公共预算收入',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_一般公共预算收入'],
      },
      {
        title: '一般公共预算收入增速',
        value: '一般公共预算收入:同比',
        secondTitleUnit: unitEnum.PERCENT,
        active: true,
        associatedKey: ['use_一般公共预算收入增速'],
      },
      {
        title: '一般公共预算收入总计',
        value: '一般公共预算总收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:税收收入',
        value: '税收收入',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_一般公共预算收入:税收收入'],
      },
      {
        title: '一般公共预算收入:税收收入增速',
        value: '一般公共预算收入:税收收入:同比',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '一般公共预算收入:税收占比',
        secondTitleUnit: unitEnum.PERCENT,
        describe: '税收占比=税收收入*100%/一般公共预算收入',
      },
      {
        title: '一般公共预算收入:非税收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:非税收入增速',
        value: '一般公共预算收入:非税收入:同比',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '一般公共预算收入:非税收入占比',
        secondTitleUnit: unitEnum.PERCENT,
        describe: '非税收入占比=非税收入*100%/一般公共预算收入',
      },
      {
        title: '一般公共预算收入:债务收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:转移性收入',
        value: '转移性收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:上级补助收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:返还性收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:转移支付收入',
        value: '转移支付收入',
        secondTitleUnit: unitEnum.YI,
        describe: '转移支付收入=一般性转移支付收入+专项转移支付收入',
      },
      {
        title: '一般公共预算收入:一般性转移支付收入',
        value: '一般性转移支付收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:专项转移支付收入',
        value: '专项转移支付收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:债务转贷收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:上年结余收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:接受其他地区援助收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:预算稳定调节基金调入',
        value: '一般公共预算收入:调入预算稳定调节基金',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:调入资金',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_一般公共预算支出'],
      },
      {
        title: '一般公共预算支出增速',
        value: '一般公共预算支出:同比',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '一般公共预算支出总计',
        value: '一般公共预算总支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:一般公共服务支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:外交支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:国防支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:公共安全支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:资源勘探信息等支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:商业服务业等支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:金融支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:自然资源海洋气象等支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:住房保障支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:粮油物资储备支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:灾害防治及应急管理支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:预备费',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:债券发行费用支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:其他支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:教育支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:科学技术支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:文化旅游体育与传媒支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:社会保障和就业支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:卫生健康支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:节能环保支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:城乡社区支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:农林水支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:交通运输支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:债务付息支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:债务还本支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:转移性支出',
        value: '转移性支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:上解上级支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:安排预算稳定调节基金',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:援助其他地区支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:调出资金',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:年终结余',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:补助下级支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:一般性转移支付支出',
        value: '一般公共预算支出:补助下级支出:一般性转移支付支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:专项转移支付支出',
        value: '一般公共预算支出:补助下级支出:专项转移支付支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:返还性支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:债务转贷支出',
        secondTitleUnit: unitEnum.YI,
      },
    ],
  },
  {
    title: '一般公共预算收支(本级)',
    children: [
      {
        title: '一般公共预算收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入增速(本级)',
        value: '一般公共预算收入:同比(本级)',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '一般公共预算收入:税收收入(本级)',
        value: '税收收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:税收收入增速(本级)',
        value: '一般公共预算收入:税收收入:同比(本级)',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '一般公共预算收入:税收占比(本级)',
        secondTitleUnit: unitEnum.PERCENT,
        describe: '税收占比(本级)=税收收入(本级)*100%/一般公共预算收入(本级)',
      },
      {
        title: '一般公共预算收入:非税收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:非税收入增速(本级)',
        value: '一般公共预算收入:非税收入:同比(本级)',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '一般公共预算收入:非税收入占比(本级)',
        secondTitleUnit: unitEnum.PERCENT,
        describe: '非税收入占比(本级)=非税收入(本级)*100%/一般公共预算收入(本级)',
      },
      {
        title: '一般公共预算收入:债务收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:转移性收入(本级)',
        value: '转移性收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:上级补助收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:返还性收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:转移支付收入(本级)',
        secondTitleUnit: unitEnum.YI,
        describe: '转移支付收入(本级)=一般转移支付收入(本级)+专项转移支付收入(本级)',
      },
      {
        title: '一般公共预算收入:一般性转移支付收入(本级)',
        value: '一般性转移支付收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:专项转移支付收入(本级)',
        value: '专项转移支付收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:债务转贷收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:上年结余收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:接受其他地区援助收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:调入预算稳定调节基金(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:调入资金(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算收入:下级上解收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出增速(本级)',
        value: '一般公共预算支出:同比(本级)',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '一般公共预算支出:一般公共服务支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:外交支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:国防支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:公共安全支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:资源勘探信息等支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:商业服务业等支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:金融支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:自然资源海洋气象等支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:住房保障支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:粮油物资储备支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:灾害防治及应急管理支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:预备费(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:债券发行费用支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:其他支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:教育支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:科学技术支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:文化旅游体育与传媒支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:社会保障和就业支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:卫生健康支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:节能环保支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:城乡社区支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:农林水支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:交通运输支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:债务付息支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:债务还本支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:转移性支出(本级)',
        value: '转移性支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:上解上级支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:安排预算稳定调节基金(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:援助其他地区支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:调出资金(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:年终结余(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:补助下级支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:一般性转移支付支出(本级)',
        value: '一般公共预算支出:补助下级支出:一般性转移支付支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:专项转移支付支出(本级)',
        value: '一般公共预算支出:补助下级支出:专项转移支付支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:返还性支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般公共预算支出:债务转贷支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
    ],
  },
  {
    title: '政府性基金收支',
    children: [
      {
        title: '政府性基金收入',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_政府性基金收入'],
      },
      {
        title: '政府性基金收入增速',
        value: '政府性基金收入:同比',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '政府性基金收入:土地出让收入',
        value: '土地出让收入',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_土地出让收入'],
      },
      {
        title: '政府性基金收入:土地出让收入占比',
        secondTitleUnit: unitEnum.PERCENT,
        describe: '土地出让收入占比=土地出让收入*100%/政府性基金收入',
      },
      {
        title: '政府性基金收入:专项债券对应项目专项收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:债务收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:转移性收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:政府性基金转移收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:政府性基金补助收入',
        value: '政府性基金收入:上级补助收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:政府性基金转移支付收入',
        value: '政府性基金收入:转移性收入:政府性基金转移支付收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:抗疫特别国债转移支付收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:上年结余收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:调入资金',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:债务转贷收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_政府性基金支出'],
      },
      {
        title: '政府性基金支出增速',
        value: '政府性基金支出:同比',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:转移性支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:政府性基金转移支付',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:政府性基金补助支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:抗疫特别国债转移支付支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:政府性基金上解支出',
        value: '政府性基金支出:转移性支出:政府性基金上解支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:调出资金',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:年终结余',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:债务转贷支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:债务还本支出',
        value: '政府性基金支出:专项债务还本支出',
        secondTitleUnit: unitEnum.YI,
      },
    ],
  },
  {
    title: '政府性基金收支(本级)',
    children: [
      {
        title: '政府性基金收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入增速(本级)',
        value: '政府性基金收入:同比(本级)',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '政府性基金收入:土地出让收入(本级)',
        value: '土地出让收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:土地出让收入占比(本级)',
        secondTitleUnit: unitEnum.PERCENT,
        describe: '土地出让收入占比(本级)=土地出让收入(本级)*100%/政府性基金收入(本级)',
      },
      {
        title: '政府性基金收入:专项债券对应项目专项收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:债务收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:转移性收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:政府性基金转移收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:政府性基金补助收入(本级)',
        value: '政府性基金收入:上级补助收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:政府性基金转移支付收入(本级)',
        value: '政府性基金收入:转移性收入:政府性基金转移支付收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:抗疫特别国债转移支付收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:上年结余收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:调入资金(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:债务转贷收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金收入:下级上解收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出增速(本级)',
        value: '政府性基金支出:同比(本级)',
        secondTitleUnit: unitEnum.PERCENT,
      },
      {
        title: '政府性基金支出:转移性支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:政府性基金转移支付(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:政府性基金补助支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:抗疫特别国债转移支付支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:政府性基金上解支出(本级)',
        value: '政府性基金支出:转移性支出:政府性基金上解支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:调出资金(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:年终结余(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:债务转贷支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '政府性基金支出:专项债务还本支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
    ],
  },
  {
    title: '国有资本预算收支',
    children: [
      {
        title: '国有资本经营收入',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_国有资本经营收入'],
      },
      {
        title: '国有资本经营收入:转移性收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营收入:上级补助收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营收入:上年结余收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营支出',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_国有资本经营支出'],
      },
      {
        title: '国有资本经营支出:转移性支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营支出:补助下级支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营支出:上解上级支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营支出:调出资金',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营支出:年终结余',
        secondTitleUnit: unitEnum.YI,
      },
    ],
  },
  {
    title: '国有资本预算收支(本级)',
    children: [
      {
        title: '国有资本经营收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营收入:转移性收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营收入:上级补助收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营收入:上年结余收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营收入:下级上解收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营支出:转移性支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营支出:补助下级支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营支出:上解上级支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营支出:调出资金(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '国有资本经营支出:年终结余(本级)',
        secondTitleUnit: unitEnum.YI,
      },
    ],
  },
  {
    title: '预算外财政专户收支',
    children: [
      {
        title: '预算外财政专户收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '预算外财政专户收入',
        secondTitleUnit: unitEnum.YI,
      },
    ],
  },
  {
    title: '综合财力',
    children: [
      {
        title: '财政总收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '财政赤字率',
        secondTitleUnit: unitEnum.PERCENT,
        describe: '财政赤字率=(一般公共预算支出-一般公共预算收入) *100%/GDP',
      },
      {
        title: '财政自给率',
        secondTitleUnit: unitEnum.PERCENT,
        active: true,
        describe: '财政自给率=一般公共预算收入*100%/一般公共预算支出',
        associatedKey: ['use_财政自给率'],
      },
      {
        title: '财政平均收益率',
        secondTitleUnit: unitEnum.PERCENT,
        describe: '财政平均收益率=一般公共预算收入*100%/GDP',
      },
      {
        title: '财政支出弹性系数',
        secondTitleUnit: unitEnum.NULL,
        describe: '财政支出弹性系数=一般公共预算支出增速/GDP增速',
      },
      {
        title: '地方政府综合财力',
        value: '地方综合财力计算',
        secondTitleUnit: unitEnum.YI,
        describe: '地方政府综合财力=一般公共预算收入＋转移性收入＋政府性基金收入＋国有资本经营预算收入',
      },
    ],
  },
  {
    title: '地方政府债务',
    children: [
      {
        title: '地方政府债务余额',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_地方政府债务余额'],
      },
      {
        title: '一般债余额',
        value: '地方政府债务余额:一般债务',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_一般债余额'],
      },
      {
        title: '专项债余额',
        value: '地方政府债务余额:专项债务',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_专项债余额'],
      },
      {
        title: '地方政府债务限额',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_地方政府债务限额'],
      },
      {
        title: '一般债限额',
        value: '地方政府债务限额:一般债务',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '专项债限额',
        value: '地方政府债务限额:专项债务',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '新增地方政府债务限额',
        value: '地方政府债务:新增限额',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '新增一般债务限额',
        value: '地方政府债务:新增限额:一般债务',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '新增专项债务限额',
        value: '地方政府债务:新增限额:专项债务',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府性债务余额',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府负有偿还责任的债务余额',
        value: '地方政府性债务余额:政府负有偿还责任',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府或有债务余额',
        value: '地方政府性债务余额:政府或有债务',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府负有担保责任的债务余额',
        value: '地方政府性债务余额:政府负有担保责任',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府可能承担一定救助责任的债务余额',
        value: '地方政府性债务余额:政府可能承担一定救助责任',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府债券还本额',
        value: '地方政府债券还本数',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府债券付息额',
        value: '地方政府债券付息数',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府一般债券还本支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府一般债券付息支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府专项债券还本支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府专项债券付息支出',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '利息支出率',
        secondTitleUnit: unitEnum.PERCENT,
        describe: '利息支出率=地方政府债券付息额*100%/（政府性基金收入+一般公共预算收入）',
      },
      {
        title: '城投平台有息债务',
        value: '融资平台有息债务',
        secondTitleUnit: unitEnum.YI,
        active: true,
        describe:
          '城投平台有息债务是该地区行政区划下所有的城投公司的短期债务与长期债务合计。其中，短期债务=短期借款+一年内到期的非流动负债+应付短期债券，长期债务=长期借款+应付长期债券。',
        associatedKey: ['use_城投平台有息债务'],
      },
      {
        title: '城投债务率',
        secondTitleUnit: unitEnum.PERCENT,
        describe: '城投债务率=城投平台有息债务*100%/地方政府综合财力',
      },
      {
        title: '负债率',
        value: '负债率1',
        secondTitleUnit: unitEnum.PERCENT,
        active: true,
        describe: '负债率 = 地方政府债务余额*100%/GDP',
        associatedKey: ['use_负债率'],
      },
      {
        title: '负债率(宽口径)',
        value: '负债率2',
        secondTitleUnit: unitEnum.PERCENT,
        active: true,
        describe: '负债率(宽口径) = (地方政府债务余额+城投平台有息债务)*100%/GDP',
        associatedKey: ['use_负债率(宽口径)'],
      },
      {
        title: '债务率',
        value: '债务率1',
        secondTitleUnit: unitEnum.PERCENT,
        active: true,
        describe: '债务率 = 地方政府债务余额*100%/地方政府综合财力',
        associatedKey: ['use_债务率'],
      },
      {
        title: '债务率(宽口径)',
        value: '债务率2',
        secondTitleUnit: unitEnum.PERCENT,
        active: true,
        describe: '债务率(宽口径) = (地方政府债务余额+城投平台有息债务) *100%/地方政府综合财力',
        associatedKey: ['use_债务率(宽口径)'],
      },
      {
        title: '地方政府债券发行额',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府一般债券收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府专项债券收入',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府债券发行额:新增债券',
        value: '地方政府债券发行:新增债券',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府债券发行额:新增债券:一般债券',
        value: '地方政府债券发行:新增债券:一般债券',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府债券发行额:新增债券:专项债券',
        value: '地方政府债券发行:新增债券:专项债券',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府债券发行额:再融资债券总额',
        value: '地方政府债券发行:再融资债券',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府债券发行额:再融资:一般债券',
        value: '地方政府债券发行:再融资债券:一般债券',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府债券发行额:再融资:专项债券',
        value: '地方政府债券发行:再融资债券:专项债券',
        secondTitleUnit: unitEnum.YI,
      },
    ],
  },
  {
    title: '地方政府债务(本级)',
    children: [
      {
        title: '地方政府债务余额(本级)',
        value: '地方政府债务余额:市本级',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般债余额(本级)',
        value: '地方政府债务余额:一般债务(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '专项债余额(本级)',
        value: '地方政府债务余额:专项债务(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府债务限额(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '一般债限额(本级)',
        value: '地方政府债务限额:一般债务(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '专项债限额(本级)',
        value: '地方政府债务限额:专项债务(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府债券还本额(本级)',
        value: '地方政府债务余额:债券还本数:本级',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府债券付息额(本级)',
        value: '地方政府债务余额:债券付息数:本级',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府一般债券还本支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府一般债券付息支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府专项债券还本支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府专项债券付息支出(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '城投平台有息债务(本级)',
        value: '融资平台有息债务(本级)',
        secondTitleUnit: unitEnum.YI,
        describe:
          '城投平台有息债务是该地区本级所有的城投公司的短期债务与长期债务合计。其中，短期债务=短期借款+一年内到期的非流动负债+应付短期债券，长期债务=长期借款+应付长期债券。',
      },
      {
        title: '地方政府债券发行额(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府一般债券收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
      {
        title: '地方政府专项债券收入(本级)',
        secondTitleUnit: unitEnum.YI,
      },
    ],
  },
];

let unitObj: RelativeObj = {},
  nameValueObj: RelativeObj = {},
  sourceValueObj: RelativeObj = {};

/** 我的指标 */
indicatorList.slice(1).forEach((list) => {
  list?.children.forEach((item) => {
    // 处理指标数据
    item.value = item.value || item.title;
    item.key = item?.key || item.value;
    item.secondTitle = item?.secondTitle || item.title;
    // 将单位、表头名称和悬浮框描述文字处理成对应的obj格式
    unitObj[item.secondTitle] = item.secondTitleUnit || '';
    nameValueObj[item.value] = item.secondTitle;
    sourceValueObj[`${item.secondTitle}${item.secondTitleUnit}`] = item.value;
    nameValueObj[`${item.secondTitle}_describe`] = item.describe || '';
  });
});
export { indicatorList, unitObj, nameValueObj, sourceValueObj };
