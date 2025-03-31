import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useBoolean, useSize, useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import dayjs from 'dayjs';
import { cloneDeep, isEmpty, isUndefined, omit, pick } from 'lodash';
import styled from 'styled-components';

import { getTblData } from '@/apis/area/areaDebt';
import NoPayDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { Icon } from '@/components';
import { Empty, Spin } from '@/components/antd';
import BackTop from '@/components/backTop';
import DataSource, { useDataSource } from '@/components/dataSource';
import ExportDoc from '@/components/exportDoc';
import { AREA_COMPARE_SELECTED_CODE } from '@/configs/localstorage';
import { LINK_AREA_COMPARE } from '@/configs/routerMap';
import AreaInfoDialog from '@/pages/area/areaDebt/components/dialog/areaInfoDialog';
import IndicatorDialog from '@/pages/area/areaDebt/components/dialog/indicatorDialogWithPagination';
import useNewFilter from '@/pages/area/areaDebt/components/filter/useNewFilter';
import useUpdateTip from '@/pages/area/areaDebt/components/updateTip';
import useUpdateModalInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useModalBaseInfo';
import NewUpdateModal from '@/pages/area/areaDebt/components/updateTip/modal';
import useIndicatorModalData from '@/pages/area/areaDebt/hooks/useIndicatorModalData';
import NoPermissionImg from '@/pages/area/areaDebt/images/noPermissionEmpty@2x.png';
import TrialLimitInfo from '@/pages/power/components/trialLimitInfo';
import useRequest from '@/utils/ahooks/useRequest';
import { useImmer } from '@/utils/hooks';
import { shortId } from '@/utils/share';

import Filter from './components/filter';
import { selectItems } from './components/filter/useFilter';
import AreaTable from './components/table';
import Title, { TITLE_HEIGHT } from './components/title';
import { conditionType, Provider, useCtx } from './getContext';

const HEAD_HIGHT = TITLE_HEIGHT + 40;
const INNER_MIN_HEIGHT = 250;

type searchAreaType = {
  regionCode: string;
  regionName: string;
};

