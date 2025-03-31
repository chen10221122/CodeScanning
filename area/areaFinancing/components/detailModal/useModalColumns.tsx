import { useMemo } from 'react';

import { isEmpty } from 'lodash';

import { Flex } from '@/components/layout';
import IconIntro from '@/pages/area/areaFinancing/components/iconIntro';
import useCommonColumn, { RenderMode } from '@/pages/area/areaFinancing/hooks/useCommonColumn';
import { DetailModalTypeEnum } from '@/pages/area/areaFinancing/types';

import S from '../../style.module.less';

export interface ModalProps {
  columnType?: DetailModalTypeEnum;
  condition: any;
}

const useModalColumns = ({ columnType = DetailModalTypeEnum.StockA, condition }: ModalProps) => {
  const sortInfo = useMemo(() => {
    return { sortKey: condition.sortKey, sortRule: condition.sortRule };
  }, [condition.sortKey, condition.sortRule]);
  const { makeColumns } = useCommonColumn(sortInfo);

  // 序号列
  const idxColumn = useMemo(
    () => ({
      title: '序号',
      dataIndex: 'rowIndex',
      width: Math.max(`${Number(condition.from) + 50}`.length * 13 + 16, 42),
      fixed: 'left',
      sorter: false,
      className: 'pdd-8',
    }),
    [condition.from],
  );
  // 地区列
  const areaInfoColumn = [
    {
      title: '地区',
      dataIndex: 'regionName',
      width: 150,
      align: 'left',
      sorter: false,
      render: (data: string, row: any) => {
        const res = [data, row.regionName2, row.regionName3].some((o) => !isEmpty(o))
          ? `${data}${row.regionName2 ? '-' + row.regionName2 : ''}${row.regionName3 ? '-' + row.regionName3 : ''}`
          : '-';
        return (
          <div title={res} className={S.overflow}>
            {res}
          </div>
        );
      },
    },
  ];
  // 区域A股融资明细
  const areaStockAColumn = [
    idxColumn,
    {
      title: '企业名称',
      dataIndex: 'itname',
      width: 230,
      align: 'left',
      fixed: 'left',
      renderMode: RenderMode.LinkText,
    },
    {
      title: '股票代码',
      dataIndex: 'Symbol',
      width: 120,
      align: 'left',
    },
    {
      title: '融资类型',
      dataIndex: 'EQ0062_004',
      width: 88,
    },
    {
      title: '发行日期',
      dataIndex: 'EQ0062_005',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '发行价格(元)',
      dataIndex: 'EQ0062_007',
      align: 'right',
      width: 110,
    },
    {
      title: '发行股数(万股)',
      dataIndex: 'EQ0062_008',
      width: 124,
      align: 'right',
    },
    {
      title: '募资总额(亿元)',
      dataIndex: 'EQ0062_009',
      width: 124,
      align: 'right',
    },
    {
      title: '募资净额(亿元)',
      dataIndex: 'EQ0062_010',
      width: 124,
      align: 'right',
    },
    {
      title: '上市板块',
      dataIndex: 'EQ0062_002',
      width: 88,
      align: 'left',
    },
    {
      title: '上市日期',
      dataIndex: 'EQ0062_006',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '注册资本',
      dataIndex: 'CR0194_009',
      width: 118,
      align: 'right',
    },
    {
      title: '成立日期',
      dataIndex: 'CR0194_005',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '证监会行业',
      dataIndex: 'CR0194_020',
      width: 154,
      align: 'left',
    },
    ...areaInfoColumn,
  ];
  // 上市平台统计明细
  const areaPlatformColumn = [
    idxColumn,
    {
      title: '企业名称',
      dataIndex: 'itname',
      width: 230,
      align: 'left',
      fixed: 'left',
      renderMode: RenderMode.LinkText,
    },
    {
      title: '股票代码',
      dataIndex: 'Symbol',
      width: 120,
      align: 'left',
    },
    {
      title: '上市日期',
      dataIndex: 'EQ0062_006',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '上市板块',
      dataIndex: 'EQ0062_002',
      width: 88,
    },
    {
      title: '最新市值(亿元)',
      dataIndex: 'EQ9107_007',
      width: 122,
      align: 'right',
    },
    {
      title: '募资总额(亿元)',
      dataIndex: 'EQ0062_009',
      width: 122,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '企业性质',
      dataIndex: 'entType',
      width: 96,
    },
    {
      title: '产业类别',
      dataIndex: 'industryType',
      width: 100,
    },
    {
      title: '注册资本',
      dataIndex: 'CR0194_009',
      width: 116,
      align: 'right',
    },
    {
      title: '成立日期',
      dataIndex: 'CR0194_005',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '证监会行业',
      dataIndex: 'CR0194_020',
      width: 152,
      align: 'left',
    },
    ...areaInfoColumn,
  ];
  // IPO储备统计明细
  const ipoColumn = [
    idxColumn,
    {
      title: '企业名称',
      dataIndex: 'ITName',
      width: 230,
      align: 'left',
      fixed: 'left',
      renderMode: RenderMode.LinkText,
    },
    condition?.state === '1'
      ? {
          title: '备案日期',
          dataIndex: 'IT0074_002',
          width: 90,
          className: 'no-padding',
        }
      : {
          title: '最新公告日',
          dataIndex: 'IT0074_004',
          width: 90,
          className: 'no-padding',
        },
    {
      title: '拟上市板块',
      dataIndex: 'IT0074_001',
      width: 102,
    },
    {
      title: '成立日期',
      dataIndex: 'CR0194_005',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '注册资本',
      dataIndex: 'CR0194_009',
      width: 106,
      align: 'right',
    },
    {
      title: '证监会行业',
      dataIndex: 'IT0020_001',
      width: 152,
      align: 'left',
    },
    ...areaInfoColumn,
  ];
  // 区域H股融资统计明细
  const areaHKColumn = [
    idxColumn,
    {
      title: '企业名称',
      dataIndex: 'ITName',
      width: 230,
      fixed: 'left',
      align: 'left',
      renderMode: RenderMode.LinkText,
    },
    {
      title: '股票代码',
      dataIndex: 'Symbol',
      width: 120,
      align: 'left',
    },
    {
      title: '融资类型',
      dataIndex: 'HK0015_001',
      width: 88,
    },
    {
      title: '上市板块',
      dataIndex: 'HK0015_002',
      width: 90,
    },
    {
      title: '发行日期',
      dataIndex: 'HK0015_003',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '发行价格',
      dataIndex: 'HK0015_005',
      width: 110,
      align: 'right',
    },
    {
      title: '发行股数(万股)',
      dataIndex: 'HK0015_007',
      width: 120,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '募资总额',
      dataIndex: 'HK0015_008',
      width: 134,
      align: 'right',
    },
    {
      title: (
        <Flex>
          募资总额(亿元人民币)
          <IconIntro content={'按照发行日的汇率中间价换算成人民币'} />
        </Flex>
      ),
      dataIndex: 'ipoAmount',
      width: 174,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '上市日期',
      dataIndex: 'HK0015_010',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '注册资本',
      dataIndex: 'CR0194_009',
      width: 110,
      align: 'right',
    },
    {
      title: '成立日期',
      dataIndex: 'CR0194_005',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '证监会行业',
      dataIndex: 'IT0020_001',
      width: 152,
      align: 'left',
    },
    ...areaInfoColumn,
  ];
  // 区域新三板融资优先股统计明细
  const areaStockThirdPriorityColumn = [
    idxColumn,
    {
      title: '企业名称',
      dataIndex: 'ITName',
      width: 230,
      align: 'left',
      fixed: 'left',
      renderMode: RenderMode.LinkText,
    },
    {
      title: '市场分层',
      dataIndex: 'EQ0063_004',
      width: 88,
    },
    {
      title: '股票代码',
      dataIndex: 'Symbol',
      width: 146,
      renderMode: RenderMode.StockCode,
    },
    {
      title: '发行日期',
      dataIndex: 'EQ0064_002',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '优先股代码',
      dataIndex: 'EQ0064_010',
      width: 88,
    },
    {
      title: '优先股简称',
      dataIndex: 'EQ0064_011',
      width: 100,
    },
    {
      title: '计息起始日',
      dataIndex: 'EQ0064_012',
      width: 100,
      className: 'no-padding',
    },
    {
      title: '挂牌转让日',
      dataIndex: 'EQ0064_013',
      width: 100,
      className: 'no-padding',
    },
    {
      title: '发行价格(元)',
      dataIndex: 'EQ0064_003',
      width: 110,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '发行数量(万股)',
      dataIndex: 'EQ0064_005',
      width: 120,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '募资总额(万元)',
      dataIndex: 'EQ0064_006',
      width: 120,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '初始票面股息率',
      dataIndex: 'EQ0073_010',
      width: 130,
    },
    ...areaInfoColumn,
  ];
  // 区域新三板融资定向增发
  const areaStockThirdPlusColumn = [
    idxColumn,
    {
      title: '企业名称',
      dataIndex: 'ITName',
      width: 230,
      align: 'left',
      fixed: 'left',
      renderMode: RenderMode.LinkText,
    },
    {
      title: '市场分层',
      dataIndex: 'EQ0063_004',
      width: 90,
    },
    {
      title: '股票代码',
      dataIndex: 'Symbol',
      width: 146,
      renderMode: RenderMode.StockCode,
    },
    {
      title: '发行日期',
      dataIndex: 'EQ0064_002',
      width: 90,
      className: 'no-padding',
    },

    {
      title: '增发股份上市日',
      dataIndex: 'EQ0064_008',
      width: 140,
    },
    {
      title: '增发价格(元)',
      dataIndex: 'EQ0064_003',
      width: 110,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '增发数量(万股)',
      dataIndex: 'EQ0064_005',
      width: 125,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '募资总额(万元)',
      dataIndex: 'EQ0064_006',
      width: 125,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '发行对象',
      dataIndex: 'EQ0064_009',
      width: 200,
      align: 'left',
      sorter: false,
    },
    {
      title: '证监会行业',
      dataIndex: 'IT0020_001',
      width: 152,
      align: 'left',
    },
    ...areaInfoColumn,
  ];
  // 区域创投融资统计明细
  const areaVcColumn = [
    idxColumn,
    {
      title: '企业名称',
      dataIndex: 'ITName',
      width: 230,
      align: 'left',
      fixed: 'left',
      renderMode: RenderMode.LinkText,
      style: { WebkitLineClamp: '3' },
    },
    {
      title: '披露日期',
      dataIndex: 'PPE0001_005',
      width: 90,
      align: 'center',
      className: 'no-padding',
    },
    {
      title: '项目',
      dataIndex: 'IT7007_001',
      width: 114,
      align: 'left',
    },
    {
      title: '主赛道',
      dataIndex: 'cr0275_002',
      width: 122,
      align: 'left',
      renderMode: RenderMode.EllipsisByRow,
    },
    {
      title: '细分赛道',
      dataIndex: 'cr0275_005',
      width: 122,
      align: 'left',
      renderMode: RenderMode.EllipsisByRow,
    },
    {
      title: '子赛道',
      dataIndex: 'cr0275_008',
      width: 122,
      align: 'left',
      renderMode: RenderMode.EllipsisByRow,
    },
    {
      title: '融资轮次',
      dataIndex: 'PPE0001_001',
      width: 88,
      align: 'center',
    },
    {
      title: '融资金额',
      dataIndex: 'PPE0001_002',
      width: 106,
      align: 'left',
    },
    {
      title: '注册资本',
      dataIndex: 'CR0001_005',
      width: 106,
      align: 'right',
    },
    {
      title: '成立日期',
      dataIndex: 'CR0001_002',
      width: 90,
      align: 'center',
      className: 'no-padding',
    },
    {
      title: '地区',
      dataIndex: 'RegionName',
      width: 154,
      align: 'left',
      sorter: false,
      render: (data: string, row: any) => {
        const res = [data, row.RegionName2, row.RegionName3].some((o) => !isEmpty(o))
          ? `${data}${row.RegionName2 ? '-' + row.RegionName2 : ''}${row.RegionName3 ? '-' + row.RegionName3 : ''}`
          : '-';
        return <div title={res}>{res}</div>;
      },
    },
    {
      title: '投资方名称',
      dataIndex: 'investITName',
      width: 240,
      align: 'left',
      renderMode: RenderMode.EllipsisByText,
    },
  ];

  const columnMap = new Map([
    [DetailModalTypeEnum.StockA, makeColumns(areaStockAColumn)],
    [DetailModalTypeEnum.AreaPlatform, makeColumns(areaPlatformColumn)],
    [DetailModalTypeEnum.Ipo, makeColumns(ipoColumn)],
    [
      DetailModalTypeEnum.HK,
      makeColumns(condition?.financeType !== '1' ? areaHKColumn.filter((o) => o.title !== '上市板块') : areaHKColumn),
    ],
    [DetailModalTypeEnum.StockThirdPriority, makeColumns(areaStockThirdPriorityColumn)],
    [DetailModalTypeEnum.StockThirdPlus, makeColumns(areaStockThirdPlusColumn)],
    [DetailModalTypeEnum.Vc, makeColumns(areaVcColumn)],
  ]);
  return columnMap.get(columnType) || [];
};

export default useModalColumns;
