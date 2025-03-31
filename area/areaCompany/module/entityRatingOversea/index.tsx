import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

import { useCreation, useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { isArray, isEmpty, isString } from 'lodash';
import styled from 'styled-components';

import { Empty, Spin } from '@/components/antd';
import Tab from '@/components/tabBarWithExport';
import FinanceTable from '@/components/tableFinance';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import {
  handleSelectData,
  rankDirectEnum,
  ratingOutlookEnum,
} from '@/pages/area/areaCompany/module/entityRatingOversea/components/searchLine/screenConf';
import { useSelector } from '@/pages/area/areaF9/context';
import { useImmer } from '@/utils/hooks';
import { shortId } from '@/utils/share';

import SearchLine from './components/searchLine';
import useColumns from './useColumns';
import useData from './useData';

const tabConf = [
  {
    name: '全部',
    content: null,
    key: 'all',
  },
  {
    name: '主体评级下调',
    content: null,
    key: 'down',
  },
  {
    name: '主体评级展望负面',
    content: null,
    key: 'negative',
  },
];

const INIT_NORMAL = {
  swIndustryTopLevelCode: '',
  enterpriseNature: '',
  urbanInvest: '',
  ratingOrgCode: '',
};

const SCROLL_EL_ID = 'area-company-index-container';
const PAGE_SIZE = 50;

export default () => {
  const tableRef = useRef<any>();
  const initParams = {
    from: 0,
    size: PAGE_SIZE,
    text: '',
    subId: '',
    provinceCode: '',
    cityCode: '',
    countyCode: '',
  };
  const [condition, update] = useImmer(initParams);
  const [screenKey, setScreenKey] = useState<string>('');
  const [regionParams, updateRegionParams] = useImmer<any>({
    provinceCode: '',
    countryCode: '',
    cityCode: '',
  });
  const { areaInfo } = useSelector((store) => ({
    areaInfo: store.areaInfo,
  }));
  const [activeKey, setActiveKey] = useState<string>(tabConf[1].key);
  const tabParams = useMemo(() => {
    let tabResParams;
    if (activeKey === 'down') {
      tabResParams = {
        rankDirect: rankDirectEnum.down,
      };
    } else if (activeKey === 'negative') {
      tabResParams = {
        ratingOutlook: ratingOutlookEnum.负面,
      };
    }
    return tabResParams;
  }, [activeKey]);
  const { loading, isFirstLoading, listInfo /**error */ } = useData({ condition, tabParams });

  const columns = useColumns({ page: 'oversea', condition });

  const sticky = useCreation(() => {
    return {
      offsetHeader: loading ? 0 : 75,
      getContainer: () => document.getElementById(SCROLL_EL_ID) || window,
    };
  }, [loading]);

  const emptyClick = useCallback(() => {
    setScreenKey(shortId());
    // console.log('regionParams',regionParams)
    update((old) => {
      return { ...initParams, ...regionParams, ...tabParams };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionParams]);
  useEffect(() => {
    if (areaInfo && areaInfo?.level && areaInfo?.regionCode) {
      update((d) => {
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
  }, [areaInfo, update]);

  // 翻页
  const handlePageChg = useMemoizedFn((x) => {
    update((d) => {
      d.from = (x - 1) * PAGE_SIZE;
    });
  });

  const onScreenChange = useMemoizedFn((type: string) => {
    return (payload: any, allSelected: Record<string, any>[] | []) => {
      switch (type) {
        case 'search':
          update((d) => {
            d.text = payload ?? '';
            d.from = 0;
          });
          break;
        case 'subId':
          update((d) => {
            if (isEmpty(allSelected)) {
              d.subId = '';
            } else {
              d.subId = allSelected?.[0]?.value;
            }
            d.from = 0;
          });
          break;
        case 'screen': {
          /** 抄老模块的 */
          let startRatingDate = '',
            endRatingDate = '';
          const custorRange = allSelected.filter((item) => item.name === '评级日期')?.[0];
          const yearRange = allSelected.filter((item) => item.field === 'year')?.[0];
          const otherScreen = allSelected.filter((item) => item.name !== '评级日期' && item.field !== 'year');
          const [startDate, endDate] = custorRange?.value || [];
          if (isArray(yearRange?.value)) {
            startRatingDate = dayjs(yearRange?.value?.[0] || '').format('YYYY-MM-DD');
            endRatingDate = dayjs(yearRange?.value?.[1] || '').format('YYYY-MM-DD');
          } else if (isString(yearRange?.value)) {
            startRatingDate = yearRange?.value + '-01-01'; //.split('-').join('');
            endRatingDate = yearRange?.value + '-12-31'; //.split('-').join('');
          } else {
            startRatingDate = '';
            endRatingDate = '';
          }
          if (startDate && endDate) {
            startRatingDate = dayjs(startDate).format('YYYY-MM-DD');
            endRatingDate = dayjs(endDate).format('YYYY-MM-DD');
          }
          /** 债券违约上古方法 */
          const menuData = handleSelectData(otherScreen);

          update((d) => {
            return {
              ...d,
              startRatingDate,
              endRatingDate,
              ...INIT_NORMAL,
              ...menuData,
              from: 0, // from 重置
            };
          });
          break;
        }
      }
    };
  });

  const onTabChange = useMemoizedFn((tab: string) => {
    setActiveKey(tab);
  });

  return (
    <Wrapper
      title="“主体评级下调(境外评级机构)"
      id="areaOverseaEntityRating"
      loading={isFirstLoading}
      useOutLoadingStatus
      noTitleWrapper
      moduleWithTab
    >
      <div className="area-bond-default-tab-sticky-wrapper">
        <Tab tabConf={tabConf} defaultActiveKey={tabConf[1].key} onChange={onTabChange} />
      </div>
      <div className="search-line" key={screenKey}>
        <SearchLine
          totalCount={listInfo?.total ?? '-'}
          title="主体评级下调(境外评级机构)"
          condition={{ ...condition, ...tabParams }}
          onScreenChange={onScreenChange}
        />
      </div>

      {listInfo?.data?.length ? (
        <Spin
          spinning={loading}
          type="thunder"
          tip="加载中"
          useTag
          keepCenter
          wrapperClassName="mount-table-loading-animation"
        >
          <div className="table-content" ref={tableRef}>
            <FinanceTable
              key={'area-entityRatingOversea'}
              type
              hideOnSinglePage
              finance
              stripe
              columns={columns}
              dataSource={listInfo?.data}
              scroll={{ x: 'max-content' }}
              sticky={sticky}
              loading={loading}
              pagination={{
                current: condition.from / 50 + 1,
                className: 'pagination',
                hideOnSinglePage: true,
                pageSize: PAGE_SIZE,
                total: listInfo?.total,
                size: 'small',
                showSizeChanger: false,
                onChange: handlePageChg,
              }}
            />
          </div>
        </Spin>
      ) : (
        <Spin
          spinning={loading}
          type="thunder"
          tip="加载中"
          useTag
          keepCenter
          wrapperClassName="mount-table-loading-animation"
        >
          <Empty
            type={Empty.NO_DATA_IN_FILTER_CONDITION}
            onClick={emptyClick}
            style={{ marginTop: '15vh', paddingBottom: '40px' }}
          />
        </Spin>
      )}
    </Wrapper>
  );
};

const Wrapper = styled((props: any) => <ModuleWrapper {...props} />)`
  .area-bond-default-tab-sticky-wrapper {
    position: sticky;
    top: 10px;
    background: #fff;
    z-index: 4;
    .ant-tabs-top {
      position: relative;
      overflow: visible;
      .ant-tabs-nav {
        background-color: #fff;
        margin: 0;
        box-shadow: none !important;
        &:before {
          z-index: 10;
          border-bottom: 1px solid rgba(1, 113, 246, 0.2);
        }
        .ant-tabs-ink-bar {
          visibility: hidden;
        }
        .ant-tabs-nav-wrap {
          .ant-tabs-tab {
            background: #f5f6f9;
            border-radius: 2px 2px 0px 0px;
            border: none !important;
            padding: 4px 16px 5px;
            font-size: 14px;
            font-weight: 400;
            color: #262626;
            line-height: 21px;
            .ant-tabs-tab-btn {
              transition: none;
            }
          }
          .ant-tabs-tab + .ant-tabs-tab {
            margin-left: 2px;
          }
          .ant-tabs-tab.ant-tabs-tab-active {
            background: #0171f6;
            .ant-tabs-tab-btn {
              color: #ffffff;
              font-weight: 500;
            }
          }
        }
      }
    }
  }

  .search-line {
    position: sticky;
    top: 42px;
    z-index: 4;
  }

  thead > tr > th {
    text-align: center !important;
  }
  thead > tr > th.pdd-8 {
    padding: 6px 8px !important;
  }
  .ant-spin-nested-loading > div > .ant-spin {
    top: 200px;
  }

  .ant-pagination {
    padding-bottom: 0 !important;
  }

  .ant-table-tbody > tr > td {
    padding: 6px 12px;
  }

  .ant-table-tbody>tr>td: last-child {
    padding: 0;
    font-size: 0;
  }
`;
