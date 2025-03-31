import { Options, ScreenType } from '@dzh/screen';

const addFiled = (arr: any[], key: string) => {
  return arr.map((i) => ({ ...i, filed: key }));
};
export const ENTERPRISE_TYPE: Options = {
  title: '企业类型',
  option: {
    type: ScreenType.MULTIPLE,
    children: addFiled(
      [
        { name: '上市公司', value: '1' },
        { name: '城投企业', value: '2' },
        { name: '央企', value: '4' },
        { name: '国企', value: '5' },
        { name: '民企', value: '6' },
      ],
      'enterpriseType',
    ),
  },
};
export const MORE_SCREEN: Options = {
  title: '更多',
  option: {
    type: ScreenType.MULTIPLE_TILING,
    children: [
      {
        title: '所处阶段',
        multiple: true,
        hasSelectAll: true,
        data: addFiled(
          [
            { name: '土地出让', value: '1' },
            { name: '地块公示', value: '2' },
            { name: '合同签订', value: '3' },
          ],
          'stage',
        ),
      },
      {
        title: '计划开发周期',
        data: addFiled(
          [
            { name: '不限', value: '' },
            { name: '<1年', value: '(0,1)' },
            { name: '1-3年', value: '[1,3)' },
            { name: '3-5年', value: '[3,5)' },
            { name: '>5年', value: '[5,*)' },
          ],
          'planDevelopCycle',
        ),
      },
      {
        title: '供应方式',
        multiple: true,
        hasSelectAll: true,
        data: addFiled(
          [
            { name: '招标出让', value: '2' },
            { name: '拍卖出让', value: '3' },
            { name: '挂牌出让', value: '4' },
          ],
          'supplyMode',
        ),
      },
      {
        title: '土地用地面积',
        data: addFiled(
          [
            { name: '不限', value: '' },
            { name: '1万㎡以下', value: '[0,10000)' },
            { name: '1(含)-5万㎡', value: '[10000,50000)' },
            { name: '5(含)-10万㎡', value: '[50000,100000)' },
            { name: '10(含)-15万㎡', value: '[100000,150000)' },
            { name: '15万㎡及以上', value: '[150000,*)' },
          ],
          'landArea',
        ),
      },
    ],
  },
};

export const LAND_USE: Options = {
  title: '土地用途',
  option: {
    type: ScreenType.MULTIPLE_THIRD,
    children: addFiled(
      [
        {
          name: '商服用地',
          value: '5',
          children: addFiled(
            [
              { name: '零售商业用地', value: '0501' },
              { name: '批发市场用地', value: '0502' },
              { name: '餐饮用地', value: '0503' },
              { name: '旅馆用地', value: '0504' },
              { name: '商务金融用地', value: '0505' },
              { name: '娱乐用地', value: '0506' },
              { name: '其他商服用地', value: '0507' },
            ],
            'landUsageSecondType',
          ),
        },
        {
          name: '工矿仓储用地',
          value: '6',
          children: addFiled(
            [
              { name: '工业用地', value: '0601' },
              { name: '采矿用地', value: '0602' },
              { name: '盐田', value: '0603' },
              { name: '仓储用地', value: '0604' },
            ],
            'landUsageSecondType',
          ),
        },
        {
          name: '住宅用地',
          value: '7',
          children: addFiled(
            [
              { name: '城镇住宅用地', value: '0701' },
              { name: '农村宅基地', value: '0702' },
              { name: '保障性租赁住房', value: '0703' },
            ],
            'landUsageSecondType',
          ),
        },
        {
          name: '公共管理与公共服务用地',
          value: '8',
          children: addFiled(
            [
              { name: '机关团体用地', value: '0801' },
              { name: '科研用地', value: '0802' },
              { name: '社会福利用地', value: '0803' },
              { name: '文化设施用地', value: '0804' },
              { name: '体育用地', value: '0805' },
              { name: '公用设施用地', value: '0806' },
              { name: '公园与绿地', value: '0807' },
            ],
            'landUsageSecondType',
          ),
        },
        {
          name: '特殊用地',
          value: '9',
          children: addFiled(
            [
              { name: '军事设施用地', value: '0901' },
              { name: '使领馆用地', value: '0902' },
              { name: '监教场所用地', value: '0903' },
              { name: '宗教用地', value: '0904' },
              { name: '殡葬用地', value: '0905' },
              { name: '风景名胜设施用地', value: '0906' },
            ],
            'landUsageSecondType',
          ),
        },
        {
          name: '交通运输用地',
          value: '10',
          children: addFiled([{ name: '铁路用地', value: '1001' }], 'landUsageSecondType'),
        },
      ],
      'landUsageFirstType',
    ),
    hasSelectAll: false,
    cascade: true,
  },
};

