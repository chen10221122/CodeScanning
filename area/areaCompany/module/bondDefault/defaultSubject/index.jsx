import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
// import { isEqual } from 'lodash';
import styled from 'styled-components';

import { getDefaultEntityBondDetail } from '@/apis/default';
import { Empty, Spin } from '@/components/antd';
import { getDefaultSubject } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { useSelector } from '@/pages/area/areaF9/context';
import Modal from '@/pages/default/bondDefault/modules/common/modal';
import DetailTable from '@/pages/default/bondDefault/modules/common/table/detailTable';
import FullTable from '@/pages/default/bondDefault/modules/defaultFull/table';
import { useHideScrollbar, useImmer, useRequest } from '@/utils/hooks';
import { shortId } from '@/utils/share';

import { FilterWrap, /** PageWrapper,  */ DefaultContainer } from '../style';
import DetailSummary from './components/detailSummary';
import FilterCondition from './components/filterCondition';
import useColumns from './useColumns';

const PAGE_SIZE = 50;
// const TOTAL_SIZE = 9999;
const regionInitParams = {
  provinceCode: '',
  cityCode: '',
  countyCode: '',
};

const SCROLL_EL_ID = 'area-company-index-container';
let totalCount = 0;

const DefaultSubject = () => {
  const skipRef = useRef(0);
  const currentPage = useRef(1);
  const prevParams = useRef();
  const tableRef = useRef(null);
  const [screenKey, setScreenKey] = useState('');
  const { areaInfo } = useSelector((store) => ({
    areaInfo: store.areaInfo,
  }));
  const [regionParams, updateRegionParams] = useImmer({
    provinceCode: '',
    countryCode: '',
    cityCode: '',
  });
  const [params, setParams] = useImmer({
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    skip: skipRef.current,
    pagesize: PAGE_SIZE,
  });

  const [sourceData, setSourceData] = useState([]);
  // const [topSummaryData, setTopSummaryData] = useState({});
  /** 列表全量数据（用于复制） */
  // const [totalData, setTotalData] = useState([]);
  /** 是否点击复制 */
  // const [clickCopy, setClickCopy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { loading: subjectPending, run } = useRequest(
    useMemoizedFn(() => getDefaultSubject(params)),
    {
      track: { once: true },
      manual: true,
      formatResult: ({ data }) => data,
      onError: (e) => {
        if (e?.returncode === 100) {
          totalCount = 0;
          setSourceData([]);
          setLoaded(true);
        }
      },
      onSuccess: (data) => {
        setLoaded(true);
        if (data) {
          // if (skipRef.current === 0) setTopSummaryData(data.defaultStats);
          if (data?.defaultStats?.orgCount) totalCount = data.defaultStats.orgCount;
          setSourceData(data.list);
        }
      },
    },
  );

  useEffect(() => {
    if (
      JSON.stringify(params) !== JSON.stringify(prevParams.current) &&
      (params?.cityCode || params?.countyCode || params?.provinceCode)
    ) {
      run(params);
      prevParams.current = params;
    }
  }, [params, run]);

  useEffect(() => {
    if (areaInfo && areaInfo?.level && areaInfo?.regionCode) {
      let draft = {},
        area = areaInfo.regionCode;
      switch (areaInfo.level) {
        case 1:
          draft = { provinceCode: area };
          break;
        case 2:
          draft = { cityCode: area };
          break;
        case 3:
          draft = { countyCode: area };
          break;
        default:
          draft = {};
          break;
      }
      setParams((old) => {
        return { ...old, ...regionInitParams, ...draft };
      });
      updateRegionParams((d) => {
        switch (areaInfo.level) {
          case 1:
            d.provinceCode = areaInfo?.regionCode;
            break;
          case 2:
            d.cityCode = areaInfo?.regionCode;
            break;
          case 3:
            d.countyCode = areaInfo?.regionCode;
            break;
          default:
            break;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaInfo, setParams]);

  useHideScrollbar(document.getElementById(SCROLL_EL_ID), subjectPending);

  const handlePageChg = useCallback(
    (page, pageSize) => {
      currentPage.current = page;
      skipRef.current = pageSize * (page - 1);
      setParams((old) => {
        return { ...old, skip: skipRef.current };
      });
      document.getElementById(SCROLL_EL_ID).scrollTop = 0;
    },
    [setParams],
  );

  const handleCondition = useCallback(
    (condition) => {
      currentPage.current = 1;
      setParams((old) => {
        return { ...old, ...condition };
      });
      document.getElementById(SCROLL_EL_ID).scrollTop = 0;
    },
    [setParams],
  );

  //
  const [defaultDetailVisible, setDefaultDetailVisible] = useState(false);
  const [currentBond, setCurrentBond] = useState();

  const {
    run: detailExecute,
    data: detailData,
    loading: detailPending,
  } = useRequest(getDefaultEntityBondDetail, {
    manual: true,
    formatResult: ({ data }) => data,
  });
  const showDefaultDetailModal = useCallback(
    (raw) => {
      setCurrentBond(raw);
      setDefaultDetailVisible(true);
      detailExecute({ itCode: raw.itCode || raw.itCode2 });
    },
    [detailExecute],
  );

  const { columns, detailColumns } = useColumns({
    setDefaultDetailVisible,
    showDefaultDetailModal,
    params,
    tableRef,
    data: sourceData,
    // totalData,
    // totalDataError,
    // setClickCopy,
  });

  const renderDetail = useMemo(() => {
    return (
      <DetailWrap>
        <DetailSummary offShore={false} data={currentBond} />
        <MDetailTable
          dataSource={detailData?.map((o, idx) => ({ key: idx, ...o }))}
          columns={detailColumns}
          scroll={{ y: 258 }}
        />
      </DetailWrap>
    );
  }, [currentBond, detailColumns, detailData]);

  const sticky = useMemo(() => {
    return {
      offsetHeader: subjectPending ? 0 : 75,
      getContainer: () => document.getElementById(SCROLL_EL_ID) || window,
    };
  }, [subjectPending]);
  const emptyClick = useCallback(() => {
    setScreenKey(shortId());
    setParams((old) => {
      return { skip: 0, pagesize: PAGE_SIZE, ...regionParams };
    });
    setLoaded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionParams]);
  return (
    <DefaultContainer>
      {/* <PageWrapper> */}
      <Modal
        title={'违约大全明细'}
        type="detail"
        loading={detailPending}
        visible={defaultDetailVisible}
        setVisible={setDefaultDetailVisible}
        width={680}
        bodyStyle={{ padding: '16px 0 16px' }}
      >
        {renderDetail}
      </Modal>
      {!loaded ? (
        <Spin spinning type="fullThunder" />
      ) : (
        <>
          <FilterWrap key={screenKey}>
            <FilterCondition
              getCondition={handleCondition}
              regionInfo={{
                provinceCode: params?.provinceCode ?? '',
                cityCode: params?.cityCode ?? '',
                countyCode: params?.countyCode ?? '',
              }}
              PAGE_SIZE={PAGE_SIZE}
              skipRef={skipRef}
              count={totalCount}
            />
          </FilterWrap>
          {sourceData?.length ? (
            <Spin
              spinning={subjectPending}
              type="thunder"
              tip="加载中"
              useTag
              keepCenter
              wrapperClassName="mount-table-loading-animation"
            >
              <div ref={tableRef}>
                <FullTable
                  type="stickyTable"
                  columns={columns}
                  dataSource={sourceData}
                  sticky={sticky}
                  scroll={{
                    x: 'max-content',
                  }}
                  pagination={{
                    current: currentPage.current,
                    className: 'pagination',
                    hideOnSinglePage: true,
                    pageSize: PAGE_SIZE,
                    total: totalCount,
                    size: 'small',
                    showSizeChanger: false,
                    onChange: handlePageChg,
                  }}
                />
              </div>
            </Spin>
          ) : (
            <Empty
              type={Empty.NO_DATA_IN_FILTER_CONDITION}
              onClick={emptyClick}
              style={{ marginTop: '15vh', paddingBottom: '40px' }}
            />
          )}
        </>
      )}
      {/* </PageWrapper> */}
    </DefaultContainer>
  );
};

export default React.memo(DefaultSubject);

const MDetailTable = styled(DetailTable)`
  /* padding-left: 24px; */
`;

const DetailWrap = styled.div`
  .summary {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    margin-bottom: 16px;
    padding: 0 24px;

    .card {
      flex: 1;
      height: 68px;
      background: #ffffff;
      border-radius: 3px;
      box-shadow: 0px 2px 9px 2px rgba(0, 0, 0, 0.09), 0px 2px 4px 0px rgba(0, 0, 0, 0.07);
      padding: 8px 0 0 16px;
      position: relative;

      &:not(:last-child) {
        margin-right: 16px;
      }

      .title {
        font-size: 13px;
        color: #262626;
      }

      .content {
        display: flex;
        align-items: flex-end;
        margin-top: 4px;

        .nums {
          font-size: 20px;
          font-weight: 500;
          color: #ff7500;
          line-height: 20px;
        }

        .unit {
          font-size: 13px;
          color: #666666;
          line-height: 16px;
          margin-left: 4px;
        }
      }
    }
  }
`;
