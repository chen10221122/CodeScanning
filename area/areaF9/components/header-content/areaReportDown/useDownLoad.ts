import { useEffect, useRef, useState } from 'react';

import { useRequest, useMemoizedFn, useMount, useThrottleFn } from 'ahooks';

import { request } from '@/app/libs/request';
import { AsyncTask, useMultipleDownload } from '@/libs/download';

const POWER_CHECK_PORT = '/finchinaAPP/downloadManager/checkRight.action';

const COMMON_PARAMS = { downloadType: 'regionReport', type: 'region' };

/** 下载权限接口 */
const getRightCheck = (params: typeof COMMON_PARAMS) => {
  return request.get(POWER_CHECK_PORT, {
    params,
  });
};

export default function useDownload() {
  /** 是否有下载权限 */
  const [downRight, setDownRight] = useState(false);
  /** 下载次数是否超限 */
  const [overLimit, setOverLimit] = useState(false);
  const [noPayDialogVisible, setNoPayDialogVisible] = useState(false);
  const [limitDialogVisible, setLimitDialogVisible] = useState(false);

  const { addFail, addDownloadPolling, loading } = useMultipleDownload();
  // 正在loading中的map返回的为true，否则为false
  const taskLoadingMapRef = useRef<Record<string, any>>({});

  useEffect(() => {
    return () => {
      taskLoadingMapRef.current = {};
    };
  }, []);

  const { run: rightCheck } = useRequest(getRightCheck, {
    manual: true,
    throttleWait: 200,
    onSuccess: (res) => {
      if (res?.data?.pdf) {
        const { status, info } = res.data.pdf;
        if (status === 20 || info?.includes('次数已用完')) {
          // 有权限但下载次数超限了
          setDownRight(true);
          setOverLimit(true);
        } else {
          if (status === 0) {
            // 正常下载
            setDownRight(true);
            setOverLimit(false);
          } else if (status === 204) {
            // 无下载权限
            setDownRight(false);
          }
        }
      }
    },
  });

  /* 挂载的时候查一下权限状态 */
  useMount(() => {
    rightCheck({ ...COMMON_PARAMS });
  });

  useEffect(() => {
    const taskIds = Object.keys(taskLoadingMapRef.current);
    const loadingIds = Object.keys(loading);
    for (const taskId of taskIds) {
      if (!loadingIds.includes(taskId)) {
        taskLoadingMapRef.current[taskId] = false;
        /* 一个下载任务完成就查一下最新的权限状态 */
        rightCheck({ ...COMMON_PARAMS });
      }
    }
  }, [rightCheck, loading]);

  const handleDownload = useMemoizedFn((code, id) => {
    const existTask = taskLoadingMapRef.current[id];
    if (existTask) {
      return;
    }
    const task = new AsyncTask({ ext: 'pdf', queryRight: false, name: '', addSuffix: false });
    taskLoadingMapRef.current[id] = true;
    task.unique(id);
    task.addParams({
      code,
      fileId: task.id,
      fileType: 2,
      ...COMMON_PARAMS,
    });
    task.start({
      onSuccess: ({ data }) => {
        if (data.fileName) {
          task.name = data.fileName;
          addDownloadPolling(task);
        }
      },
      onError: () => {
        addFail(task);
      },
    });
  });

  const { run: onThrottleDown } = useThrottleFn(handleDownload, {
    wait: 500,
  });

  const onDownClick = useMemoizedFn((code, id) => {
    if (!downRight) setNoPayDialogVisible(true);
    else if (overLimit) setLimitDialogVisible(true);
    else onThrottleDown(code, id);
  });

  return {
    handleDownload,
    handleThrottleDownload: onThrottleDown,
    onDownClick,
    loading,
    downRight,
    overLimit,
    noPayDialogVisible,
    limitDialogVisible,
    setNoPayDialogVisible,
    setLimitDialogVisible,
  };
}
