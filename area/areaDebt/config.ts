import { cloneDeep } from 'lodash';
export type InfoType = {
  params: {
    regionCode: string;
    indicName: string;
    endDate?: string;
  };
  visible: boolean;
};

type ItemType = {
  guid: string | null;
  indicName: string;
  mValue: string | null;
  isTitle?: boolean;
  ischildTitle?: boolean;
  children?: ItemType[];
  key?: number;
  updateType?: string;
  addName?: string;
  formula?: string;
};

type NameListType = {
  name: string;
  addName?: string;
  isTitle?: boolean;
  isNumerator?: string | null;
  formula?: string | null;
  updateType?: string;
};
type NameType = {
  hasNumerator?: boolean;
  list: NameListType[];
  tips?: string;
  detail?: string;
};
export type TranseDataType = {
  detail?: string;
  tips: string;
  data: ItemType[];
};

export const handleIndicName = (name: string) => {
  const nameMap = Object.keys(indicNameMap);
  const isSpecial = nameMap.includes(name);
  return isSpecial;
};

export const indicNameMap = {
  常住人口变动数: '常住人口变动数',
  常住人口增长率: '常住人口增长率',
  户籍人口变动数: '户籍人口变动数',
  户籍人口增长率: '户籍人口增长率',
  '一般公共预算收入:税收占比': '一般公共预算收入:税收占比',
  '一般公共预算收入:非税收入占比': '一般公共预算收入:非税收入占比',
  '一般公共预算收入:转移支付收入': '转移支付收入',
  '政府性基金收入:土地出让收入占比': '政府性基金收入:土地出让收入占比',
  财政赤字率: '财政赤字率',
  财政自给率: '财政自给率',
  财政平均收益率: '财政平均收益率',
  财政支出弹性系数: '财政支出弹性系数',
  地方政府综合财力: '地方综合财力计算',
  利息支出率: '利息支出率',
  城投债务率: '城投债务率',
  负债率: '负债率1',
  '负债率(宽口径)': '负债率2',
  债务率: '债务率1',
  '债务率(宽口径)': '债务率2',
  '一般公共预算收入:税收占比(本级)': '一般公共预算收入:税收占比(本级)',
  '一般公共预算收入:非税收入占比(本级)': '一般公共预算收入:非税收入占比(本级)',
  '一般公共预算收入:转移支付收入(本级)': '转移支付收入(本级)',
  '政府性基金收入:土地出让收入占比(本级)': '政府性基金收入:土地出让收入占比(本级)',
};

const expandList = ['地方政府综合财力(亿元)'];

/** 计算指标弹窗模版 */
const formateTemplate = (data: ItemType[], nameMap: NameType, updateData: any) => {
  let resList: ItemType[] = [];
  const numerator: ItemType = { indicName: '分子：', mValue: null, guid: null, ischildTitle: true };
  const denominator: ItemType = { indicName: '分母：', mValue: null, guid: null, ischildTitle: true };
  const list = cloneDeep(data);
  const nameList = cloneDeep(nameMap?.list);
  let flagNum = 0;
  let flag = true;
  /** 添加更新提示 */

  updateData?.forEach((o: any) => {
    nameList?.forEach((nameobj: NameListType) => {
      if (o.indicName === nameobj.name && !expandList.includes(o.indicName)) {
        nameobj.updateType = o.updateType;
      }
    });
  });
  nameList?.forEach((nameobj: NameListType, idx) => {
    /** 指标是否有数据 */
    let hasValue = false;
    list.forEach((item: ItemType) => {
      const tempItem = cloneDeep(item);
      if (nameobj && item) {
        /** 配置指标名 */
        if (nameobj?.name === item.indicName) {
          hasValue = true;
          /** 标题 */
          if (nameobj?.isTitle) tempItem.isTitle = true;
          /** 分母 */
          if (flag && nameobj?.isNumerator === '分母') {
            flagNum = idx;
            flag = false;
          }
          /** 添加加减 */
          if (nameobj?.formula) {
            tempItem.indicName = item.indicName;
            tempItem.formula = nameobj?.formula;
          }
          if (nameobj?.updateType) {
            tempItem.updateType = nameobj?.updateType;
          }
          if (nameobj?.addName) {
            tempItem.addName = nameobj?.addName;
          }
          if (item.children) {
            tempItem.key = idx;
            /** 子集添加更新提示 */
            updateData?.forEach((o: any) => {
              item.children?.forEach((obj: ItemType) => {
                if (o.indicName === obj.indicName) {
                  obj.updateType = o.updateType;
                }
              });
            });
            const copyChildren = cloneDeep(item.children);
            const childMap = expandChildMap.get(item.indicName);
            childMap?.forEach((childObj: NameListType, childidx: number) => {
              /** 指标是否有数据 */
              let childItemHasValue = false;
              item.children?.forEach((childItem: ItemType) => {
                if (childObj.name === childItem.indicName) {
                  childItemHasValue = true;
                }
              });
              /** 没有数据则添加 */
              if (!childItemHasValue) {
                copyChildren.splice(childidx, 0, { indicName: childObj.name, mValue: null, guid: null });
              }
            });
            tempItem.children = copyChildren;
          }
          resList.push(tempItem);
        }
      }
    });
    if (!hasValue) {
      let itemName = nameobj.name;
      let itemFormula = '';
      /** 添加加减 */
      if (nameobj?.formula) {
        itemFormula = nameobj?.formula;
      }
      resList.splice(idx, 0, { indicName: itemName, mValue: null, guid: null, formula: itemFormula });
    }
  });
  /** 有分子分母，将分子分母行添加进去 */
  if (nameMap?.hasNumerator) {
    resList.splice(1, 0, numerator);
    resList.splice(flagNum + 1, 0, denominator);
  }

  return resList;
};

