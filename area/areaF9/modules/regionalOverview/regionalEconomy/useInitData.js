import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useRequest } from 'ahooks';

import { getNewAreaEconomy } from '@/apis/area/areaEconomy';
import { useDispatch } from '@/pages/area/areaF9/context';

const useInitData = () => {
  const dispatch = useDispatch();

  const [reqData, setReqData] = useState();
  // 上方卡片的接口请求
  const {
    data,
    run: execute,
    loading: pending,
    error,
  } = useRequest(getNewAreaEconomy, {
    manual: true,
    onSuccess() {
      setReqData(data);
      dispatch((d) => {
        d.areaTableInfo = data;
      });
    },
  });
  const { code } = useParams();
  useEffect(() => {
    if (code) execute({ code });
  }, [code, execute]);
  return {
    reqData,
    pending,
    error,
  };
};
export default useInitData;