const pageSize = 50;
const AreaDebt: FC = memo(() => {
  const tblRef = useRef<HTMLDivElement | null>(null);
  const [exportCondition, setExportCondition] = useImmer<conditionType>({});
  const domRef = useRef<any>(null);
  const scrollDom = useRef<HTMLDivElement | null>(null);
  const InnerRef = useRef<HTMLDivElement | null>(null);
  const { height } = useSize(domRef) || {};

  const [indicatorEmpty, setIndicatorEmpty] = useState(false);
  const { loading: filterInitYearLoading, data: filterInitYear } = useNewFilter();
  const [noAuth, setNoAuth] = useState(false);

  const paramsRef = useRef({});
  const conditionRef = useRef<{ [a: string]: any }>({});
  const history = useHistory();
  const havePay = useSelector((store: any) => store.user.info).havePay;
  const havePayRef = useRef(false);
  // const [currentPage, setCurrentPage] = useState(1)
  const {
    state: { condition, infoDetail, sortName, current, selectedRowKeys, indexSort, indicatorAllAttribute },
    update,
  } = useCtx();

  const [limitVisible, setLimitVisible] = useState(false);
  const [areaLimitVisible, setAreaLimitVisible] = useState(false);
  // 新增可自定义指标后需给导出配置user
  const { info } = useSelector((state: any) => state.user);
  const getUserFromReduxState = useMemoizedFn(() => info?.basic_info?.user);
  /** 是否清除选项 */
  const [isClearFilter, setIsClearFilter] = useState(false);
  const [updateDate, setUpdateDate] = useState<{ days: number }>({ days: 30 });
  const [updateRegionCode, setUpdateRegionCode] = useState('');
  /** 搜索选中的地区 */
  const [searchArea, updateSearchArea] = useImmer<searchAreaType>({ regionCode: '', regionName: '' });

  const [firstLoading, { setFalse: setLoadFalse }] = useBoolean(true);

  const { run, data, loading, error } = useRequest(getTblData, {
    manual: true,
    formatResult: (res: any) => {
      // 处理非vip用户查看次数的提示内容
      if (res.info?.includes('该模块为VIP模块')) {
        const info = res.info.match(/该模块为VIP模块，已查询(\S*)\/天，提升等级可获更多权限/);
        if (info.length > 1) {
          update((o) => {
            o.requestNum = `今日已查看${info[1]}`;
          });
        }
      }
      update((o) => {
        o.total = res.data?.total || 0;
      });
      return res.data;
    },
    onSuccess: () => {
      setLoadFalse();
      setIsClearFilter(false);
      update((draft) => {
        draft.selectedRowKeys = [];
      });
    },
    onError: (err: any) => {
      if (err?.info?.includes('今日查询次数已达上限')) {
        update((o) => {
          o.requestNum = `今日已查看10/10次`;
        });
      }
      setLoadFalse();
      setIsClearFilter(false);
    },
  });

  // 获取表头指标弹窗数据
  const {
    currentIndictorPage,
    onIndicatorDialogPageChange,
    indicatorData,
    indicatorLoading,
    indicatorError,
    indicatorDataTotal,
  } = useIndicatorModalData();

  const originTblData = useMemo(() => {
    return data?.data || [];
  }, [data?.data]);

  const total = useMemo(() => {
    return data?.total || 0;
  }, [data?.total]);

  useEffect(() => {
    if (originTblData?.length > 0) {
      const res = cloneDeep(originTblData)
        .filter((i: any) => i.regionCode4)
        ?.map((i: any) => i.regionCode4)
        ?.join(',');
      setUpdateRegionCode(res);
    }
  }, [originTblData]);

  /** 更新提示相关内容 */
  const {
    UpdateTipCref,
    // UpdateTipScreenCref,
    openUpdate,
    traceSource,
    traceCref,
    // tipLoading: loading2,
    tipData: updateData,
    getTipData,
  } = useUpdateTip({ missVCA: true, isLastMonth: true });

  /** 更新提示弹窗 */
  const { modalInfo, openModal, closeModal, contetHolder } = useUpdateModalInfo();

  // 精准溯源弹窗
  const {
    info: dataSourceInfo,
    openDrawer: openDataSource,
    closeDrawer: closeDataSource,
  } = useDataSource({ moduleCode: 'queryEconomy' });

  /** 获取表格中需要提示的数据 */
  useEffect(() => {
    if (condition?.indicName) {
      const param = {
        ...omit(condition, ['regionName']),
        ...updateDate,
        regionCode: updateRegionCode,
        indicName: condition?.indicName?.join(','),
        endDate: condition?.endDate?.join(','),
        keyword: '',
        sort: '',
        size: 10000,
        pageCode: 'regionalEconomyAll',
      };
      if (updateRegionCode !== '' && JSON.stringify(paramsRef.current) !== JSON.stringify(param)) {
        getTipData(param);
        paramsRef.current = param;
      }
    }
  }, [condition, getTipData, updateDate, updateRegionCode, current]);

  useEffect(() => {
    update((o) => {
      o.openSource = traceSource;
    });
  }, [traceSource, update]);

  useEffect(() => {
    setUpdateDate({ days: openUpdate.days });
  }, [openUpdate.days]);

  useEffect(() => {
    update((o) => {
      o.openUpdate = openUpdate.isUpdate;
    });
  }, [openUpdate.isUpdate, update]);

  const AreaInfoDialogShow = useMemo(() => {
    return !isEmpty(infoDetail);
  }, [infoDetail]);

  const closeInfoDialog = useCallback(() => {
    update((o) => {
      o.infoDetail = {};
    });
  }, [update]);
  useEffect(() => {
    if (error && (error as any).returncode === 202) setLimitVisible(true);
  }, [error, setLimitVisible]);

  const handleRun = useMemoizedFn((condition) => {
    if (condition && Object.keys(condition).length) {
      conditionRef.current = condition;
      // 指标组件返回的指标加了个100ms的debounceEffect, indicName异步添加进condition
      // 兼容处理这里也加个120ms的计时器

      let isIndicatorEmpty = !condition.indicName && !condition.indexId;
      setIndicatorEmpty(isIndicatorEmpty);
      if (isIndicatorEmpty) {
        return;
      }
      update((o) => {
        o.container = domRef.current!;
      });
      const { sortName, indexSort, current, ...restCondition } = condition;
      let t: any = { ...restCondition, from: (current - 1) * pageSize, pageCode: 'regionalEconomyAll' }; //, flag: 1
      const { indexId } = condition;
      delete t.regionName;
      /** 搜索选中的地区code */
      // if (condition.keyword && searchArea.regionCode) {
      //   t.regionCode = searchArea.regionCode;
      // } else {
      t.regionCode = condition.regionCode;
      // }
      /**新增自定义指标后，需要注意sort和indexSort是个互斥参数，只能存在其一，否则中台排序失效报错【建议区域经济大全还是要统一自定义和基础指标，否则容易更改遗漏！！！！22822需求暂时这么处理】 */
      if (sortName) {
        t.sort = sortName;
        t.indexSort = '';
      } else if (indexSort) {
        t.indexSort = indexSort;
        t.sort = '';
      }
      if (indexId) {
        t.userID = getUserFromReduxState();
      }

      t.regionCode && run(t);
    }
  });

  // 表格分页、排序、自定义指标筛选改变重新渲染
  useEffect(() => {
    if (conditionRef.current.regionCode) {
      if (
        (!isUndefined(indexSort) && indexSort !== conditionRef.current.indexSort) ||
        (!isUndefined(sortName) && sortName !== conditionRef.current.sortName)
      ) {
        update((o) => {
          o.current = 1;
        });
        handleRun({
          ...conditionRef.current,
          indexSort,
          sortName,
          current: 1,
        });
      } else if (conditionRef.current.regionCode && current !== conditionRef.current.current) {
        handleRun({
          ...conditionRef.current,
          current,
        });
      }
    }
  }, [handleRun, indexSort, sortName, current, conditionRef.current.regionCode, update]);

  // useEffect(() => {
  //   if (condition && Object.keys(condition).length) {
  //     // 指标组件返回的指标加了个100ms的debounceEffect, indicName异步添加进condition
  //     // 兼容处理这里也加个120ms的计时器
  //     // const timer = setTimeout(() => {
  //     let isIndicatorEmpty = !condition.indicName && !condition.indexId;
  //     setIndicatorEmpty(isIndicatorEmpty);
  //     if (isIndicatorEmpty) {
  //       return;
  //     }
  //     update((o) => {
  //       o.container = domRef.current!;
  //     });

  //     let t: any = { ...condition, from: (current - 1) * pageSize, pageCode: 'regionalEconomyAll' }; //, flag: 1
  //     const { indexId } = condition;
  //     delete t.regionName;
  //     /** 搜索选中的地区code */
  //     if (condition.keyword && searchArea.regionCode) {
  //       t.regionCode = searchArea.regionCode;
  //     } else {
  //       t.regionCode = condition.regionCode;
  //     }
  //     /**新增自定义指标后，需要注意sort和indexSort是个互斥参数，只能存在其一，否则中台排序失效报错【建议区域经济大全还是要统一自定义和基础指标，否则容易更改遗漏！！！！22822需求暂时这么处理】 */
  //     if (sortName) {
  //       t.sort = sortName;
  //       t.indexSort = '';
  //     } else if (indexSort) {
  //       t.indexSort = indexSort;
  //       t.sort = '';
  //     }
  //     if (indexId) {
  //       t.userID = getUserFromReduxState();
  //     }

  //     t.regionCode && run(t);
  //     console.log('t', t);
  //     // }, 1000);
  //     // return () => timer && clearTimeout(timer);
  //   }
  // }, [
  //   condition,
  //   run,
  //   update,
  //   setAreaLimitVisible,
  //   setIndicatorEmpty,
  //   searchArea,
  //   sortName,
  //   indexSort,
  //   getUserFromReduxState,
  //   setLoadFalse,
  //   current,
  // ]);
  const refreshEditTable = useMemoizedFn(() => {
    let t: any = { ...condition, pageCode: 'regionalEconomyAll' }; //, flag: 1
    const { indexId } = condition;
    delete t.regionName;
    /** 搜索选中的地区code */
    if (condition.keyword && searchArea.regionCode) {
      t.regionCode = searchArea.regionCode;
    } else {
      t.regionCode = condition.regionCode;
    }
    /**新增自定义指标后，需要注意sort和indexSort是个互斥参数，只能存在其一，否则中台排序失效报错【建议区域经济大全还是要统一自定义和基础指标，否则容易更改遗漏！！！！22822需求暂时这么处理】 */
    if (sortName) {
      t.sort = sortName;
      t.indexSort = '';
    }
    if (indexSort) {
      t.indexSort = indexSort;
      t.sort = '';
    }
    if (indexId) {
      t.userID = getUserFromReduxState();
    }
    run(t);
  });
  useEffect(() => {
    if (condition) {
      let sendObj = cloneDeep(condition);
      for (let k in sendObj) {
        if (Array.isArray(sendObj[k])) sendObj[k] = sendObj[k].filter((s: string) => s && s.trim()).join();
      }

      sendObj.module_type = 'regional_economies_new';
      sendObj.exportFlag = true;
      sendObj.dealMissData = true;
      sendObj.userID = getUserFromReduxState();
      // sendObj.exportFields = sendObj.indicName;
      if (sortName) {
        sendObj.sort = sortName;
        sendObj.indexSort = '';
      }
      if (indexSort) {
        sendObj.indexSort = indexSort;
        sendObj.sort = '';
      }
      /** 搜索选中的地区 */
      const { regionCode, regionName } = searchArea;
      if (condition.keyword && regionCode && regionName) {
        sendObj.regionCode = regionCode;
        sendObj.regionName = regionName;
      } else {
        sendObj.regionCode = condition.regionCode?.join(',');
        sendObj.regionName = condition.regionName?.join(',');
      }
      if (!isEmpty(indicatorAllAttribute)) {
        sendObj.indexOrder = indicatorAllAttribute?.map((ele) => ele.indexId || ele.value).join(',');
      }
      setExportCondition(() => sendObj);
    }
  }, [condition, sortName, setExportCondition, searchArea, indexSort, getUserFromReduxState, indicatorAllAttribute]);

  /** 空状态--试用次数已达上限 */
  const noPermission = useMemo(() => {
    return (error as any)?.returncode === 202;
  }, [error]);

  useEffect(() => {
    if (InnerRef.current)
      InnerRef.current.style.minHeight = `${noPermission ? INNER_MIN_HEIGHT : height ? height - TITLE_HEIGHT : 0}px`;
  }, [error, height, noPermission]);

  useEffect(() => {
    let isEmpty = error || (data && data.data && !data.data.length);
    if (InnerRef.current) InnerRef.current.style.overflow = `${isEmpty ? 'hidden' : 'visible'}`;
  }, [error, data]);
  useEffect(() => {
    update((d) => {
      d.filterInitYear = filterInitYear;
      d.filterInitYearLoading = filterInitYearLoading;
    });
  }, [filterInitYear, filterInitYearLoading, update]);

  /** 清除选项 */
  const handleClear = useMemoizedFn(() => {
    setIsClearFilter(true);
  });
  /** 搜索选中地区 */
  const handleSearchArea = useMemoizedFn((obj: selectItems) => {
    if (obj) {
      updateSearchArea((d: searchAreaType) => {
        d.regionCode = obj.value;
        d.regionName = obj.label;
      });
    }
  });

  /** 默认按照第一列降序 */
  // useEffect(() => {
  //   /**自定义也要支持默认给顺序 */
  //   if (indicatorAllAttribute && !isEmpty(indicatorAllAttribute) && indicatorAllAttribute.length > 0) {
  //     const resKey = indicatorAllAttribute[0].isCustom
  //       ? indicatorAllAttribute[0].indexId
  //       : indicatorAllAttribute[0].secondTitle || indicatorAllAttribute[0].title;
  //     const firstIsCustom = indicatorAllAttribute[0].isCustom;
  //     update((d) => {
  //       d.sortData = {
  //         columnKey: resKey,
  //         order: 'descend',
  //       };
  //       d.defaultSortOrder = {
  //         columnKey: resKey,
  //         order: 'descend',
  //       };
  //       if (firstIsCustom) {
  //         d.indexSort = `${resKey}:desc`;
  //         d.sortName = '';
  //       }
  //     });
  //   }
  // }, [indicatorAllAttribute, update]);

  const Description = useMemo(() => {
    return (
      <DescriptionWrap>
        当日试用次数已达上限，请
        <span
          className="clear"
          onClick={() => {
            document.getElementById('sidebar-staff-service-btn')?.click();
          }}
        >
          &nbsp; 联系客服 &nbsp;
        </span>
        升级
      </DescriptionWrap>
    );
  }, []);

  const NoPermissionEmpty = useMemo(() => {
    return (
      <div className="no-permission-empty">
        <Empty image={<Img />} description={Description}></Empty>
      </div>
    );
  }, [Description]);

  /** 跳转到区域对比页面 */
  const toPK = useMemoizedFn((row) => {
    localStorage.setItem(AREA_COMPARE_SELECTED_CODE, JSON.stringify(row));
    history.push(LINK_AREA_COMPARE);
  });

  const tableLists = useMemo(
    () => (data?.data || []).map((item: any) => ({ ...item, downFileId: shortId() })),
    [data?.data],
  );

  useEffect(() => {
    havePayRef.current = havePay;
  }, [havePay]);

  /** 非vip点击地区筛选 */
  const handleAreaClick = useCallback(() => {
    if (!havePayRef.current) {
      setNoAuth(true);
    }
  }, [havePayRef, setNoAuth]);

  const [outEmpty, setOutEmpty] = useState(false);
  const handleChange = useMemoizedFn((rows) => {
    setOutEmpty(false);
    if (!rows.length) {
      setLoadFalse();
      setOutEmpty(true);
    }
  });

  return (
    <Wrapper
      className={cn({
        'data-source-wrapper': dataSourceInfo?.visible,
      })}
    >
      <OuterStyle className="outerStyle" noPermission={noPermission}>
        <PageStyle
          ref={domRef}
          hasPage={total > pageSize}
          clientHeight={height ? height - HEAD_HIGHT : 0}
          id="pageContainer"
          className="areaDebt-pageStyle"
        >
          <NoPayDialog visible={limitVisible} setVisible={setLimitVisible} type={`areaDebt`} />
          <TrialLimitInfo
            title="区域经济大全"
            desc="当前选择地区数量超限，请分批查询！"
            cancelBtnStyle={{ display: 'none' }}
            show={areaLimitVisible}
            forbidGoToUDesk
            okTxt="我知道了"
            onOk={() => {
              setAreaLimitVisible(false);
            }}
            container={domRef.current}
          />

          <Spin spinning={firstLoading} type={'thunder'} tip="加载中">
            <Title />
            <div className="page-content" ref={scrollDom}>
              <div className={`inner`} ref={InnerRef}>
                <div className="top-bar">
                  <Filter
                    isClearFilter={isClearFilter}
                    handleSearchArea={handleSearchArea}
                    handleAreaClick={handleAreaClick}
                    onChange={handleChange}
                    firstLoading={firstLoading}
                    handleRun={handleRun}
                  />
                  <Info className="info">
                    <div className={`tbl-num`}>
                      共 <i>{indicatorEmpty ? 0 : total}</i> 条
                    </div>

                    <div
                      className={cn('pk-disable', { pk: selectedRowKeys?.length > 0 })}
                      onClick={() => {
                        selectedRowKeys?.length > 0 && toPK(selectedRowKeys);
                      }}
                    >
                      <Icon
                        width={22}
                        height={14}
                        image={require(selectedRowKeys?.length > 0 ? './images/pk.png' : './images/pk_disable.png')}
                      />
                      对比
                    </div>

                    {traceCref}
                    {/* {UpdateTipScreenCref} */}
                    <ExportDoc
                      condition={exportCondition}
                      filename={`区域经济大全${dayjs(new Date()).format('YYYYMMDD')}`}
                      portal={domRef.current}
                    />
                  </Info>
                </div>

                <div className="table-container" ref={tblRef} data-prevent>
                  {(error as any)?.returncode === 100 ? (
                    <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={handleClear} />
                  ) : error ? (
                    (error as any)?.returncode === 202 ? (
                      NoPermissionEmpty
                    ) : (
                      <Empty type={Empty.MODULE_LOAD_FAIL} />
                    )
                  ) : tableLists.length && !outEmpty ? (
                    <>
                      <AreaTable
                        refreshTable={refreshEditTable}
                        loading={loading}
                        total={total}
                        originTblData={tableLists}
                        updateData={updateData}
                        handleOpenModal={openModal}
                        openDataSource={openDataSource}
                        dataSourceInfo={dataSourceInfo}
                      />
                      {UpdateTipCref}
                    </>
                  ) : (
                    <Empty type={Empty.NO_SCREEN_DATA} />
                  )}
                </div>
              </div>
            </div>
          </Spin>
          {/* 更新弹窗 */}
          <NewUpdateModal
            {...modalInfo}
            openDataSource={openDataSource}
            onClose={closeModal}
            container={domRef.current!}
          />
          {contetHolder}
          {/* 明细弹窗 */}
          <AreaInfoDialog
            openDataSource={openDataSource}
            show={AreaInfoDialogShow}
            close={closeInfoDialog}
            hideUpdateTip={false}
          />
          <IndicatorDialog
            openDataSource={openDataSource}
            data={indicatorData || []}
            year={condition?.endDate}
            error={indicatorError}
            loading={indicatorLoading}
            close={() => {
              update((o) => {
                o.indicator = '';
                o.customIndicator = undefined;
              });
              onIndicatorDialogPageChange(1);
            }}
            hideUpdateTip={false}
            pagination={{
              total: indicatorDataTotal,
              currentIndictorPage,
              pageSize: pageSize,
              pageNum: 5,
              hideOnSinglePage: true,
              onChange: (page: number) => onIndicatorDialogPageChange(page),
            }}
            condition={{ ...pick(exportCondition, ['regionCode', 'endDate', 'sort']) }}
          />
          <NoPayDialog
            className="custon-new-combination"
            visible={noAuth}
            setVisible={() => setNoAuth(false)}
            type="advanceSearchCombination"
          />
          <BackTop target={() => domRef.current!} />
        </PageStyle>
      </OuterStyle>
      <DataSource {...dataSourceInfo} onClose={closeDataSource} />
    </Wrapper>
  );
});

