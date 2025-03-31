import { useEffect, useMemo, useState } from 'react';

import { Switch, Table, Empty } from '@dzh/components';
import { ProTableFinance } from '@dzh/pro-components';
import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { isBoolean, slice } from 'lodash';
import styled from 'styled-components';

import { /* Icon, */ Pagination } from '@/components';
// import { Spin } from '@/components/antd';
import { Spin as AntSpin } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
// import DzhTable from '@/components/tableFinance';
import { useConditionCtx } from '@/pages/area/areaFinanceResource/components/layout/context';
import DetailModal from '@/pages/area/areaFinanceResource/components/modal';
import NextNode from '@/pages/area/areaFinanceResource/components/nextNode';
import Filter from '@/pages/area/areaFinanceResource/components/template/filter';
import { useCtx } from '@/pages/area/areaFinanceResource/context';
import { newHeadTitleHeight } from '@/pages/full/financingInstitution/components/headTitle';
import { formatNumber } from '@/utils/format';

import { sortMap } from '../../config';
import tableStyle from './style.module.less';

import S from '@/pages/area/areaFinanceResource/style.module.less';

export const [headHeight, screenHeight] = [83, 43];

const TableNew = Table as any;

const DzhTableNew = ProTableFinance as any;

interface ContentProps {
  columns: any[];
  screenConfig: any[];
  handleScreen: any;
  /** 表格接口调用函数 */
  apiName?: any;
  /**@description 筛选组件受控值 */
  screenValue: any[];
  handleSort: any;
  pageChangeFn?: (cur: number) => void;
  /** 全量数据，每次只展示50条, 通过condition中的skip参数进行控制 */
  fullData: boolean;
  firstLevelTitle?: string;
  resizeTable?: boolean;
  areaFormConfig?: any;
  areaLevelOption?: any;
  areaValue: any;
  containerId?: string;
}

