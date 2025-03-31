import { useEffect, useRef, useState } from 'react';

import { useDebounceFn, useMemoizedFn, useRequest } from 'ahooks';
import { isEmpty, isNil, cloneDeep } from 'lodash';

import { getDeriveData, getPosId } from '@dataView/api';
import { areaLinkType, areaModalType } from '@dataView/const';

import { useSelector } from '@/pages/area/areaF9/context';
import { formateData, IndicatorEnums } from '@/pages/dataView/components/areaTraceModal/config';
import { ITraceModalInfo } from '@/pages/dataView/components/areaTraceModal/interface';
import { useImmer } from '@/utils/hooks';

import { useGoInformationTrace } from '.';

export default function useTraceModalFn({ setTraceInfo }: { setTraceInfo?: any }) {
  // const history = useHistory();
  const [traceModalInfo, updateTraceModalInfo] = useImmer<ITraceModalInfo>({} as ITraceModalInfo);

  /** 点击溯源的指标名 */
  const clickedTypeRef = useRef<IndicatorEnums>();
  const [data, setData] = useState([]);

  const openDataSource = useSelector((store) => store.openDataSource);

  const gotoInformationTrace = useGoInformationTrace();
  // 获取跳转接口的 guid
  const { runAsync: runGetGuid } = useRequest(getPosId, {
    manual: true,
    onSuccess: ({ data }, params) => {
      const { guid, posId } = data || {};
      if (posId && openDataSource) {
        // 打开右侧溯源
        openDataSource({
          posIDs: posId,
        });
        setTraceInfo(cloneDeep(params?.[0]?.indexParam));
      } else if (guid) {
        gotoInformationTrace(guid);
      }
    },
  });

  // 获取弹窗参数
  const { loading: listInfoLoading, run: runGetDeriveData } = useRequest(getDeriveData, {
    manual: true,
    onSuccess: (traceData) => {
      if (traceData && !isEmpty(traceData)) {
        const list = formateData(traceData, clickedTypeRef.current!, data);

        updateTraceModalInfo((d) => {
          d.traceData = traceData;
          if (list) {
            d.data = list;
          }
        });
      }
    },
  });

  /** 格式化溯源弹窗数据 */
  useEffect(() => {
    updateTraceModalInfo((d) => {
      d.loading = listInfoLoading;
    });
  }, [listInfoLoading, updateTraceModalInfo]);

  /** 关闭溯源弹窗 */
  const handleModalClose = useMemoizedFn(() => {
    updateTraceModalInfo((d) => {
      d = {} as ITraceModalInfo;
      d.data = { tips: '', detail: '', data: [] };
      return d;
    });
  });

  /** 处理弹窗数据 */
  const { run: handleAreaLinkClick } = useDebounceFn(
    (params, viewType, handleClose) => {
      const {
        extraProperties,
        isShowUpdate,
        isShowTrace,
        requestParams,
        paramName,
        regionName,
        regionCode,
        year,
        isClickArea,
        value,
      } = params;
      const isShowTraceLink = isShowTrace && !isNil(value) && viewType === areaLinkType;
      const { color } = extraProperties || {};
      // 请求服务并跳转
      if (isClickArea && isShowTraceLink && !(isShowUpdate && color)) {
        runGetGuid(requestParams).then(() => {
          handleClose && handleClose();
        });
      }
      // 弹窗
      if (
        !isNil(params.value) &&
        areaModalType.includes(viewType) &&
        ((isShowTrace && isClickArea) || (isShowUpdate && color))
      ) {
        setData([]);
        runGetDeriveData(requestParams);
        updateTraceModalInfo((d) => {
          d.visible = true;
          d.title = paramName;
          d.regionName = regionName;
          d.regionCode = regionCode;
          d.year = year;
        });
        clickedTypeRef.current = viewType;
      }
    },
    { leading: true, trailing: false, wait: 1000 },
  );

  return { handleAreaLinkClick, handleModalClose, traceModalInfo };
}