export const SUPPLY_MODE: Options = {
  title: '供应方式',
  option: {
    type: ScreenType.MULTIPLE,
    children: addFiled(
      [
        { name: '招标出让', value: '2' },
        { name: '拍卖出让', value: '3' },
        { name: '挂牌出让', value: '4' },
      ],
      'supplyMode',
    ),
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

export const MONTH_OPTIONS: Options = {
  title: '类型',
  option: {
    type: ScreenType.SINGLE,
    cancelable: false,
    children: addFiled(
      [
        { name: '月', value: 'm' },
        { name: '季', value: 'q' },
        { name: '半年', value: 'h' },
        { name: '年', value: 'y', active: true },
      ],
      'timeStatisticsType',
    ),
  },
};
export const MORE_SCREEN_NEW: Options = {
  title: '更多',
  option: {
    type: ScreenType.MULTIPLE_TILING,
    children: [
      {
        title: '所处阶段',
        multiple: true,
        hasSelectAll: true,
        data: addFiled(
          [
            { name: '土地出让', value: '1' },
            { name: '地块公示', value: '2' },
            { name: '合同签订', value: '3' },
          ],
          'stage',
        ),
      },
      {
        title: '计划开发周期',
        data: addFiled(
          [
            { name: '不限', value: '' },
            { name: '<1年', value: '(0,1)' },
            { name: '1-3年', value: '[1,3)' },
            { name: '3-5年', value: '[3,5)' },
            { name: '>5年', value: '[5,*)' },
          ],
          'planDevelopCycle',
        ),
      },
      {
        title: '供应方式',
        multiple: true,
        hasSelectAll: true,
        data: addFiled(
          [
            { name: '招标出让', value: '2' },
            { name: '拍卖出让', value: '3' },
            { name: '挂牌出让', value: '4' },
          ],
          'supplyMode',
        ),
      },
      {
        title: '土地用地面积',
        data: addFiled(
          [
            { name: '不限', value: '' },
            { name: '1万㎡以下', value: '[0,10000)' },
            { name: '1(含)-5万㎡', value: '[10000,50000)' },
            { name: '5(含)-10万㎡', value: '[50000,100000)' },
            { name: '10(含)-15万㎡', value: '[100000,150000)' },
            { name: '15万㎡及以上', value: '[150000,*)' },
          ],
          'landArea',
        ),
      },
      {
        title: '土地成交金额',
        data: addFiled(
          [
            { name: '不限', value: '' },
            { name: '1万元以下', value: '[0,1)' },
            { name: '1(含)-50万元', value: '[1,50)' },
            { name: '50(含)-500万元', value: '[50,500)' },
            { name: '500(含)-1000万元', value: '[500,1000)' },
            { name: '1000万元及以上', value: '[1000,*)' },
          ],
          'landDealTotalPrice',
        ),
      },
    ],
  },
};
export const OPTIONSCHART: Options[] = [
  {
    title: '类型',
    option: {
      type: ScreenType.SINGLE,
      cancelable: false,
      children: addFiled(
        [
          { name: '按成交金额(亿元)', value: 'money', active: true },
          { name: '按成交面积(万㎡)', value: 'area' },
          { name: '按成交数量(宗)', value: 'count' },
        ],
        'chartDataType',
      ),
    },
  },
];
