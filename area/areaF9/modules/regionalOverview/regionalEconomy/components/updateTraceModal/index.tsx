import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn, useRequest } from 'ahooks';
import { message } from 'antd';
import { isNil } from 'lodash';

import { getCellTransformRequest } from '@dataView/api';
import {
  AreaTraceModal,
  UpdateModal,
  AreaTechnologyInnovation,
  useAreaTechnologyInnovationFn,
} from '@dataView/components/areaTraceModal';
import { IndicatorConfig } from '@dataView/provider';

import AreaDialog from '@/components/dialog/areaModal';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { useRefCtx, useSelector } from '@/pages/area/areaF9/context';
import AreaBondModal from '@/pages/bond/chineseDollarBondStatistics/components/detailModal';
import useDetail from '@/pages/bond/chineseDollarBondStatistics/hooks/useDetail';
import { ColumnTypeEnums } from '@/pages/bond/chineseDollarBondStatistics/types';
import {
  relativeMap,
  technologyInnovationType,
  enterpriseRankType,
  newRegisteredEnterprise,
  revocationOrCancelEnterprise,
  dollarBondType,
  dollarBondMap,
  dollarBondNumType,
  dollarBondNumMap,
} from '@/pages/dataView/DataView/SheetView/TableView/extras/area/const';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import useTraceModalFn from './useTraceModalFn';
import useUpdateModalFn from './useUpdateModalFn';

export type Param = {
  /** 是否展示更新弹窗 */
  isShowUpdate: boolean;
  /** 是否溯源 */
  isShowTrace: boolean;
  /** 是否点击文本 */
  isClickArea: boolean;
  /** 当前单元格值 */
  value: any;
  /** 溯源guId */
  guId: string;
  indexId: string;
  /** 指标弹窗类型 */
  type: string;
  /** 指标其他信息 */
  extraProperties: Record<string, any>;
  /** 接口入参 */
  requestParams: {
    businessCodeInfo: [string, string];
    indexParam: { indexId: string; paramMap?: Record<string, any[]> | undefined };
  };
  /** 指标名 */
  paramName: string;
  /** 当前地区 */
  regionName: string;
  /** 当前地区code */
  regionCode: string;
  /** 当前列年份 */
  year: string;
  modalVisible: boolean;
  /** 弹窗关闭的回调函数 */
  handleClose: () => void;
  setTraceInfo?: any;
};

