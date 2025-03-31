import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { useBoolean, useSize, useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { cloneDeep, isEmpty, pick } from 'lodash';
import styled from 'styled-components';

import NoPayDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { Icon, Loading } from '@/components';
import { Empty, Switch, Spin } from '@/components/antd';
import BackTop from '@/components/backTop';
import DataSourceDrawer, { useDataSourceDrawer } from '@/components/dataSourceDrawer';
import ExportDoc from '@/components/exportDoc';
import NoPermissionImg from '@/pages/area/areaDebt/images/noPermissionEmpty@2x.png';
import { getTblData } from '@/pages/area/monthlyEconomy/api';
import AreaIndicatorDetails from '@/pages/area/monthlyEconomy/components/modal/areaIndicatorDetails';
import IndicatorDialog from '@/pages/area/monthlyEconomy/components/modal/indicatorDialog';
import useUpdateTip from '@/pages/area/monthlyEconomy/components/updateTip';
import useUpdateModalInfo from '@/pages/area/monthlyEconomy/components/updateTip/hooks/useModalBaseInfo';
import NewUpdateModal from '@/pages/area/monthlyEconomy/components/updateTip/modal';
import TrialLimitInfo from '@/pages/power/components/trialLimitInfo';
import useRequest from '@/utils/ahooks/useRequest';
import { divisionNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';

import Filter from './components/filter';
import { SelectItems } from './components/filter/useFilter';
import Table, { pageSize } from './components/table';
import Title, { TITLE_HEIGHT } from './components/title';
import { Provider, useCtx } from './getContext';

const HEAD_HIGHT = TITLE_HEIGHT + 40;
const INNER_MIN_HEIGHT = 250;

type searchAreaType = {
  regionCode: string;
  regionName: string;
};

const Content: FC = memo(() => {
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [exportCondition, setExportCondition] = useImmer<any>({});
  const domRef = useRef<any>(null);
  const scrollDom = useRef<HTMLDivElement | null>(null);
  const InnerRef = useRef<HTMLDivElement | null>(null);
  const { height } = useSize(domRef) || {};
  const [indicatorEmpty, setIndicatorEmpty] = useState(false);
  const [noAuth, setNoAuth] = useState(false);

  // 精准溯源弹窗
  const {
    info: dataSourceInfo,
    openDrawer: openDataSource,
    closeDrawer: closeDataSource,
  } = useDataSourceDrawer({ moduleCode: 'queryEconomy' }); // 不同的业务需要传递不同的 moduleCode, 不传递默认是财务数据

  const {
    state: { condition, year, month, infoDetail, tblData, sortName },
    update,
  } = useCtx();
  const [limitVisible, setLimitVisible] = useState(false);
  const [areaLimitVisible, setAreaLimitVisible] = useState(false);

  /** 是否清除选项 */
  const [isClearFilter, setIsClearFilter] = useState(false);
  /** 搜索选中的地区 */
  const [searchArea, updateSearchArea] = useImmer<searchAreaType>({ regionCode: '', regionName: '' });
  const [firstLoading, { setFalse: setLoadFalse }] = useBoolean(true);
  /**分页加载页面 */
  const [tableLoading, setTableLoading] = useState(false);
  const [tableDataList, setTableDataList] = useState([]);
  const havePay = useSelector((store: any) => store.user.info).havePay;
  const havePayRef = useRef(false);

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
      setTableDataList(res.data?.data || []);
      update((o) => {
        o.total = res.data?.total || 0;
      });
      return res.data;
    },
    onSuccess: () => {
      setLoadFalse();
      setIsClearFilter(false);
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

  const total = useMemo(() => {
    return data?.total || 0;
  }, [data?.total]);

  /** 更新提示相关内容 */
  const {
    UpdateTipCref,
    traceSource,
    hiddenEmptyCols,
    traceCref,
    tipLoading: loading2,
    tipData: updateData,
  } = useUpdateTip({ isMainPage: true });
  /** 更新提示弹窗 */
  const { modalInfo, openModal, closeModal } = useUpdateModalInfo();

  useEffect(() => {
    update((o) => {
      o.openSource = traceSource;
    });
  }, [traceSource, update]);

  /** 默认按照第一列降序 */
  useEffect(() => {
    if (condition?.indicName?.[0]) {
      update((d) => {
        d.sortData = {
          field: condition.indicName[0],
          order: 'descend',
        };
      });
    }
  }, [condition?.indicName, update]);

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

  useEffect(() => {
    if (condition && Object.keys(condition).length) {
      // 指标组件返回的指标加了个100ms的debounceEffect, indicName异步添加进condition
      let isIndicatorEmpty = !condition.indicName;
      setIndicatorEmpty(isIndicatorEmpty);
      if (isIndicatorEmpty) return;
      // if (condition.regionCode && new Set(condition.regionCode?.join().split(',')).size > 1000) {
      //   setAreaLimitVisible(true);
      //   return;
      // }

      update((o) => {
        o.tblData = [];
        o.container = domRef.current!;
      });
      let params: any = { ...condition }; //, flag: 1
      delete params.regionName;
      /** 搜索选中的地区code */
      if (condition.keyword && searchArea.regionCode) {
        params.regionCode = searchArea.regionCode;
      } else {
        params.regionCode = condition.regionCode;
      }
      if (sortName) {
        params.sort = sortName;
      }
      run(params);
    }
  }, [condition, run, setExportCondition, update, setAreaLimitVisible, setIndicatorEmpty, searchArea, sortName]);

  useEffect(() => {
    if (condition) {
      let sendObj = cloneDeep(condition);
      for (let k in sendObj) {
        if (Array.isArray(sendObj[k])) sendObj[k] = sendObj[k].filter((s: string) => s && s.trim()).join();
      }

      sendObj.module_type = 'regional_economies_month_quarter';
      /**pageCode 用于区分列表和单指标区域分布 */
      sendObj.pageCode = 'regionalEconomyMonthQuarter';
      sendObj.exportFlag = true;
      sendObj.exportFlag = true;
      sendObj.dealMissData = true;
      if (sortName) sendObj.sort = sortName;
      /** 搜索选中的地区 */
      const { regionCode, regionName } = searchArea;
      if (condition.keyword && regionCode && regionName) {
        sendObj.regionCode = [regionCode];
        sendObj.regionName = regionName;
      } else {
        sendObj.regionCode = condition.regionCode;
        sendObj.regionName = condition.regionName?.join(',');
      }
      setExportCondition(() => ({ ...sendObj, regionCode: sendObj.regionCode?.join(',') }));
    }
  }, [condition, sortName, setExportCondition, searchArea]);

  /** 空状态--试用次数已达上限 */
  const noPermission = useMemo(() => {
    return (error as any)?.returncode === 202;
  }, [error]);

  useEffect(() => {
    if (InnerRef.current)
      InnerRef.current.style.minHeight = `${noPermission ? INNER_MIN_HEIGHT : height ? height - TITLE_HEIGHT : 0}px`;
  }, [error, height, noPermission]);

  useEffect(() => {
    let isEmpty = error || !tableDataList.length;
    if (InnerRef.current) InnerRef.current.style.overflow = `${isEmpty ? 'hidden' : 'visible'}`;
  }, [error, tableDataList]);

  /** 清除选项 */
  const handleClear = useMemoizedFn(() => {
    setIsClearFilter(true);
  });
  /** 搜索选中地区 */
  const handleSearchArea = useMemoizedFn((obj: SelectItems) => {
    if (obj) {
      updateSearchArea((d: searchAreaType) => {
        d.regionCode = obj.value;
        d.regionName = obj.label;
      });
    }
  });

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

  useEffect(() => {
    havePayRef.current = havePay;
  }, [havePay]);

  /** 非vip点击地区筛选 */
  const handleAreaClick = useCallback(() => {
    if (!havePayRef.current) {
      setNoAuth(true);
    }
  }, [havePayRef, setNoAuth]);

  return (
    <OuterStyle noPermission={noPermission}>
      <PageStyle ref={domRef} hasPage={total > pageSize} clientHeight={height ? height - HEAD_HIGHT : 0}>
        {/** 权限弹框 */}
        <NoPayDialog
          visible={limitVisible}
          setVisible={setLimitVisible}
          type="monthlyEconomy"
          customMsgTxt="月度季度经济数据大全已达 10 次/天，开通VIP版即可无限次查看"
        />
        <TrialLimitInfo
          title="月度季度经济大全"
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
          {/** 顶部标题、说明、意见反馈 */}
          <Title />
          <div className="page-content" ref={scrollDom}>
            <div className={`inner`} ref={InnerRef}>
              <div className="top-bar">
                {/** 筛选部分 */}
                <Filter
                  isClearFilter={isClearFilter}
                  handleSearchArea={handleSearchArea}
                  handleAreaClick={handleAreaClick}
                />
                <Info>
                  <div className={`tbl-num`}>
                    共 <i>{divisionNumber(total)}</i> 条
                  </div>
                  {traceCref}
                  <ExportDoc
                    condition={exportCondition}
                    filename={`月度季度经济大全${dayjs(new Date()).format('YYYYMMDD')}`}
                    portal={domRef.current}
                  />
                </Info>
              </div>
              {/** 表格部分 */}
              <div className="table-container" ref={tableRef}>
                <Loading show={loading || loading2 || tableLoading} text="加载中" className="container-load">
                  {indicatorEmpty || (error as any)?.returncode === 100 ? (
                    <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={handleClear} />
                  ) : error ? (
                    noPermission ? (
                      NoPermissionEmpty
                    ) : (
                      <Empty type={Empty.LOAD_FAIL_LG} />
                    )
                  ) : tableDataList.length ? (
                    <>
                      <Table
                        tableData={tableDataList}
                        hiddenEmptyCols={hiddenEmptyCols}
                        updateData={updateData}
                        handleOpenModal={openModal}
                        setTableLoading={setTableLoading}
                        openDataSource={openDataSource}
                      />
                      {UpdateTipCref}
                    </>
                  ) : (
                    <Empty type={Empty.NO_SCREEN_DATA} />
                  )}
                </Loading>
              </div>
            </div>
          </div>
        </Spin>
        {/* 更新弹窗 */}
        <NewUpdateModal
          {...modalInfo}
          onClose={closeModal}
          container={domRef.current!}
          openDataSource={openDataSource}
        />
        {/* {contetHolder} */}
        {/** 多指标明细弹框 */}
        <AreaIndicatorDetails show={AreaInfoDialogShow} close={closeInfoDialog} openDataSource={openDataSource} />
        {/** 单指标地区分布弹框 */}
        <IndicatorDialog
          data={tblData}
          currentDate={`${year}年${month}月`}
          endDate={condition?.endDate}
          hideUpdateTip={false}
          close={() => {
            update((o) => {
              o.indicator = '';
            });
          }}
          condition={{ ...pick(exportCondition, ['regionCode', 'endDate', 'sort']) }}
          openDataSource={openDataSource}
        />
        {/* 精准溯源弹窗 */}
        <DataSourceDrawer
          {...dataSourceInfo}
          onClose={closeDataSource}
          getContainer={() => domRef.current!} // 不同的业务需要传递不同的 getContainer
          hasSwipe
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
  );
});

const MonthlyEconomy: FC = () => {
  return (
    <Provider>
      <Content />
    </Provider>
  );
};

export default memo(MonthlyEconomy);

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

const OuterStyle = styled.div<{ noPermission: boolean }>`
  height: 100%;
  background: #fff;
  @media (max-width: 1280px) {
    /* padding-bottom: ${({ noPermission }) => (noPermission ? 0 : 10)}px; */
    min-width: 1280px;
    overflow-x: auto;
  }
`;

const PageStyle = styled.div<{ hasPage: boolean; clientHeight: number }>`
  width: 100% !important;
  height: 100%;
  position: relative;
  overflow: auto !important;

  .update-bottom-tip {
    // margin-top: ${({ hasPage }) => (hasPage ? '-43' : 0)}px !important;
    background: #fff;
    width: 100%;
  }

  .page-content {
    background: #fafbfd;
    @media (min-width: 1366px) {
      padding: 0 48px;
    }

    .inner {
      background: #fff;
      padding: 0 24px;
      position: relative;
      min-height: calc(100vh - 124px) !important;
      @media (max-width: 1280px) {
        min-height: calc(100vh - 136px) !important;
      }
    }
  }

  .top-bar {
    line-height: 40px;
    height: 40px;
    position: sticky;
    background: #fff;
    top: 0;
    z-index: 10;
  }

  .table-container {
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
    /* th {
      text-align: center !important;
    } */

    .ant-empty-image {
      z-index: 1 !important;
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

export const SwitchStyle = styled(Switch)`
  transform: scale(${26 / 32});
  transform-origin: left center;
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
