import { memo, FC, useMemo, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import usePlanApi, {
  PlanItem,
} from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';

import Icon from '@/components/icon';
import { Image } from '@/components/layout';

import styles from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/header/styles.module.less';

interface Props {
  editFlag: boolean;
  myPlan: PlanItem[];
  setEditFlag: (value: boolean) => void;
}

const Header: FC<Props> = ({ editFlag, myPlan, setEditFlag }) => {
  const {
    state: { allPlan },
  } = useCtx();

  const { updateBatchPlan, openTemplateModal } = usePlanApi();

  const hasCustomPlan = useMemo(() => allPlan.length > 1, [allPlan.length]);

  /** 结束编辑点完成触发 */
  const editDone = useMemoizedFn(() => {
    setEditFlag(false);
    if (allPlan.length !== myPlan.length || myPlan.some((item, index) => item.planId !== allPlan[index].planId)) {
      const copyPlan = cloneDeep(myPlan);
      updateBatchPlan(
        copyPlan.reverse().reduce((pre, cur, index) => {
          pre.push({
            planId: cur.planId,
            planName: cur.planName,
            sort: index,
          });
          return pre;
        }, [] as PlanItem[]),
        false,
      );
    }
  });

  // 需求24028要求拖拽模板结束后直接生效，不需要点击‘完成’触发
  useEffect(() => {
    editDone();

    return () => {};
  }, [myPlan, editDone]);

  return (
    <div className={styles.overlayHead}>
      <div className={styles.overlayHeadTitle}>我的指标</div>
      {hasCustomPlan ? (
        <div className={styles.headButtonWrapper}>
          {editFlag ? (
            <div className={styles.editDone} onClick={editDone}>
              完成
            </div>
          ) : (
            <div className={styles.headEditWrapper} onClick={() => setEditFlag(true)} hidden>
              <Image
                src={require('@pages/area/landTopic/components/transferSelect/icons/editTitleActive.svg')}
                style={{ marginRight: '3px' }}
              />
              管理模板
            </div>
          )}
          <div
            onClick={() => openTemplateModal(undefined)}
            /* 这里用position是为了防止拖拽时新建按钮上移 */
            className={styles.addNewPlan}
          >
            <Icon
              unicode="&#xe6b3;"
              size={12}
              style={{ position: 'relative', top: '-1.5px', marginRight: '3px', transform: 'scale(0.833)' }}
            />
            新建模板
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default memo(Header);
