import { FC, useState, memo, useMemo, useRef, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import useFootFun from '@pages/area/landTopic/components/transferSelect/modules/templateModal/foot/useFootFun';
import ConfirmNewPlanModal from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/confirmNewPlanModal';
import { DefaultPlan } from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import { SelectItem } from '@pages/area/landTopic/components/transferSelect/types';

import { getConfig } from '@/app';
import { Popover } from '@/components/antd';
import { Flex, Image } from '@/components/layout';

import styles from '@pages/area/landTopic/components/transferSelect/modules/templateModal/foot/styles.module.less';

interface Props {
  isAddModal: boolean;
  newPlanName: string;
  /** 点击取消方法 */
  onCancel: () => void;
  checkedNodes: SelectItem[];
  onConfirmChange: (confirmData: SelectItem[]) => void;
}

const Foot: FC<Props> = ({ isAddModal, newPlanName, onCancel, checkedNodes, onConfirmChange }) => {
  const [addPlanIconHover, setAddPlanIconHover] = useState(false);
  const [, setSavePlanIconHover] = useState(false);
  const timerRef = useRef<any>(null);

  const { tempCheck, saveNewPlan, onOk } = useFootFun({
    onCancel,
    checkedNodes,
    onConfirmChange,
  });

  const {
    state: { curEditPlan, forbidEmptyCheck, allPlan, hasPay, isFirstOpenModal, customPlan, noPlan },
    update,
  } = useCtx();

  const [showTip, setShowTip] = useState(isFirstOpenModal);

  useEffect(() => {
    if (isFirstOpenModal && !isAddModal) {
      setTimeout(() => {
        update((draft) => {
          draft.isFirstOpenModal = false;
        });
        if (showTip) setShowTip(false);
      }, 5000);
    }
    return () => {};
  }, [isFirstOpenModal, isAddModal, update, showTip]);

  /** 展示的是否是默认模板 */
  const showDefault = useMemo(() => {
    const defaultPlan = allPlan.find((item) => item.description === DefaultPlan.IsDefault);
    return curEditPlan?.planId === defaultPlan?.planId;
  }, [allPlan, curEditPlan?.planId]);

  const addNewPlan = useMemoizedFn(() => {
    if (!hasPay) {
      update((draft) => {
        draft.noPayDialogVisible = true;
      });
    } else saveNewPlan();
  });

  /** 临时查看按钮可用状态 */
  const emptyCheckFlag = useMemo(
    () => !forbidEmptyCheck || checkedNodes.length,
    [forbidEmptyCheck, checkedNodes.length],
  );

  const handleMouseOver = useMemoizedFn(() => {
    setAddPlanIconHover(true);
    // 无指标模板时弹出操作提示
    if (!timerRef.current && !customPlan.length) {
      timerRef.current = setTimeout(() => {
        setShowTip(true);
      }, 500);
    }
  });
  const handleMouseLeave = useMemoizedFn(() => {
    setAddPlanIconHover(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      setShowTip(false);
    }
  });

  return (
    <div className={cn(styles.overlayFoot, styles.modalFoot)}>
      <span className={styles.tip}>说明：按住shift键选择“已选指标”配合delete键可批量删除</span>
      <Flex align="center">
        {!noPlan && !isAddModal && !showDefault ? (
          <div
            className={cn(emptyCheckFlag ? styles.active : styles.notAllowed, styles.footItem)}
            onClick={() => {
              if (emptyCheckFlag) {
                tempCheck();
              }
            }}
            onMouseOver={() => setSavePlanIconHover(true)}
            onMouseOut={() => setSavePlanIconHover(false)}
          >
            <Image
              src={
                emptyCheckFlag
                  ? require('@pages/area/landTopic/components/transferSelect/icons/savePlanActive.svg')
                  : require('@pages/area/landTopic/components/transferSelect/icons/savePlan.svg')
              }
              style={{ marginRight: '4px', marginBottom: '2px' }}
              w={13}
              h={12}
            />
            临时查看
          </div>
        ) : null}

        {/* 只有新建模板弹窗不显示另存模板按钮，其他情况都显示 */}
        {!noPlan && !isAddModal && !getConfig((d) => d.commons.hideSaveTemplate) ? (
          <Popover
            content={
              <Image
                src={require('@pages/area/landTopic/components/transferSelect/icons/tipBanner.png')}
                w={220}
                h={148}
              />
            }
            title="您可保存指标模版，快捷查看"
            visible={showTip}
            align={{ offset: [0, 5] }}
            // @ts-ignore
            getPopupContainer={(trigger) => trigger.parentNode}
          >
            <div
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseLeave}
              onClick={() => {
                /* 已选指标清空时不可点击 */
                if (checkedNodes.length > 0) addNewPlan();
              }}
              className={cn(checkedNodes.length > 0 ? styles.active : styles.notAllowed, styles.footItem)}
            >
              <Image
                src={
                  addPlanIconHover || checkedNodes.length
                    ? require('@pages/area/landTopic/components/transferSelect/icons/addPlanActive.svg')
                    : require('@pages/area/landTopic/components/transferSelect/icons/addPlan.svg')
                }
                style={{ marginRight: '4px', marginBottom: '1px' }}
                w={13}
                h={12}
              />
              另存模板
              <Image
                src={require('@/assets/images/common/vip.svg')}
                style={{ marginLeft: '2px', marginBottom: '1px' }}
                w={13}
                h={12}
              />
            </div>
          </Popover>
        ) : null}

        <div onClick={onCancel} className={cn(styles.active, styles.footItem)}>
          取消
        </div>
        <div
          onClick={() => {
            if (noPlan) {
              tempCheck();
            } else {
              if (checkedNodes.length) {
                if (isAddModal || !showDefault) {
                  onOk(isAddModal ? newPlanName : undefined, newPlanName);
                } else {
                  tempCheck();
                }
              }
            }
          }}
          className={noPlan || checkedNodes.length ? styles.active : styles.notAllowed}
          style={{ paddingRight: '20px' }}
        >
          {noPlan ? '确定' : !isAddModal && showDefault ? '查看' : '保存'}
        </div>
      </Flex>
      <ConfirmNewPlanModal checkedNodes={checkedNodes} onConfirmChange={onConfirmChange} onCancel={onCancel} />
    </div>
  );
};

export default memo(Foot);