function Content({
  columns,
  screenConfig,
  handleScreen,
  screenValue,
  handleSort,
  pageChangeFn,
  fullData = false,
  firstLevelTitle,
  resizeTable,
  areaFormConfig,
  areaLevelOption,
  areaValue,
  containerId,
}: ContentProps) {
  const {
    state: {
      condition,
      error,
      total,
      tableData,
      isOpenSource,
      tableLoading,
      tableExport,
      exportName,
      isFirstLoad,
      hiddenBlankColumn,
      reginLevel,
    },
    update,
  } = useConditionCtx();
  const {
    state: { fullLoading },
    update: updateCtx,
  } = useCtx();
  const [isMac, setIsMac] = useState(false);

  if (fullLoading && !isFirstLoad) {
    updateCtx((d) => {
      d.fullLoading = false;
    });
  }

  const handleChange = useMemoizedFn((pagination, filters, sorter, extra: { currentDataSource: []; action: any }) => {
    if (handleSort) {
      handleSort(pagination, filters, sorter, extra);
    } else {
      update((d) => {
        d.condition.sortKey = sorter.order ? sorter.field : '';
        d.condition.sortRule = `${sortMap.get(sorter.order) || ''}`;
        d.tableLoading = true;
      });
    }
    if (document.getElementById(`${containerId ? containerId : 'areaFinancingWrapper'}`)) {
      (document.getElementById(`${containerId ? containerId : 'areaFinancingWrapper'}`) as HTMLElement).scrollTop = 0;
    }
  });
  /**
   * 表格加载控制
   * 分页加载和筛选加载loading区分
   */
  const loadingIndicator = useMemo(() => {
    return { spinning: tableLoading, translucent: true, type: 'square' };
  }, [tableLoading]);

  const exportParams = useMemo(() => {
    return {
      condition: { ...condition, module_type: tableExport },
      filename: exportName,
      usePost: true,
    };
  }, [condition, exportName, tableExport]);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Mac OS')) {
      setIsMac(true);
    }
  }, []);

  // 解决双滚动条
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [tableData]);

  const tableComponent = useMemo(() => {
    if (!tableData?.length) {
      return <Empty type={Empty.NO_DATA} />;
    }
    return resizeTable ? (
      <DzhTableNew
        className={{ [tableStyle.mac]: isMac }}
        type={'stickyTable'}
        columns={columns}
        stripe={true}
        scroll={{ x: reginLevel !== 'province' ? 940 : 1024 }}
        sortDirections={['descend', 'ascend']}
        showSorterTooltip={false}
        dataSource={fullData ? slice(tableData, condition.skip, condition.skip + 50) : tableData}
        loading={loadingIndicator}
        onlyBodyLoading={true}
        onChange={handleChange}
        sticky={{
          offsetHeader: firstLevelTitle ? 68 : 32 + newHeadTitleHeight,
          getContainer: () =>
            document.getElementById('contentScrollDom') ||
            document.getElementById(`${containerId ? containerId : 'areaFinancingWrapper'}`) ||
            window,
        }}
      />
    ) : (
      <TableNew
        className={cn(tableStyle.noResizeTable)}
        type={'stickyTable'}
        columns={columns}
        stripe={true}
        scroll={{ x: 1336 }}
        sortDirections={['descend', 'ascend']}
        showSorterTooltip={false}
        dataSource={fullData ? slice(tableData, condition.skip, condition.skip + 50) : tableData}
        loading={loadingIndicator}
        onlyBodyLoading={true}
        pagination={false}
        onChange={handleChange}
        sticky={{
          offsetHeader: firstLevelTitle ? 68 : 32 + newHeadTitleHeight,
          getContainer: () =>
            document.getElementById('contentScrollDom') ||
            document.getElementById(`${containerId ? containerId : 'areaFinancingWrapper'}`) ||
            window,
        }}
      />
    );
  }, [
    columns,
    condition.skip,
    firstLevelTitle,
    fullData,
    handleChange,
    isMac,
    loadingIndicator,
    reginLevel,
    resizeTable,
    tableData,
    containerId,
  ]);

  return (
    <div className={S.templateWrapper} id="areaFinancingWrapper-contentWrap">
      <SpinWrapper
        wrapperClassName="full-page-spin-wrapper"
        type="thunder"
        direction="vertical"
        spinning={isFirstLoad}
        tip="加载中"
      >
        <div className={S.templateContent}>
          <div className={S.menu}>
            {screenConfig.length && (
              <Filter
                areaValue={areaValue}
                screenConfig={screenConfig}
                value={screenValue}
                handleScreen={handleScreen}
                areaFormConfig={areaFormConfig}
                areaLevelOption={areaLevelOption}
              />
            )}
            {condition && error?.returncode !== 500 ? (
              <div className={S.menuRight}>
                {isOpenSource !== undefined ? (
                  <div className={S.sourceNode}>
                    <Switch
                      size="22"
                      checked={isOpenSource}
                      onClick={() => {
                        update((d) => {
                          d.isOpenSource = !isOpenSource;
                        });
                      }}
                    />
                    溯源
                  </div>
                ) : null}
                {isBoolean(hiddenBlankColumn) ? (
                  <div className={S.switchNode}>
                    <Switch
                      size="22"
                      checked={hiddenBlankColumn}
                      onClick={() =>
                        update((d) => {
                          d.hiddenBlankColumn = !hiddenBlankColumn;
                          d.condition.hiddenBlankColumn = !hiddenBlankColumn;
                          d.ready = false;
                        })
                      }
                    />
                    隐藏空列
                  </div>
                ) : null}
                <span className={S.count}>
                  共计 <span>{formatNumber(total, 0)}</span> 条
                </span>
                <ExportDoc {...exportParams} />
              </div>
            ) : null}
          </div>
          <div className={S.tableWrapper}>
            {firstLevelTitle ? <div className={S.firstLevelTitle}>{firstLevelTitle}</div> : null}
            {tableComponent}
            <Pagination
              current={condition.skip / 50 + 1 || 1}
              pageSize={50}
              total={total}
              onChange={(current) => {
                if (pageChangeFn) {
                  pageChangeFn(current);
                } else {
                  update((d) => {
                    d.condition.skip = (current - 1) * 50;
                    d.tableLoading = true;
                  });
                }
                if (document.getElementById(`${containerId ? containerId : 'areaFinancingWrapper'}`)) {
                  (
                    document.getElementById(`${containerId ? containerId : 'areaFinancingWrapper'}`) as HTMLElement
                  ).scrollTop = 0;
                }
              }}
              style={{ padding: '8px 0px 0px', position: 'relative', marginBottom: 0 }}
              align={'left'}
            />
          </div>
        </div>
      </SpinWrapper>

      {!isFirstLoad && condition && <NextNode />}
    </div>
  );
}
export default function CommonTemplate({ pageConfig }: any) {
  return (
    <>
      <Content
        {...pageConfig}
        columns={pageConfig.columns}
        screenConfig={pageConfig.screenConfig}
        handleMenuChange={pageConfig.handleMenuChange}
        defaultCondition={pageConfig.defaultCondition}
        apiName={pageConfig.apiName}
        dataFormatFn={pageConfig.dataFormatFn}
        headerFixConfig={pageConfig.headerFixConfig}
      />
      <DetailModal containerId={pageConfig?.containerId} />
    </>
  );
}

const SpinWrapper = styled(AntSpin)`
  .full-page-spin-wrapper {
    > .ant-spin-container {
      height: 100%;
      min-height: calc(100vh - 258px);
    }
  }
`;
