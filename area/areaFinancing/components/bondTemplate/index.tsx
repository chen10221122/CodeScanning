import { useEffect, useMemo, useRef } from 'react';

import { useMemoizedFn, useSize } from 'ahooks';
import cn from 'classnames';
import dayjs from 'dayjs';

import { DEFAULT_PAGE_BOTTOM_MARGIN, DEFAULT_PAGE_TOP_MARGIN, getConfig } from '@/app';
import { Icon, Pagination } from '@/components';
import { Empty, Spin, Table as DzhTable } from '@/components/antd';
import ExportDoc, { EXPORT } from '@/components/exportDoc';
import {
  getAreaBondFinancingStatistic,
  getAreaBondInventoryStatistic,
  getAreaBondIssueStatistic,
  getAreaBondReturnStatistic,
} from '@/pages/area/areaFinancing/api';
import useBondScreen from '@/pages/area/areaFinancing/components/bondTemplate/useBondScreen';
import { useConditionCtx } from '@/pages/area/areaFinancing/components/commonLayout/context';
import NextNode from '@/pages/area/areaFinancing/components/nextNode';
import { useCtx } from '@/pages/area/areaFinancing/context';
import { formatNumber } from '@/utils/format';
import { shortId } from '@/utils/share';

import { Provider } from '../commonLayout/context';
import DetailModal from './bondDetailModal';
import Filter from './filter';
import tableStyle from './style.module.less';
import { BondFinancingColumnType } from './type';
import useTableColumns from './useTableColumns';
import useTableData, { LoadType } from './useTableData';

import S from '@/pages/area/areaFinancing/style.module.less';

export const [headHeight] = [83];
export enum TabType {
  ByType = 'byType',
  ByYear = 'byYear',
}

export const getTabType = (type: BondFinancingColumnType) => {
  return [
    BondFinancingColumnType.NormalInventoryByType,
    BondFinancingColumnType.NormalFinancingByType,
    BondFinancingColumnType.NormalIssueByType,
    BondFinancingColumnType.NormalReturnByType,
    BondFinancingColumnType.FinancialInventoryByType,
    BondFinancingColumnType.FinancialFinancingByType,
    BondFinancingColumnType.FinancialIssueByType,
    BondFinancingColumnType.FinancialReturnByType,
  ].includes(type)
    ? TabType.ByType
    : TabType.ByYear;
};
/**
 * 债券融资各表格配置参数
 */
const size = 50;
const currentYear = new Date().getFullYear();
// tab按年份-近五年参数
const currentDate = `[${dayjs().format('YYYY-MM-DD')},${dayjs().format('YYYY-MM-DD')}]`;
// tab按年份-近五年参数
const recentFiveYear = `[${dayjs(String(currentYear - 4)).format('YYYY-MM-DD')},${dayjs().format('YYYY-MM-DD')}]`;

// 发行tab按年份-近五年参数
const recentFiveYearEnd = `[${dayjs(String(currentYear - 4)).format('YYYY-MM-DD')},${currentYear}-12-31]`;

// 债券偿还按年份
const nextFiveYear = `[${dayjs(String(currentYear)).format('YYYY-MM-DD')},${currentYear + 4}-12-31]`;

const currentYearToToday = `[${dayjs(String(currentYear)).format('YYYY-MM-DD')},${dayjs().format('YYYY-MM-DD')}]`;
// 债券发行-按类型
const currentYearToEnd = `[${dayjs(String(currentYear)).format('YYYY-MM-DD')},${currentYear}-12-31]`;
// 债券偿还-按类型
// const todayToEnd = `[${dayjs().format('YYYY-MM-DD')},${currentYear}-12-31]`;