const OutAreaDebt: FC = () => {
  return (
    <Provider>
      <AreaDebt />
    </Provider>
  );
};

export default memo(OutAreaDebt);

export const IconStyle = styled(Icon)`
  margin-right: 2px;
  transform: scale(${12 / 13});
`;

export const TooltipContent = styled.div`
  color: #434343;
  font-size: 12px;
  line-height: 20px;
  padding: 0 8px;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;

  &.data-source-wrapper {
    .head-con {
      h1 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .right {
        flex-shrink: 0;
      }
    }

    .outerStyle {
      min-width: unset;
      width: unset;
      flex: 1;
      overflow: auto;
      .areaDebt-pageStyle {
        width: unset !important;
        overflow: hidden auto !important;

        .page-content {
          background: #fff;
        }
        .top-bar {
          display: flex;
          justify-content: space-between;
          overflow: hidden;
          .filter {
            flex-shrink: 0;
          }
          .info {
            float: none;
            flex-shrink: 0;
            background-color: #fff;
            z-index: 1;
            position: absolute;
            right: 0;
            padding-left: 24px;
          }
        }
      }
      .update-bottom-tip {
        flex-shrink: 0;
        overflow: hidden;
      }
    }
  }
`;

const OuterStyle = styled.div<{ noPermission: boolean }>`
  max-width: 100%;
  width: 100%;
  height: 100%;
  background: #fff;
  flex: 1;
  overflow: auto;
  .dzh-table-spinning-wrapper .ant-spin-container {
    overflow: inherit !important;
  }
  @media (max-width: 1280px) {
    padding-bottom: ${({ noPermission }) => (noPermission ? 0 : 10)}px;
    min-width: 1280px;
    overflow-x: auto;
  }
  .areaDebt-pageStyle {
    .ant-table-sticky-scroll {
      z-index: 2;
    }
    .dzh-spin-spinWrapper {
      .ant-spin-container {
        .dzh-table-pagination {
          margin: 12px 0 0;
        }
      }
      /* 加载闪电 */
      .ant-spin-spinning {
        color: #666;
        font-size: 14px;
      }
    }

    .dzh-table-pagination {
      margin: 0;
      padding-top: 8px;
      position: absolute;
      right: 0;
      bottom: -28px;
      z-index: 2;
      background: #fff;
      padding-left: 24px;
    }
  }
`;

