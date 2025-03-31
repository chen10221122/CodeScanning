import { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useMemoizedFn, useSize } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty, isFunction } from 'lodash';
import styled from 'styled-components';

import NoPowerDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { InputSearchType } from '@/components/advanceSearch';
import { Empty } from '@/components/antd';
import BackTop from '@/components/backTop';
import SkeletonScreen from '@/components/skeletonScreen';
import { useTab } from '@/libs/route';
import { isCity, isProvince, isCounty } from '@/pages/area/areaEconomy/common';
import Filter from '@/pages/area/areaEconomy/modules/blackList/component/filter';
import BreakCreditModal, {
  RowInfoProps,
} from '@/pages/area/areaEconomy/modules/blackList/component/modal/breakCreditModal';
import NoBreakCreditModal from '@/pages/area/areaEconomy/modules/blackList/component/modal/noBreakCreditModal';
import TabRightNode from '@/pages/area/areaEconomy/modules/blackList/component/tabRightNode';
import usePageChange from '@/pages/area/areaEconomy/modules/blackList/hooks/usePageChange';
import { useTableSelect } from '@/pages/area/areaEconomy/modules/blackList/hooks/useTableSelect';
import { useCtx as useCodeCtx } from '@/pages/area/areaEconomy/provider/getContext';
import * as S from '@/pages/area/areaEconomy/style';
import LimitAlert from '@/pages/cloudTotal/modules/limitAlert';
import { IRootState } from '@/store';
import { formatNumber } from '@/utils/format';
import useLoading from '@/utils/hooks/useLoading';

import { TabEnum } from './constant';
import { Provider, useCtx, CtxProps } from './context';
import { useData } from './hooks/useData';
import List from './modules/list';
import { EmptyError } from './style';

const nameMapParams: Map<string, string> = new Map([
  ['类型', 'classificationType'],
  ['公告日期', 'declareDate'],
  ['登记状态', 'registrationStatus'],
  ['成立时间', 'establishmentTime'],
  ['注册资本', 'registeredCapital'],
  ['上市/发债', 'companyType'],
  ['国标行业', 'industryCode'],
  ['地区', 'regionCode'],
  ['搜索', 'itName'],
  ['自选组合', 'subId'],
]);

