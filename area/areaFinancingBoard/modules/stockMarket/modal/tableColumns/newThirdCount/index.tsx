import { RenderMode } from '@/pages/area/areaFinancingBoard/modules/stockMarket/modal/useCommonColumn';

const newThirdCountColumn = [
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
    title: '市场分层',
    dataIndex: 'listingSector',
    width: 90,
  },
  {
    title: '交易方式',
    dataIndex: 'trading',
    width: 90,
  },
  {
    title: '挂牌日期',
    dataIndex: 'listingDate',
    className: 'no-padding',
    width: 92,
  },
  {
    title: '最新股份总量(万股)',
    dataIndex: 'stockAmount',
    width: 150,
    align: 'right',
  },
  {
    title: '募资总额(万元)',
    dataIndex: 'fundAmount',
    width: 125,
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
    title: '成立日期',
    dataIndex: 'foundData',
    className: 'no-padding',
    width: 92,
  },
  {
    title: '注册资本',
    dataIndex: 'registeredCapital',
    width: 113,
    align: 'right',
  },
  {
    title: '所属地区',
    dataIndex: 'regionName',
    width: 190,
    sorter: false,
    align: 'left',
  },
].map((o) => ({ ...o, resizable: true }));
export default newThirdCountColumn;
