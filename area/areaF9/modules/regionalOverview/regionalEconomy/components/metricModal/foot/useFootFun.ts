import { useMemoizedFn } from 'ahooks';

import { IParam, SelectItem } from '../../../types';
import { useCtx } from '../context';
interface Props {
  checkedNodes: SelectItem[];
  checkedNodeParamMap: Record<string, IParam | undefined>;
  onCancel: () => void;
  onConfirmChange: (
    confirmData: SelectItem[],
    isDefault: boolean,
    paramMap: Record<string, IParam | undefined>,
  ) => void;
}

export default function useFootFun({ checkedNodes, checkedNodeParamMap, onConfirmChange, onCancel }: Props) {
  const {
    state: { resetFlag, selectedNodeParam },
  } = useCtx();

  /** 点击保存触发 */
  const onOk = useMemoizedFn(() => {
    onConfirmChange && onConfirmChange(checkedNodes, !resetFlag, selectedNodeParam);
    onCancel && onCancel();
  });

  return { onOk };
}
