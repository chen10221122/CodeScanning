/* 企业负面舆情指数 */

import { FC, memo, useEffect, useMemo, useRef, useState } from 'react';

import { Empty, EmptyLayoutType, Spin } from '@dzh/components';
import { Updater, useImmer } from '@dzh/utils';
import { useCreation, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface';
import { uniq } from 'lodash';
import styled from 'styled-components';

import { useTab } from '@/libs/route';
import Next from '@/pages/area/areaF9/components/next';
import { useSelector } from '@/pages/area/areaF9/context';
import { getColumnSubItem } from '@/pages/area/areaF9/modules/regionalOverview/monitoring/config';
import MonitoringTable, {
  MonitoringTableProps,
  onChangeType,
} from '@/pages/publicOpinionPages/monitoring/components/table';
import { PAGESIZE, pageToSkip, skipToPage, sortReverseMap } from '@/pages/publicOpinionPages/monitoring/config';
import useGetTableList, { RiskCompanyListApiParam } from '@/pages/publicOpinionPages/monitoring/hooks/useGetTableList';

import useNewsDetailModal from './components/modals/newsDetailModal/useNewsDetailModal';
import useTrendModal from './components/modals/trendModal/useTrendModal';
import ScreenTitle from './components/screenTitle';
import { STATIC_COMPANYTYPE } from './config';
import { Provider } from './context';

const defaultParams: RiskCompanyListApiParam = {
  pagesize: '50',
  skip: '0',
  sort: 'riskIndexDayLatest:desc',
  /** 是否展示标签 */
  showTags: 1,
  keyField: '1',
  companyType: STATIC_COMPANYTYPE,
};

const sticky = {
  offsetHeader: 63,
};

const defaultHookProps = {
  needTrendInfo: true,
  needHiddenTag: false,
};

const sortMap = new Map([
  ['desc', 'descend'],
  ['asc', 'ascend'],
]);
/**
 * 将riskIndexDayChange:desc 转成 {key, sorter}
 * @param sort
 */
const transformSortToObj = (sort: string) => {
  const list = sort.split(':');
  return {
    key: list[0],
    sorter: sortMap.get(list[1]),
  } as Pick<MonitoringTableProps, 'sort'>['sort'];
};

const ModuleTemplate: FC = () => {
  const { areaInfo, jurisdictionCode, pathFrom } = useSelector((s) => ({
    areaInfo: s.areaInfo,
    jurisdictionCode: s.jurisdictionCode,
    pathFrom: s.pathFrom,
  }));
  const prevListSort = useCreation(() => ({ current: defaultParams.sort }), []);
  /** 是否筛选变动 */
  const isScreenChangeRef = useRef(false);
  const isTablePageChangeRef = useRef(false);
  const withSubCodeRef = useRef(false);
  const codeUpdateCountRef = useRef(0);
  const [isTabActive, setIsTabActive] = useState(false);
  const isTabActiveRef = useRef(false);
  const [isTreeNodeChange, setIsTreeNodeChange] = useState(false);
  const [apiParams, updateApiParams] = useImmer(defaultParams);
  /** 表格数据 三个接口拼接成的 */
  const { getList, tableData, total, pageLoading, listLoading, listError, noData } = useGetTableList(defaultHookProps);

  useTab({
    onActive() {
      setIsTabActive(true);
      isTabActiveRef.current = true;
    },
    onDeActive() {
      setIsTabActive(false);
      isTabActiveRef.current = false;
    },
  });

  const { modal: trendModal } = useTrendModal();
  const { modal: newsDetailModal } = useNewsDetailModal();

  /** 判断是否筛选变动 */
  const confirmIsScreenChange = useMemoizedFn((isScreenChange: boolean) => {
    isScreenChangeRef.current = isScreenChange;
    isTablePageChangeRef.current = false;
  });

  /** 重置筛选 */
  const resetScreen = useMemoizedFn(() => {
    updateApiParams((d) => {
      d = { ...defaultParams, regionCode: d.regionCode };
      return d;
    });
  });

  /** 表格置顶 */
  const backToTableTop = useMemoizedFn(() => {
    const dom = document.querySelector('.side-page-content') as HTMLElement;
    if (dom && dom.scrollTop) {
      dom.scrollTop = 0;
    }
  });

  /** 处理筛选 */
  const handleUpdateApiParams = useMemoizedFn(((updater) => {
    updateApiParams(updater);
    backToTableTop();
  }) as Updater<RiskCompanyListApiParam>);

  /** 处理表格排序 */
  const handleTableSort = useMemoizedFn((sorter: SorterResult<Record<string, any>>) => {
    const newSort = `${sorter.columnKey}:${sortReverseMap.get(sorter.order!) || 'desc'}`;
    if (prevListSort.current !== newSort) {
      updateApiParams((d) => {
        d.sort = newSort;
        // 排序重置分页
        d.skip = defaultParams.skip;
      });
      prevListSort.current = newSort;
      isTablePageChangeRef.current = false;
    }
  });
  /** 处理表格分页变动 */
  const handleTablePage = useMemoizedFn((pagination: TablePaginationConfig) => {
    updateApiParams((d) => {
      d.skip = String(pageToSkip(pagination.current || 1));
    });
    backToTableTop();
    isTablePageChangeRef.current = true;
  });
  /** 表格变动 */
  const handleTableChange = useMemoizedFn(((pagination, filters, sorter, extra) => {
    confirmIsScreenChange(false);
    if (extra.action === 'sort') {
      if (sorter && !Array.isArray(sorter)) {
        handleTableSort(sorter);
      }
    } else if (extra.action === 'paginate') {
      if (pagination) {
        handleTablePage(pagination);
      }
    }
  }) as onChangeType);

  const tableSticky = useMemo(
    () => ({
      ...sticky,
      getContainer: () => (document.getElementsByClassName('side-page-content')[0] as HTMLElement) || document.body,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTabActive],
  );

  const columns = useMemo(
    () =>
      getColumnSubItem({
        curSkip: String(skipToPage(Number(apiParams.skip)) * PAGESIZE),
        keyword: apiParams.query,
        specialCompany: false,
      }),
    [apiParams.skip, apiParams.query],
  );

  /** table组件分页配置 */
  const pagination = useMemo(() => {
    return {
      total,
      pageSize: PAGESIZE,
      current: skipToPage(Number(apiParams.skip)),
    };
  }, [total, apiParams.skip]);

  // 根据请求参数来处理sort
  const tableInitSort = useMemo(() => {
    if (apiParams.sort) return transformSortToObj(apiParams.sort);
  }, [apiParams.sort]);

  const regionCode = useMemo(() => {
    let areaCode: string[] = [];
    const regionCode = areaInfo?.regionCode || '';
    if (areaInfo?.level === 3) {
      if (regionCode) {
        withSubCodeRef.current = false;
        areaCode = [regionCode];
      }
    } else {
      if (regionCode && jurisdictionCode) {
        // 两个都会导致rerender 并且间隔较长 可能会导致接口发多次 并且参数会错误 虽然前端代码不友好 也只能这么做
        withSubCodeRef.current = true;
        areaCode = uniq([regionCode, ...jurisdictionCode.split(',')]);
      }
    }
    return areaCode;
  }, [areaInfo?.regionCode, areaInfo?.level, jurisdictionCode]);

  // 切换目录树节点
  useEffect(() => {
    setIsTreeNodeChange(!!(pathFrom && pathFrom !== window.location.pathname));
  }, [pathFrom]);

  // 只有切换节点，effect才执行了一次; 其他情况下 effect执行两次
  useEffect(() => {
    codeUpdateCountRef.current += 1;
  }, [areaInfo?.regionCode, jurisdictionCode]);

  useEffect(() => {
    // isTabActive是为了在切换tab时，不执行effect
    if (regionCode.length && isTabActiveRef.current) {
      if (withSubCodeRef.current) {
        if (codeUpdateCountRef.current === (isTreeNodeChange ? 1 : 2)) {
          updateApiParams((d) => {
            d.regionCode = regionCode.join(',');
          });
          withSubCodeRef.current = false;
          codeUpdateCountRef.current = 0;
        }
      } else {
        updateApiParams((d) => {
          d.regionCode = regionCode.join(',');
        });
      }
    }
  }, [updateApiParams, regionCode, isTreeNodeChange]);

  useUpdateEffect(() => {
    if (apiParams.companyType) {
      getList(apiParams);
    }
  }, [apiParams, getList]);

  // 禁止滚动
  useUpdateEffect(() => {
    let dom: HTMLElement;
    if (isScreenChangeRef.current || isTablePageChangeRef.current) {
      dom = document.getElementsByClassName('dzh-container-right')[0] as HTMLElement;
      if (dom) {
        dom.style.overflow = listLoading ? 'hidden' : '';
      }
    }
    return () => {
      if (dom) dom.style.overflow = '';
    };
  }, [listLoading]);

  return (
    <ModuleTemplateContainer>
      <Spin type="thunder" spinning={pageLoading}>
        <SubTitle>高舆情风险企业</SubTitle>
        {listError && !isScreenChangeRef.current ? (
          <Empty.Layout type={EmptyLayoutType.Margin}>
            <Empty type={noData ? Empty.NO_DATA : Empty.LOAD_FAIL} />
          </Empty.Layout>
        ) : (
          <>
            <ScreenTitle
              total={total}
              defaultCompanyType={STATIC_COMPANYTYPE}
              apiParams={apiParams}
              updateApiParams={handleUpdateApiParams}
              confirmIsScreenChange={confirmIsScreenChange}
            />
            {listError && isScreenChangeRef.current ? (
              // 筛选error
              <Empty.Layout type={EmptyLayoutType.Margin}>
                <Empty type={Empty.NO_SCREEN_DATA} onCleanClick={resetScreen} />
              </Empty.Layout>
            ) : (
              <MonitoringTable
                loading={listLoading}
                columns={columns}
                dataSource={tableData}
                onChange={handleTableChange}
                pagination={pagination}
                rowKey={(record) => record.id}
                sticky={tableSticky}
                // scroll={{ x: 1100 }}
                sort={tableInitSort}
                // columnLayout="fixed"
              />
            )}
          </>
        )}
      </Spin>
      {newsDetailModal}
      {trendModal}
    </ModuleTemplateContainer>
  );
};

const Monitoring = () => {
  return (
    <Provider>
      <ModuleTemplate />
      <Next />
    </Provider>
  );
};

export default memo(Monitoring);

const ModuleTemplateContainer = styled.div`
  width: 100%;
  min-height: calc(100% - 48px);
  /* border: 1px solid #efefef; */
  border-top: none;
  border-radius: 0px 4px 4px 0px;
  background-color: #fff;
  padding: 0 12px;
`;

const SubTitle = styled.div`
  width: 100%;
  height: 35px;
  padding: 6px 0 6px 16px;
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 4;
  font-size: 15px;
  font-weight: 500;
  color: #141414;
  line-height: 23px;
  &::before {
    position: absolute;
    content: '';
    width: 3px;
    height: 14px;
    background: #ff9347;
    border-radius: 2px;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
`;
