import { useEffect, useState } from 'react';

import { useDebounce, useMemoizedFn } from 'ahooks';

import ErrorMessage, { TipType } from '@/components/advanceSearch/components/extraModal/errorMessage';
import { useSelector } from '@/pages/area/areaF9/context';
import { PagePlatform } from '@/pages/dataView/provider';

import { useIndicatorsModuleConfig } from '../../hooks';
import InfoModal from '../../infoModal';
import { IParam, ModalType, SelectItem } from '../../types';
import useMainTop from '../../useMainTop';
import MetricModal from '../mMetricModal';
import ChartLayout, { ChartLoadingLayout } from './chartLayOut';
import { CardItem } from './types';

const ErrorMessageStyle = { top: '20px', minWidth: 'max-content' };
function ChartLayOutContainer({
  changeResetFlag,
  changeResetHandle,
  changeLoadingHandle,
  setLoading,
  hiddenEmptyCard,
  changeHasData,
  indicatorTreeParams,
}: {
  changeResetFlag: (resetFlag: boolean, modalType: ModalType) => void;
  changeResetHandle: (modalType: ModalType, handle: () => void) => void;
  changeLoadingHandle: (modalType: ModalType, loading: boolean) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  hiddenEmptyCard: boolean;
  changeHasData?: (modalType: ModalType, hasData: boolean) => void;
  indicatorTreeParams: any;
}) {
  const areaInfo = useSelector((store) => store.areaInfo);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    title: '',
    unit: undefined,
    data: '',
    name: '',
    hasChart: 0,
    chartType: null,
    isCustom: false,
    customValueType: 2,
  });
  // 指标拖拽后的排序信息
  const [sortMap, setSortMap] = useState<Record<string, number>>({ hasSort: 0 });
  // 图表弹窗
  const handleShowModal = useMemoizedFn((item, name, data, unit) => {
    const regionName = areaInfo?.regionName || '';
    // const unUnitName = name?.lastIndexOf('(') ? name.slice(0, name.lastIndexOf('(')) : name;
    item.data.hasChart &&
      setModal({
        show: true,
        title: regionName + item.data.chartTitle,
        unit: unit,
        name,
        data,
        hasChart: item.data.hasChart,
        chartType: item.data.chartType,
        isCustom: item.data?.isCustom,
        customValueType: item.data?.customValueType,
      });
  });
  const handleClose = useMemoizedFn(() => {
    setModal((base) => {
      return { ...base, show: false };
    });
  });

  const [tipInfo, setTipInfo] = useState<{
    visible: boolean;
    type?: TipType;
    text?: string;
  }>({
    visible: false,
  });

  const { indicatorList, cardDefaultChoice, treeLoading, customParam } = indicatorTreeParams;

  const {
    pending,
    firstLoading,
    formatCardData: cardList,
    resetFlag,
    getCardDataAsync,
    handleGetDefData,
    paramData,
    paramLoading,
    defaultChoice,
    error,
  }: { formatCardData: CardItem[]; [k: string]: any } = useMainTop({ hiddenEmptyCard, sortMap, cardDefaultChoice });

  const debounceLoading = useDebounce(firstLoading, {
    wait: 1000,
    leading: true,
  });

  useEffect(() => {
    setLoading(debounceLoading);
  }, [debounceLoading, setLoading]);

  useEffect(() => {
    changeResetFlag && changeResetFlag(resetFlag, ModalType.CARD);
  }, [changeResetFlag, resetFlag]);
  // 更新恢复默认的事件
  useEffect(() => {
    handleGetDefData && changeResetHandle && changeResetHandle(ModalType.CARD, handleGetDefData);
  }, [changeResetHandle, handleGetDefData]);
  // 更新模块loading态
  useEffect(() => {
    changeLoadingHandle && changeLoadingHandle(ModalType.CARD, pending);
  }, [changeLoadingHandle, pending]);
  // 更新模块error态
  useEffect(() => {
    changeHasData && changeHasData(ModalType.CARD, !error);
  }, [changeHasData, error]);

  // 自定义指标弹窗显隐
  const handleModalVisible = useMemoizedFn(() => {
    setModalVisible(true);
  });
  const handleModalUnV = useMemoizedFn(() => {
    setModalVisible(false);
  });

  const { batchRequest } = useIndicatorsModuleConfig();
  const getDataAsync = useMemoizedFn((params: Record<string, IParam>, isDefault: boolean) => {
    getCardDataAsync?.({
      regionCode: areaInfo?.regionCode!,
      indexParamList: Object.values(params) as IParam[],
      restoreDefault: isDefault ? 1 : 0,
    })
      .then(() => {
        setTipInfo({
          visible: true,
          type: TipType.success,
          text: '保存成功',
        });
      })
      .catch(() => {
        setTipInfo({
          visible: true,
          type: TipType.error,
          text: '保存失败',
        });
      })
      .finally(() => {
        setTimeout(() => {
          setTipInfo({
            visible: false,
          });
        }, 3000);
        changeResetFlag(!isDefault, ModalType.CARD);
      });
  });
  // 自定义指标弹窗保存的回调
  const handleConfirmChange = useMemoizedFn((checkedNodes: SelectItem[], isDefault: boolean) => {
    // 保存排序信息
    const sortObj: Record<string, number> = { hasSort: 1 };
    const customIndexIds: string[] = [];
    const params: Record<string, IParam> = {};
    checkedNodes.forEach((item, index) => {
      sortObj[item.indexId!] = index;
      params[item.indexId!] = { indexId: item.indexId! };
      if (item?.defaultParamMap) {
        params[item.indexId!] = { indexId: item.indexId!, paramMap: item.defaultParamMap };
      }
      if (item?.paramMap) {
        params[item.indexId!] = { indexId: item.indexId!, paramMap: item.paramMap };
      }
      if (item?.canAdd || item?.isCustom) {
        customIndexIds.push(item.indexId!);
        params[item.indexId!] = { indexName: item?.indexName, indexId: item.indexId! };
      }
    });
    setSortMap(sortObj);
    if (customIndexIds.length) {
      batchRequest({
        indexIds: customIndexIds.join(','),
        isDefault: true,
        pageType: PagePlatform.Area,
      }).then((res) => {
        res?.data?.forEach((item: { indexId: any; indexName: any; defaultValueBean: any }) => {
          const { indexId, indexName, defaultValueBean } = item;
          params[indexId] = { indexId, indexName, paramMap: defaultValueBean?.paramMap };
        });
        getDataAsync(params, isDefault);
      });
    } else {
      getDataAsync(params, isDefault);
    }
  });

  return (
    <>
      {tipInfo?.visible && (
        <ErrorMessage
          visible={tipInfo?.visible ?? false}
          type={tipInfo?.type}
          content={tipInfo?.text ?? ''}
          style={ErrorMessageStyle}
        />
      )}
      {/* {modal.show ? <InfoModal tabIndex={undefined} {...modal} onClose={handleClose} /> : null} */}
      <InfoModal tabIndex={undefined} {...modal} onClose={handleClose} />
      {pending && <ChartLoadingLayout />}
      {!pending && cardList?.length ? (
        <ChartLayout
          list={cardList}
          openInfoModal={handleShowModal}
          openMetricModal={handleModalVisible}
          resetFlag={resetFlag}
        />
      ) : null}
      <MetricModal
        onConfirmChange={handleConfirmChange}
        visible={modalVisible}
        modalType={ModalType.CARD}
        onCancel={handleModalUnV}
        initData={{
          indicatorList,
          treeLoading,
          paramData,
          paramLoading,
          defaultChoice,
        }}
        customParam={customParam}
      />
    </>
  );
}

export default ChartLayOutContainer;