const expandChildMap = new Map<string, NameListType[]>([
  [
    '地方政府综合财力(亿元)',
    [
      { name: '一般公共预算收入(亿元)' },
      { name: '一般公共预算收入:转移性收入(亿元)' },
      { name: '政府性基金收入(亿元)' },
      { name: '国有资本经营收入(亿元)' },
    ],
  ],
]);
/** 计算指标溯源弹窗配置 */
const configMap = new Map<string, NameType>([
  [
    '常住人口变动数',
    {
      hasNumerator: false,
      list: [
        { name: '常住人口变动数(万人)', isTitle: true },
        { name: '本年常住人口(万人)', addName: '常住人口' },
        { name: '上年常住人口(万人)', addName: '常住人口', formula: '减' },
      ],
      tips: '常住人口变动数=本年常住人口-去年同期常住人口',
    },
  ],
  [
    '常住人口增长率',
    {
      hasNumerator: true,
      list: [
        { name: '常住人口增长率(%)', isTitle: true },
        { name: '本年常住人口(万人)', isNumerator: '分子', addName: '常住人口' },
        { name: '上年常住人口(万人)', isNumerator: '分子', addName: '常住人口', formula: '减' },
        { name: '上年常住人口(万人)', isNumerator: '分母' },
      ],
      tips: '常住人口增长率=(本年常住人口-去年同期常住人口) *100%/去年同期常住人口',
    },
  ],
  [
    '户籍人口变动数',
    {
      hasNumerator: false,
      list: [
        { name: '户籍人口变动数(万人)', isTitle: true },
        { name: '本年户籍人口(万人)', addName: '户籍人口' },
        { name: '上年户籍人口(万人)', addName: '户籍人口', formula: '减' },
      ],
      tips: '户籍人口变动数=本年户籍人口-去年同期户籍人口',
    },
  ],
  [
    '户籍人口增长率',
    {
      hasNumerator: true,
      list: [
        { name: '户籍人口增长率(%)', isTitle: true },
        { name: '本年户籍人口(万人)', isNumerator: '分子', addName: '户籍人口' },
        { name: '上年户籍人口(万人)', isNumerator: '分子', addName: '户籍人口', formula: '减' },
        { name: '上年户籍人口(万人)', isNumerator: '分母' },
      ],
      tips: '户籍人口增长率=(本年户籍人口-去年同期户籍人口) *100%/去年同期户籍人口',
    },
  ],
  [
    '一般公共预算收入:税收占比',
    {
      hasNumerator: true,
      list: [
        { name: '一般公共预算收入:税收占比(%)', isTitle: true },
        { name: '一般公共预算收入:税收收入(亿元)', isNumerator: '分子' },
        { name: '一般公共预算收入(亿元)', isNumerator: '分母' },
      ],
      tips: '税收占比=税收收入*100%/一般公共预算收入',
    },
  ],
  [
    '一般公共预算收入:非税收入占比',
    {
      hasNumerator: true,
      list: [
        { name: '一般公共预算收入:非税收入占比(%)', isTitle: true },
        { name: '一般公共预算收入:非税收入(亿元)', isNumerator: '分子' },
        { name: '一般公共预算收入(亿元)', isNumerator: '分母' },
      ],
      tips: '非税收入占比=非税收入*100%/一般公共预算收入',
    },
  ],
  [
    '一般公共预算收入:转移支付收入',
    {
      hasNumerator: false,
      list: [
        { name: '一般公共预算收入:转移支付收入(亿元)', isTitle: true },
        { name: '一般公共预算收入:一般性转移支付收入(亿元)' },
        { name: '一般公共预算收入:专项转移支付收入(亿元)', formula: '加' },
      ],
      tips: '转移支付收入=一般转移支付收入+专项转移支付收入',
    },
  ],
  [
    '政府性基金收入:土地出让收入占比',
    {
      hasNumerator: true,
      list: [
        { name: '政府性基金收入:土地出让收入占比(%)', isTitle: true },
        { name: '政府性基金收入:土地出让收入(亿元)', isNumerator: '分子' },
        { name: '政府性基金收入(亿元)', isNumerator: '分母' },
      ],
      tips: '土地出让收入占比=土地出让收入*100%/政府性基金收入',
    },
  ],
  [
    '财政赤字率',
    {
      hasNumerator: true,
      list: [
        { name: '财政赤字率(%)', isTitle: true },
        { name: '一般公共预算支出(亿元)', isNumerator: '分子' },
        { name: '一般公共预算收入(亿元)', isNumerator: '分子', formula: '减' },
        { name: 'GDP(亿元)', isNumerator: '分母' },
      ],
      tips: '财政赤字率=(一般公共预算支出-一般公共预算收入) *100%/GDP',
    },
  ],
  [
    '财政自给率',
    {
      hasNumerator: true,
      list: [
        { name: '财政自给率(%)', isTitle: true },
        { name: '一般公共预算收入(亿元)', isNumerator: '分子' },
        { name: '一般公共预算支出(亿元)', isNumerator: '分母' },
      ],
      tips: '财政自给率=一般公共预算收入*100%/一般公共预算支出',
    },
  ],
  [
    '财政平均收益率',
    {
      hasNumerator: true,
      list: [
        { name: '财政平均收益率(%)', isTitle: true },
        { name: '一般公共预算收入(亿元)', isNumerator: '分子' },
        { name: 'GDP(亿元)', isNumerator: '分母' },
      ],
      tips: '财政平均收益率=一般公共预算收入*100%/GDP',
    },
  ],
  [
    '财政支出弹性系数',
    {
      hasNumerator: true,
      list: [
        { name: '财政支出弹性系数', isTitle: true },
        { name: '一般公共预算支出增速(%)', isNumerator: '分子' },
        { name: 'GDP增速(%)', isNumerator: '分母' },
      ],
      tips: '财政支出弹性系数=一般公共预算支出增速/GDP增速',
    },
  ],
  [
    '地方政府综合财力',
    {
      hasNumerator: false,
      list: [
        { name: '地方政府综合财力(亿元)', isTitle: true },
        { name: '一般公共预算收入(亿元)' },
        { name: '一般公共预算收入:转移性收入(亿元)', formula: '加' },
        { name: '政府性基金收入(亿元)', formula: '加' },
        { name: '国有资本经营收入(亿元)', formula: '加' },
      ],
      tips: '地方政府综合财力=一般公共预算收入＋转移性收入＋政府性基金收入＋国有资本经营预算收入。',
      detail:
        '其中，转移性收入为一般公共预算口径，若综合财力中除一般公共预算收入外的其他3个指标未披露时或部分披露时，未披露的指标以0代替，可能造成综合财力的低估。',
    },
  ],
  [
    '利息支出率',
    {
      hasNumerator: true,
      list: [
        { name: '利息支出率(%)', isTitle: true },
        { name: '地方政府债券付息额(亿元)', isNumerator: '分子' },
        { name: '政府性基金收入(亿元)', isNumerator: '分母' },
        { name: '一般公共预算收入(亿元)', isNumerator: '分母', formula: '加' },
      ],
      tips: '利息支出率=地方政府债券付息额*100%/（政府性基金收入+一般公共预算收入）',
    },
  ],
  [
    '城投债务率',
    {
      hasNumerator: true,
      list: [
        { name: '城投债务率(%)', isTitle: true },
        { name: '城投平台有息债务(亿元)', isNumerator: '分子' },
        { name: '地方政府综合财力(亿元)', isNumerator: '分母' },
      ],
      tips: '城投债务率=城投平台有息债务*100%/地方政府综合财力。',
      detail:
        '地方政府综合财力中，转移性收入为一般公共预算口径，若综合财力中除一般公共预算收入外的其他3个指标未披露时或部分披露时，未披露的指标以0代替，可能造成综合财力的低估。',
    },
  ],
  [
    '负债率',
    {
      hasNumerator: true,
      list: [
        { name: '负债率(%)', isTitle: true },
        { name: '地方政府债务余额(亿元)', isNumerator: '分子' },
        { name: 'GDP(亿元)', isNumerator: '分母' },
      ],
      tips: '负债率 = 地方政府债务余额*100%/GDP',
    },
  ],
  [
    '负债率(宽口径)',
    {
      hasNumerator: true,
      list: [
        { name: '负债率(宽口径)(%)', isTitle: true },
        { name: '地方政府债务余额(亿元)', isNumerator: '分子' },
        { name: '城投平台有息债务(亿元)', isNumerator: '分子', formula: '加' },
        { name: 'GDP(亿元)', isNumerator: '分母' },
      ],
      tips: '负债率(宽口径) = (地方政府债务余额+城投平台有息债务)*100%/GDP',
    },
  ],
  [
    '债务率',
    {
      hasNumerator: true,
      list: [
        { name: '债务率(%)', isTitle: true },
        { name: '地方政府债务余额(亿元)', isNumerator: '分子' },
        { name: '地方政府综合财力(亿元)', isNumerator: '分母' },
      ],
      tips: '债务率 = 地方政府债务余额*100%/地方政府综合财力',
      detail:
        '地方政府综合财力中，转移性收入为一般公共预算口径，若综合财力中除一般公共预算收入外的其他3个指标未披露时或部分披露时，未披露的指标以0代替，可能造成综合财力的低估。',
    },
  ],
  [
    '债务率(宽口径)',
    {
      hasNumerator: true,
      list: [
        { name: '债务率(宽口径)(%)', isTitle: true },
        { name: '地方政府债务余额(亿元)', isNumerator: '分子' },
        { name: '城投平台有息债务(亿元)', isNumerator: '分子', formula: '加' },
        { name: '地方政府综合财力(亿元)', isNumerator: '分母' },
      ],
      tips: '债务率(宽口径) = (地方政府债务余额+城投平台有息债务) *100%/地方政府综合财力',
      detail:
        '地方政府综合财力中，转移性收入为一般公共预算口径，若综合财力中除一般公共预算收入外的其他3个指标未披露时或部分披露时，未披露的指标以0代替，可能造成综合财力的低估。',
    },
  ],
  [
    '一般公共预算收入:税收占比(本级)',
    {
      hasNumerator: true,
      list: [
        { name: '一般公共预算收入:税收占比(本级)(%)', isTitle: true },
        { name: '一般公共预算收入:税收收入(本级)(亿元)', isNumerator: '分子' },
        { name: '一般公共预算收入(本级)(亿元)', isNumerator: '分母' },
      ],
      tips: '税收占比(本级)=税收收入(本级)*100%/一般公共预算收入(本级)',
    },
  ],
  [
    '一般公共预算收入:非税收入占比(本级)',
    {
      hasNumerator: true,
      list: [
        { name: '一般公共预算收入:非税收入占比(本级)(%)', isTitle: true },
        { name: '一般公共预算收入:非税收入(本级)(亿元)', isNumerator: '分子' },
        { name: '一般公共预算收入(本级)(亿元)', isNumerator: '分母' },
      ],
      tips: '非税收入占比(本级)=非税收入(本级)*100%/一般公共预算收入(本级)',
    },
  ],
  [
    '一般公共预算收入:转移支付收入(本级)',
    {
      hasNumerator: false,
      list: [
        { name: '一般公共预算收入:转移支付收入(本级)(亿元)', isTitle: true },
        { name: '一般公共预算收入:一般性转移支付收入(本级)(亿元)' },
        { name: '一般公共预算收入:专项转移支付收入(本级)(亿元)', formula: '加' },
      ],
      tips: '转移支付收入(本级)=一般转移支付收入(本级)+专项转移支付收入(本级)',
    },
  ],
  [
    '政府性基金收入:土地出让收入占比(本级)',
    {
      hasNumerator: true,
      list: [
        { name: '政府性基金收入:土地出让收入占比(本级)(%)', isTitle: true },
        { name: '政府性基金收入:土地出让收入(本级)(亿元)', isNumerator: '分子' },
        { name: '政府性基金收入(本级)(亿元)', isNumerator: '分母' },
      ],
      tips: '土地出让收入占比(本级)=土地出让收入(本级)*100%/政府性基金收入(本级)',
    },
  ],
]);

/** 格式化计算指标溯源弹窗数据 */
export const formateData = (data: ItemType[], indicName: string, updateData: any) => {
  if (data?.length > 0) {
    const config: any = configMap.get(indicName);
    let resList: ItemType[] = [];
    resList = formateTemplate(data, config, updateData);
    if (resList?.length > 0) {
      return { data: resList, tips: config.tips, detail: config.detail };
    }
  }
};

export const getScrollX = (columns: any[]) =>
  columns.reduce((total: number, item: Record<string, any>) => {
    total += item.width;
    return total;
  }, 0);
