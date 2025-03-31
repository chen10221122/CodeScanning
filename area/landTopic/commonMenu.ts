import { Options, ScreenType } from '@dzh/screen';

export const ENTERPRISE_TYPE: Options = {
  title: '企业类型',
  option: {
    type: ScreenType.MULTIPLE,
    children: [
      { name: '不限', value: '', unlimited: true, active: true, filed: 'enterpriseType' },
      { name: '上市', value: '1', filed: 'enterpriseType' },
      { name: '城投', value: '2', filed: 'enterpriseType' },
      { name: '房企', value: '3', filed: 'enterpriseType' },
      { name: '央企', value: '4', filed: 'enterpriseType' },
      { name: '国企', value: '5', filed: 'enterpriseType' },
      { name: '民营', value: '6', filed: 'enterpriseType' },
    ],
  },
};

export const LAND_USE: Options = {
  title: '土地用途',
  option: {
    type: ScreenType.MULTIPLE_THIRD,
    children: [
      {
        name: '商服用地',
        value: '5',
        children: [
          { name: '零售商业用地', value: '0501', filed: 'landUsageSecondType' },
          { name: '批发市场用地', value: '0502', filed: 'landUsageSecondType' },
          { name: '餐饮用地', value: '0503', filed: 'landUsageSecondType' },
          { name: '旅馆用地', value: '0504', filed: 'landUsageSecondType' },
          { name: '商务金融用地', value: '0505', filed: 'landUsageSecondType' },
          { name: '娱乐用地', value: '0506', filed: 'landUsageSecondType' },
          { name: '其他商服用地', value: '0507', filed: 'landUsageSecondType' },
        ],
        filed: 'landUsageFirstType',
      },
      {
        name: '工矿仓储用地',
        value: '6',
        children: [
          { name: '工业用地', value: '0601', filed: 'landUsageSecondType' },
          { name: '采矿用地', value: '0602', filed: 'landUsageSecondType' },
          { name: '盐田', value: '0603', filed: 'landUsageSecondType' },
          { name: '仓储用地', value: '0604', filed: 'landUsageSecondType' },
        ],
        filed: 'landUsageFirstType',
      },
      {
        name: '住宅用地',
        value: '7',
        children: [
          { name: '城镇住宅用地', value: '0701', filed: 'landUsageSecondType' },
          { name: '农村宅基地', value: '0702', filed: 'landUsageSecondType' },
          { name: '保障性租赁住房', value: '0703', filed: 'landUsageSecondType' },
        ],
        filed: 'landUsageFirstType',
      },
      {
        name: '公共管理与公共服务用地',
        value: '8',
        children: [
          { name: '机关团体用地', value: '0801', filed: 'landUsageSecondType' },
          { name: '科研用地', value: '0802', filed: 'landUsageSecondType' },
          { name: '社会福利用地', value: '0803', filed: 'landUsageSecondType' },
          { name: '文化设施用地', value: '0804', filed: 'landUsageSecondType' },
          { name: '体育用地', value: '0805', filed: 'landUsageSecondType' },
          { name: '公用设施用地', value: '0806', filed: 'landUsageSecondType' },
          { name: '公园与绿地', value: '0807', filed: 'landUsageSecondType' },
        ],
        filed: 'landUsageFirstType',
      },
      {
        name: '特殊用地',
        value: '9',
        children: [
          { name: '军事设施用地', value: '0901', filed: 'landUsageSecondType' },
          { name: '使领馆用地', value: '0902', filed: 'landUsageSecondType' },
          { name: '监教场所用地', value: '0903', filed: 'landUsageSecondType' },
          { name: '宗教用地', value: '0904', filed: 'landUsageSecondType' },
          { name: '殡葬用地', value: '0905', filed: 'landUsageSecondType' },
          { name: '风景名胜设施用地', value: '0906', filed: 'landUsageSecondType' },
        ],
        filed: 'landUsageFirstType',
      },
      {
        name: '交通运输用地',
        value: '10',
        children: [{ name: '铁路用地', value: '1001', filed: 'landUsageSecondType' }],
        filed: 'landUsageFirstType',
      },
    ],
    hasSelectAll: false,
    cascade: true,
  },
};

export const STATISTICAL_RANGE: Options = {
  title: '统计范围',
  option: {
    type: ScreenType.SINGLE,
    cancelable: false,
    children: [
      { name: '含下属辖区', value: '1', active: true, filed: 'statisticsScope' },
      { name: '本级', value: '0', filed: 'statisticsScope' },
    ],
  },
};

export const SUPPLY_MODE: Options = {
  title: '供应方式',
  option: {
    type: ScreenType.SINGLE,
    cancelable: false,
    children: [
      { name: '不限', value: '', unlimited: true, active: true, filed: 'supplyMode' },
      { name: '招标出让', value: '2', filed: 'supplyMode' },
      { name: '拍卖出让', value: '3', filed: 'supplyMode' },
      { name: '挂牌出让', value: '4', filed: 'supplyMode' },
    ],
  },
};

export const HOLD_RATIO: Options[] = [
  {
    title: '持股比例',
    option: {
      cancelable: false,
      type: ScreenType.SINGLE,
      children: [
        { name: '持股比例≥5%', value: '1', filed: ' holdRatio' },
        { name: '持股比例≥20%', value: '2' },
        { name: '持股比例≥50%', value: '3', active: true },
        { name: '持股比例100%', value: '4' },
      ],
    },
    ellipsis: 10,
    formatTitle(rows) {
      //格式化显示标题
      if (rows.length) {
        return rows[0].name;
      }
      return '持股比例';
    },
  },
];
