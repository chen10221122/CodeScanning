import { useEffect, useState, useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';

import useRequest from '@/utils/ahooks/useRequest';
import { useImmer } from '@/utils/hooks';

import { getCensusAnalyseDetailData } from '../api';
import { DetailModuleType } from '../config';

interface stringMap {
  [key: string]: string;
}

const seasonMap = new Map([
  ['01', '一季度'],
  ['04', '二季度'],
  ['07', '三季度'],
  ['10', '四季度'],
]);

const awesomeSite = new Map([
  ['01', '03'],
  ['04', '06'],
  ['07', '09'],
  ['10', '12'],
]);

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

interface Props {
  /** 外部表格接口初始化请求参数 */
  tableParamsData: Record<string, any>;
  /** 其他请求参数 */
  restProp?: Record<string, any>;
  /** 更新其他参数 */
  setRestProp?: Function;
  /** 受控参数 */
  ctrl?: string;
}

export default function useHandleDetailModal({ tableParamsData, restProp, setRestProp, ctrl }: Props) {
  /** 弹框类型 */
  const [modalType, setModalType] = useState('');
  /** 表格请求参数 */
  const [detailParamsData, update] = useImmer({
    requestParams: {
      popKey: '',
      from: '0',
    },
  });
  /** 表格数据总量*/
  const [detailTotal, setTotal] = useState(0);
  /** 当前页码数*/
  const [curentDetailPage, setCurentPage] = useState(1);
  /** 弹框可见性 */
  const [visible, setVisible] = useState(false);
  /** 弹框标题 */
  const [title, setTitle] = useState('');

  const reqRef = useRef<string>('');
  const totalRef = useRef<string>('');

  const {
    run,
    data: detailResultData,
    loading: detailLoading,
    // error,
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
    const reqJson = JSON.stringify({ ...detailParamsData.requestParams, size: 0, from: 0 });
    if (detailLoading && reqJson !== totalRef.current) {
      setTotal(0);
      totalRef.current = reqJson;
    } else {
      setTotal(detailResultData?.data?.total ?? 0);
    }
  }, [detailLoading, setTotal, detailResultData?.data?.total, detailParamsData.requestParams]);

  const currentPopkey = useMemo(() => {
    return { popKey: DETAIL_PARAMS_MAP?.[modalType] };
  }, [modalType]);

  useEffect(() => {
    /** 请求是三部分参数组成：
     * 1、外层表格参数
     * 2、popKey
     * 3、当前行的itcode2
     */

    update?.((data: any) => {
      data.requestParams = {
        ...data.requestParams,
        ...tableParamsData.requestParams,
        ...restProp,
        ...currentPopkey,
        size: 50,
      };
    });
  }, [tableParamsData, restProp, update, currentPopkey]);

  useEffect(() => {
    const reqJson = JSON.stringify(detailParamsData.requestParams);
    if (currentPopkey?.popKey?.length && reqJson !== reqRef.current && visible) {
      run({ ...detailParamsData.requestParams });
      reqRef.current = reqJson;
    }
  }, [run, detailParamsData, currentPopkey, visible]);

  const handlePageChange = useMemoizedFn((currentValue) => {
    setCurentPage(currentValue);
    update?.((data: any) => {
      data.requestParams = {
        ...data.requestParams,
        from: String(currentValue ? (currentValue - 1) * 50 : 0),
      };
    });
  });

  /** 详情弹窗事件 */
  const handleNumModal = useMemoizedFn((record, type) => {
    const { itname, itcode2 } = record?.lessee?.[0] || record?.leaser?.[0] || {};
    // setExportTypeName(TITLE_SUFFIX_MAP?.[type]);
    setTitle(`${itname}${TITLE_SUFFIX_MAP?.[type]}`);
    setRestProp?.({ itcode2 });
    setModalType(type);
    setVisible(true);
  });

  /** 详情弹窗事件 */
  const closeNumModal = useMemoizedFn(() => {
    setVisible(false);
    setCurentPage(1);

    update((d) => {
      d.requestParams = {
        popKey: '',
        from: '0',
      };
    });
  });

  /** 按规模总量详情弹窗事件 */
  const handleNumModalWithTotal = useMemoizedFn((record, type) => {
    let registerStartDateFrom, registerStartDateTo, title;
    if (ctrl === '2') {
      if (record?.registerStartDate) {
        const [y, m] = record.registerStartDate.split('-');
        registerStartDateFrom = record.registerStartDate ?? '';
        registerStartDateTo = `${y}-${awesomeSite.get(m)}` ?? '';
        title = `${y}年${seasonMap.get(String(m))}`;
      } else {
        registerStartDateFrom = record.registerStartDate ?? '';
        registerStartDateTo = record.registerStartDate ?? '';
        title = ``;
      }
    } else {
      if (ctrl === '1') {
        const [y, m] = record.registerStartDate.split('-');
        title = `${y}年${m}月`;
        /** 2 */
      } else {
        title = record.registerStartDate + '年';
      }
      registerStartDateFrom = record.registerStartDate ?? '';
      registerStartDateTo = record.registerStartDate ?? '';
    }
    setTitle(`${title}${(TITLE_SUFFIX_MAP as any)[type]}`);
    setRestProp?.({ registerStartDateFrom, registerStartDateTo });
    setModalType(type);
    setVisible(true);
  });

  /** 按规模将到期详情弹窗事件 */
  const handleNumModalWithWillExpire = useMemoizedFn((record, type) => {
    let endDateFrom, endDateTo, title;
    if (ctrl === '2') {
      if (record?.registerEndDate) {
        const [y, m] = record.registerEndDate.split('-');
        endDateFrom = record.registerEndDate ?? '';
        endDateTo = `${y}-${awesomeSite.get(m)}` ?? '';
        title = `${y}年${seasonMap.get(String(m))}`;
      } else {
        endDateFrom = record.registerEndDate ?? '';
        endDateTo = record.registerEndDate ?? '';
        title = ``;
      }
    } else {
      if (ctrl === '1') {
        const [y, m] = record.registerEndDate.split('-');
        title = `${y}年${m}月`;
        /** 2 */
      } else {
        title = record.registerEndDate + '年';
      }
      endDateFrom = record.registerEndDate ?? '';
      endDateTo = record.registerEndDate ?? '';
    }

    setTitle(`${title}${(TITLE_SUFFIX_MAP as any)[type]}`);
    // setTitle(`${endDateFrom.slice(0, 4)}年${endDateTo.slice(5)}月${(TITLE_SUFFIX_MAP as any)[type]}`);
    setRestProp?.({ endDateFrom, endDateTo });
    setModalType(type);
    setVisible(true);
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
    detailParamsData,
    handleNumModal,
    handleNumModalWithTotal,
    handleNumModalWithWillExpire,
    handlePageChange,
    closeNumModal,
  };
}
