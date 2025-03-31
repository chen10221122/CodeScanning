import { Icon } from '@dzh/components';
import styled from 'styled-components';

import ChartInTable from '@/pages/area/areaF9/modules/regionalOverview/monitoring/components/chartInTable';
import TextOverWithMore from '@/pages/area/areaF9/modules/regionalOverview/monitoring/components/textOverWithMore';
import Progress from '@/pages/publicOpinionPages/monitoring/components/progress';
import { TableInnerSkeleton } from '@/pages/publicOpinionPages/monitoring/components/skeleton';
import {
  renderColor,
  getColorImage,
  ColumnItemType,
} from '@/pages/publicOpinionPages/monitoring/components/table/config';
import { TextOverWithTag } from '@/pages/publicOpinionPages/monitoring/components/table/textOverflow';
import { COMPANYTYPEENUMS } from '@/pages/publicOpinionPages/monitoring/config';

/** 固定的companyType */
export const STATIC_COMPANYTYPE = COMPANYTYPEENUMS.ALL;
/** 固定的标题 */
export const STATIC_TITLE = '全部';

export const getColumnSubItem: (props: {
  curSkip: string;
  keyword?: string;
  specialCompany?: boolean;
}) => ColumnItemType[] = ({ curSkip, keyword, specialCompany }) => [
  {
    title: 'NO.',
    dataIndex: 'idx',
    key: 'idx',
    // width: 39 + (curSkip.length - 2) * 13,
    width: 47,
    align: 'center',
    fixed: 'left',
    className: 'pd-8 fontSize-12',
    shouldCellUpdate: (prev, next) => {
      return prev['idx'] !== next['idx'];
    },
    render(text: string) {
      return <>{Number(text) < 4 ? <Icon size={17} image={getColorImage(text)} /> : text}</>;
    },
  },
  {
    title: '企业名称',
    dataIndex: 'companyName',
    key: 'companyName',
    width: 322, // 322 / 1088
    // width: '29.595%',
    fixed: 'left',
    render(text: string, row: Record<string, any>) {
      return text ? (
        <TextOverWithTag
          keyword={keyword}
          text={`${text}${specialCompany && row.obj ? `(${row.obj})` : ''}`}
          row={row}
          tagsCount={6}
        />
      ) : (
        '-'
      );
    },
  },
  {
    title: '最新',
    dataIndex: 'riskIndexDayLatest',
    key: 'riskIndexDayLatest',
    width: 67,
    sorter: true,
    resizable: true,
    shouldCellUpdate: (prev, next) => {
      return prev['riskIndexDayLatest'] !== next['riskIndexDayLatest'];
    },
    render(text: string, row: Record<string, any>) {
      return <Progress text={text} row={row} />;
    },
  },
  {
    title: '日变动',
    dataIndex: 'riskIndexDayChange',
    key: 'riskIndexDayChange',
    width: 79,
    sorter: true,
    align: 'right',
    resizable: true,
    shouldCellUpdate: (prev, next) => {
      return prev['riskIndexDayChange'] !== next['riskIndexDayChange'];
    },
    render: renderColor,
  },
  {
    title: '周变动',
    dataIndex: 'riskIndexWeekChange',
    key: 'riskIndexWeekChange',
    width: 79,
    sorter: true,
    align: 'right',
    resizable: true,
    shouldCellUpdate: (prev, next) => {
      return prev['riskIndexWeekChange'] !== next['riskIndexWeekChange'];
    },
    render: renderColor,
  },
  {
    title: '月变动',
    dataIndex: 'riskIndexMonthChange',
    key: 'riskIndexMonthChange',
    width: 79,
    sorter: true,
    align: 'right',
    resizable: true,
    shouldCellUpdate: (prev, next) => {
      return prev['riskIndexMonthChange'] !== next['riskIndexMonthChange'];
    },
    render: renderColor,
  },
  {
    title: (
      <TrendTitle>
        <span>趋势</span>
        <Icon image={require('@/assets/images/common/new_vip.svg')} size={12} className="vip-icon" />
      </TrendTitle>
    ),
    dataIndex: 'trend',
    key: 'trend',
    width: 94,
    align: 'center',
    className: 'pd-8 trend-pd',
    resizable: true,
    render(info: Record<string, any>, row: Record<string, any>) {
      return info ? (
        info.trendList && info.trendList.length ? (
          <ChartInTable data={info.trendList} row={row} />
        ) : (
          '-'
        )
      ) : (
        <TableInnerSkeleton />
      );
    },
  },
  {
    title: '近6个月重要负面',
    dataIndex: 'negativeInfo',
    key: 'negativeInfo',
    width: 413,
    // width: '37.96%',
    align: 'left',
    // UI说可无限拖拽
    resizable: { min: 30, max: 20000 },
    render(info: Record<string, any>, row: Record<string, any>) {
      return info ? <TextOverWithMore row={row} text={info.title} /> : <TableInnerSkeleton />;
    },
  },
  { title: '', dataIndex: 'blank', key: 'blank' },
];

const TrendTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .vip-icon {
    margin-left: 1px;
  }
`;
