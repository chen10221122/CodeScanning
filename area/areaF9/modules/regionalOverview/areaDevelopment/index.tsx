import { memo, useState, useEffect, useRef, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import dayjs from 'dayjs';

import Next from '@pages/area/areaF9/components/next';

import { getDevZoneList } from '@/apis/bond/cityInvestMap';
import NoPayDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { Spin, Empty } from '@/components/antd';
import BackTop from '@/components/backTop';
import ExportDoc from '@/components/exportDoc';
import { RowItem } from '@/components/screen';
import useTraceInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useTraceSource';
import { useNoScrollBar } from '@/pages/area/areaF9/hooks/useNoScrollBar';
import useRequest from '@/utils/ahooks/useRequest';
import { scrollTo } from '@/utils/animate';
import { formatNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';
import { shortId, triggerWindowResize } from '@/utils/share';

import Filter from './components/filter';
import useFilter from './components/filter/useFilter';
import TitleWithBackImg from './components/titleWithBackImg';
import * as S from './style';
import styles from './styles.module.less';
import Table from './table';

/** 头部高度 */
const HEADER_HEIGHT = 36;
/** 分页数量 */
const PAGE_SIZE = 50;
export interface IRequestParams {
  /** 截止日期 */
  endDate: string;
  /** 地区 */
  cr0231_013?: string;
  /** 指标名称 */
  indicName2: string;
  /** 基本信息,注意：此处是特殊处理，筛选指标中的基本信息需要单独拿出来放到includes入参里面 */
  includes: string;
  /** 开发区分类 */
  cr0231_022?: string;
  /** 搜索 */
  devzName?: string;
  /** 排序名称 */
  sortKey?: string;
  /** 排序规则 */
  sortRule?: string;
  /** 分页起始位置 */
  devzFrom?: string;
  /** 分页条数 */
  devzSize?: string;
}

export const initParams: IRequestParams = {
  endDate: '',
  cr0231_013: '',
  indicName2: '',
  includes: 'CR0231_013,CR0231_014,CR0231_015,CR0231_016,CR0231_017,CR0231_018,Guid',
  cr0231_022: '',
  devzName: '',
  sortKey: 'GDP', //初始化默认是按照GDP降序排列的
  sortRule: 'desc',
  devzFrom: '',
  devzSize: `${PAGE_SIZE}`,
};

const AreaDevelopment = memo(function AreaDevelopment() {
  const developWrapper = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  /** 表格请求参数 */
  const [tableParamsData, update] = useImmer({ requestParams: initParams });
  /** 当前页码数*/
  const [curentPage, setCurentPage] = useState(1);
  /** 当前搜索关键词*/
  const keywordRef = useRef('');
  /** 表格数据总量*/
  const [total, setTotal] = useState(0);
  /** 权限：当前查看次数信息*/
  const [viewTimesInfoNow, setViewTimesInfoNow] = useState('');
  /** 权限弹窗显示 */
  const [limitVisible, setLimitVisible] = useState(false);
  /** 是否首次加载 */
  const [firstLoading, setFirstLoading] = useState(true);
  /** loading类型，SCREEN是筛选loading，SORT_PAGE_CHANGE是排序翻页loading*/
  const [loadingType, setLoadingType] = useState('');
  /** 表格分页排序加载露出表头的top动态值*/
  const [tableHeadTopHeight, setTableHeadTopHeight] = useState(53);

  /** 筛选组件key*/
  const [filterKey, setFilterKey] = useState(shortId());
  /** 当前指标信息 */
  const [indicators, setIndicators] = useState<RowItem[]>([]);

  /** 接口获取的筛选年份信息 */
  const { data: screenYearList } = useFilter();
  /** 溯源 */
  const { traceSource, traceCref } = useTraceInfo({ switchSize: '22' });

  /** 当前排序的信息，初始化默认是按照GDP降序排列 */
  const [currentSort, setCurrentSort] = useState<{ key: string; rule: string; value: string }>({
    key: 'GDP',
    value: 'GDP(亿元)',
    rule: 'desc',
  });

  const hasContentScroll = useNoScrollBar({ scrollWrapRef: developWrapper, contentRef });

  const {
    run,
    data: tableResultData,
    loading: tableLoading,
    error,
  } = useRequest<any>(getDevZoneList, {
    manual: true,
    debounceWait: 300,
    formatResult: (result: any) => {
      /** 处理非vip用户查看次数的提示内容 */
      result.info && setViewTimesInfoNow(result.info);
      return result;
    },
    onSuccess(res: any) {
      setTimeout(() => {
        triggerWindowResize();
      });
      setFirstLoading(false);
      setTotal(res?.total);
    },
    onError(err: any) {
      if (err?.returncode === 202) {
        if (err?.info?.includes('此模块已达 10 次/天')) {
          setViewTimesInfoNow('今日已查看10/10次');
        }
        setLimitVisible(true);
      }
      setFirstLoading(false);
    },
  });

  /** 请求表格数据 */
  useEffect(() => {
    let finalRequestParams = tableParamsData.requestParams;
    if (finalRequestParams.endDate && finalRequestParams.indicName2) {
      run({ ...finalRequestParams });
    }
  }, [tableParamsData.requestParams, run, update]);

  /** loading加载隐藏滚动条 */
  useEffect(() => {
    const scrollElement = document.getElementById('specialTopicDevelopmentZone');
    scrollElement?.setAttribute(
      'style',
      `overflow:
      ${tableLoading ? 'hidden' : 'overlay'}`,
    );
  }, [tableLoading]);

  /** 滚动到头部事件 */
  const scrollToTop = useMemoizedFn(() => {
    scrollTo(HEADER_HEIGHT, {
      getContainer: () => developWrapper.current!,
      duration: 0, //滚动直接变，不要动画
    });
  });

  /** 排序变化更新表格请求入参 */
  const handleSortChange = useMemoizedFn((sort) => {
    scrollToTop();
    setLoadingType('SORT_PAGE_CHANGE');
    update((data: any) => {
      data.requestParams = {
        ...data.requestParams,
        sortKey: sort.rule ? sort.key : '',
        sortRule: sort.rule,
      };
    });
  });

  /** 表格翻页事件 */
  const handlePageChange = useMemoizedFn((count) => {
    scrollToTop();
    setCurentPage(count);
    setLoadingType('SORT_PAGE_CHANGE');
    update((data: any) => {
      data.requestParams.devzFrom = String(count ? (count - 1) * 50 : 0);
    });
  });

  /** 清除筛选项 */
  const handleReset = useMemoizedFn(() => {
    setFilterKey(shortId());
    update((data: any) => {
      data.requestParams = {
        ...data.requestParams,
        devzFrom: 0,
        cr0231_022: '',
      };
    });
  });

  const titleStyle = useMemo(
    () => ({ padding: hasContentScroll ? '12px 10px 8px 24px' : '12px 20px 8px 24px' }),
    [hasContentScroll],
  );
  const scrollStyle = useMemo(() => ({ scrollbarGutter: hasContentScroll ? 'stable' : 'initial' }), [hasContentScroll]);
  const contentStyle = useMemo(
    () => ({ padding: hasContentScroll ? '0 10px 20px 20px' : '0 20px 20px 20px' }),
    [hasContentScroll],
  );
  const stickyStyle = useMemo(
    () => ({ padding: hasContentScroll ? '0 10px 0 24px' : '0 20px 0 24px' }),
    [hasContentScroll],
  );
  return (
    <>
      {/** 仅用于明细弹框挂载节点 */}
      <div id="areaDevelop_detailModal_container" />
      <div className={cn(styles.wrapper)} style={scrollStyle} id="specialTopicDevelopmentZone" ref={developWrapper}>
        <NoPayDialog visible={limitVisible} setVisible={setLimitVisible} type={`areaDevelop`} />
        <Spin type="thunder" spinning={firstLoading} translucent={!firstLoading} isNewLoadingText={true}>
          <TitleWithBackImg style={titleStyle} title="开发区经济" info={viewTimesInfoNow} />
          <div className={styles.filterStickyWrap} id="areaDevelopFilterDom" ref={contentRef}>
            <div className={styles.stickyWrap} style={stickyStyle}>
              <div className={styles.filterContent}>
                <Filter
                  filterKey={filterKey}
                  screenYearList={screenYearList}
                  keywordRef={keywordRef}
                  onSetCurentPage={setCurentPage}
                  onUpdateParams={update}
                  onSetIndicators={setIndicators}
                  onSetLoadingType={setLoadingType}
                  onScrollToTop={scrollToTop}
                  onSetTableHeadTopHeight={setTableHeadTopHeight}
                />
                <S.ExportAndTotal>
                  <div className="total">
                    共 <span>{formatNumber(total, 0) || 0}</span> 条
                  </div>
                  {traceCref}
                  <ExportDoc
                    condition={{
                      ...tableParamsData.requestParams,
                      module_type: 'web_devZone_devZoneContrastList',
                      devzFrom: '0',
                      devzSize: '10000',
                    }}
                    filename={`开发区专题_${dayjs(new Date()).format('YYYYMMDD')}`}
                  />
                </S.ExportAndTotal>
              </div>
            </div>
          </div>
          <div className={styles.mainWrapper}>
            {error ? (
              <Empty type={(error as any)?.returncode === 202 ? Empty.NO_PERMISSION_LG : Empty.MODULE_LOAD_FAIL} />
            ) : !tableResultData?.data?.length ? (
              <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={handleReset} />
            ) : (
              <div className={styles.areaDevelopment}>
                <div className={styles.tableWrap} style={contentStyle}>
                  <Table
                    data={tableResultData?.data}
                    total={total}
                    loading={tableLoading}
                    loadingType={loadingType}
                    curentPage={curentPage}
                    paginationSize={PAGE_SIZE}
                    onPageChange={handlePageChange}
                    currentSort={currentSort}
                    setCurrentSort={setCurrentSort}
                    onSortChange={handleSortChange}
                    tableHeadTopHeight={tableHeadTopHeight}
                    indicators={indicators as any}
                    isOpenSource={traceSource}
                    searchKey={keywordRef?.current}
                  />
                </div>
              </div>
            )}
          </div>
          <Next></Next>
        </Spin>
      </div>
      <BackTop target={() => developWrapper.current!} />
    </>
  );
});

export default memo(AreaDevelopment);
