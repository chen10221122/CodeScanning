import { RenderMode } from '../../useCommonColumn';

const vcColumn = [
  {
    title: '企业名称',
    dataIndex: 'name',
    width: 232,
    align: 'left',
    fixed: 'left',
    renderMode: RenderMode.LinkText,
  },
  {
    title: '披露日期',
    dataIndex: 'publishDate',
    width: 92,
    align: 'left',
  },
  {
    title: '项目',
    dataIndex: 'project',
    width: 128,
    align: 'left',
  },
  {
    title: '主赛道',
    dataIndex: 'mainTrack',
    width: 128,
    align: 'left',
    renderMode: RenderMode.EllipsisByRow,
  },
  {
    title: '细分赛道',
    dataIndex: 'segmentTrack',
    width: 128,
    align: 'left',
    renderMode: RenderMode.EllipsisByRow,
  },
  {
    title: '子赛道',
    dataIndex: 'subTrack',
    width: 128,
    align: 'left',
    renderMode: RenderMode.EllipsisByRow,
  },
  {
    title: '融资轮次',
    dataIndex: 'financingRounds',
    width: 96,
    align: 'center',
  },
  {
    title: '融资金额',
    dataIndex: 'financingAmount',
    width: 110,
    align: 'right',
  },
  {
    title: '注册资本',
    dataIndex: 'registeredCapital',
    width: 110,
    align: 'left',
  },
  {
    title: '成立日期',
    dataIndex: 'foundData',
    width: 92,
  },
  {
    title: '地区',
    dataIndex: 'regionName',
    width: 110,
    sorter: false,
    align: 'left',
  },
  {
    title: '投资方名称',
    dataIndex: 'investorList',
    width: 232,
    sorter: false,
    align: 'left',
    renderMode: RenderMode.EllipsisByText,
  },
].map((o) => ({ ...o, resizable: true }));
export default vcColumn;
