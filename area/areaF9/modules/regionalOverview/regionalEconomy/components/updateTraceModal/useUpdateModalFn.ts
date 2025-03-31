import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { getUpdateData } from '@dataView/api';
import { areaModalType } from '@dataView/const';

import { IUpdateModalInfo } from '@/pages/dataView/components/areaTraceModal/interface';
import useRequest from '@/utils/ahooks/useRequest';

export default function useUpdateModalFn() {
  const [updateModalInfo, setUpdateModalInfo] = useState<IUpdateModalInfo>({} as IUpdateModalInfo);

  const {
    loading: updateInfoLoading,
    data: updateDataInfo,
    run: runUpdateDataInfo,
  } = useRequest(getUpdateData, {
    manual: true,
    formatResult: (res) => {
      return res.data;
    },
  });

  /** 打开数据更新弹窗 */
  const handleUpdateModalOpen = useMemoizedFn((record, realIndicName, o) => {
    setUpdateModalInfo({
      title: o,
      regionName: record?.regionName,
    });
  });

  /** 关闭数据更新弹窗 */
  const handleUpdateModalClose = useMemoizedFn(() => {
    setUpdateModalInfo({} as IUpdateModalInfo);
  });

  const handleCellWrapperClick = useMemoizedFn((params, viewAreaType) => {
    const { extraProperties, isShowUpdate, requestParams, paramName, regionName } = params;
    const { color } = extraProperties || {};

    if (!areaModalType.includes(viewAreaType) && isShowUpdate && color) {
      // if (!havePay) {
      //   openNoPermissionModal(PermissionType.NoPermissionIndicator);
      //   return;
      // }

      // const indicatorParams = interfaceParams?.[colKey];
      // const requestParams = {
      //   businessCodeInfo: [params.data.key, typeMap[params.data.type]],
      //   indexParam: {
      //     indexId: colKey,
      //     paramMap: indicatorParams,
      //   },
      // };
      runUpdateDataInfo(requestParams);

      setUpdateModalInfo({
        title: paramName,
        regionName,
      });
    }
  });
  return {
    handleCellWrapperClick,
    handleUpdateModalOpen,
    handleUpdateModalClose,
    updateInfoLoading,
    updateDataInfo,
    updateModalInfo,
  };
}
