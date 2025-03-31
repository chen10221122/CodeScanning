import { memo, FC, useRef, useState, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';
import useSessionStorageState from 'use-session-storage-state';

import { useSelector } from '@pages/area/areaF9/context';

import { Empty, Spin, message } from '@/components/antd';
import Pagination from '@/components/Pagination';
import FinanceTable from '@/components/tableFinance';
import { IMPORT_ADDITIONAL_PARAMS } from '@/configs/constants';
import { useColumns } from '@/pages/area/areaF9/modules/regionalRisk/chineseBond/components/hooks/useColumns';
import { useRiskCommon } from '@/pages/area/areaF9/modules/regionalRisk/useCommon';
import { Filters, CHANGE } from '@/pages/default/bondDefault/modules/defaultOffshore/components';
import {
  PAGE_SIZE,
  initBondParams,
  initSubjectParams,
  bondSortInfoMap,
  subjectSortInfoMap,
} from '@/pages/default/bondDefault/modules/defaultOffshore/constants';
import { useBondList, useScreenData } from '@/pages/default/bondDefault/modules/defaultOffshore/hooks';
import { EPAGETYPE } from '@/pages/default/bondDefault/modules/defaultOffshore/hooks/useColumns';
import DetailModal from '@/pages/default/bondDefault/modules/defaultOffshore/modules/DetailModal';
import { formatScreenResult } from '@/pages/default/bondDefault/modules/defaultOffshore/utils';
import { useImmer, useLoading } from '@/utils/hooks';
import { shortId } from '@/utils/share';
const Content: FC<{ pageType: EPAGETYPE }> = ({ pageType }) => {
  const areaInfo = useSelector((store) => store.areaInfo);
  const getContainer = useMemoizedFn(() => document.getElementById('contentScrollDom') || document.body);

  const [regionParams, updateRegionParams] = useImmer<any>({
    provinceCode: '',
    countyCode: '',
    cityCode: '',
  });
  const [params, update] = useImmer<any>(
    pageType === EPAGETYPE.BOND ? { ...initBondParams } : { ...initSubjectParams },
  );
  const { screenData } = useScreenData(pageType);
  const { data, loading, total, error }: any = useBondList(pageType, params, true);
  const firstLoading = useLoading(loading);
  const detailModalRef = useRef<any>();
  const [screenKey, setScreenKey] = useState(shortId()); // 筛选组件的key
  const [, setType] = useSessionStorageState<Record<string, string>>(IMPORT_ADDITIONAL_PARAMS);
  const onCopyBtnClick = useMemoizedFn((key, obj) => {
    navigator.clipboard.writeText(data.map((o: any) => o[key]).join('\n'));
    message.success('复制成功');
    setType(obj);
  });
  const screenConfigs = screenData.filter((item) => item.title !== '地区');
  const columns = useColumns({
    pageType,
    params,
    getContainer,
    onCopyBtnClick,
    openModal: detailModalRef.current?.showDetailModal,
  });

  const { loadingTips, totalWidth } = useRiskCommon(columns);
  const onChange = useMemoizedFn((payload, type) => {
    if (type === CHANGE.Screen) {
      const draft = formatScreenResult(payload?.__);
      if (pageType === EPAGETYPE.BOND) {
        update((d) => {
          d.defaultDate = draft.defDate;
          d.enterpriseNatureCode = draft.enterprise;
          d.industryCode = draft.industry;
          d.from = 0;
          d.sort = '';
        });
      } else {
        update((d) => {
          d.firstDefaultDate = draft.firDate;
          d.enterpriseNatureCode = draft.enterprise;
          d.industryCode = draft.industry;
          d.from = 0;
          d.defaultEntityRate = draft.subRating;
          d.sortKey = '';
          d.sortOrder = '';
        });
      }
    } else if (type === CHANGE.Page) {
      update((d) => {
        d.from = (payload?.current - 1) * PAGE_SIZE;
      });
    } else if (type === CHANGE.Sort) {
      const [field, order] = [payload?.field, payload?.order];

      if (pageType === EPAGETYPE.BOND) {
        update((d) => {
          if (field && order) {
            d.sort = `${bondSortInfoMap.get(field)}:${bondSortInfoMap.get(order)}`;
          } else {
            d.sort = '';
          }
        });
      } else {
        update((d) => {
          if (field && order) {
            d.sortKey = (subjectSortInfoMap.get(field) as string) ?? '';
            d.sortOrder = subjectSortInfoMap.get(order) ?? '';
            d.from = 0;
          } else {
            d.sortKey = '';
            d.sortOrder = '';
            d.from = 0;
          }
        });
      }
    } else if (type === CHANGE.Search) {
      update((d) => {
        d.text = payload;
      });
    } else if (type === CHANGE.Combination) {
      update((d) => {
        d.subNM = payload[0]?.value || '';
      });
    }
  });

  const emptyClick = () => {
    update(
      (d) =>
        (d =
          pageType === EPAGETYPE.BOND
            ? { ...initBondParams, ...regionParams }
            : { ...initSubjectParams, ...regionParams }),
    );
    setScreenKey(shortId());
  };
  useEffect(() => {
    if (areaInfo && areaInfo?.level && areaInfo?.regionCode) {
      updateRegionParams(() => {
        return {
          provinceCode: areaInfo?.level === 1 ? areaInfo.regionCode : '',
          cityCode: areaInfo?.level === 2 ? areaInfo.regionCode : '',
          countyCode: areaInfo?.level === 3 ? areaInfo.regionCode : '',
        };
      });
      update((old) => {
        return {
          ...old,
          provinceCode: areaInfo?.level === 1 ? areaInfo.regionCode : '',
          cityCode: areaInfo?.level === 2 ? areaInfo.regionCode : '',
          countyCode: areaInfo?.level === 3 ? areaInfo.regionCode : '',
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaInfo]);
  return (
    <div className="content-wrapper">
      <DetailModal ref={detailModalRef}></DetailModal>
      {firstLoading ? (
        <Spin spinning={firstLoading} type="fullThunder"></Spin>
      ) : (
        <>
          <FilterWrapper>
            <Filters
              total={total}
              key={screenKey}
              onChange={onChange}
              screenData={screenConfigs ?? []}
              pageType={pageType}
              condition={params}
              isF9={true}
            />
          </FilterWrapper>
          {/* 表格区域 */}
          {data?.length ? (
            <TableWrapper>
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
                  offsetHeader: 74,
                  getContainer: () => document.getElementById('contentScrollDom') || document.body,
                }}
                columns={columns}
                dataSource={data}
                loading={
                  loading
                    ? {
                        wrapperClassName: 'mount-table-loading',
                        tip: '加载中',
                        indicator: loadingTips,
                      }
                    : false
                }
                showSorterTooltip={false}
                onChange={(_: any, __: any, sorter: any) => {
                  onChange(sorter, CHANGE.Sort);
                }}
              />
            </TableWrapper>
          ) : (
            <>
              {loading ? (
                <Spin spinning={loading} type="fullThunder"></Spin>
              ) : error ? (
                <Empty type={Empty.LOAD_FAIL} style={{ marginTop: '15vh', paddingBottom: '40px' }} />
              ) : (
                <Empty
                  type={Empty.NO_DATA_IN_FILTER_CONDITION}
                  style={{ marginTop: '15vh', paddingBottom: '40px' }}
                  onClick={emptyClick}
                />
              )}
            </>
          )}

          {total > 50 ? (
            <div>
              <Pagination
                current={(params.from as any) / 50 + 1 || 1}
                pageSize={50}
                total={total}
                onChange={(curr) => {
                  onChange({ current: curr }, CHANGE.Page);
                }}
                style={{ padding: '8px 0px 16px', position: 'relative', left: '9px', marginBottom: 0 }}
                align={'left'}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default memo(Content);
export const FilterWrapper = styled.div`
  position: sticky;
  top: 40px;
  z-index: 20;
  display: flex;
  align-items: center;
  height: 34px;
  .offshore-filter {
    padding: 0 !important;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
`;
export const TableWrapper = styled.div``;
