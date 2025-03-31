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
  /** 溯源的默认状态，区域经济大全页弹窗内的溯源状态跟随外部的溯源状态 */
  defaultSource?: boolean;
  /** 为true时显示更新提示-近一月 */
  isLastMonth?: boolean;
  missVCA?: boolean;
  /** 更新提示显示近一周 */
  isLastWeek?: boolean;
}

export default ({ defaultSource, isLastMonth, missVCA, isLastWeek }: Iprops) => {
  const traceInfo = useTraceSource({ defaultSource, switchSize: '22' });
  const updateTipInfo = useUpdateTip(!!isLastMonth, missVCA, isLastWeek);
  const tipRequestInfo = useGetTipData();
  return { ...traceInfo, ...updateTipInfo, ...tipRequestInfo };
};
