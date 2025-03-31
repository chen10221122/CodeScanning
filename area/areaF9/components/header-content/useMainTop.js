import { useEffect, useRef, useState } from 'react';

import { useParams } from '@pages/area/areaF9/hooks';

import { getAreaModel } from '@/apis/area/areaEconomy';
import useRequest from '@/utils/ahooks/useRequest';

export default function useMainTop() {
  const { code } = useParams();
  const [modelInfo, setModelInfo] = useState([]);

  // 悬浮框接口请求
  const {
    data: modelInfoData,
    run: getModelInfo,
    loading: modelInfoPending,
  } = useRequest(getAreaModel, {
    manual: true,
  });

  const codeRef = useRef(code);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    // 当 code 存在的时候才去请求，否则就会请求到默认上海的数据，是有问题的
    if (codeRef.current) {
      getModelInfo({ regionCode: codeRef.current });
    }
  }, [getModelInfo]);

  useEffect(() => {
    if (modelInfoData?.data) {
      setModelInfo(modelInfoData.data);
    }
  }, [modelInfoData]);

  return {
    pending: modelInfoPending,

    modelInfo: modelInfo.length ? modelInfo[0] : {},
  };
}
