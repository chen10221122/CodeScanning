import { useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import { pick } from 'lodash';

import { DetailModalTypeEnum } from '@pages/area/areaCompany/components/financingModal/type';
import useCommonColumn from '@pages/area/areaCompany/module/stockFinancing/templatePage/useCommonColumn';
import { calcPercentage } from '@pages/area/areaFinancing/utils';

import { useConditionCtx } from './context';
import S from './style.module.less';
import { TableColumnType } from './type';

/*const emptyFilter = (val: any) => {
  return val ? val : '-';
};*/
interface IProps {
  // 债券融资类型
  tableType: TableColumnType;
  tableData?: any;
}
// 设计稿每列宽度
const designColumnWidthObj = {
  index: 42,
  count: 108,
};

export default function useTableColumns({ tableType }: IProps) {
  const {
    state: { condition, page },
    update,
  } = useConditionCtx();
  const { makeColumns, indexColumn } = useCommonColumn({
    page,
    sortInfo: { sortKey: condition?.sortKey, sortRule: condition?.sortRule },
  });
  // 计算出实际的表格设计稿宽度
  const tableWidthRef = useRef(1014);
  // 点击出弹窗
  const handleModalClick = useMemoizedFn(({ title, modalType, defaultCondition, row }: any) => {
    update((d) => {
      d.visible = true;
      d.detailModalConfig.title = title;
      d.detailModalConfig.modalType = modalType;
      // 各列详情默认入参不同
      switch (modalType) {
        case DetailModalTypeEnum.StockAIpo:
        case DetailModalTypeEnum.StockARefinance:
        case DetailModalTypeEnum.NewThirdAdd:
        case DetailModalTypeEnum.VC:
          d.detailModalConfig.defaultCondition = Object.assign({
            sortRule: 'desc',
            sortKey: modalType === DetailModalTypeEnum.VC ? 'publishDate' : 'issueDate',
            ...pick(condition, 'provinceCode', 'cityCode', 'countyCode', 'companyType'),
            ...defaultCondition,
            year: row.year === '合计' ? `[${condition?.startYear}0101,${condition?.endYear}1231]` : row.year,
          });
          break;
        default:
          d.detailModalConfig.defaultCondition = Object.assign({
            sortRule: 'desc',
            sortKey: [DetailModalTypeEnum.StockADistribution].includes(modalType) ? 'listingDate' : 'listingDate',
            ...pick(condition, 'companyType', 'provinceCode', 'cityCode', 'countyCode'),
            ...defaultCondition,
            endYear: row.year,
          });
          break;
      }
    });
  });

  const makeChildrenColumn = ({ modalType, arr }: { modalType: DetailModalTypeEnum; arr: any[] }) => {
    return arr.map((o) => {
      return {
        title: o.title,
        dataIndex: o.dataIndex,
        width: calcPercentage(designColumnWidthObj.count, tableWidthRef.current),
        align: 'right',
        sorter: false,
        render: (v: any, item: any) => {
          if (Number(v) === 0) return '0';
          const val = v ? v : '-';
          return (
            <div
              onClick={() => {
                if (val && val !== '-') {
                  let title =
                    modalType === DetailModalTypeEnum.StockADistribution ? 'A股上市公司分布明细' : '新三板挂牌家数明细';
                  handleModalClick({
                    title,
                    modalType: modalType,
                    row: item,
                    defaultCondition: o.defaultCondition,
                  });
                }
              }}
              className={val && val !== '-' ? S.cursorText : ''}
            >
              {val ? val : '-'}
            </div>
          );
        },
      };
    });
  };
  const getPlateColumns = useMemoizedFn(() => {
    let restColumns: Record<string, any>[] = [
      {
        name: 'A股上市公司家数(累计)',
        modalType: DetailModalTypeEnum.StockADistribution,
        children: [
          { title: '合计', dataIndex: 'oneTypeSum', defaultCondition: { listingSector: '' } },
          { title: '主板', dataIndex: 'oneTypeFirst', defaultCondition: { listingSector: '沪市主板,深市主板' } },
          { title: '创业板', dataIndex: 'oneTypeSecond', defaultCondition: { listingSector: '创业板' } },
          { title: '科创板', dataIndex: 'oneTypeThird', defaultCondition: { listingSector: '科创板' } },
          { title: '北交所', dataIndex: 'oneTypeFour', defaultCondition: { listingSector: '北交所' } },
        ],
      },
      {
        name: '新三板挂牌家数(累计)',
        modalType: DetailModalTypeEnum.NewThirdCount,
        children: [
          { title: '合计', dataIndex: 'twoTypeSum', defaultCondition: { listingSector: '' } },
          { title: '基础层', dataIndex: 'twoTypeFirst', defaultCondition: { listingSector: '2' } },
          { title: '创新层', dataIndex: 'twoTypeSecond', defaultCondition: { listingSector: '1' } },
        ],
      },
    ];
    return restColumns.map((o: Record<string, any>) => {
      return {
        title: o.name,
        children: makeChildrenColumn({
          modalType: o.modalType,
          arr: o.children,
        }),
      };
    });
  });
  const getNatureColumns = useMemoizedFn(() => {
    let restColumns: Record<string, any>[] = [
      {
        name: 'A股上市公司家数(累计)',
        modalType: DetailModalTypeEnum.StockADistribution,
        children: [
          { title: '合计', dataIndex: 'oneTypeSum', defaultCondition: { companyType: '' } },
          { title: '国有企业', dataIndex: 'oneTypeFirst', defaultCondition: { companyType: '国有企业' } },
          { title: '民营企业', dataIndex: 'oneTypeSecond', defaultCondition: { companyType: '民营企业' } },
          { title: '其他', dataIndex: 'oneTypeThird', defaultCondition: { companyType: '其他' } },
        ],
      },
      {
        name: '新三板挂牌家数(累计)',
        modalType: DetailModalTypeEnum.NewThirdCount,
        children: [
          { title: '合计', dataIndex: 'twoTypeSum', defaultCondition: { companyType: '' } },
          { title: '国有企业', dataIndex: 'twoTypeFirst', defaultCondition: { companyType: '国有企业' } },
          { title: '民营企业', dataIndex: 'twoTypeSecond', defaultCondition: { companyType: '民营企业' } },
          { title: '其他', dataIndex: 'twoTypeThird', defaultCondition: { companyType: '其他' } },
        ],
      },
    ];
    return restColumns.map((o: Record<string, any>) => {
      return {
        title: o.name,
        children: makeChildrenColumn({
          modalType: o.modalType,
          arr: o.children,
        }),
      };
    });
  });
  const getIndustryColumns = useMemoizedFn(() => {
    let restColumns: Record<string, any>[] = [
      {
        name: 'A股上市公司家数(累计)',
        modalType: DetailModalTypeEnum.StockADistribution,
        children: [
          { title: '合计', dataIndex: 'oneTypeSum', defaultCondition: { industryType: '' } },
          { title: '第一产业', dataIndex: 'oneTypeFirst', defaultCondition: { industryType: '1' } },
          { title: '第二产业', dataIndex: 'oneTypeSecond', defaultCondition: { industryType: '2' } },
          { title: '第三产业', dataIndex: 'oneTypeThird', defaultCondition: { industryType: '3' } },
        ],
      },
      {
        name: '新三板挂牌家数(累计)',
        modalType: DetailModalTypeEnum.NewThirdCount,
        children: [
          { title: '合计', dataIndex: 'twoTypeSum', defaultCondition: { industryType: '' } },
          { title: '第一产业', dataIndex: 'twoTypeFirst', defaultCondition: { industryType: '1' } },
          { title: '第二产业', dataIndex: 'twoTypeSecond', defaultCondition: { industryType: '2' } },
          { title: '第三产业', dataIndex: 'twoTypeThird', defaultCondition: { industryType: '3' } },
        ],
      },
    ];
    return restColumns.map((o: Record<string, any>) => {
      return {
        title: o.name,
        children: makeChildrenColumn({
          modalType: o.modalType,
          arr: o.children,
        }),
      };
    });
  });
  // 股权融资规模统计
  const getStockScaleColumns = useMemoizedFn(() => {
    const commonChildren = [
      { title: '新增家数', width: 80 },
      { title: '新增融资额(亿元)', width: 122 },
    ];
    let restColumns: Record<string, any>[] = [
      {
        name: 'A股IPO',
        modalType: DetailModalTypeEnum.StockAIpo,
        dataIndex: 'aShareIPO',
        defaultCondition: { equityType: 'IPO' },
        children: commonChildren,
      },
      {
        name: 'A股再融资',
        modalType: DetailModalTypeEnum.StockARefinance,
        dataIndex: 'aShareRefinance',
        defaultCondition: { equityType: '公开增发,定向增发,配股' },
        children: commonChildren,
      },
      {
        name: '新三板定增',
        dataIndex: 'newThreeIncrease',
        modalType: DetailModalTypeEnum.NewThirdAdd,
        defaultCondition: {},
        children: commonChildren,
      },
      {
        name: '创投融资',
        dataIndex: 'ventureCapital',
        defaultCondition: {},
        modalType: DetailModalTypeEnum.VC,
        children: commonChildren,
      },
    ];
    return restColumns.map((o: Record<string, any>) => {
      return {
        title: o.name,
        children: o.children?.map((item: Record<string, any>, i: number) => {
          return {
            title: item.title,
            dataIndex: o.dataIndex,
            width: calcPercentage(item.width, 1320),
            align: 'right',
            sorter: false,
            render: (_: any, item: any) => {
              const { amount, financingAmount } = item[o.dataIndex] || {};
              const v = !i ? amount : financingAmount;
              const val = v ? v : '0';
              if (i) {
                return val;
              }
              const isCursor = val !== '-' && val !== '0';
              return (
                <div
                  onClick={() => {
                    if (isCursor) {
                      let title = '';
                      handleModalClick({
                        title,
                        modalType: o.modalType,
                        row: item,
                        defaultCondition: o.defaultCondition,
                      });
                    }
                  }}
                  className={isCursor ? S.cursorText : ''}
                >
                  {val}
                </div>
              );
            },
          };
        }),
      };
    });
  });
  const withModalCell = ({ val, modalType, row, defaultCondition }: any) => {
    const isCursor = val !== '-' && val !== '0';
    return (
      <div
        onClick={() => {
          if (isCursor) {
            handleModalClick({
              title: '',
              modalType,
              row,
              defaultCondition,
            });
          }
        }}
        className={isCursor ? S.cursorText : ''}
      >
        {val}
      </div>
    );
  };
  const columns = useMemo(() => {
    return {
      plate: [{ title: '年度', dataIndex: 'year', width: 102, sorter: false }, ...getPlateColumns()],
      nature: [{ title: '年度', dataIndex: 'year', width: 102, sorter: false }, ...getNatureColumns()],
      industry: [{ title: '年度', dataIndex: 'year', width: 102, sorter: false }, ...getIndustryColumns()],
      scale: [
        { title: '年度', dataIndex: 'year', width: 63, sorter: false, fixed: 'left' },
        {
          title: '新增融资额(亿元)',
          dataIndex: 'year',
          width: 123,
          sorter: false,
          fixed: 'left',
          align: 'right',
          render: (text: string, item: Record<string, any>) => {
            return item.financingAmount?.financingAmount || '-';
          },
        },
        {
          title: '地区GDP(亿元)',
          dataIndex: 'gdp',
          width: 128,
          sorter: false,
          fixed: 'left',
          align: 'right',
        },
        { title: '新增融资额/地区GDP', dataIndex: 'rate', width: 144, sorter: false, align: 'right', fixed: 'left' },
        ...getStockScaleColumns(),
      ],
    };
  }, [getIndustryColumns, getNatureColumns, getPlateColumns, getStockScaleColumns]);
  const columnMap = new Map([
    [TableColumnType.Plate, [indexColumn, ...makeColumns(columns.plate)]],
    [TableColumnType.Nature, [indexColumn, ...makeColumns(columns.nature)]],
    [TableColumnType.Industry, [indexColumn, ...makeColumns(columns.industry)]],
    [TableColumnType.Scale, [{ ...indexColumn, fixed: 'left' }, ...makeColumns(columns.scale)]],
  ]);

  return {
    columns: columnMap.get(tableType) || [],
    tableScrollWidth: TableColumnType.Scale === tableType ? 1316 : 1012,
    withModalCell,
  };
}