const BlackList = () => {
  // redux中获取全局的自选信息
  const currentCombinationList = useSelector((store: IRootState) => store.combination.list);
  const cacheCombinationList = useRef(currentCombinationList);
  const {
    state: { tabRightInfo, tableParams, searchParams },
    update,
  } = useCtx();
  const {
    state: { code: regionCode },
  } = useCodeCtx();

  const { refresh } = useTab({
    onActive: () => {
      if (cacheCombinationList.current !== currentCombinationList) {
        refresh();
      }
    },
  });

  // 翻页相关
  const { handleSkipChange, limitModalVisible, tipVisible, setLimitModalVisible, setTipVisible } = usePageChange();
  // 列表选中处理
  const { selectRows, hasSelect, clearSelect } = useTableSelect();
  // 高级搜索筛选
  const { screenData, screenLoading, screenError } = useData();

  const [activeTab] = useState(TabEnum.List);
  // 弹窗相关信息
  const [visible, setVisible] = useState(false);
  // 弹窗信息
  const [modalRowInfo, setModalRowInfo] = useState<Record<string, any>>();
  // 列表请求状态
  const [tableLoading, setTableLoading] = useState(false);
  // tab切换的loading，有缓存，手动loading
  const [tabChangeLoading, setTabChangeLoading] = useState(false);
  const isBreakCreditModalRef = useRef(false);
  const isHotSearchRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const advanceSearchRef = useRef<HTMLDivElement>(null);
  const isFirstRef = useRef(true);
  const { height: advanceSearchHeight } = useSize(advanceSearchRef) || {};

  const isLoading = useLoading(tableLoading || screenLoading);

  // 添加到ctx中
  useEffect(() => {
    if (isFunction(refresh)) {
      update((d: CtxProps) => {
        d.refresh = refresh;
      });
    }
  }, [refresh, update]);

  // 处理tab切换的loading
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isFirstRef.current) {
      setTabChangeLoading(true);
      timer = setTimeout(() => {
        setTabChangeLoading(false);
      }, 300);
    } else {
      isFirstRef.current = false;
    }
    update((d: CtxProps) => {
      d.activeTab = activeTab;
    });
    return () => timer && clearTimeout(timer);
  }, [activeTab, update]);

  // 打开弹窗
  const hanleOpenModal = useMemoizedFn((row: Record<string, any>, isHot?: boolean) => {
    if (row) {
      isHotSearchRef.current = !!isHot;
      isBreakCreditModalRef.current = row?.blackList === '失信被执行人';
      setVisible(true);
      setModalRowInfo(row);
    }
  });

  // 处理高级搜索筛选
  const handleAdvanceData = useMemoizedFn((data) => {
    const nameMapList: Map<string, any[]> = new Map([
      ['搜索', []],
      ['类型', []],
      ['公告日期', []],
      ['登记状态', []],
      ['成立时间', []],
      ['注册资本', []],
      ['上市/发债', []],
      ['国标行业', []],
      ['地区', []],
      ['自选组合', []],
    ]);
    // 已选中的地区code
    const selectAreaSet: Set<string> = new Set();
    let keyword: string = '';

    data.forEach((item: Record<string, any>) => {
      const name = item.name;
      const pathName = item?.pathName?.[0];
      const secondPathName = item?.pathName?.[1];
      const value = item.value;
      const target = nameMapList.get(pathName) || nameMapList.get(secondPathName) || [];
      switch (true) {
        // 搜索
        case !!item.keyword:
          target.push(item.keyword);
          break;
        case pathName === '类型':
          target.push(value);
          break;
        case pathName === '公告日期':
          if (name === '自定义') {
            // 取消自定义时间的时候，不处理数据
            if (!isEmpty(value)) {
              const paramStr = `[${dayjs(item.value[0]).format('YYYYMMDD')},${dayjs(item.value[1]).format(
                'YYYYMMDD',
              )}]`;
              target.push(paramStr);
            }
          } else {
            target.push(value);
          }
          break;
        case pathName === '自选组合':
          target.push(value);
          break;
        case secondPathName === '登记状态':
          target.push(value);
          break;
        case secondPathName === '成立时间':
          if (name === '自定义') {
            const paramStr = `[${dayjs(value[0]).format('YYYYMMDD')},${dayjs(value[1]).format('YYYYMMDD')}]`;
            target.push(paramStr);
          } else {
            target.push(value);
          }
          break;
        case secondPathName === '注册资本':
          target.push(value);
          break;
        case secondPathName === '上市/发债':
          target.push(value);
          break;
        case secondPathName === '国标行业': {
          const level = item.key;
          (target[level] || (target[level] = [])).push(value);
          break;
        }
        default:
          return;
      }
      if (target.length) {
        if (nameMapList.has(pathName)) {
          nameMapList.set(pathName, target);
        } else if (nameMapList.has(secondPathName)) {
          nameMapList.set(secondPathName, target);
        } else {
          nameMapList.set('搜索', target);
          keyword = target[0];
        }
      }
    });

    const tempCondition: Record<string, any> = {};
    const areaCodeList: string[] = [];
    const singleAreaCodeList: string[] = [];
    let selectAreaCount: number = 0;
    // 是否区县级
    let isSingleThirdArea: boolean = false;
    // @ts-ignore
    for (let [name, list] of nameMapList) {
      const len = list.length;
      if (len) {
        const targetProp = nameMapParams.get(name) as string;
        if (name === '国标行业' || name === '地区') {
          if (name === '地区') {
            let target = [];
            for (let i = 0; i < len; i++) {
              if (list[i] && list[i].length) {
                target = list[i].filter((item: any) => !selectAreaSet.has(item.parent));
                selectAreaCount += target.length;
                // 只有单选时该值才有用，不做关处理
                if (target[0]?.areaLevel === 3) {
                  isSingleThirdArea = true;
                }
                if (target && target.length) {
                  tempCondition[`${targetProp}${i}`] = target
                    .map((item: any) => {
                      areaCodeList.push(...item.allParentInfo);
                      // 只选一个地区时，parentCode只取最近的父级
                      singleAreaCodeList.push(item.value, item.allParentInfo[item.allParentInfo.length - 1]);

                      return item.value;
                    })
                    .join(',');
                }
              }
            }
          } else {
            for (let i = 0; i < len; i++) {
              if (list[i] && list[i].length) {
                tempCondition[`${targetProp}${i}`] = list[i].join(',');
              }
            }
          }
        } else {
          tempCondition[targetProp] = list.join(',');
          if (name === '自选组合') {
            tempCondition.groupType = 'created';
          }
        }
      }
    }

    update((d: CtxProps) => {
      d.searchParams = tempCondition;
      d.areaCodeTotalAndList = [selectAreaCount, selectAreaCount === 1 ? singleAreaCodeList : areaCodeList];
      d.areaNoTopTen = selectAreaCount === 1 && isSingleThirdArea;
      d.keyword = keyword;
    });
  });

  const region = useMemo(() => {
    const region = {
      regionCode1: '',
      regionCode2: '',
      regionCode3: '',
    };
    switch (true) {
      case isProvince(regionCode):
        region.regionCode1 = regionCode;
        break;
      case isCity(regionCode):
        region.regionCode2 = regionCode;
        break;
      case isCounty(regionCode):
        region.regionCode3 = regionCode;
        break;
      default:
    }
    return region;
  }, [regionCode]);

  // 导出参数
  const moduleParams = useMemo(() => {
    return hasSelect
      ? {
          id: selectRows.selectedRows?.map((item: any) => item.id)?.join(',') || '',
          sort: tableParams?.sort,
          ...region,
        }
      : {
          ...tableParams,
          ...searchParams,
          ...region,
          skip: 0,
        };
  }, [hasSelect, searchParams, tableParams, selectRows.selectedRows, region]);

  const [hash, setHash] = useState(0);

  // 清除筛选项
  const clearCondition = useMemoizedFn(() => {
    // 清除筛选项
    setHash(Math.random());
    // 重新设置请求
    handleAdvanceData([]);
  });

  return (
    <Layout id="blackListContainer" ref={containerRef}>
      {isLoading ? (
        <div style={{ height: 'calc(100vh - 264px)' }}>
          <SkeletonScreen num={2} firstStyle={{ paddingTop: '36px' }} otherStyle={{ marginTop: '22px' }} />
        </div>
      ) : screenError ? (
        <EmptyError marginTop={127}>
          <Empty type={Empty.LOAD_FAIL} />
        </EmptyError>
      ) : null}
      <S.Container style={{ paddingBottom: '0' }}>
        <PageWrapper>
          {
            <div style={isLoading || screenError ? { opacity: '0', position: 'fixed', zIndex: -10 } : {}}>
              <div className="sticky-top" />
              <FilterContainer ref={advanceSearchRef}>
                <Filter
                  hash={hash}
                  onChange={handleAdvanceData}
                  options={{
                    data: screenData,
                    placeholder: '请输入机构名称或代码',
                    inputSearchType: InputSearchType.FULL,
                    scrollWrap: () => document.getElementById('blackListContainer') || document.body,
                  }}
                />
                <TabRightNode
                  count={formatNumber(tabRightInfo.count, 0)}
                  exportDoc={{
                    condition: {
                      ...moduleParams,
                      module_type: 'web_blackListTopic_info',
                      pageSize: 10000,
                    },
                    filename: '黑名单企业',
                  }}
                  selectRows={selectRows.selectedRows}
                  hasSelected={hasSelect}
                />
              </FilterContainer>
              <div className="sticky-bottom" />
              <List
                tabChangeLoading={tabChangeLoading}
                clearSelect={clearSelect}
                hanleOpenModal={hanleOpenModal}
                setTableLoading={setTableLoading}
                handleSkipChange={handleSkipChange}
                advanceSearchHeight={advanceSearchHeight}
                region={region}
                clearCondition={clearCondition}
              />
              {visible ? (
                isBreakCreditModalRef.current ? (
                  <BreakCreditModal
                    visible={visible}
                    closeModal={() => setVisible(false)}
                    rowInfo={modalRowInfo as RowInfoProps}
                  />
                ) : (
                  <NoBreakCreditModal
                    visible={visible}
                    closeModal={() => setVisible(false)}
                    rowInfo={modalRowInfo}
                    isHotSearch={isHotSearchRef.current}
                    handleSkipChange={handleSkipChange}
                  />
                )
              ) : null}
            </div>
          }
          <NoPowerDialog
            visible={limitModalVisible}
            setVisible={setLimitModalVisible}
            type="cloud_total_count_limit"
            key="black-list-table"
          />
          <LimitAlert msg="已到达条数查询上限。" setVisible={setTipVisible} visible={tipVisible} />
          <BackTop target={() => (document.getElementById('blackListContainer') as HTMLElement) || document.body} />
        </PageWrapper>
      </S.Container>
    </Layout>
  );
};

export default () => {
  return (
    <Provider>
      <BlackList />
    </Provider>
  );
};

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0 0 0;
`;

const Layout = styled.div`
  height: 100%;
  /* 弹窗的副作用，需要加important */
  width: 100% !important;
  overflow-y: inherit !important;

  .blackListCoustomPopover {
    .ant-popover-inner {
      .ant-popover-inner-content {
        max-width: 430px;
        padding: 12px 10px !important;
        font-size: 14px;
        color: #434343;
        line-height: 21px;
      }
    }
  }
`;

const PageWrapper = styled.div`
  /* height: 100%; */
  min-height: 100%;
  background-color: #fff;
  .advance-search-container .fix-header-wrap {
    padding: 0;
  }
`;
