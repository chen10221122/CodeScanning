import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { isBoolean } from 'lodash';

import Next from '@pages/area/areaF9/components/next';
import { useSelector } from '@pages/area/areaF9/context';

import { Spin, Empty } from '@/components/antd';
import BackTop from '@/components/backTop';
import CombinationDropdownSelect from '@/components/combinationDropdownSelect';
import ExportDoc, { EXPORT } from '@/components/exportDoc';
import Pagination from '@/components/Pagination';
import { Screen, Options } from '@/components/screen';
import FinanceTable from '@/components/tableFinance';
import TopicSearch from '@/components/topicSearch';
import { OVERDUE_DEBT_SEARCH } from '@/configs/localstorage';
import useColumn from '@/pages/area/areaF9/modules/regionalRisk/overdueDebt/hooks/useColumn';
import useTableData, { Condition } from '@/pages/area/areaF9/modules/regionalRisk/overdueDebt/hooks/useTableData';
import { Content, Wrapper } from '@/pages/area/areaF9/modules/regionalRisk/style';
import { useRiskCommon } from '@/pages/area/areaF9/modules/regionalRisk/useCommon';
import { debtScreenOption } from '@/pages/bond/overdue';
import useScreen from '@/pages/bond/overdue/hooks/useScreen';
import { formatNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';
import { shortId } from '@/utils/share';
const initParams = {
  industryFirstCode: '',
  keyword: '',
  publishDateFrom: '',
  publishDateTo: '',
  size: 50,
  from: 0,
  keywordEnum: '',
  isHKListed: '',
  isHSJListed: '',
  isIssued: '',
  isNewThirdBoardListed: '',
  isUrban: '',
  isUrbanChild: '',
  enterpriseNature: '',
  sortKeyEnum: '',
  sortOrder: '',
  endDate: '',
  isNotListed: '',
  debtorBusinessType: '',
  industrySecCode: '',
  subId: '',
};

const OverdueDebt = () => {
  const [regionParams, updateRegionParams] = useImmer<any>({
    provinceCode: '',
    countryCode: '',
    cityCode: '',
  });
  const areaInfo = useSelector((store) => store.areaInfo);
  const [condition, setCondition] = useImmer<Condition>({ ...initParams, provCode: '', countyCode: '', cityCode: '' });
  const combinationRef = useRef<any>(null);
  const ref = useRef<HTMLDivElement>(null);
  const tableRef = useRef(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const filterElRef = useRef<HTMLDivElement>(null);
  const [fristLoading, setFirstLoading] = useState(true);
  const [endDate, setEndDate] = useState('');
  // 搜索关键字
  const [searchText, setSearchText] = useState('');
  // 搜索前缀
  const [searchPre, setSearchPre] = useState([]);
  const [screenKey, setScreenKey] = useState(shortId()); // 筛选组件的key
  const searchRef = useRef<any>(null);

  const { data, loading, error } = useTableData(condition);
  const { options, filterData, screenLoading, filterError } = useScreen(true, setEndDate, true, filterElRef);

  const dataSource = useMemo(() => {
    return data?.list || [];
  }, [data]);
  const currentPage = useMemo(() => {
    return (condition.from as any) / 50 + 1 || 1;
  }, [condition.from]);
  const { column } = useColumn(setCondition, searchText, searchPre, dataSource, currentPage);
  const handleChange = useCallback(
    (current, _, index) => {
      if (index === 'combination') {
        setCondition((old) => {
          old.subId = current[0]?.value || '';
          old.from = 0;
        });
        return;
      }
      const type = current[0]?.type;
      // 重置
      if ([1, 2, 3, 4].includes(index) && current.length === 0) {
        switch (index) {
          case 0:
            setEndDate(filterData?.data?.endDate[0]);
            setCondition((old) => {
              old.publishDateFrom = '';
              old.publishDateTo = '';
              old.from = 0;
            });
            break;

          case 1:
            setCondition((old) => {
              old.industryFirstCode = '';
              old.industrySecCode = '';
              old.from = 0;
            });
            break;

          case 2:
            setCondition((old) => {
              old.enterpriseNature = '';
              old.isHSJListed = '';
              old.isHKListed = '';
              old.isNewThirdBoardListed = '';
              old.isIssued = '';
              old.isUrban = '';
              old.isUrbanChild = '';
              old.isNotListed = '';
              old.debtorBusinessType = '';
              old.from = 0;
            });
            break;
          case 3:
            setCondition((old) => {
              old.subId = '';
              old.from = 0;
            });
            break;
        }
        return;
      }
      switch (type) {
        case 'endDate':
          setEndDate(current[0].value);
          setCondition((old) => {
            old.endDate = current[0].value;
            old.from = 0;
          });
          break;
        case 'date': {
          let start = '',
            end = '';
          if (current[0].value === 'one') {
            start = dayjs().format('YYYY-MM-DD');
            end = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
          } else {
            start = dayjs().format('YYYY-MM-DD');
            end = dayjs().subtract(3, 'year').format('YYYY-MM-DD');
          }
          setCondition((old) => {
            old.publishDateFrom = end;
            old.publishDateTo = start;
            old.from = 0;
          });
          break;
        }
        case 'rangePicker':
          setCondition((old) => {
            old.publishDateFrom = dayjs(current[0].value[0]).format('YYYY-MM-DD');
            old.publishDateTo = dayjs(current[0].value[1]).format('YYYY-MM-DD');
            old.from = 0;
          });
          break;
        case 'industry': {
          // 通过key 区分二级code
          const firseCode: string[] = [];
          const secCode: string[] = [];
          current.forEach((el: any) => {
            if (el.key === 'industryCodeLevel1') {
              firseCode.push(el.value);
            } else {
              secCode.push(el.value);
            }
          });

          setCondition((old) => {
            old.industryFirstCode = firseCode.join(',');
            old.industrySecCode = secCode.join(',');
            old.from = 0;
          });
          break;
        }
        case 'tiling': {
          // 更多筛选
          let obj: any = {
            enterpriseNature: [],
            isHSJListed: '',
            isHKListed: '',
            isNewThirdBoardListed: '',
            isNotListed: '',
            isIssued: [],
            isUrban: [],
            isUrbanChild: '',
            debtorBusinessType: [],
          };
          current.forEach((item: any) => {
            const secondType = item.secondType;
            switch (secondType) {
              case 'enterpriseNature':
                // 未选择全部的情况 若选择全部 此处不对后续的企业类型选择项进行处理
                if (obj.enterpriseNature !== true) {
                  // 特殊化处理全部的情况
                  if (item.value === true) {
                    obj.enterpriseNature = true;
                  } else {
                    obj.enterpriseNature.push(item.value);
                  }
                }
                break;
              case 'debtorBusinessType':
                // 未选择全部的情况 若选择全部 此处不对后续的企业类型选择项进行处理
                if (obj.debtorBusinessType !== true) {
                  // 特殊化处理全部的情况
                  if (item.value === true) {
                    obj.debtorBusinessType = true;
                  } else {
                    obj.debtorBusinessType.push(item.value);
                  }
                }
                break;
              case 'market': {
                const classfy: string = item.classfy;
                if (!classfy) {
                  // 全选的情况
                  obj.isHSJListed = 1;
                  obj.isHKListed = 1;
                  obj.isNewThirdBoardListed = 1;
                  obj.isNotListed = 1;
                } else {
                  obj[classfy] = '1';
                }
                break;
              }
              case 'isIssued':
                obj.isIssued.push(item.value);
                break;
              case 'isUrban': {
                const urbanClassfy: string = item.classfy;
                if (urbanClassfy === 'isUrban') {
                  // 是否城投选择全部
                  obj.isUrban.push(item.value);
                } else {
                  obj[urbanClassfy] = item.value;
                }
              }
            }
          });
          setCondition((old) => {
            old.from = 0;
            old.enterpriseNature =
              isBoolean(obj.enterpriseNature) && obj.enterpriseNature
                ? '1,2,3,4,5,6,7,8,9,10,11,12,13'
                : obj.enterpriseNature.join(',');
            old.debtorBusinessType =
              isBoolean(obj.debtorBusinessType) && obj.debtorBusinessType
                ? '1,2,3,4,5,6,7,8,9,10,11,12,13'
                : obj.debtorBusinessType.join(',');
            old.isHSJListed = obj.isHSJListed;
            old.isHKListed = obj.isHKListed;
            old.isNewThirdBoardListed = obj.isNewThirdBoardListed;
            old.isNotListed = obj.isNotListed;
            old.isIssued = obj.isIssued.join(',');
            old.isUrban = obj.isUrban.length === 2 && obj.isUrbanChild ? '' : obj.isUrban.join(',');
            old.isUrbanChild = obj.isUrban.length === 2 && obj.isUrbanChild ? '' : obj.isUrbanChild;
          });
        }
      }
    },
    [filterData?.data?.endDate, setCondition, setEndDate],
  );
  useEffect(() => {
    if (areaInfo && areaInfo?.level && areaInfo?.regionCode) {
      updateRegionParams(() => {
        return {
          provCode: areaInfo?.level === 1 ? areaInfo.regionCode : '',
          cityCode: areaInfo?.level === 2 ? areaInfo.regionCode : '',
          countyCode: areaInfo?.level === 3 ? areaInfo.regionCode : '',
        };
      });
      setCondition((old) => {
        return {
          ...old,
          provCode: areaInfo?.level === 1 ? areaInfo.regionCode : '',
          cityCode: areaInfo?.level === 2 ? areaInfo.regionCode : '',
          countyCode: areaInfo?.level === 3 ? areaInfo.regionCode : '',
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaInfo]);
  const onCombinationChange = useMemoizedFn((_, all) => {
    handleChange(_, all, 'combination');
  });
  // 搜索
  const handleSearch = useCallback(
    (val, pre) => {
      setCondition((old) => {
        old.keyword = val;
        old.keywordEnum = pre.join(',');
      });
      setSearchPre(pre);
      setSearchText(val);
    },
    [setCondition],
  );

  const handleClear = useCallback(
    (pre) => {
      setCondition((old) => {
        old.keyword = '';
        old.keywordEnum = pre.join(',');
      });
      setSearchText('');
    },
    [setCondition],
  );

  const handlePageChange = useCallback(
    (page) => {
      setCondition((old) => {
        old.from = (page - 1) * 50;
      });
      contentRef.current?.scrollIntoView();
    },
    [setCondition],
  );
  const hasArea = useMemo(() => {
    return areaInfo && areaInfo?.level && areaInfo?.regionCode;
  }, [areaInfo]);
  useEffect(() => {
    if (fristLoading) {
      if (!(loading || screenLoading) && hasArea) {
        setFirstLoading(false);
      }
    }
  }, [fristLoading, loading, screenLoading, hasArea]);

  const emptyClick = useCallback(() => {
    setScreenKey(shortId());
    searchRef.current?.clearValue();
    combinationRef.current?.reset();
    setFirstLoading(true);
    setCondition((old) => {
      return { ...old, ...initParams, ...regionParams };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* 表格loading时把页面滚动条去掉 */
  useEffect(() => {
    const warp = ref.current;
    if (warp) {
      warp.style.overflowY = loading ? 'hidden' : '';
      if (warp.scrollTop >= 32) {
        warp.scrollTop = 32;
      } else {
        warp.scrollTop = 0;
      }
    }
    return () => {
      if (warp) {
        warp.style.overflow = '';
      }
    };
  }, [loading]);
  const { loadingTips, totalWidth } = useRiskCommon(column);
  return fristLoading ? (
    <Spin spinning={fristLoading} type="fullThunder"></Spin>
  ) : (
    <Wrapper ref={ref}>
      <>
        <Content id="overdue-content" ref={contentRef} hasPagination={data?.total > 50}>
          <p className={'main-title'}>{'债务逾期'}</p>
          {/* 条件筛选区域 */}
          <div className="filter" ref={filterElRef}>
            <div className="filter-left">
              <div className="screenWrap" ref={screenRef}>
                <Screen
                  key={screenKey}
                  options={options as Options[]}
                  onChange={handleChange}
                  getPopContainer={() => screenRef.current || document.body}
                />
              </div>

              <CombinationDropdownSelect
                ref={combinationRef}
                onChange={onCombinationChange}
                style={{
                  marginRight: 24,
                }}
              />

              <div className="searchWrap">
                <TopicSearch
                  onClear={handleClear}
                  onChange={() => {}}
                  onSearch={handleSearch}
                  dataKey={OVERDUE_DEBT_SEARCH}
                  cref={searchRef}
                  style={null}
                  prefix={true}
                  screenOption={debtScreenOption}
                  focusedWidth={252}
                  placeholder={'债务人、债权人、披露方'}
                />
              </div>
            </div>

            <div className="filter-right">
              <div className="count">
                共<span className="overdebt-num">{formatNumber(data?.total, 0)}</span>条
              </div>
              <div>
                <ExportDoc
                  type={EXPORT}
                  downloadType="export"
                  module_type={'debt_overdue'}
                  condition={{
                    ...condition,
                    exportFlag: true,
                    endDate: endDate,
                  }}
                  filename={'债务逾期'}
                />
              </div>
            </div>
          </div>

          {/* 表格区域 */}
          {dataSource?.length ? (
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
                  getContainer: () => ref.current!,
                }}
                columns={column}
                dataSource={dataSource}
                loading={
                  loading
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
              {loading ? (
                <Spin spinning={loading} type="fullThunder"></Spin>
              ) : error || filterError ? (
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

          {data?.total > 50 ? (
            <div>
              <Pagination
                current={(condition.from as any) / 50 + 1 || 1}
                pageSize={50}
                total={data.total}
                onChange={handlePageChange}
                style={{ padding: '8px 0px 16px', position: 'relative', left: '9px', marginBottom: 0 }}
                align={'left'}
              />
            </div>
          ) : null}
        </Content>
        <Next></Next>
        <BackTop target={() => ref.current || document.body} />
      </>
    </Wrapper>
  );
};

export default OverdueDebt;