// 最新对应的接口年份传参
export const defaultYearObj = {
  inventory: currentYearToToday,
  financing: currentYearToToday,
  issue: currentYearToEnd,
  return: currentYearToEnd,
};
// 非金融企业
const normalBondCategory = '6,7,8,9,10';
// 金融企业
const financialBondCategory = '2,3,4,5,6,7,8,11';
// 债券大类对应的默认传参
export const defaultBondCategoryObj = {
  normal: normalBondCategory,
  financial: financialBondCategory,
};

// 默认地区
const defaultRegionCode =
  '110000,120000,130000,140000,150000,210000,220000,230000,310000,320000,330000,340000,350000,360000,370000,410000,420000,430000,440000,450000,460000,500000,510000,520000,530000,540000,610000,620000,630000,640000,650000';
const makeMap: (orgType: '1' | '0') => any = (orgType) => {
  const flag = orgType === '0';
  const bondCategory = orgType === '0' ? normalBondCategory : financialBondCategory;
  return new Map([
    [
      flag ? BondFinancingColumnType.NormalInventoryByType : BondFinancingColumnType.FinancialInventoryByType,
      {
        apiName: getAreaBondInventoryStatistic,
        exportInfo: { filename: '债券存量-按类型', pageType: '1' },
        defaultCondition: {
          orgType,
          sortKey: '-1_amount',
          sortRule: 'desc',
          tabType: '1',
          from: 0,
          size,
          changeDate: currentDate,
          regionCode: defaultRegionCode,
          bondCategory,
        },
      },
    ],
    [
      flag ? BondFinancingColumnType.NormalInventoryByYear : BondFinancingColumnType.FinancialInventoryByYear,
      {
        apiName: getAreaBondInventoryStatistic,
        exportInfo: { filename: '债券存量-按年份', pageType: '1' },
        defaultCondition: {
          changeDate: recentFiveYear,
          orgType,
          sortKey: `${dayjs().format('YYYY-MM-DD')}_amount`,
          sortRule: 'desc',
          tabType: '2',
          from: 0,
          size,
          regionCode: defaultRegionCode,
          bondCategory,
        },
      },
    ],
    [
      flag ? BondFinancingColumnType.NormalFinancingByType : BondFinancingColumnType.FinancialFinancingByType,
      {
        apiName: getAreaBondFinancingStatistic,
        exportInfo: { filename: '债券净融资-按类型', pageType: '2' },
        defaultCondition: {
          orgType,
          sortKey: '-1_netFinancingAmount',
          sortRule: 'desc',
          tabType: '1',
          from: 0,
          size,
          changeDate: currentYearToToday,
          bondCategory,
          regionCode: defaultRegionCode,
        },
      },
    ],
    [
      flag ? BondFinancingColumnType.NormalFinancingByYear : BondFinancingColumnType.FinancialFinancingByYear,
      {
        apiName: getAreaBondFinancingStatistic,
        exportInfo: { filename: '债券净融资-按年份', pageType: '2' },
        defaultCondition: {
          orgType,
          sortKey: `${currentYearToToday}_netFinancingAmount`,
          sortRule: 'desc',
          tabType: '2',
          from: 0,
          size,
          changeDate: recentFiveYear,
          regionCode: defaultRegionCode,
          bondCategory,
        },
      },
    ],
    [
      flag ? BondFinancingColumnType.NormalIssueByType : BondFinancingColumnType.FinancialIssueByType,
      {
        apiName: getAreaBondIssueStatistic,
        exportInfo: { filename: '债券发行-按类型', pageType: '3' },
        defaultCondition: {
          orgType,
          sortKey: '-1_amount',
          sortRule: 'desc',
          tabType: '1',
          from: 0,
          size,
          changeDate: currentYearToEnd,
          bondCategory,
          regionCode: defaultRegionCode,
        },
      },
    ],
    [
      flag ? BondFinancingColumnType.NormalIssueByYear : BondFinancingColumnType.FinancialIssueByYear,
      {
        apiName: getAreaBondIssueStatistic,
        exportInfo: { filename: '债券发行-按年度', pageType: '3' },
        defaultCondition: {
          orgType,
          sortKey: `${currentYearToEnd}_amount`,
          sortRule: 'desc',
          tabType: '2',
          from: 0,
          size,
          changeDate: recentFiveYearEnd,
          bondCategory,
          regionCode: defaultRegionCode,
        },
      },
    ],
    [
      flag ? BondFinancingColumnType.NormalReturnByType : BondFinancingColumnType.FinancialReturnByType,
      {
        apiName: getAreaBondReturnStatistic,
        exportInfo: { filename: '债券偿还-按类型', pageType: '4' },
        defaultCondition: {
          orgType,
          sortKey: '-1_amount',
          sortRule: 'desc',
          tabType: '1',
          from: 0,
          size,
          changeDate: currentYearToEnd,
          bondCategory,
          regionCode: defaultRegionCode,
          sCaliber: '0',
        },
      },
    ],
    [
      flag ? BondFinancingColumnType.NormalReturnByYear : BondFinancingColumnType.FinancialReturnByYear,
      {
        apiName: getAreaBondReturnStatistic,
        exportInfo: { filename: '债券偿还-按年度', pageType: '4' },
        defaultCondition: {
          orgType,
          sortKey: `${currentYearToEnd}_amount`,
          sortRule: 'desc',
          tabType: '2',
          from: 0,
          size,
          sCaliber: '0',
          changeDate: nextFiveYear,
          bondCategory,
          regionCode: defaultRegionCode,
        },
      },
    ],
  ]);
};
export const BondFinancingInfoMap: any = new Map([...makeMap('0'), ...makeMap('1')]);

