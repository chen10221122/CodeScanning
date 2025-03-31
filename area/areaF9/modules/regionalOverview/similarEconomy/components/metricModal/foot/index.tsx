import { FC, memo } from 'react';

import cn from 'classnames';

import { saveEconomySimilarChoiceParam } from '@/apis/area/areaEconomy';
import { Flex } from '@/components/layout';

import { IParam, SelectItem } from '../types';
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

  // 保存指标
  const saveProxy = (e: any) => {
    saveEconomySimilarChoiceParam(checkedNodes.map((i) => i.indexId).join(','));
    onOk();
  };

  return (
    <div className={cn(styles.overlayFoot, styles.modalFoot)}>
      <span className={styles.tip}>说明：按住shift键选择“已选指标”配合delete键可批量删除</span>
      <Flex align="center">
        {/* <Checkbox checked={rememberProxy} onChange={saveProxy} className={styles.rememberProxy}>
          记住指标
        </Checkbox> */}

        <div onClick={onCancel} className={cn(styles.active, styles.footItem)}>
          取消
        </div>
        <div
          onClick={saveProxy}
          className={checkedNodes.length ? styles.active : styles.notAllowed}
          // style={{ paddingRight: '20px', lineHeight: '32px' }}
        >
          保存
        </div>
      </Flex>
    </div>
  );
};

export default memo(Foot);
