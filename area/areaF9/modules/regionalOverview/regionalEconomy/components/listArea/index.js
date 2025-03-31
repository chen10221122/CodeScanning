import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector as useAppSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Empty, EmptySize } from '@dzh/components';
import { useMemoizedFn, useDebounce } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import EditIcon from '@/assets/images/area/icon_edit@2x.png';
import missVCAIcon from '@/assets/images/area/missVCA.svg';
import ErrorMessage from '@/components/advanceSearch/components/extraModal/errorMessage';
import { Skeleton, Table } from '@/components/antd';
// import Table from '@/components/tableFinance';
import useUpdateTip from '@/pages/area/areaDebt/components/updateTip';
import { getIndicAndUnit } from '@/pages/area/areaDebt/components/updateTip/formatData';
import useUpdateModalInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useModalBaseInfo';
import UpdateModal from '@/pages/area/areaDebt/components/updateTip/modal';
import { ItemEnum, TitleItem /**WrapperContainer*/ } from '@/pages/area/areaF9/components';
import TraceBtn from '@/pages/area/areaF9/components/traceBtn';
import { useSelector } from '@/pages/area/areaF9/context';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';

import InfoModal from '../../infoModal';
import { AreaF9ChangeIndicNameMap, AreaF9SpecialIndicList, ModalType, Suffix, indicNameMap } from '../../types';
import useListData from '../../useListData';
import { getNewTableData } from '../../utils';
import MetricModal from '../mMetricModal';
import UpdateTraceModal from '../updateTraceModal';
import { getIsTraceAndHasDetail } from './tableCell';
import useListColumns from './useListColumns';

const ErrorMessageStyle = { top: '20px', minWidth: 'max-content' };

const defaultCell = {
  /** 是否展示更新弹窗 */
  isShowUpdate: false,
  /** 是否溯源 */
  isShowTrace: false,
  /** 是否点击文本 */
  isClickArea: false,
  /** 当前单元格值 */
  value: '',
  /** 溯源的guId */
  guId: '',
  indexId: '',
  /** 指标弹窗类型 */
  type: '',
  /** 指标其他信息 */
  extraProperties: {},
  /** 接口入参 */
  requestParams: { businessCodeInfo: ['', ''], indexParam: { indexId: '', paramMap: {} } },
  /** 指标名 */
  paramName: '',
  /** 当前地区 */
  regionName: '',
  /** 当前地区code */
  regionCode: '',
  /** 当前列年份 */
  year: '',
  /** 弹框是否打开 */
  modalVisible: false,
};

