import { ScreenType } from '@/components/screen';
const enum unitEnum {
  NULL = '',
  YI = '(亿元)',
  YIDOLLAR = '(亿美元)',
  YUAN = '(元)',
  PERCENT = '(%)',
  TENTHOUSAND = '(万人)',
  HOMEUNIT = '(家)',
  SQUAREKILOMETER = '(平方公里)',
  HECTARE = '(公顷)',
}
export interface IDicatorConfig {
  title: string;
  children: ItemConfig[];
}
interface ItemConfig {
  key?: string;
  title: string; // 筛选项名称
  value?: string; // 筛选项值
  secondTitle?: string; // 筛选项对应的表格标题
  secondTitleUnit?: string; // 表格标题的单位
  width?: number; //表格列宽
  align?: string; //表格列对其方式
  active?: boolean; // 默认选中
  sortKey?: string; //排序名称
  dataIndex?: string; //特殊处理的表格渲染名称
  ignoreIndicator?: boolean;
  associatedKey?: any;
}
type RelativeObj = { [a: string]: string };

/* 开发区类别筛选数据 */
const category = [
  { name: '国家级经开区', value: 'K001' },
  { name: '国家级高新区', value: 'K002' },
  { name: '国家海关监管区域', value: 'K003' },
  { name: '国家级新区', value: 'K004' },
  { name: '其他国家级开发区', value: 'K005' },
  { name: '国家边和区', value: 'K006' },
  { name: '省级新区', value: 'K007' },
  { name: '省级开发区', value: 'K008' },
];

