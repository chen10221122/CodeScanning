import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useUpdateEffect } from 'ahooks';
import cn from 'classnames';
import { isEqual } from 'lodash';

// import { getDefaultCompleteDefaultBond } from '@/apis/default';
import { Empty, Skeleton, Spin } from '@/components/antd';
import { getDefaultDetail } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { useSelector } from '@/pages/area/areaF9/context';
import FullTable from '@/pages/default/bondDefault/modules/defaultFull/table';
import { useHideScrollbar, useImmer, useRequest } from '@/utils/hooks';
import { shortId } from '@/utils/share';

import { FilterWrap, /** PageWrapper,  */ DefaultContainer } from '../style';
import FilterCondition from './components/filterCondition';
import S from './styles.module.less';
import useColumns from './useColumns';

const PAGE_SIZE = 50;

const SCROLL_EL_ID = 'area-company-index-container';

const regionInitParams = {
  provinceCode: '',
  cityCode: '',
  countyCode: '',
};

const DefaultBond = () => {
  const location = useLocation();
  const { word, skeleton } = location.state || {};
  const [currentSort, setCurrentSort] = useState();
  const skipRef = useRef(0);
  const tableRef = useRef(null);
  const [regionParams, updateRegionParams] = useImmer({
    provinceCode: '',
    countryCode: '',
    cityCode: '',
  });
  const { areaInfo } = useSelector((store) => ({
    areaInfo: store.areaInfo,
  }));
  const [params, setParams] = useImmer({
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    skip: skipRef.current,
    pagesize: PAGE_SIZE,
    text: word ? decodeURIComponent(word) : '',
  });

  useUpdateEffect(() => {
    if (word) {
      setParams((d) => {
        d.text = decodeURIComponent(word);
      });
    }
  }, [word]);

  useEffect(() => {
    if (currentSort)
      setParams((old) => {
        old.sort = currentSort?.value;
      });
  }, [currentSort, setParams]);

  useEffect(() => {
    if (areaInfo && areaInfo?.level && areaInfo?.regionCode) {
      let draft = {};
      switch (areaInfo.level) {
        case 1:
          draft = { provinceCode: areaInfo?.regionCode };
          break;
        case 2:
          draft = { cityCode: areaInfo?.regionCode };
          break;
        case 3:
          draft = { countyCode: areaInfo?.regionCode };
          break;
        default:
          draft = {};
          break;
      }
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
      setParams((old) => {
        return { ...old, ...regionInitParams, ...draft };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaInfo, setParams]);

  const [sourceData, setSourceData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [screenKey, setScreenKey] = useState('');

  const {
    run: handleGet,
    data: bondData,
    loading: bondPending,
  } = useRequest(getDefaultDetail, {
    manual: true,
    track: { once: true },
    refreshDeps: [params],
    formatResult: ({ data }) => {
      return data;
    },
    onSuccess: ({ list }) => {
      setLoaded(true);
      setSourceData(list);
    },
    onError: ({ returncode }) => {
      if (returncode === 100) {
        setSourceData([]);
        setLoaded(true);
      }
    },
  });

  useHideScrollbar(document.getElementById(SCROLL_EL_ID), bondPending);
  const lastParams = useRef();

  useEffect(() => {
    if (!isEqual(params, lastParams.current) && (params?.cityCode || params?.countyCode || params?.provinceCode)) {
      handleGet(params);
      document.getElementById(SCROLL_EL_ID).scrollTop = 0;
    }
  }, [handleGet, params]);

  const currentPage = useRef(1);
  /** 分页切换 */
  const handlePageChg = useCallback(
    (page, pageSize) => {
      currentPage.current = page;
      skipRef.current = pageSize * (page - 1);
      setParams((old) => {
        old.skip = skipRef.current;
        old.sort = currentSort?.value;
        return old;
      });
    },
    [currentSort?.value, setParams],
  );

  const handleCondition = useCallback(
    (condition) => {
      currentPage.current = 1;
      setParams((old) => {
        return { ...old, ...condition, sort: currentSort?.value };
      });
    },
    [currentSort?.value, setParams],
  );

  const columns = useColumns({
    params,
    currentSort,
    setCurrentSort,
    tableRef,
    data: sourceData,
  });

  // 解决表格滚动条和页面底部滚动条重叠问题
  const isResizedRef = useRef(false);

  useEffect(() => {
    function overflow() {
      const el = document.getElementById(SCROLL_EL_ID);
      if (el) {
        if (window.innerWidth < 1280) {
          el.classList.add(S.styleLt1280);
        } else el.classList.remove(S.styleLt1280);
      }
      isResizedRef.current = true;
    }

    if (!isResizedRef.current) overflow();
    window.addEventListener('resize', overflow);
    return () => window.removeEventListener('resize', overflow);
  }, []);
  const sticky = useMemo(() => {
    return {
      offsetHeader: bondPending ? 0 : 75,
      getContainer: () => document.getElementById(SCROLL_EL_ID) || window,
    };
  }, [bondPending]);
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
      {skeleton ? (
        <Skeleton count={2} active loading={!loaded} />
      ) : (
        <Spin spinning={!loaded} type="fullThunder" style={{ marginLeft: 50 }} />
      )}
      <div className={cn({ hidden: !loaded })}>
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
            count={bondData?.totalCount || 0}
          />
        </FilterWrap>
        {sourceData.length ? (
          <Spin
            spinning={bondPending}
            type="thunder"
            tip="加载中"
            useTag
            keepCenter
            wrapperClassName="mount-table-loading-animation"
          >
            <div ref={tableRef}>
              <FullTable
                columns={columns}
                dataSource={sourceData}
                scroll={{ x: 1860 }}
                sticky={sticky}
                pagination={{
                  current: currentPage.current,
                  className: 'pagination',
                  hideOnSinglePage: true,
                  pageSize: PAGE_SIZE,
                  total: bondData?.totalCount,
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
      </div>
      {/* </PageWrapper> */}
    </DefaultContainer>
  );
};

export default React.memo(DefaultBond);
