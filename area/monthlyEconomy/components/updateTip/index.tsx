import useTraceSource from './hooks/useTraceSource';
import useGetTipData from './hooks/useUpdateInfoData';
import useUpdateTip from './hooks/useUpdateTip';

export const inModalInitparams = {
  endDate: '(*,*)',
  keyword: '',
  sort: '',
  from: 0,
  size: 10000,
};

interface Iprops {
  /** 溯源的默认状态，弹窗内的溯源状态跟随外部的溯源状态 */
  defaultSource?: boolean;
  /** 为true时显示更新提示-近一月 */
  isLastMonth?: boolean;
  /**主页面 */
  isMainPage?: boolean;
}

export default ({ defaultSource, isLastMonth, isMainPage = false }: Iprops) => {
  const traceInfo = useTraceSource({ defaultSource, isMainPage });
  const updateTipInfo = useUpdateTip(!!isLastMonth);
  const tipRequestInfo = useGetTipData();
  return { ...traceInfo, ...updateTipInfo, ...tipRequestInfo };
};
