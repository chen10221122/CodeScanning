// 水平单选
export const HORIZONTAL_SINGLE = 0;
// 水平多选
export const HORIZONTAL_MULTIPLE = 1;
// 垂直单选
export const VERTICAL_SINGLE = 3;
// 垂直多选
export const VERTICAL_MULTIPLE = 4;
// 日期选择
export const DATEPICKER = 5;
// 水平布局
export const HORIZONTAL = 6;
// 垂直布局
export const VERTICAL = 7;

export const configuation = [
  { name: '债券类型', type: HORIZONTAL, listType: HORIZONTAL_MULTIPLE, hasSelectAll: true, selectAllName: '全部' },
  { name: '市场', type: HORIZONTAL, listType: HORIZONTAL_SINGLE, hasSelectAll: false, selectAllName: '' },
  { name: '违约原因', type: HORIZONTAL, listType: HORIZONTAL_MULTIPLE, hasSelectAll: true, selectAllName: '全部' },
  { name: '行业', type: HORIZONTAL, listType: HORIZONTAL_MULTIPLE, hasSelectAll: true, selectAllName: '全部' },
  { name: '地区', type: HORIZONTAL, listType: HORIZONTAL_MULTIPLE, hasSelectAll: true, selectAllName: '全部' },
  { name: '自选组合', type: HORIZONTAL, listType: HORIZONTAL_SINGLE, hasSelectAll: false, selectAllName: '' },
  { name: '企业性质', type: HORIZONTAL, listType: HORIZONTAL_MULTIPLE, hasSelectAll: true, selectAllName: '全部' },
  { name: '城投债', type: HORIZONTAL, listType: HORIZONTAL_MULTIPLE, hasSelectAll: true, selectAllName: '全部' },
  { name: '担保', type: HORIZONTAL, listType: HORIZONTAL_MULTIPLE, hasSelectAll: true, selectAllName: '全部' },
];

export default [
  {
    name: '债券类型',
    list: [
      { name: '企业债', value: '企业债' },
      { name: '公司债', value: '公司债' },
      { name: '中期票据', value: '中期票据' },
      { name: '短期融资券', value: '一般短期融资券' },
      { name: '超短期融资券', value: '超短期融资券' },
      { name: '项目收益票据', value: '项目收益票据' },
      { name: '集合债', value: '集合债' },
      { name: '集合票据', value: '集合票据' },
      { name: '私募债', value: '私募债' },
      { name: '定向工具PPN', value: '定向工具PPN' },
      { name: '可转换债券', value: '可转换债券' },
      { name: '可交换债券', value: '可交换债券' },
      { name: '分离式可转债', value: '分离式可转债' },
      { name: '资产支持证券', value: '资产支持证券' },
      { name: '资产支持票据', value: '资产支持票据' },
    ],
    key: 'bondType',
  },
  {
    name: '筛选',
    list: [
      {
        name: '市场',
        list: [
          { name: '全部', value: 'ALLTYPE' },
          { name: '银行间', value: 'CNIBEX' },
          { name: '上交所', value: 'CNSESH,CNETPF' },
          { name: '深交所', value: 'CNSESZ,CNSZCP' },
          { name: '机构间报价', value: 'CNIOTC' },
          {
            name: '其他',
            value:
              'CNNCIM,CNCONT,CNOTJS,CNOSEE,CNOCST,CNOZJE,CNOGZE,CNOHEE,CNOQLE,CNOLNE,CNOWHE,CNOQHE,CNSETO,CNOXJE,CNOGSE,CNOBJE,CNOJSE,CNOHXE,CNOGDE,CNOAHE,CNOGHE',
          },
        ],
        key: 'market',
      },
      {
        name: '违约原因',
        list: [
          { name: '无法兑付', value: '3' },
          { name: '交叉违约', value: '2' },
          { name: '技术性违约', value: '4' },
          { name: '其他', value: '1' },
        ],
        key: 'reason',
      },
      {
        name: '行业',
        list: [
          { name: '农林牧渔', value: '110000' },
          { name: '采掘', value: '210000' },
          { name: '化工', value: '220000' },
          { name: '钢铁', value: '230000' },
          { name: '有色金属', value: '240000' },
          { name: '电子', value: '270000' },
          { name: '汽车', value: '280000' },
          { name: '家用电器', value: '330000' },
          { name: '食品饮料', value: '340000' },
          { name: '纺织服装', value: '350000' },
          { name: '轻工制造', value: '360000' },
          { name: '医药生物', value: '370000' },
          { name: '公用事业', value: '410000' },
          { name: '交通运输', value: '420000' },
          { name: '房地产', value: '430000' },
          { name: '商业贸易', value: '450000' },
          { name: '休闲服务', value: '460000' },
          { name: '银行', value: '480000' },
          { name: '非银金融', value: '490000' },
          { name: '综合', value: '510000' },
          { name: '建筑材料', value: '610000' },
          { name: '建筑装饰', value: '620000' },
          { name: '电气设备', value: '630000' },
          { name: '机械设备', value: '640000' },
          { name: '国防军工', value: '650000' },
          { name: '计算机', value: '710000' },
          { name: '传媒', value: '720000' },
          { name: '通信', value: '730000' },
        ],
        key: 'industry_code',
      },
      {
        name: '地区',
        list: [
          { name: '北京', value: '1100' },
          { name: '天津', value: '1200' },
          { name: '河北', value: '1300' },
          { name: '山西', value: '1400' },
          { name: '内蒙古', value: '1500' },
          { name: '辽宁', value: '2100' },
          { name: '吉林', value: '2200' },
          { name: '黑龙江', value: '2300' },
          { name: '上海', value: '3100' },
          { name: '江苏', value: '3200' },
          { name: '浙江', value: '3300' },
          { name: '安徽', value: '3400' },
          { name: '福建', value: '3500' },
          { name: '江西', value: '3600' },
          { name: '山东', value: '3700' },
          { name: '河南', value: '4100' },
          { name: '湖北', value: '4200' },
          { name: '湖南', value: '4300' },
          { name: '广东', value: '4400' },
          { name: '广西', value: '4500' },
          { name: '海南', value: '4600' },
          { name: '重庆', value: '5000' },
          { name: '四川', value: '5100' },
          { name: '贵州', value: '5200' },
          { name: '云南', value: '5300' },
          { name: '西藏', value: '5400' },
          { name: '陕西', value: '6100' },
          { name: '甘肃', value: '6200' },
          { name: '青海', value: '6300' },
          { name: '宁夏', value: '6400' },
          { name: '新疆', value: '6500' },
        ],
        key: 'area',
      },
      {
        name: '企业性质',
        list: [
          { name: '央企', value: '1' },
          { name: '地方国企', value: '2' },
          { name: '其他国企', value: '3' },
          { name: '民营企业', value: '4' },
          { name: '集体企业', value: '5' },
          { name: '外资企业', value: '6' },
          { name: '中外合资企业', value: '7' },
        ],
        key: 'enterprise_property',
      },
      {
        name: '城投债',
        list: [
          { name: '是', value: '1' },
          { name: '否', value: '0' },
        ],
        key: 'is_municipal',
      },
      {
        name: '担保',
        list: [
          { name: '有', value: '1' },
          { name: '无', value: '0' },
        ],
        key: 'is_guarantee',
      },
    ],
    key: 'screen',
  },
  {
    name: '排序',
    list: [
      { name: '最新违约日期降序', value: '1' },
      { name: '累计违约金额降序', value: '2' },
    ],
    key: 'sort',
  },
];