export default function AreaExtraModal({ handleClose, setTraceInfo, ...param }: Param) {
  const { indexId, year, paramName } = param;
  const [params, setParams] = useState<{ type?: string; indicator?: IndicatorConfig; [a: string]: any }>({});

  const {
    state: { wholeModuleWrapperRef },
  } = useRefCtx();

  const { runAsync: requestCellModalInfo } = useRequest(getCellTransformRequest, {
    manual: true,
    onError: (e: any) => {
      if (e.type === 'Timeout') {
        message.error({ content: '请求超时，请稍后再试', duration: 3 });
      } else {
        message.error({ content: e.info || '请求异常，请稍后再试', duration: 3 });
      }
    },
  });

  const getContainer = useMemoizedFn(() =>
    (wholeModuleWrapperRef || document.body).querySelector('#wrapperContainer__ContentContainer'),
  );

  const openDataSource = useSelector((store) => store.openDataSource);

  const close = useMemoizedFn(() => {
    setParams({});
    getContainer().style.zIndex = 10;
    handleClose && handleClose();
  });

  /** 计算指标溯源弹窗 */
  const { handleAreaLinkClick, handleModalClose, traceModalInfo } = useTraceModalFn({
    setTraceInfo,
  });

  /** 数据更新详情弹窗 */
  const {
    handleCellWrapperClick,
    handleUpdateModalOpen,
    handleUpdateModalClose,
    updateInfoLoading,
    updateDataInfo,
    updateModalInfo,
  } = useUpdateModalFn();

  // 科创类弹窗 + 版单弹窗
  const technologyInnovationProps = useAreaTechnologyInnovationFn();
  const {
    setVisible: setTechnologyInnovationVisible,
    setTitle: setTechnologyInnovationTitle,
    setParams: setTechnologyInnovationParams,
    setType: setTechnologyInnovationType,
  } = technologyInnovationProps || {};

  // 中资美元债弹窗
  const [modalType, setModalType] = useState<ColumnTypeEnums>(ColumnTypeEnums.Expire);
  const {
    visible,
    setVisible,
    modalInfo,
    modalParam,
    curPage,
    setCurPage,
    updateParams,
    handleClick,
    handlePageChange,
    handleTableChange,
  } = useDetail(modalType);

  const goInformationTrace = useGoInformationTrace();
  useEffect(() => {
    const { type, guId /*isShowUpdate*/ } = param;
    if (guId) {
      // 有guId时直接跳转
      goInformationTrace(guId);
    } else if (indexId) {
      if (type) {
        let isShowTraceLink = true;
        // 这里是区域数据浏览器的 开发区特点指标 溯源过滤，区域F9的地区都是普通地区，所以注释掉不用
        // if (event?.data?.type === 'develop' && type.includes('region_windows_')) {
        //   let t = type.replace('region_windows_', '') as any;
        //   if (t && !isNaN(t) && 23 - t >= 0) isShowTraceLink = false;
        // }

        // 溯源弹窗
        isShowTraceLink && handleAreaLinkClick(param, type, handleClose);
        handleCellWrapperClick(param, type);

        const modalType = relativeMap[type];
        // 明细弹窗
        if (modalType && param.requestParams && !(isNil(param.value) || param.value === '')) {
          setParams({
            type: modalType,
          });

          getContainer().style.zIndex = 11;

          requestCellModalInfo(param.requestParams).then(({ data }) => {
            setParams({
              params: data,
              areaName: param.regionName || '',
              indicatorName: param.paramName,
              type: modalType,
            });
          });
        }
        // 科创企业弹窗 + 版单明细
        if (
          [
            technologyInnovationType,
            enterpriseRankType,
            newRegisteredEnterprise,
            revocationOrCancelEnterprise,
          ].includes(type) &&
          param.requestParams &&
          !(isNil(param.value) || param.value === '')
        ) {
          requestCellModalInfo(param.requestParams).then(({ data }) => {
            setTechnologyInnovationType(type);
            setTechnologyInnovationTitle(`${param.regionName}_${param.paramName}`);
            setTechnologyInnovationParams(data);
            setTechnologyInnovationVisible(true);
          });
        }
        // 中资美元债弹窗
        if (
          [...dollarBondType, ...dollarBondNumType].includes(type) &&
          param.requestParams &&
          !(isNil(param.value) || param.value === '')
        ) {
          requestCellModalInfo(param.requestParams).then(({ data }) => {
            const moduleType = dollarBondType.includes(type) ? dollarBondMap[type] : dollarBondNumMap[type];
            setModalType(moduleType as ColumnTypeEnums);
            handleClick({
              info: {
                title: param.paramName || '',
                usAmount: dollarBondType.includes(type) ? param.value : 0,
              },
              pageParam: data,
            });
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexId, year, paramName]);
  return (
    <>
      <AreaTraceModal
        updataFlag={true}
        traceModalInfo={traceModalInfo}
        close={() => {
          handleModalClose();
          handleClose?.();
        }}
        handleUpdateModalOpen={handleUpdateModalOpen}
        getContainer={() => getContainer() || document.body}
        openDataSource={openDataSource}
      />
      {/* 数据更新弹窗 */}
      <UpdateModal
        data={updateDataInfo}
        updateModalInfo={updateModalInfo}
        loading={updateInfoLoading}
        close={() => {
          handleUpdateModalClose();
          handleClose?.();
        }}
        getContainer={() => getContainer() || document.body}
        openDataSource={openDataSource}
      />

      <AreaDialog condition={params} close={close} getContainer={getContainer} />

      {/* 科创企业类弹窗 */}
      {/* 榜单明细弹窗 */}
      <AreaTechnologyInnovation
        {...technologyInnovationProps}
        onCloseModal={() => {
          setTechnologyInnovationVisible?.(false);
          handleClose?.();
        }}
        getContainer={() => getContainer() || document.body}
      />

      {/* 美元债弹窗 */}
      {visible ? (
        <AreaBondModal
          visible={visible}
          setVisible={(visible: boolean) => {
            setVisible(visible);
            if (!visible) handleClose?.();
          }}
          page={curPage}
          setCurPage={setCurPage}
          onPageChange={handlePageChange}
          onTableChange={handleTableChange}
          modalParam={modalParam}
          modalInfo={modalInfo}
          modalType={modalType}
          updateParams={updateParams}
          containerID={getContainer() || document.body}
          isHideDetail={true}
        />
      ) : null}
    </>
  );
}

export function useGoInformationTrace() {
  const history = useHistory();

  return useMemoizedFn((guId: string) => {
    history.push(
      urlJoin(
        LINK_INFORMATION_TRACE,
        urlQueriesSerialize({
          guId: guId,
        }),
      ),
    );
  });
}