interface ContentProps {
  defaultCondition: Record<string, any>;
  type: BondFinancingColumnType;
  /** 表格接口调用函数 */
  apiName?: any;
  dataFormatFn: any[];
  /** 表格备注信息 */
  tableConf?: { remark: string };
  headerFixConfig?: {
    screenTop: number | string;
    tableTop: number | string;
  };
}

function Content({
  type,
  dataFormatFn,
  tableConf,
  headerFixConfig = { screenTop: 43, tableTop: headHeight },
}: ContentProps) {
  const isInitRef = useRef(false);
  const screenRef = useRef(null);
  const {
    state: { condition, error },
    update,
  } = useConditionCtx();
  const {
    state: { fullLoading, wrapperRef },
  } = useCtx();

  const size = useSize(screenRef);
  const offsetHeaderTop = useMemo(() => {
    if (size?.height && headerFixConfig?.screenTop) return Number(size.height) + Number(headerFixConfig.screenTop);
    return headerFixConfig.tableTop;
  }, [headerFixConfig.screenTop, headerFixConfig.tableTop, size?.height]);
  // 各表格不同配置信息
  const { apiName, exportInfo, defaultCondition } = BondFinancingInfoMap.get(type) || {
    apiName: '',
    exportInfo: { filename: '' },
    defaultCondition: {},
  };
  const { screenConfig, handleMenuChange, hideSelectAll } = useBondScreen(type);
  const { tableData, handleTableChange, current, total, loading, onPageChange, loadType } = useTableData({
    apiName,
    dataFormatFn,
  });
  useEffect(
    function initCondition() {
      if (defaultCondition && !condition && !isInitRef.current && screenConfig) {
        isInitRef.current = true;
        update((d) => {
          d.isFirstLoad = true;
          d.condition = defaultCondition;
        });
      }
    },
    [condition, defaultCondition, screenConfig, update],
  );
  // 重置
  const handleReset = useMemoizedFn(() => {
    isInitRef.current = false;
    update((d) => {
      d.condition = undefined;
    });
  });

  const exportParams = useMemo(() => {
    return {
      condition: {
        ...condition,
        exportFlag: true,
        pageType: exportInfo.pageType,
        sheetNames: { '0': exportInfo.filename },
      },
      usePost: true,
      module_type: 'bond_financing_common_stat',
      filename: exportInfo.filename + dayjs().format('YYYYMMDD'),
      type: EXPORT,
    };
  }, [condition, exportInfo.filename, exportInfo.pageType]);

  const { columns, tableScrollWidth } = useTableColumns({ bondType: type, tableData });

  /**
   * 表格加载控制
   * 分页加载和筛选加载loading区分
   */
  const loadingIndicator = useMemo(() => {
    if (!loading || fullLoading) return false;
    return {
      wrapperClassName: tableStyle.tableLoading,
      indicator: (
        <span className={tableStyle.loadingTips}>
          <Icon
            style={{ width: 28, height: 28, marginTop: 20 }}
            image={require('@/assets/images/common/loading.gif')}
          />
          <span className={tableStyle.loadingText}>加载中</span>
        </span>
      ),
    };
  }, [fullLoading, loading]);
  if (fullLoading) {
    return (
      <Spin
        type="fullThunder"
        spinning={true}
        className={S.fullLoading}
        style={{
          top: getConfig((d) => d.css.pageTopMargin, DEFAULT_PAGE_TOP_MARGIN),
          bottom: getConfig((d) => d.css.pageBottomMargin, DEFAULT_PAGE_BOTTOM_MARGIN),
        }}
      />
    );
  }

  return (
    <div className={S.templateWrapper}>
      <div className={S.templateContent}>
        <div
          ref={screenRef}
          className={cn(S.menu, { [S.hideFirstSelectAll]: hideSelectAll })}
          style={{ top: headerFixConfig.screenTop }}
        >
          {screenConfig && condition && error?.returncode !== 500 ? (
            <Filter screenConfig={screenConfig} handleMenuChange={handleMenuChange} />
          ) : null}
          {condition && error?.returncode !== 500 ? (
            <div className={S.menuRight}>
              <span className={S.count}>
                共计 <span>{formatNumber(total, 0)}</span> 条
              </span>
              <ExportDoc {...exportParams} />
            </div>
          ) : null}
        </div>
        <div className={cn(S.tableWrapper, { [S.minHeight]: !tableData.length })}>
          <Spin
            type="thunder"
            spinning={!condition || (loading && !fullLoading && loadType !== LoadType.TABLE)}
            style={{ position: 'absolute', minHeight: '400px' }}
          >
            <div>
              {tableData.length && !fullLoading ? (
                <DzhTable
                  rowKey={() => shortId()}
                  type="stickyTable"
                  className={cn(tableStyle.tableStyleWrapper, { [tableStyle.isLoading]: loading })}
                  onChange={handleTableChange}
                  sticky={{
                    offsetHeader: offsetHeaderTop,
                    getContainer: () => wrapperRef || window,
                  }}
                  loading={loadingIndicator}
                  columns={columns}
                  showSorterTooltip={false}
                  dataSource={tableData}
                  scroll={{ x: tableScrollWidth || '100%' }}
                />
              ) : null}
              {total > 50 ? (
                <div className={S.pagerWrapper}>
                  <Pagination total={total} current={current} pageSize={50} onChange={onPageChange} />
                </div>
              ) : null}
              {total > 0 && tableConf?.remark ? <div className={S.remark}>{tableConf.remark}</div> : null}
            </div>
            {condition && !loading && !fullLoading && tableData.length < 1 ? (
              <>
                <div className={S.emptyWrapper} />
                <Empty
                  type={error?.returncode === 500 ? Empty.LOAD_FAIL_BIG : Empty.NO_DATA_IN_FILTER_CONDITION}
                  onClick={handleReset}
                />
              </>
            ) : null}
          </Spin>
        </div>
      </div>
      {!loading && condition && <NextNode />}
    </div>
  );
}
export default function BondTemplate({ pageConfig }: any) {
  return (
    <Provider>
      <Content {...pageConfig} />
      <DetailModal />
    </Provider>
  );
}
