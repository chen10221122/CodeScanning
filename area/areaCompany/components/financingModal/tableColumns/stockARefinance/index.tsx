import { RenderMode } from '../../useCommonColumn';

const stockARefinanceColumn = [
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
    title: '融资类型',
    dataIndex: 'equityType',
    width: 90,
    align: 'center',
  },
  {
    title: '发行日期',
    dataIndex: 'issueDate',
    width: 92,
    align: 'center',
    className: 'no-padding',
  },
  {
    title: '发行价格(元)',
    dataIndex: 'issuePrice',
    width: 111,
    align: 'right',
  },
  {
    title: '发行股数(万股)',
    dataIndex: 'issueStockNum',
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
    title: '募资净额(亿元)',
    dataIndex: 'fundNetAmount',
    width: 124,
    align: 'right',
  },
  {
    title: '上市板块',
    dataIndex: 'listingSector',
    width: 90,
  },
  {
    title: '上市日期',
    dataIndex: 'listingDate',
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
    width: 90,
  },
  {
    title: '证监会行业',
    dataIndex: 'industryName',
    width: 192,
    align: 'left',
  },
  {
    title: '所属地区',
    dataIndex: 'regionName',
    width: 190,
    sorter: false,
    align: 'left',
  },
].map((o) => ({ ...o, resizable: true }));
export default stockARefinanceColumn;
