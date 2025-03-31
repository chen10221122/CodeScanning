import dayJs from 'dayjs';

import { RangePicker } from '@/components/antd';
import { ScreenType } from '@/components/screen';

export const dateScreen = [
  {
    name: '评级日期',
    value: null,
    render: () => <RangePicker size="small" />,
  },
];

// 评级类型
// export const enterpriseType = [
//   { name: '评级调高', value: '1' },
//   { name: '评级调低', value: '2' },
//   { name: '评级维持', value: '3' },
//   { name: '评级展望正面', value: '11' },
//   { name: '评级展望负面', value: '13' },
//   { name: '评级展望稳定', value: '12' },
//   { name: '列入评级观察', value: '7' },
//   { name: '评级展望调高', value: '4' },
//   { name: '评级展望调低', value: '5' },
// ];

// 行业
export const industryType: {
  name: string;
  value: string;
}[] = [
  { name: '农林牧渔', value: '110000' },
  { name: '基础化工', value: '220000' },
  { name: '钢铁', value: '230000' },
  { name: '有色金属', value: '240000' },
  { name: '电子', value: '270000' },
  { name: '汽车', value: '280000' },
  { name: '家用电器', value: '330000' },
  { name: '食品饮料', value: '340000' },
  { name: '纺织服饰', value: '350000' },
  { name: '轻工制造', value: '360000' },
  { name: '医药生物', value: '370000' },
  { name: '公用事业', value: '410000' },
  { name: '交通运输', value: '420000' },
  { name: '房地产', value: '430000' },
  { name: '商贸零售', value: '450000' },
  { name: '社会服务', value: '460000' },
  { name: '银行', value: '480000' },
  { name: '非银金融', value: '490000' },
  { name: '综合', value: '510000' },
  { name: '建筑材料', value: '610000' },
  { name: '建筑装饰', value: '620000' },
  { name: '电力设备', value: '630000' },
  { name: '机械设备', value: '640000' },
  { name: '国防军工', value: '650000' },
  { name: '计算机', value: '710000' },
  { name: '传媒', value: '720000' },
  { name: '通信', value: '730000' },
  { name: '煤炭', value: '740000' },
  { name: '石油石化', value: '750000' },
  { name: '环保', value: '760000' },
  { name: '美容护理', value: '770000' },
];

//地区
export const location = [
  { name: '安徽', value: '3400', oldValue: '340000' },
  { name: '北京', value: '1100', oldValue: '110000' },
  { name: '福建', value: '3500', oldValue: '350000' },
  { name: '甘肃', value: '6200', oldValue: '620000' },
  { name: '广东', value: '4400', oldValue: '440000' },
  { name: '广西', value: '4500', oldValue: '450000' },
  { name: '贵州', value: '5200', oldValue: '520000' },
  { name: '海南', value: '4600', oldValue: '460000' },
  { name: '河北', value: '1300', oldValue: '130000' },
  { name: '河南', value: '4100', oldValue: '410000' },
  { name: '黑龙江', value: '2300', oldValue: '230000' },
  { name: '湖北', value: '4200', oldValue: '420000' },
  { name: '湖南', value: '4300', oldValue: '430000' },
  { name: '吉林', value: '2200', oldValue: '220000' },
  { name: '江苏', value: '3200', oldValue: '320000' },
  { name: '江西', value: '3600', oldValue: '360000' },
  { name: '辽宁', value: '2100', oldValue: '210000' },
  { name: '内蒙古', value: '1500', oldValue: '150000' },
  { name: '宁夏', value: '6400', oldValue: '640000' },
  { name: '青海', value: '6300', oldValue: '630000' },
  { name: '山东', value: '3700', oldValue: '370000' },
  { name: '山西', value: '1400', oldValue: '140000' },
  { name: '陕西', value: '6100', oldValue: '610000' },
  { name: '上海', value: '3100', oldValue: '310000' },
  { name: '四川', value: '5100', oldValue: '510000' },
  { name: '天津', value: '1200', oldValue: '120000' },
  { name: '西藏', value: '5400', oldValue: '540000' },
  { name: '新疆', value: '6500', oldValue: '650000' },
  { name: '云南', value: '5300', oldValue: '530000' },
  { name: '浙江', value: '3300', oldValue: '330000' },
  { name: '重庆', value: '5000', oldValue: '500000' },
];

