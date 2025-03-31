import { FC, useMemo, useEffect, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import { WritableDraft } from 'immer/dist/types/types-external';
import { isNumber, isString } from 'lodash';

import Pagination from '@/components/Pagination';
import FinanceTable from '@/components/tableFinance';
import { WrapperProps } from '@/pages/area/areaCompany/components/moduleWrapper';
import { SubModuleProps } from '@/pages/area/areaCompany/components/moduleWrapper/multiModuleWrapper';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { sortMap, sortReverseMap, reverseSortMap } from '@/pages/area/areaCompany/const';
import { convertStringToNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';

import { TemplateKeyEnums, defaultSpecialParamKeyMap, CONTIAINERID, sortKeyList, TemplateProps } from './config';
import styles from './styles.module.less';
import TableWithLoading, { LoadingTips } from './tableWithLoading';

interface UseTableProps {
  defaultSortInfo: string[];
  data: Record<string, any>[];
  totalCount: number;
  loading: boolean;
  isLoading: boolean;
  currentModule: {
    pageSize: number;
    tableSticky: number;
    wrapperComponent: FC<Partial<WrapperProps & SubModuleProps>>;
    title: string;
  };
  updateCondition: (f: (draft: WritableDraft<Record<string, any>>) => void | Record<string, any>) => void;
  setSortIconLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  needColumnCustomStyle?: boolean;
}

type RestProps = Pick<
  TemplateProps,
  'defaultCondition' | 'specialParamKeyMap' | 'useColumnsHook' | 'specialStyleStr' | 'id' | 'title'
>;

const useRenderTable = ({
  defaultCondition,
  defaultSortInfo,
  data,
  totalCount,
  loading,
  isLoading,
  specialParamKeyMap = defaultSpecialParamKeyMap,
  currentModule,
  specialStyleStr,
  id,
  title,
  useColumnsHook,
  updateCondition,
  setSortIconLoaded,
  needColumnCustomStyle,
}: UseTableProps & RestProps) => {
  // 跳过无序
  const nextSortIsReverseRef = useRef(false);
  // 当前是默认排序字段且下一次回到默认状态
  const nextSortIsDefaultRef = useRef(false);
  // 当前排序状态，受控
  const [curSorter, updateCurSorter] = useImmer({
    sortKey: '',
    sortRule: '',
  });
  const [columnsProps, updateColumnsProps] = useImmer({
    // 当前页数
    curPage: 1,
    curDataCounts: 0,
    restParams: defaultCondition,
  });

  const initColumns = useColumnsHook(columnsProps);

  const total = convertStringToNumber(totalCount);

  const originColumns = useMemo(() => {
    return initColumns?.map((columnItem: any, idx: number) => {
      const orderWidth = Math.max(
        `${Number(columnsProps.curPage - 1) * currentModule.pageSize + currentModule.pageSize}`.length * 10 + 22,
        45,
      );
      return columnItem.title
        ? {
            ...columnItem,
            // width: !idx ? orderWidth : isNumber(columnItem.width) ? columnItem.width + 10 : columnItem.width,
            width: !idx ? orderWidth : isNumber(columnItem.width) ? columnItem.width : 150,
            title: isString(columnItem.title) ? (
              <span className="areaf9-tbl-header" title={columnItem.title}>
                {columnItem.title}
              </span>
            ) : (
              columnItem.title
            ),
            resizable: !idx ? false : columnItem?.fixed ? { max: 895 } : true,
            wrapLine: true,
            specialWidth: columnItem?.sort ? 16 : undefined,
          }
        : columnItem;
    });
  }, [initColumns, columnsProps.curPage, currentModule.pageSize]);

  // 默认
  useEffect(() => {
    updateCurSorter((d) => {
      d.sortKey = defaultSortInfo[0];
      d.sortRule = defaultSortInfo[1];
    });
  }, [defaultSortInfo, updateCurSorter]);

  useEffect(() => {
    const sortIcon = document.querySelector('.ant-table-column-sorter .ant-table-column-sorter-inner svg');
    if (sortIcon) {
      // 等待icon加载完成
      if (sortIcon.children.length > 0) {
        setSortIconLoaded(false);
      }
    }
  }, [isLoading, setSortIconLoaded]);

  useEffect(() => {
    updateColumnsProps((d) => {
      d.curDataCounts = data?.length || 0;
    });
  }, [updateColumnsProps, data?.length]);

  // 第一个默认排序相反的状态，用于跳过无序
  const defaultReverseSort = useMemo(() => (defaultSortInfo[1] === 'asc' ? 'desc' : 'asc'), [defaultSortInfo]);

  const sortKey = useMemo(() => {
    if (specialParamKeyMap.has(TemplateKeyEnums.sort)) {
      return {
        sort: specialParamKeyMap.get(TemplateKeyEnums.sort) || TemplateKeyEnums.sort,
      };
    } else {
      return {
        sortKey: specialParamKeyMap.get(TemplateKeyEnums.sortKey) || TemplateKeyEnums.sortKey,
        sortType: specialParamKeyMap.get(TemplateKeyEnums.sortType) || TemplateKeyEnums.sortType,
      };
    }
  }, [specialParamKeyMap]);

  // 表格排序
  const handleChange = useMemoizedFn((_: any, __: any, sorter: any) => {
    const isReverse = !!sorter.column?.reverseSort;
    const key = sorter.column?.sortKey ?? sorter.columnKey ?? sorter.field;
    const order = sortMap.get(sorter.order);
    const formatedOrder = isReverse ? sortReverseMap.get(sorter.order) : order;
    // 已经是默认值，再点击默认字段的话，应该根据默认字段的排序来跳过null
    const curSortKey = order ? key : defaultSortInfo[0];
    updateCurSorter((d) => {
      d.sortKey = curSortKey;
      d.sortRule = order ? order : nextSortIsReverseRef.current ? defaultReverseSort : defaultSortInfo[1];
    });
    // nextSortIsDefaultRef nextSortIsReverseRef 这两个ref记录的都是上一次的状态
    const isDefault = curSortKey === defaultSortInfo[0];
    updateCondition((d) => {
      if (sortKey.sort) {
        if (order) {
          d[sortKey.sort] =
            isDefault && nextSortIsDefaultRef.current ? defaultCondition[sortKey.sort] : `${key}:${formatedOrder}`;
        } else {
          // 无序时，应该回到默认状态。对于默认的排序字段，如果当前状态是默认排序的相反状态，下一次跳过无序
          d[sortKey.sort] = nextSortIsReverseRef.current
            ? `${defaultSortInfo[0]}:${defaultReverseSort}`
            : defaultCondition[sortKey.sort];
        }
      } else {
        if (order) {
          d[sortKey.sortKey!] = isDefault && nextSortIsDefaultRef.current ? defaultCondition[sortKey.sortKey!] : key;
          d[sortKey.sortType!] =
            isDefault && nextSortIsDefaultRef.current ? defaultCondition[sortKey.sortType!] : formatedOrder;
        } else {
          d[sortKey.sortKey!] = nextSortIsReverseRef.current ? defaultSortInfo[0] : defaultCondition[sortKey.sortKey!];
          d[sortKey.sortType!] = nextSortIsReverseRef.current
            ? defaultReverseSort
            : defaultCondition[sortKey.sortType!];
        }
      }
    });
  });
  // 表格翻页
  const handlePageChange = useMemoizedFn((page: number) => {
    updateColumnsProps((d) => {
      d.curPage = page;
    });
    updateCondition((d) => {
      d[specialParamKeyMap.get(TemplateKeyEnums.from) || TemplateKeyEnums.from] = (page - 1) * currentModule.pageSize;
    });
  });

  // 重置表格状态
  const resetTablePageStatus = useMemoizedFn(() => {
    updateCurSorter((d) => {
      d.sortKey = defaultSortInfo[0];
      d.sortRule = defaultSortInfo[1];
    });
    updateColumnsProps((d) => {
      d.curPage = 1;
      d.curDataCounts = 0;
    });
  });

  // 重置表格状态和参数
  const resetTableStatus = useMemoizedFn(() => {
    resetTablePageStatus();
    updateCondition((d) => {
      if (sortKey.sort) {
        d[sortKey.sort] = defaultCondition[sortKey.sort] || '';
      } else {
        d[sortKey.sortKey!] = defaultCondition[sortKey.sortKey!] || '';
        d[sortKey.sortType!] = defaultCondition[sortKey.sortType!] || '';
      }
      d[specialParamKeyMap.get(TemplateKeyEnums.from) || TemplateKeyEnums.from] = 0;
    });
  });

  const domName = useMemo(
    () => ({
      tableContent: `area-company-${id || title}`,
      tableAfter: `table-after-dom-${id || title}`,
    }),
    [id, title],
  );

  const { columns: noSortColumns, tableScroll } = useMemo(() => {
    // 业务相关的对表格的批量处理
    originColumns.forEach((column) => {
      if (column.dataIndex === 'registeredCapital') {
        column.render = (text: string, record: Record<string, any>) => {
          // record.currency是直接展示在导出里的，和页面展示规则不太一样，人民币页面不显示
          const res = text ? `${text}${!record.currency || record.currency === '人民币' ? '' : record.currency}` : '-';
          return <TextWrap>{res}</TextWrap>;
        };
      }
    });
    const totalWidth = originColumns.reduce((prev: any, current: any, idx: any) => {
      if (idx && !current?.fixed) {
        prev += current.width || 0;
      }
      return prev;
    }, 0);
    return {
      columns: originColumns,
      // tableScroll: totalWidth + originColumns[0].width || 42,
      tableScroll: totalWidth,
      // tableScroll: 'max-content',
    };
  }, [originColumns]);

  const columns = useMemo(() => {
    // 这个curSortKey可能是多个排序拼接的，xxx:desc,yyy:desc 或者 xxx,yyy。这里用:,分割拿到第一个的key
    if (curSorter.sortKey) {
      return noSortColumns.map((columnItem) => {
        if (sortKeyList.some((keyItem) => columnItem[keyItem] === curSorter.sortKey)) {
          // 当前是默认排序，下一次应该跳过无序
          nextSortIsReverseRef.current =
            curSorter.sortKey === defaultSortInfo[0] && curSorter.sortRule === defaultSortInfo[1];
          // 当前是默认排序字段且下一次是默认的顺序，那么下一次应该回到默认的状态(如果有多个排序字段，那么就应该是多个排序的字段)
          nextSortIsDefaultRef.current =
            curSorter.sortKey === defaultSortInfo[0] && curSorter.sortRule === defaultReverseSort;
          return {
            ...columnItem,
            sortOrder: reverseSortMap.get(curSorter.sortRule) || null,
          };
        }
        return {
          ...columnItem,
          sortOrder: null,
        };
      });
    }
    return noSortColumns;
  }, [curSorter, noSortColumns, defaultSortInfo, defaultReverseSort]);

  const table = useMemo(
    () => (
      <>
        {/*@ts-ignore*/}
        <FinanceTable
          customStripe={true}
          titleCenter={true}
          noSelectRow={true}
          stripe
          showSorterTooltip={false}
          type="stickyTable"
          dataSource={data}
          columns={columns}
          sticky={{
            offsetHeader: currentModule.tableSticky,
            getContainer: () => document.getElementById(CONTIAINERID) || document.body,
          }}
          scroll={{
            x: tableScroll,
          }}
          onChange={handleChange}
          loading={
            loading
              ? {
                  wrapperClassName: 'mount-table-loading',
                  tip: '加载中',
                  indicator: <LoadingTips />,
                }
              : false
          }
        />
        {total > currentModule.pageSize ? (
          <div className="pagination-wrapper">
            <Pagination
              current={columnsProps.curPage}
              pageSize={currentModule.pageSize}
              total={total}
              onChange={handlePageChange}
              align={'left'}
            />
          </div>
        ) : null}
      </>
    ),
    [
      data,
      columns,
      currentModule.tableSticky,
      currentModule.pageSize,
      tableScroll,
      handleChange,
      loading,
      total,
      columnsProps.curPage,
      handlePageChange,
    ],
  );

  const tableContainer = useMemo(() => {
    return (
      <TableWithLoading
        className={needColumnCustomStyle ? styles.customStyle : ''}
        tableContentId={domName.tableContent}
        tableAfterId={domName.tableAfter}
        scrollDom={document.getElementById(CONTIAINERID)}
        containerDom={document.getElementById('area-company-container')}
        loading={loading}
        hasPagination={totalCount > currentModule.pageSize}
        specialStyleStr={specialStyleStr}
      >
        {table}
      </TableWithLoading>
    );
  }, [
    needColumnCustomStyle,
    domName.tableContent,
    domName.tableAfter,
    loading,
    totalCount,
    currentModule.pageSize,
    specialStyleStr,
    table,
  ]);

  return {
    tableContainer,
    updateColumnsProps,
    resetTablePageStatus,
    resetTableStatus,
  };
};

export default useRenderTable;
