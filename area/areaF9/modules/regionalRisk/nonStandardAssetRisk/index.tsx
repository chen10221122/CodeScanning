import { memo, useRef, useState, useEffect, useCallback } from 'react';

import dayjs from 'dayjs';

import Next from '@pages/area/areaF9/components/next';
import { useSelector } from '@pages/area/areaF9/context';

import { getNonstandardAreaF9 } from '@/apis/bond/nonStandardAssetRisk';
import { Spin, Empty } from '@/components/antd';
import BackTop from '@/components/backTop';
import Pagination from '@/components/Pagination';
import { Screen, Options } from '@/components/screen';
import FinanceTable from '@/components/tableFinance';
import TopicSearch from '@/components/topicSearch';
import { NONSTANDARD_RISK_HISTORY } from '@/configs/localstorage';
import useColumn from '@/pages/area/areaF9/modules/regionalRisk/nonStandardAssetRisk/useColumns';
import { Content, Wrapper } from '@/pages/area/areaF9/modules/regionalRisk/style';
import { useRiskCommon } from '@/pages/area/areaF9/modules/regionalRisk/useCommon';
import ExportDoc from '@/pages/bond/nonStandardAssetRisk/components/countExportDoc';
import NewProcessModal from '@/pages/bond/nonStandardAssetRisk/components/newProcessModal';
import { menuConfigF9 } from '@/pages/bond/nonStandardAssetRisk/menuConfig';
import useAsync from '@/pages/bond/nonStandardAssetRisk/useAsync';
import { useCommonFunc } from '@/pages/bond/nonStandardAssetRisk/useCommonFunc';
import { shortId } from '@/utils/share';

const pageSize = 50;
const originCondition = {
  keyword: '',
  regionCodes: '',
  financerAreaCodes: '',
  sort: 'BD0270_015:desc',
  type: '',
  type1: '',
  isUDIC: '',
  func: '/app/appNonStandardDefaultRiskNew',
  from: 0,
  riskType: '',
  disclosureStartDate: '',
  disclosureEndDate: '',
  size: pageSize,
};
const NonStandardAssetRisk = () => {
  const areaInfo = useSelector((store) => store.areaInfo);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const filterElRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState({
    show: false,
    title: '',
    content: '',
  });
  const tableRef = useRef(null);
  const { execute: executeRequest, pending, data, error }: any = useAsync(getNonstandardAreaF9);
  const [listData, setListData] = useState([]);
  const [fristLoading, setFirstLoading] = useState(true);
  const {
    condition,
    handleSearch,
    keywordRef,
    skipRef,
    screenValues,
    topicSearchRef,
    handleMenuDataChange,
    handlePageChange,
    clearFilter,
  } = useCommonFunc({
    pageSize,
    menuData: menuConfigF9,
    originCondition,
    setListData: undefined,
  });
  const handleCheckClick = useCallback((title, content) => {
    setModal({
      show: true,
      title,
      content,
    });
  }, []);
  const { column } = useColumn({
    keyword: keywordRef.current,
    data,
    skip: skipRef.current,
    handleCheckClick,
  });
  const { loadingTips, totalWidth } = useRiskCommon(column);
  const initPage = useCallback(async () => {
    if (areaInfo) {
      condition['sort'] = condition['sort'] ? condition['sort'] : 'BD0270_015:desc';
      condition['financerAreaCodes'] = areaInfo ? areaInfo.regionCode : '';
      await executeRequest(condition);
      setFirstLoading(false);
    }
  }, [condition, executeRequest, areaInfo]);
  useEffect(() => {
    /**修改执行顺序确保第一次数据刷回来再离开loading */
    initPage();
  }, [initPage]);
  useEffect(
    function changeRenderList() {
      if (data?.data) {
        setListData(data.data);
      }
    },
    [condition.keyword, data?.data, skipRef],
  );
  const PageContent = () => {
    return fristLoading ? (
      <Spin spinning={fristLoading} type="fullThunder"></Spin>
    ) : (
      <Wrapper ref={wrapperRef}>
        <>
          <Content id="overdue-content" ref={contentRef} hasPagination={data?.length > 50}>
            <NewProcessModal
              modal={modal}
              setModal={setModal}
              getContainer={wrapperRef.current || document.body}
            ></NewProcessModal>
            <p className={'main-title'}>{'非标资产风险'}</p>
            {/* 条件筛选区域 */}
            <div className="filter" ref={filterElRef}>
              <div className="filter-left">
                <div className="screenWrap" ref={screenRef}>
                  <Screen
                    getPopContainer={() => screenRef.current || document.body}
                    options={menuConfigF9 as Options[]}
                    values={screenValues}
                    onChange={handleMenuDataChange}
                  />
                </div>

                <div className="searchWrap">
                  <TopicSearch
                    cref={topicSearchRef}
                    onClear={() => handleSearch('')}
                    onChange={(value: string) => {
                      keywordRef.current = value;
                    }}
                    onSearch={(value: string) => handleSearch(value)}
                    dataKey={NONSTANDARD_RISK_HISTORY}
                  />
                </div>
              </div>

              <div className="filter-right">
                <ExportDoc
                  counter={(data && data.length) || 0}
                  condition={{ ...condition, module_type: 'non_standard_pc' }}
                  filename={`非标资产风险${dayjs(new Date()).format('YYYYMMDD')}`}
                />
              </div>
            </div>

            {/* 表格区域 */}
            {data && data.length > 0 ? (
              <div ref={tableRef}>
                <FinanceTable
                  stripe={true}
                  rowKey={() => shortId()}
                  scrollTo={null}
                  type
                  hideOnSinglePage
                  finance
                  components={null}
                  scroll={{ x: totalWidth() }}
                  sticky={{
                    offsetHeader: 36,
                    getContainer: () => wrapperRef.current!,
                  }}
                  columns={column}
                  dataSource={listData}
                  loading={
                    pending
                      ? {
                          wrapperClassName: 'mount-table-loading',
                          tip: '加载中',
                          indicator: loadingTips,
                        }
                      : false
                  }
                />
              </div>
            ) : (
              <>
                {pending ? (
                  <Spin spinning={pending} type="fullThunder"></Spin>
                ) : error ? (
                  <Empty type={Empty.LOAD_FAIL} style={{ marginTop: '15vh' }} />
                ) : (
                  <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} style={{ marginTop: '15vh' }} onClick={clearFilter} />
                )}
              </>
            )}

            {data?.length > 50 ? (
              <div>
                <Pagination
                  current={skipRef.current / 50 + 1 || 1}
                  pageSize={50}
                  total={data.length}
                  onChange={(params) => {
                    handlePageChange(params);
                    contentRef.current?.scrollIntoView();
                  }}
                  style={{ padding: '8px 0px 16px', position: 'relative', left: '9px', marginBottom: 0 }}
                  align={'left'}
                />
              </div>
            ) : null}
          </Content>
          <Next></Next>
          <BackTop target={() => wrapperRef.current || document.body} />
        </>
      </Wrapper>
    );
  };

  return PageContent();
};

export default memo(NonStandardAssetRisk);