/**
 * 更多筛选数据总装
 */

const enterpriseNature = [
  { name: '央企', value: '1', field: 'enterpriseNature' },
  { name: '地方国企', value: '2', field: 'enterpriseNature' },
  { name: '其他国企', value: '3', field: 'enterpriseNature' },
  { name: '民营企业', value: '4', field: 'enterpriseNature' },
  { name: '集体企业', value: '5', field: 'enterpriseNature' },
  { name: '外资企业', value: '6', field: 'enterpriseNature' },
  { name: '中外合资企业', value: '7', field: 'enterpriseNature' },
];

/** 评级 */
const ratingList = [
  { name: 'AAA', value: 'AAA', field: 'latestRate' },
  { name: 'AA+', value: 'AA+', field: 'latestRate' },
  { name: 'AA', value: 'AA', field: 'latestRate' },
  { name: 'AA-', value: 'AA-', field: 'latestRate' },
  { name: 'A+', value: 'A+', field: 'latestRate' },
  { name: 'A', value: 'A', field: 'latestRate' },
  { name: 'A-', value: 'A-', field: 'latestRate' },

  { name: 'BBB+', value: 'BBB+', field: 'latestRate' },
  { name: 'BBB', value: 'BBB', field: 'latestRate' },
  { name: 'BBB-', value: 'BBB-', field: 'latestRate' },
  { name: 'BB+', value: 'BB+', field: 'latestRate' },
  { name: 'BB', value: 'BB', field: 'latestRate' },
  { name: 'BB-', value: 'BB-', field: 'latestRate' },
  { name: 'B+', value: 'B+', field: 'latestRate' },
  { name: 'B', value: 'B', field: 'latestRate' },
  { name: 'B-', value: 'B-', field: 'latestRate' },

  { name: 'CCC', value: 'CCC', field: 'latestRate' },
  { name: 'CC', value: 'CC', field: 'latestRate' },
  { name: 'C', value: 'C', field: 'latestRate' },

  { name: 'D', value: 'DDD', field: 'latestRate' },
];

/** 评级日期 */
const getYearList = () => {
  const currentYear = dayJs().format('YYYY-MM-DD').split('-')[0];
  let list = [];
  let num = 3;
  while (num > 0) {
    list.push(String(Number(currentYear) - num + 1));
    num--;
  }
  return list;
};

const yearList = getYearList();

const moreSelectors = [
  {
    title: '企业性质',
    hasSelectAll: true,
    multiple: true,
    data: enterpriseNature,
    group: 0,
  },
  {
    title: '债券担保人',
    data: [
      { name: '全部', value: '1,2', field: 'isguarantee' },
      { name: '是', value: 1, field: 'isguarantee' },
      { name: '否', value: 2, field: 'isguarantee' },
    ],
    group: 1,
  },
  {
    title: '地方融资平台',
    data: [
      { name: '全部', value: '1,2', field: 'islgfp' },
      { name: '是', value: 1, field: 'islgfp' },
      { name: '否', value: 2, field: 'islgfp' },
    ],
    group: 2,
  },
  {
    title: '评级机构',
    hasSelectAll: true,
    multiple: true,
    data: [
      { name: '中诚信国际', value: '80002154', field: 'raitingOrgCode' },
      { name: '中诚信评估', value: '80000858', field: 'raitingOrgCode' },
      { name: '中证鹏元', value: '80002099', field: 'raitingOrgCode' },
      { name: '远东资信', value: '80002101', field: 'raitingOrgCode' },
      { name: '联合评级', value: '80129270', field: 'raitingOrgCode' },
      { name: '大公国际', value: '80002192', field: 'raitingOrgCode' },
      { name: '新世纪评级', value: '80062388', field: 'raitingOrgCode' },
      { name: '联合资信', value: '80002172', field: 'raitingOrgCode' },
      { name: '东方金诚', value: '80117870', field: 'raitingOrgCode' },
      { name: '中债资信', value: '80160465', field: 'raitingOrgCode' },
      { name: '上海资信', value: '80087311', field: 'raitingOrgCode' },
      // { name: '穆迪', value: '80065841', field: 'raitingOrgCode' },
      // { name: '标普', value: '80058815', field: 'raitingOrgCode' },
      { name: '标普中国', value: '81625944', field: 'raitingOrgCode' },
      // { name: '惠誉', value: '80065840', field: 'raitingOrgCode' },
    ],
    group: 3,
  },
];

