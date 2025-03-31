export const column: Record<string, any>[] = [
  {
    title: '公告日期',
    dataIndex: 'declareDate',
    key: 'DeclareDate',
    width: 102,
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    fixed: true,
  },
  {
    title: '公司名称',
    dataIndex: 'enterpriseName',
    key: 'ITNamePinyinInitial',
    width: 340,
    sorter: true,
    fixed: true,
    align: 'left',
  },
  {
    title: '数据来源',
    dataIndex: 'dataSources',
    key: 'Source_sort',
    width: 218,
    sorter: true,
    align: 'left',
  },
  {
    title: '原文',
    dataIndex: 'detail',
    key: 'detail',
    width: 49,
  },
  {
    title: '登记状态',
    dataIndex: 'registrationStatus',
    key: 'RegistrationStatus_sort',
    width: 87,
    sorter: true,
  },
  {
    title: '上市/发债',
    dataIndex: 'listed',
    key: 'market_sort',
    width: 127,
    sorter: true,
  },
  {
    title: '列入日期',
    dataIndex: 'inclusionDate',
    key: 'BeginDate',
    width: 102,
    sorter: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: '截止日期',
    dataIndex: 'closingDate',
    key: 'EndDate',
    width: 102,
    sorter: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: '法定代表人',
    dataIndex: 'legalRepresentative',
    key: 'CR0001_004_sort',
    width: 102,
    sorter: true,
    align: 'left',
  },
  {
    title: '成立日期',
    dataIndex: 'establishmentTime',
    key: 'RegDate',
    width: 102,
    sorter: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: '注册资本',
    dataIndex: 'registeredCapital',
    key: 'CR0001_005_sort',
    width: 90,
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    align: 'right',
  },
  {
    title: '国标行业门类',
    dataIndex: 'industryName1',
    key: 'IndustryName_sort',
    width: 192,
    sorter: true,
    align: 'left',
  },
  {
    title: '国标行业大类',
    dataIndex: 'industryName2',
    key: 'IndustryName2_sort',
    width: 205,
    sorter: true,
    align: 'left',
  },
  {
    title: '国标行业中类',
    dataIndex: 'industryName3',
    key: 'IndustryName3_sort',
    width: 192,
    sorter: true,
    align: 'left',
  },
  {
    title: '国标行业细类',
    dataIndex: 'industryName4',
    key: 'IndustryName4_sort',
    width: 192,
    sorter: true,
    align: 'left',
  },
  {
    title: '所属省',
    dataIndex: 'province',
    key: 'RegionName_sort',
    width: 77,
    sorter: true,
  },
  {
    title: '所属市',
    dataIndex: 'city',
    key: 'RegionName2_sort',
    width: 114,
    sorter: true,
  },
  {
    title: '所属区县',
    dataIndex: 'country',
    key: 'RegionName3_sort',
    width: 114,
    sorter: true,
  },
];

/** 弹窗和页面之间的间距，默认为60 */
export const MODALTOPAGETOP = 60;

/** 表格上方搜索高度 */
export const MODALTABLESEARCHHEIGHT = 40;

/** 两个标题之间的间距 */
export const TITLEMARIGINHEIGHT = 6;

/** 弹窗底部的安全距离 */
export const MODALFOOTERHEIGHT = 32;
