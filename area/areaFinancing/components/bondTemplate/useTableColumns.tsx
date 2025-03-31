import { useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { omit } from 'lodash';

import { getTabType, TabType } from '@pages/area/areaFinancing/components/bondTemplate/index';
import { BondFinancingColumnType, TableDataItem } from '@pages/area/areaFinancing/components/bondTemplate/type';
import { useConditionCtx } from '@pages/area/areaFinancing/components/commonLayout/context';
import { useCtx } from '@pages/area/areaFinancing/context';
import useCommonColumn from '@pages/area/areaFinancing/hooks/useCommonColumn';
import { calcPercentage } from '@pages/area/areaFinancing/utils';

import { LINK_AREA_F9 } from '@/configs/routerMap';
import {
  BondDetailModalInfoMap,
  BondModalType,
  BondModalTypeMap,
} from '@/pages/area/areaFinancing/components/bondTemplate/type';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import S from '../../style.module.less';
import { TableHeadFilter } from './tableHeadFilter';

const emptyFilter = (val: any) => {
  return val ? val : '-';
};
interface IProps {
  // 债券融资类型
  bondType: BondFinancingColumnType;
  tableData?: any;
}
// 设计稿每列宽度
const designColumnWidthObj = {
  index: 42,
  area: 128,
  longAmount: 98,
  amount: 92,
  count: 85,
};
enum ColumnCode {
  /** 合计列 */
  Total = '-1',
  /** 商业银行债 */
  CommercialBankBonds = '2',
  /** 非银金融债 */
  NonBankFinancialBonds = '5',
}
export default function useTableColumns({ bondType, tableData }: IProps) {
  const history = useHistory();
  const {
    state: { dynamicColumnTitle },
  } = useCtx();
  const {
    state: { condition },
    update,
  } = useConditionCtx();
  // 计算出实际的表格设计稿宽度
  const tableWidthRef = useRef(1280);
  const { makeColumns, indexColumn } = useCommonColumn();

  const tabType = useMemo(() => getTabType(bondType), [bondType]);
  const handleModalClick = useMemoizedFn(({ title, modalType, row }: any) => {
    update((d) => {
      d.visible = true;
      d.detailModalConfig.title = title;
      d.detailModalConfig.areaName = row.name;
      d.detailModalConfig.modalType = modalType;
      // 明细接口部分参数过滤
      let needCondition: Record<string, any> | undefined = {};
      switch (row.dataIndex) {
        case ColumnCode.Total:
          needCondition = condition;
          break;
        case ColumnCode.NonBankFinancialBonds:
          needCondition = omit(condition, 'commercialBankBonds');
          break;
        case ColumnCode.CommercialBankBonds:
          needCondition = omit(condition, 'nonBankFinancialBonds');
          break;
        default:
          needCondition = omit(condition, 'nonBankFinancialBonds', 'commercialBankBonds');
          break;
      }
      // 债券存量页面排序字段不同
      d.detailModalConfig.defaultCondition = Object.assign(
        { ...needCondition },
        {
          sortRule: 'desc',
          sortKey: [
            BondModalType.NormalInventory,
            BondModalType.FinancialInventory,
            BondModalType.NormalIssue,
            BondModalType.FinancialIssue,
          ].includes(modalType)
            ? 'issueDate'
            : 'changeDate',
          regionCode: row.code,
          // 债券存量统计明细日期取时间点
          changeDate: [BondModalType.NormalInventory, BondModalType.FinancialInventory].includes(modalType)
            ? condition?.changeDate?.match(/\d{4}-\d{2}-\d{2}/g)?.[1]
            : condition?.changeDate,
        },
      );
      // 债券类型单列,详情区分
      if (row.dataIndex && row.dataIndex?.indexOf('-') === -1) {
        d.detailModalConfig.defaultCondition!.bondCategory = row.dataIndex;
      } else if (row.dataIndex && row.dataIndex?.indexOf('-') > 0) {
        // tab-按年份
        d.detailModalConfig.defaultCondition!.changeDate = row.dataIndex;
      }
    });
  });

  const modalColumn = useMemoizedFn((val, item, modalType) => {
    return (
      <div
        onClick={() => {
          if (val !== '-') {
            let baseTitle = BondDetailModalInfoMap.get(modalType)?.title;
            let title = item.name + '-' + baseTitle;
            if (item.bondCategoryName && item.dataIndex !== '-1') {
              baseTitle = tabType === TabType.ByType ? baseTitle?.replace('债券', '') : baseTitle;
              title = item.name + '-' + item.bondCategoryName + baseTitle;
            }
            handleModalClick({
              title,
              modalType: modalType,
              row: item,
            });
          }
        }}
        className={val !== '-' ? S.cursorText : ''}
      >
        {val}
      </div>
    );
  });

  const makeChildrenColumn = ({
    isFinancing,
    dataIndex,
    modalType,
    bondCategoryName,
  }: {
    isFinancing: boolean;
    dataIndex: string;
    bondCategoryName: string;
    modalType: BondModalType;
  }) => {
    const financingChildren = [
      {
        title: '净融资(亿)',
        dataIndex: `${dataIndex}_netFinancingAmount`,
        width: calcPercentage(designColumnWidthObj.longAmount, tableWidthRef.current),
        align: 'right',
        render: (_: any, item: any) => {
          const { valueList } = item;
          const val = emptyFilter(
            formatNumber(valueList.find((o: Record<string, any>) => o.code === dataIndex)?.netFinancingAmount, 2),
          );
          return modalColumn(val, { ...item, dataIndex, bondCategoryName }, modalType);
        },
      },
      {
        title: '发行量(亿)',
        dataIndex: `${dataIndex}_issueAmount`,
        width: calcPercentage(designColumnWidthObj.longAmount, tableWidthRef.current),
        align: 'right',
        render: (_: any, item: any) => {
          const { valueList } = item;
          const val = emptyFilter(
            formatNumber(valueList.find((o: Record<string, any>) => o.code === dataIndex)?.issueAmount, 2),
          );
          return <div>{val}</div>;
        },
      },
      {
        title: '偿还量(亿)',
        dataIndex: `${dataIndex}_repayAmount`,
        align: 'right',
        width: calcPercentage(designColumnWidthObj.longAmount, tableWidthRef.current),
        render: (_: any, item: any) => {
          const { valueList } = item;
          const val = emptyFilter(
            formatNumber(valueList.find((o: Record<string, any>) => o.code === dataIndex)?.repayAmount, 2),
          );
          return <div>{val}</div>;
        },
      },
    ];
    const normalChildren = [
      {
        title: '金额(亿)',
        dataIndex: `${dataIndex}_amount`,
        width: calcPercentage(designColumnWidthObj.amount, tableWidthRef.current),
        align: 'right',
        render: (_: any, item: any) => {
          const { valueList } = item;
          return emptyFilter(formatNumber(valueList.find((o: Record<string, any>) => o.code === dataIndex)?.amount, 2));
        },
      },
      {
        title: '数量(只)',
        dataIndex: `${dataIndex}_quantity`,
        width: calcPercentage(designColumnWidthObj.count, tableWidthRef.current),
        align: 'right',
        render: (_: any, item: any) => {
          const { valueList } = item;
          const val = valueList.find((o: Record<string, any>) => o.code === dataIndex)?.quantity
            ? formatNumber(valueList.find((o: Record<string, any>) => o.code === dataIndex)?.quantity, 0)
            : '-';
          return modalColumn(val, { ...item, dataIndex, bondCategoryName }, modalType);
        },
      },
    ];
    return isFinancing ? financingChildren : normalChildren;
  };
  // 表头筛选
  const handleColumnTitleChange = useMemoizedFn((key, data: Record<string, any>[]) => {
    update((d) => {
      d.condition![key] = data.map((o) => o.value).join(',');
    });
  });
  const getColumns = useMemoizedFn((bondType: BondFinancingColumnType) => {
    let restColumns: Record<string, any>[] = [];
    const valueList = tableData?.[0]?.valueList;
    if (valueList?.length) {
      // 计算实际表格设计稿宽度
      const dynamicColumnWidth = [
        BondFinancingColumnType.NormalFinancingByType,
        BondFinancingColumnType.NormalFinancingByYear,
        BondFinancingColumnType.FinancialFinancingByType,
        BondFinancingColumnType.FinancialFinancingByYear,
      ].includes(bondType)
        ? designColumnWidthObj.longAmount * 3
        : designColumnWidthObj.amount + designColumnWidthObj.count;
      tableWidthRef.current =
        designColumnWidthObj.index + designColumnWidthObj.area + valueList.length * dynamicColumnWidth;

      const dynamicColumnTitleKey = dynamicColumnTitle?.map((o) => o.name);
      restColumns = valueList.map((o: Record<string, any>) => {
        let dynamicColumnData;
        if (dynamicColumnTitleKey?.includes(o.name)) {
          dynamicColumnData = dynamicColumnTitle!.find((t) => t.name === o.name);
        }
        return {
          title: dynamicColumnTitleKey?.includes(o.name) ? (
            <TableHeadFilter data={dynamicColumnData} onChange={handleColumnTitleChange} />
          ) : (
            o.name
          ),
          children: makeChildrenColumn({
            isFinancing: [
              BondFinancingColumnType.NormalFinancingByType,
              BondFinancingColumnType.NormalFinancingByYear,
              BondFinancingColumnType.FinancialFinancingByType,
              BondFinancingColumnType.FinancialFinancingByYear,
            ].includes(bondType),
            dataIndex: o.code,
            // 债券大类名称
            bondCategoryName: o.name,
            modalType: BondModalTypeMap.get(bondType),
          }),
        };
      });
      return restColumns;
    }
    return restColumns;
  });
  return {
    columns: makeColumns([
      { ...indexColumn, fixed: 'left' },
      {
        title: '地区',
        dataIndex: 'name',
        align: 'left',
        // width: 128,
        fixed: 'left',
        sorter: false,
        render: (text: string, row: TableDataItem) => {
          return (
            <div
              className={S.cursorText}
              onClick={() => {
                history.push(
                  urlJoin(
                    dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code: row.code }),
                    urlQueriesSerialize({
                      code: row.code,
                    }),
                  ),
                );
              }}
            >
              {text}
            </div>
          );
        },
      },
      ...getColumns(bondType),
    ]),
    tableScrollWidth: tableWidthRef.current,
  };
}