interface DataItem {
  name: string;
  value: string;
}

type ResultDataItem = DataItem | { field: string };

const handleAddDataFiled = (arr: DataItem[], field: string): ResultDataItem[] => {
  return arr.map((item) => ({ ...item, field }));
};

// 处理menu选中的数据成请求的参数
export const handleSelectData = (arr: any[]) => {
  let menuObj: any = {};

  arr.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(menuObj, item.field)) {
      menuObj[item.field] += `,${item.value}`;
    } else {
      menuObj[item.field] = item.value;
    }
  });
  return menuObj;
};

const handleChildren = (arr: string[], field: string) => {
  return arr.map((item: string) => {
    return { name: item, value: item, field };
  });
};

const changeDateList = [
  ...handleChildren(yearList, 'year'),
  {
    name: '近一年',
    value: [dayJs().subtract(1, 'year'), dayJs()],
    field: 'year',
  },
  {
    name: '近三年',
    value: [dayJs().subtract(3, 'year'), dayJs()],
    field: 'year',
  },
  ...dateScreen,
];

// const ratingTypeList = [
//   {
//     name: '不限',
//     value: '2,5',
//     field: 'changeDirection',
//   },
//   {
//     name: '主体评级下调',
//     value: '2',
//     field: 'changeDirection',
//   },
//   {
//     name: '主体评级展望下调',
//     value: '5',
//     field: 'changeDirection',
//   },
// ];

export const menuConfig = [
  // {
  //   title: '评级类型',
  //   option: {
  //     type: ScreenType.SINGLE,
  //     children: ratingTypeList,
  //   },
  // },
  {
    title: '评级',
    option: {
      type: ScreenType.MULTIPLE,
      children: ratingList,
    },
  },
  {
    title: '评级日期',
    option: {
      type: ScreenType.SINGLE,
      children: changeDateList,
    },
  },
  // {
  //   title: '评级类型',
  //   option: {
  //     type: ScreenType.SINGLE,
  //     children: handleAddDataFiled(enterpriseType, 'changeDirection'),
  //   },
  // },
  {
    title: '申万行业',
    option: {
      type: ScreenType.MULTIPLE,
      children: handleAddDataFiled(industryType, 'swIndustryTopLevelCode'),
    },
  },
  // {
  //   title: '地区',
  //   option: {
  //     type: ScreenType.MULTIPLE,
  //     children: handleAddDataFiled(location, 'area'),
  //   },
  // },
  {
    title: '筛选',
    option: {
      type: ScreenType.MULTIPLE_TILING,
      children: moreSelectors, //handleAddDataFiled(province, 'issuerAreaFilterCode'),
    },
  },
];

export const filter = (val: any, type: string) => {
  let str;
  switch (type) {
    case 'enterpriseNature':
      str = enterpriseNature.filter((item) => {
        return item.value === String(val);
      })[0].name;
      break;
    case 'area':
      str = location.filter((item) => {
        return item.value === val;
      });
      str = str.length > 0 ? str[0].name : null;
      break;
  }
  return str;
};