const PageStyle = styled.div<{ hasPage: boolean; clientHeight: number }>`
  /* width: 100% !important; */
  height: 100%;
  position: relative;
  /* overflow: hidden auto !important; */
  overflow: auto;
  /* scrollbar-gutter: stable; */

  .update-bottom-tip {
    /* margin-top: ${({ hasPage }) => (hasPage ? '-48' : 0)}px !important; */
    padding: 8px 0 3px;
  }

  .page-content {
    background: #fafbfd;

    .inner {
      background: #fff;
      padding: 0 24px;
      position: relative;
    }
  }

  .top-bar {
    //padding: 0 24px;
    line-height: 40px;
    height: 40px;
    position: sticky;
    background: #fff;
    top: 0;
    z-index: 10;
  }

  .table-container {
    //flex: auto;
    //height: 1px;
    //overflow: hidden;
    //padding: 0 24px;
    padding-bottom: 16px;
    .container-load {
      margin-top: 10%;
      div {
        color: #666;
      }
      .loading-container i:before {
        margin: 0;
      }
    }
    .ant-empty {
      margin-top: 12%;
    }
    th {
      text-align: center !important;
    }

    .ant-empty-image {
      z-index: 1 !important;
    }

    .ant-spin-spinning {
      z-index: 4 !important;
    }
  }

  .ant-empty-image {
    z-index: 10;
  }
  .header-text,
  .primary-hover {
    color: #262626;
  }
  .no-permission-empty {
    .ant-empty {
      margin-top: ${({ clientHeight }) => (clientHeight > 490 ? clientHeight * 0.25 : 60)}px !important;
      margin-bottom: 60px;
    }
    .ant-empty-image {
      width: 288px;
      height: 176px;
    }
  }
  .header-text {
    margin-right: 4px;
  }

  .ant-back-top {
    z-index: 99;
  }
`;

const Info = styled.div`
  float: right;
  font-size: 13px;

  > div {
    float: left;
    margin-right: 24px;

    &:last-of-type {
      margin-right: 0;
    }

    &.tbl-num {
      color: #8c8c8c;

      i {
        color: rgb(51, 51, 51);
        font-style: normal;
      }
    }
  }
  .pk-disable {
    color: #bfbfbf;

    i {
      margin-right: 4px;
      vertical-align: -2px;
    }
  }
  .pk {
    color: #262626;
    cursor: pointer;
  }
`;

const DescriptionWrap = styled.div`
  height: 18px;
  font-size: 13px;
  text-align: center;
  color: #8193ad;
  line-height: 18px;
  .clear {
    color: #0171f6;
    &:hover {
      cursor: pointer;
    }
  }
`;
const Img = styled.div`
  margin: 0 auto;
  width: 288px;
  height: 176px;
  background: url(${NoPermissionImg}) no-repeat center;
  background-size: contain;
`;
