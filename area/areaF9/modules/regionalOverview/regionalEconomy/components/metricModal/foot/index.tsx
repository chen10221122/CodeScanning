import { FC, memo } from 'react';

import cn from 'classnames';

import { Flex } from '@/components/layout';

import { IParam, SelectItem } from '../../../types';
import styles from './styles.module.less';
import useFootFun from './useFootFun';

interface Props {
  onCancel: () => void;
  checkedNodes: SelectItem[];
  checkedNodeParamMap: Record<string, IParam | undefined>;
  onConfirmChange: (
    confirmData: SelectItem[],
    isDefault: boolean,
    paramMap: Record<string, IParam | undefined>,
  ) => void;
}

const Foot: FC<Props> = ({ onCancel, checkedNodes, checkedNodeParamMap, onConfirmChange }) => {
  const { onOk } = useFootFun({
    onCancel,
    checkedNodes,
    checkedNodeParamMap,
    onConfirmChange,
  });

  return (
    <div className={cn(styles.overlayFoot, styles.modalFoot)}>
      <span className={styles.tip}>说明：按住shift键选择“已选指标”配合delete键可批量删除</span>
      <Flex align="center">
        <div onClick={onCancel} className={cn(styles.active, styles.footItem)}>
          取消
        </div>
        <div
          onClick={() => {
            if (checkedNodes.length) {
              onOk();
            }
          }}
          className={checkedNodes.length ? styles.active : styles.notAllowed}
          style={{ paddingRight: '20px' }}
        >
          保存
        </div>
      </Flex>
    </div>
  );
};

export default memo(Foot);