const developCategory = {
  title: '类别',
  option: {
    type: ScreenType.MULTIPLE,
    children: category,
  },
  overlayStyle: { zIndex: 101 },
};
/** 指标数据 */
/*  如果value、secondTitle的值和title的值是一致的，就不用赋值；数据会统一赋值处理 */
const indicatorList: IDicatorConfig[] = [
  {
    title: '常用指标',
    children: [
      {
        title: 'GDP',
        ignoreIndicator: true,
        key: 'use_GDP',
        associatedKey: ['GDP'],
      },
      {
        title: 'GDP增速',
        ignoreIndicator: true,
        key: 'use_GDP增速',
        associatedKey: ['GDP增速'],
      },
      {
        title: '固定资产投资',
        ignoreIndicator: true,
        key: 'use_固定资产投资',
        associatedKey: ['固定资产投资'],
      },
      {
        title: '固定资产投资增速',
        ignoreIndicator: true,
        key: 'use_固定资产投资增速',
        associatedKey: ['固定资产投资增速'],
      },
      {
        title: '进出口总额',
        ignoreIndicator: true,
        key: 'use_进出口总额',
        associatedKey: ['进出口总额'],
      },
      {
        title: '工业总产值',
        ignoreIndicator: true,
        key: 'use_工业总产值',
        associatedKey: ['工业总产值'],
      },
      {
        title: '社会消费品零售总额',
        ignoreIndicator: true,
        key: 'use_社会消费品零售总额',
        associatedKey: ['社会消费品零售总额'],
      },
      {
        title: '社会消费品零售总额增速',
        ignoreIndicator: true,
        key: 'use_社会消费品零售总额增速',
        associatedKey: ['社会消费品零售总额增速'],
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
        associatedKey: ['一般公共预算收入增速'],
      },
      {
        title: '转移支付收入',
        ignoreIndicator: true,
        key: 'use_转移支付收入',
        associatedKey: ['转移支付收入'],
      },
      {
        title: '税收收入',
        ignoreIndicator: true,
        key: 'use_税收收入',
        associatedKey: ['税收收入'],
      },
      {
        title: '政府性基金收入',
        ignoreIndicator: true,
        key: 'use_政府性基金收入',
        associatedKey: ['政府性基金收入'],
      },
      {
        title: '一般公共预算支出',
        ignoreIndicator: true,
        key: 'use_一般公共预算支出',
        associatedKey: ['一般公共预算支出'],
      },
      {
        title: '政府性基金支出',
        ignoreIndicator: true,
        key: 'use_政府性基金支出',
        associatedKey: ['政府性基金支出'],
      },
      {
        title: '地方政府债务余额',
        ignoreIndicator: true,
        key: 'use_地方政府债务余额',
        associatedKey: ['地方政府债务余额'],
      },
      {
        title: '地方政府债务限额',
        ignoreIndicator: true,
        key: 'use_地方政府债务限额',
        associatedKey: ['地方政府债务限额'],
      },
      {
        title: '成立年份',
        ignoreIndicator: true,
        key: 'use_成立年份',
        associatedKey: ['成立年份'],
      },
      {
        title: '主导产业',
        ignoreIndicator: true,
        key: 'use_主导产业',
        associatedKey: ['主导产业'],
      },
    ],
  },
  {
    title: '经济情况',
    children: [
      {
        title: 'GDP',
        sortKey: 'GDP',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_GDP'],
        width: 114,
      },
      {
        title: 'GDP增速',
        sortKey: 'GDP增速',
        secondTitleUnit: unitEnum.PERCENT,
        active: true,
        associatedKey: ['use_GDP增速'],
        width: 118,
      },
      {
        title: '人均GDP',
        sortKey: '人均GDP',
        secondTitleUnit: unitEnum.YUAN,
        width: 118,
      },
      {
        title: '第一产业',
        sortKey: '第一产业',
        secondTitleUnit: unitEnum.YI,
        width: 128,
      },
      {
        title: '第二产业',
        sortKey: '第二产业',
        secondTitleUnit: unitEnum.YI,
        width: 128,
      },
      {
        title: '第三产业',
        sortKey: '第三产业',
        secondTitleUnit: unitEnum.YI,
        width: 128,
      },
      {
        title: '固定资产投资',
        sortKey: '固定资产投资',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_固定资产投资'],
        width: 128,
      },
      {
        title: '固定资产投资增速',
        sortKey: '固定资产投资增速',
        secondTitleUnit: unitEnum.PERCENT,
        active: true,
        associatedKey: ['use_固定资产投资增速'],
        width: 128,
      },
      {
        title: '进出口总额',
        sortKey: '进出口总额',
        secondTitleUnit: unitEnum.YIDOLLAR,
        active: true,
        associatedKey: ['use_进出口总额'],
        width: 120,
      },
      {
        title: '工业增加值',
        sortKey: '工业增加值',
        secondTitleUnit: unitEnum.YI,
        width: 111,
      },
      {
        title: '工业总产值',
        sortKey: '工业总产值',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_工业总产值'],
        width: 111,
      },
      {
        title: '社会消费品零售总额',
        sortKey: '社会消费品零售总额',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_社会消费品零售总额'],
        width: 132,
      },
      {
        title: '社会消费品零售总额增速',
        sortKey: '社会消费品零售总额增速',
        secondTitleUnit: unitEnum.PERCENT,
        active: true,
        associatedKey: ['use_社会消费品零售总额增速'],
        width: 132,
      },
      {
        title: '户籍人口',
        sortKey: '户籍人口',
        secondTitleUnit: unitEnum.TENTHOUSAND,
        width: 128,
      },
      {
        title: '常住人口',
        sortKey: '常住人口',
        secondTitleUnit: unitEnum.TENTHOUSAND,
        width: 128,
      },
    ],
  },
  {
    title: '园区财政',
    children: [
      {
        title: '一般公共预算收入',
        sortKey: '一般公共预算收入',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_一般公共预算收入'],
        width: 132,
      },
      {
        title: '一般公共预算收入增速',
        sortKey: '一般公共预算收入增速',
        secondTitleUnit: unitEnum.PERCENT,
        active: true,
        associatedKey: ['use_一般公共预算收入增速'],
        width: 132,
      },
      {
        title: '转移支付收入',
        sortKey: '转移支付收入',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_转移支付收入'],
        width: 127,
      },
      {
        title: '税收收入',
        sortKey: '税收收入',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_税收收入'],
        width: 128,
      },
      {
        title: '转移性收入',
        sortKey: '转移性收入',
        secondTitleUnit: unitEnum.YI,
        width: 111,
      },
      {
        title: '政府性基金收入',
        sortKey: '政府性基金收入',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_政府性基金收入'],
        width: 132,
      },
      {
        title: '国有资本经营收入',
        sortKey: '国有资本经营收入',
        secondTitleUnit: unitEnum.YI,
        width: 127,
      },
      {
        title: '土地出让收入',
        sortKey: '土地出让收入',
        secondTitleUnit: unitEnum.YI,
        width: 127,
      },
      {
        title: '一般公共预算支出',
        sortKey: '一般公共预算支出',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_一般公共预算支出'],
        width: 127,
      },
      {
        title: '政府性基金支出',
        sortKey: '政府性基金支出',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_政府性基金支出'],
        width: 132,
      },
      {
        title: '国有资本经营支出',
        sortKey: '国有资本经营支出',
        secondTitleUnit: unitEnum.YI,
        width: 127,
      },
    ],
  },
  {
    title: '园区债务',
    children: [
      {
        title: '地方政府债务余额',
        sortKey: '地方政府债务余额',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_地方政府债务余额'],
        width: 127,
      },
      {
        title: '一般债余额',
        sortKey: '一般债余额',
        secondTitleUnit: unitEnum.YI,
        width: 111,
      },
      {
        title: '专项债余额',
        sortKey: '专项债余额',
        secondTitleUnit: unitEnum.YI,
        width: 111,
      },
      {
        title: '地方政府债务限额',
        sortKey: '地方政府债务限额',
        secondTitleUnit: unitEnum.YI,
        active: true,
        associatedKey: ['use_地方政府债务限额'],
        width: 127,
      },
      {
        title: '一般债限额',
        sortKey: '一般债限额',
        secondTitleUnit: unitEnum.YI,
        width: 112,
      },
      {
        title: '专项债限额',
        sortKey: '专项债限额',
        secondTitleUnit: unitEnum.YI,
        width: 112,
      },
      {
        title: '财政自给率',
        sortKey: '财政自给率',
        secondTitleUnit: unitEnum.PERCENT,
        width: 127,
      },
      {
        title: '负债率',
        sortKey: '负债率',
        secondTitleUnit: unitEnum.PERCENT,
        width: 100,
      },
      {
        title: '负债率(宽口径)',
        sortKey: '负债率(宽口径)',
        secondTitleUnit: unitEnum.PERCENT,
        width: 127,
      },
      {
        title: '债务率',
        sortKey: '债务率',
        secondTitleUnit: unitEnum.PERCENT,
        width: 100,
      },
      {
        title: '债务率(宽口径)',
        sortKey: '债务率(宽口径)',
        secondTitleUnit: unitEnum.PERCENT,
        width: 127,
      },
    ],
  },
  {
    title: '产业特色',
    children: [
      {
        title: '外商实际投资',
        sortKey: '外商实际投资',
        secondTitleUnit: unitEnum.YIDOLLAR,
        width: 127,
      },
      {
        title: '高新技术企业产值',
        sortKey: '高新技术企业产值',
        secondTitleUnit: unitEnum.YI,
        width: 127,
      },
      {
        title: '规模以上企业数',
        sortKey: '规模以上企业数',
        secondTitleUnit: unitEnum.HOMEUNIT,
        width: 127,
      },
      {
        title: '合同外资金额',
        sortKey: '合同外资金额',
        secondTitleUnit: unitEnum.YIDOLLAR,
        width: 127,
      },
    ],
  },
  /* 注意：此处是特殊处理，基本信息中的筛选指标需要单独拿出来放到includes入参里面 */
  {
    title: '基本信息',
    children: [
      {
        title: '成立年份',
        // sortKey: 'CR0231_015',
        dataIndex: 'CR0231_015',
        secondTitleUnit: unitEnum.NULL,
        width: 78,
        active: true,
        associatedKey: ['use_成立年份'],
        align: 'center',
      },
      {
        title: '主导产业',
        dataIndex: 'CR0231_018',
        secondTitleUnit: unitEnum.NULL,
        width: 246,
        active: true,
        associatedKey: ['use_主导产业'],
        align: 'left',
      },
      {
        title: '管辖面积',
        // sortKey: 'CR0231_017',
        dataIndex: 'CR0231_017',
        secondTitleUnit: unitEnum.SQUAREKILOMETER,
        width: 138,
      },
      {
        title: '核准面积',
        // sortKey: 'CR0231_016',
        dataIndex: 'CR0231_016',
        secondTitleUnit: unitEnum.HECTARE,
        width: 118,
      },
    ],
  },
];

let unitObj: RelativeObj = {},
  nameValueObj: RelativeObj = {};

/** 我的指标 */
indicatorList.forEach((list) => {
  list?.children.forEach((item) => {
    item.value = item.key || item.value || item.title;
    item.key = item.value;
    item.secondTitle = item?.secondTitle || item.title;

    unitObj[item.secondTitle] = item.secondTitleUnit || '';
    nameValueObj[item.value] = item.secondTitle;
  });
});
export { indicatorList, unitObj, nameValueObj, developCategory };
