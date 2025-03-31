import { RenderMode } from '../../useCommonColumn';

const stockADistributionColumn = [
  {
    title: '企业名称',
    dataIndex: 'name',
    width: 260,
    align: 'left',
    fixed: 'left',
    renderMode: RenderMode.LinkText,
  },
  {
    title: '股票代码',
    dataIndex: 'stockCode',
    width: 100,
    align: 'left',
  },
  {
    title: '上市日期',
    dataIndex: 'listingDate',
    width: 92,
    className: 'no-padding',
  },
  {
    title: '上市板块',
    dataIndex: 'listingSector',
    width: 90,
  },
  {
    title: '最新市值(亿元)',
    dataIndex: 'marketValue',
    width: 124,
    align: 'right',
  },
  {
    title: '募资总额(亿元)',
    dataIndex: 'fundAmount',
    width: 124,
    align: 'right',
  },
  {
    title: '企业性质',
    dataIndex: 'companyType',
    width: 90,
  },
  {
    title: '产业类别',
    dataIndex: 'industryType',
    width: 90,
  },
  {
    title: '注册资本',
    dataIndex: 'registeredCapital',
    width: 113,
    align: 'right',
  },
  {
    title: '成立日期',
    dataIndex: 'foundData',
    width: 92,
    align: 'left',
    className: 'no-padding',
  },
  {
    title: '证监会行业',
    dataIndex: 'industryName',
    width: 192,
    align: 'left',
  },
  {
    title: '地区',
    dataIndex: 'regionName',
    width: 190,
    align: 'left',
    sorter: false,
  },
].map((o) => ({ ...o, resizable: true }));
export default stockADistributionColumn;