export default function Region({
  setLoading,
  changeResetFlag,
  changeResetHandle,
  changeLoadingHandle,
  indicatorTreeParams,
}) {
  const areaInfo = useSelector((store) => store.areaInfo);
  const dataSourceInfo = useSelector((store) => store.dataSourceInfo);
  const user = useAppSelector((store) => store.user.info.basic_info.user);
  const hasPay = useAppSelector((store) => store.user.info).havePay;
  const { code } = useParams();
  const [activeTab] = useState(1);
  const [currentStat, setCurrentStat] = useState([]);
  const [hoverRowKey, setHoverRowKey] = useState('');
  // const { update } = useCtx();
  const [metricVisible, setMetricVisible] = useState(false);
  const domRef = useRef();
  // const history = useHistory();
  const [cellState, setCellState] = useState(defaultCell);
  const tableRef = useRef(null);

  /** 隐藏空行 */
  const [hiddenChecked, setHiddenChecked] = useState(true);

  const [drag] = useState(false); // 指标弹窗是否支持拖拽

  const { indicatorTypeMap, listDefaultChoice, treeLoading, indicatorList, indicatorNeedConfigMap, customParam } =
    indicatorTreeParams;

  const {
    pending: loading,
    firstLoading,
    tableData,
    handleChangeData,
    traceType,
    hasData,
    listParam,
    handleGetDefData,
    resetFlag,
    paramData,
    listHeadParamMap,
    paramLoading,
    defaultChoice,
    tipInfo,
    handleConfirmChange,
    tableList,
    setTableList,
  } = useListData({ hiddenChecked, tabIndex: activeTab, currentStat, indicatorTypeMap, listDefaultChoice });

  useEffect(() => {
    if (tableData?.data) {
      // 解决筛选后出现双滚动条
      window.dispatchEvent(new Event('resize'));
    }
  }, [tableData?.data]);

  useEffect(() => {
    handleGetDefData && changeResetHandle && changeResetHandle(ModalType.LIST, handleGetDefData);
  }, [changeResetHandle, handleGetDefData]);
  useEffect(() => {
    changeLoadingHandle && changeLoadingHandle(ModalType.LIST, loading);
  }, [changeLoadingHandle, loading]);

  useEffect(() => {
    changeResetFlag && changeResetFlag(resetFlag, ModalType.LIST);
  }, [changeResetFlag, resetFlag]);
  const isLoading = useLoading(loading);

  useAnchor(isLoading);

  /** 趋势图弹窗state */
  const [modal, setModal] = useState({
    show: false,
    title: '',
    unit: undefined,
    data: '',
    name: '',
    hasChart: 0,
    chartType: null,
  });

  /** 更新提示的图例 */
  const { UpdateTipCref, traceSource, traceCref, handleTblCell } = useUpdateTip({
    isLastMonth: true,
    missVCA: true,
  });

  /** 旧的更新提示弹窗 */
  const { modalInfo, openModal, closeModal, contetHolder } = useUpdateModalInfo();

  // 无数据时不显示滚动条
  useEffect(() => {
    const wrap = document.getElementById('tabsWrapper');
    if (wrap) {
      wrap.style.overflowY = !hasData ? 'hidden' : '';
    }
    return () => {
      if (wrap) wrap.style.overflowY = '';
    };
  }, [hasData]);

  /** 隐藏空行 */
  const handleChangeHidden = useMemoizedFn((e) => {
    setHiddenChecked((base) => !base);
    if (tableData?.data?.length) {
      setTableList(getNewTableData(e.target.checked, tableData.data));
    }
  });

  /** 趋势图弹窗 */
  const handleShowModal = useCallback(
    (row, name, data, unit) => {
      const regionName = areaInfo?.regionName || '';
      // const unUnitName = unit ? name.slice(0, name.lastIndexOf('(')) : name;
      setModal({
        show: true,
        title: regionName + name,
        unit,
        name,
        data,
        hasChart: row.hasChart,
        chartType: row.chartType,
        isCustom: row?.isCustom,
        customValueType: row?.customValueType,
      });
    },
    [areaInfo?.regionName],
  );
  const handleClose = useCallback(() => {
    setModal((base) => {
      return { ...base, show: false };
    });
  }, []);

  const onScreenChange = useMemoizedFn((row) => {
    if (isEmpty(row)) {
      setCurrentStat([]);
    } else {
      setCurrentStat(row.map((i) => i.value));
    }
  });

  /** 自定义指标弹窗open close */
  const handleOpenMetric = useCallback(() => {
    setMetricVisible(true);
  }, []);
  const handleCloseMetric = useCallback(() => {
    setMetricVisible(false);
  }, []);

  /** 溯源、指标更新数据弹窗的参数修改 */
  const handleCellClick = useCallback(
    (year, row, isUpdateItem, event) => {
      const { isShowTraceLink, hasDetailModal } = getIsTraceAndHasDetail(traceSource, row[year], row.type, row.guId);
      // console.log('row', row?.type, isUpdateItem, isShowTraceLink || hasDetailModal);
      const { isCustom, indexId } = row;
      const { indicName: unUnitName, unit } = getIndicAndUnit(row?.paramName);
      // console.log('unUnitName', unUnitName)
      // 使用旧的更新弹窗: 1.无type 2.为计算指标且无权限 3.自定义指标
      if (isUpdateItem && (!row.type || (AreaF9SpecialIndicList.includes(unUnitName) && !hasPay) || isCustom)) {
        // console.log('1', AreaF9SpecialIndicList.includes(unUnitName));
        // let tab2Info;
        // if (activeTab === 2) {
        //   tab2Info = row?.[year + 'indicCode'];
        // }
        openModal(
          {
            title: `${year}${activeTab === 1 ? '年' : ''}_${areaInfo?.regionName}_${row?.paramName}`,
            regionCode: code || '',
            indicName: unUnitName.includes(Suffix) ? unUnitName.split(Suffix)[0] : unUnitName,
            // indicName2: sourceValueObj[row?.paramName],
            // indicName2: `${isUpdateItem?.indicName}`,
            indicName2:
              AreaF9ChangeIndicNameMap[unUnitName] ?? indicNameMap[unUnitName] ?? (isCustom ? indexId : unUnitName),
            unit,
            year,
            pageCode: 'areaF9PlatformEconomy',
            regionName: areaInfo?.regionName,
            activeTab: activeTab,
            // tab2Info,
          },
          // 标记：计算指标的接口是 GET_AREA_ECONOMY_LIST_TIP_INFO，activTab === 1 时非计算指标的接口是 GET_AREA_ECONOMY_UPDATE_TIP_INFO
          AreaF9SpecialIndicList.includes(unUnitName) && activeTab !== 2,
          !row[year + 'guId'] && isUpdateItem?.child ? isUpdateItem.child : [],
        );
        // 否则使用区域数据浏览器的弹窗，包括guid跳转
      } else if (row.type || row[year + 'guId'] || isShowTraceLink || hasDetailModal) {
        // console.log('2', row.type)
        const paramMap = row?.paramMap;
        if (paramMap) {
          if (paramMap?.auditYear) paramMap.auditYear = [year + ''];
          if (paramMap?.date) paramMap.date = [year + ''];
        }
        setCellState({
          isShowUpdate: isUpdateItem,
          isShowTrace: traceSource,
          isClickArea: event.target.dataset.clickArea,
          value: row[year],
          guId: row[year + 'guId'],
          indexId: row.indexId,
          type: row.type,
          extraProperties: {
            ...row.extraProperties,
            ...row?.paramDetailArr?.[year]?.extraProperties,
            guId: row[year + 'guId'],
          },
          requestParams: {
            businessCodeInfo: [code, '3'],
            indexParam: { indexId: row.indexId, paramMap: paramMap || {} },
          },
          paramName: row.paramName,
          regionName: areaInfo?.regionName,
          regionCode: areaInfo?.regionCode,
          year,
          modalVisible: true,
        });
      }
    },
    [activeTab, openModal, areaInfo?.regionName, areaInfo?.regionCode, code, traceSource, hasPay],
  );
  const handleCellModalClose = useCallback(() => {
    setCellState(defaultCell);
  }, []);

  const [traceInfo, setTraceInfo] = useState({});

  /** 表格列 */
  const finalColumns = useListColumns({
    years: tableData?.colKey,
    traceSource,
    handleShowModal,
    activeTab,
    onScreenChange,
    handleOpenMetric,
    hoverRowKey,
    handleCellClick,
    handleTblCell,
    indicatorNeedConfigMap,
    listHeadParamMap,
    traceInfo,
  });

  const debounceLoading = useDebounce(firstLoading, {
    wait: 1000,
    leading: true,
  });

  useEffect(() => {
    setLoading(debounceLoading);
  }, [debounceLoading, setLoading]);

  useEffect(() => {
    if (!dataSourceInfo?.visible) {
      setTraceInfo({});
    }
  }, [dataSourceInfo?.visible]);

  return (
    <ListWrapper ref={domRef}>
      {tipInfo?.visible && (
        <ErrorMessage
          visible={tipInfo?.visible ?? false}
          type={tipInfo?.type}
          content={tipInfo?.text ?? ''}
          style={ErrorMessageStyle}
        />
      )}
      {/* {modal.show ? <InfoModal name={undefined} {...modal} onClose={handleClose} /> : null} */}
      <InfoModal name={undefined} {...modal} onClose={handleClose} />
      <div className="header-content">
        <TitleItem type={ItemEnum.ZYZB}></TitleItem>
        <div className="select-right">
          {!loading && tableList?.length ? (
            <TraceBtn
              title="区域经济"
              code={code}
              year={tableData.colKey[tableData.colKey.length - 1]}
              onChange={handleChangeData}
              checked={traceType}
              isHiddenColumn={true}
              hideExport={false}
              hiddenChecked={hiddenChecked}
              onChangeHidden={handleChangeHidden}
              filename={`${areaInfo?.regionNameAll ?? ''}经济速览-${dayjs(new Date()).format('YYYYMMDD')}`}
              exportCondition={
                activeTab === 2
                  ? {
                      areaCode: code,
                      exportFlag: true,
                      statNature: currentStat?.length ? currentStat.join(',') : '1,2,3',
                      module_type: 'web_progress_area_indicators',
                    }
                  : {
                      regionCode: code,
                      exportFlag: 'true',
                      ...listParam,
                      user,
                      years: 5,
                      module_type: 'web_pro_area_economy_new',
                    }
              }
              updateTip={traceCref}
              exportDisabled={!hasData}
            />
          ) : null}
        </div>
      </div>
      <div className="area-economy-table-wrap" data-prevent>
        <Skeleton active loading={loading}>
          {hasData ? (
            <>
              <Table
                ref={tableRef}
                sticky={{
                  offsetHeader: debounceLoading ? 0 : 34,
                  offsetScroll: 0,
                  getContainer: () => document.querySelector('.main-container'),
                }}
                scroll={{
                  // x: 1026,
                  x: 'max-content',
                }}
                stripe={true}
                type="stickyTable"
                columns={finalColumns}
                dataSource={tableList}
                rowKey={(_, index) => index}
                key={activeTab}
                onRow={(record) => {
                  return {
                    onMouseEnter: () => {
                      if (record?.indexId && record?.paramMap && record?.key) {
                        setHoverRowKey(record.key || '');
                      }
                    },
                    onMouseLeave: () => {
                      setHoverRowKey('');
                    },
                  };
                }}
              />
              {UpdateTipCref}
            </>
          ) : null}
        </Skeleton>
        {!loading && !hasData ? (
          <Empty type={Empty.LOAD_FAIL_XS} size={EmptySize.Small} needDefaultDistance={false} />
        ) : null}
      </div>
      {/* 溯源、更新弹窗 */}
      <UpdateTraceModal {...cellState} handleClose={handleCellModalClose} setTraceInfo={setTraceInfo} />
      <UpdateModal {...modalInfo} onClose={closeModal} container={domRef.current} />
      {contetHolder}
      {/* 自定义指标弹窗 */}
      <MetricModal
        visible={metricVisible}
        onConfirmChange={handleConfirmChange}
        onCancel={handleCloseMetric}
        modalType={ModalType.LIST}
        initData={{
          indicatorList,
          treeLoading,
          paramData,
          paramLoading,
          defaultChoice,
        }}
        customParam={customParam}
        drag={drag}
      />
    </ListWrapper>
  );
}

const ListWrapper = styled.div`
  overflow: visible;

  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    display: none;
  }

  .custom-area-economy-screen-wrap {
    margin-bottom: 8px;
  }

  .ant-table-tbody > tr > td.missVCA {
    background: right center / 14px no-repeat url(${missVCAIcon});
  }

  .select-right {
    flex-shrink: 0;
    margin-left: 24px;
  }

  .edit-title {
    display: inline-flex;
    align-items: center;
    line-height: 13px;
    height: 20px;
  }
  .edit-btn {
    width: 54px;
    height: 20px;
    margin-left: 8px;
    border: 0.5px solid #abd1ff;
    border-radius: 11px;
    padding: 0 6px;
    display: inline-flex;
    align-items: center;
    justify-content: space-around;
    line-height: 12px;
    font-size: 12px;
    color: #0171f6;
    cursor: pointer;
  }
  .edit-icon {
    display: inline-block;
    width: 11px;
    height: 11px;
    line-height: 11px;
    margin-top: -1px;
    background: url('${EditIcon}');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .metric-title {
    > span {
      &:not(:last-child) {
        margin-right: 6px;
      }
    }
  }
`;
