import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { getCensusAnalyseDetailData } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/api';
import { DetailModuleType } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/config';
import useRequest from '@/utils/ahooks/useRequest';
import { useImmer } from '@/utils/hooks';

interface stringMap {
  [key: string]: string;
}

const TITLE_SUFFIX_MAP: stringMap = {
  [DetailModuleType.LEASEEVENTNUM]: '租赁融资事件',
  [DetailModuleType.LEASE_WILLEXPIREEVENTNUM]: '将到期租赁融资事件',
  [DetailModuleType.LEASERNUM]: '租赁融资事件-出租人明细',
  [DetailModuleType.LESSEENUM]: '租赁融资事件-承租人明细',
  [DetailModuleType.LEASER_WILLEXPIRENUM]: '将到期租赁融资事件-出租人明细',
  [DetailModuleType.LESSEE_WILLEXPIRENUM]: '将到期租赁融资事件-承租人明细',
};

const DETAIL_PARAMS_MAP: stringMap = {
  [DetailModuleType.LEASEEVENTNUM]: 'leaseEventDetail',
  [DetailModuleType.LEASE_WILLEXPIREEVENTNUM]: 'leaseEventDetail',
  [DetailModuleType.LEASERNUM]: 'leaserDetail',
  [DetailModuleType.LESSEENUM]: 'lesseeDetail',
  [DetailModuleType.LEASER_WILLEXPIRENUM]: 'leaserDetail',
  [DetailModuleType.LESSEE_WILLEXPIRENUM]: 'lesseeDetail',
};

const defaultDetailParams = {
  size: 50,
  from: 0,
};

export default function useHandleDetailModal() {
  /** 弹框类型 */
  const [modalType, setModalType] = useState('');
  /** 表格请求参数 */
  const [detailParams, updateDetailParams] = useImmer(defaultDetailParams);
  /** 表格数据总量*/
  const [detailTotal, setTotal] = useState(0);
  /** 当前页码数*/
  const [curentDetailPage, setCurentPage] = useState(1);
  /** 弹框可见性 */
  const [visible, setVisible] = useState(false);
  /** 弹框标题 */
  const [title, setTitle] = useState('');

  const {
    run,
    data: detailResultData,
    loading: detailLoading,
  } = useRequest<any>(getCensusAnalyseDetailData, {
    manual: true,
    onSuccess(res) {
      setTotal(res?.data?.total);
    },
    onError() {
      setTotal(0);
    },
  });

  useEffect(() => {
    if (!visible) setTotal(0);
  }, [visible, detailTotal]);

  useEffect(() => {
    if (visible) {
      run(detailParams);
    }
  }, [run, detailParams, visible]);

  const handlePageChange = useMemoizedFn((currentValue) => {
    setCurentPage(currentValue);
    updateDetailParams((d) => {
      d.from = currentValue ? (currentValue - 1) * defaultDetailParams.size : 0;
    });
  });

  /** 详情弹窗事件 */
  const handleNumModal = useMemoizedFn(({ record, type, restParams }) => {
    const { itname, itcode2 } = record?.lessee?.[0] || record?.leaser?.[0] || {};
    setTitle(`${itname}${TITLE_SUFFIX_MAP[type]}`);
    setModalType(type);
    setVisible(true);

    updateDetailParams((d) => {
      return {
        itcode2,
        popKey: DETAIL_PARAMS_MAP[type],
        ...restParams,
        ...defaultDetailParams,
      };
    });
  });

  /** 详情弹窗事件 */
  const closeNumModal = useMemoizedFn(() => {
    setVisible(false);
    setCurentPage(1);
  });

  return {
    title,
    visible,
    detailLoading,
    modalType,
    detailTotal,
    setVisible,
    curentDetailPage,
    detailResultData,
    detailParams,
    handleNumModal,
    handlePageChange,
    closeNumModal,
  };
}
