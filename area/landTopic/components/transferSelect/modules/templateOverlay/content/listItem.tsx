import { useState, memo, FC, useMemo } from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

import { useMemoizedFn } from 'ahooks';
import { Radio } from 'antd';
import cn from 'classnames';
import { cloneDeep, isUndefined } from 'lodash';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import { DeleteInfo } from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/deleteModal';
import usePlanApi, {
  DefaultPlan,
  PlanItem,
} from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import { SelectItem } from '@pages/area/landTopic/components/transferSelect/types';

import { Image } from '@/components/layout';

import styles from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/content/styles.module.less';

interface Props {
  myPlan: PlanItem[];
  setMyPlan: React.Dispatch<React.SetStateAction<PlanItem[]>>;
  editFlag: boolean;
  showItem: PlanItem;
  showIndex: number;
  dragIndex?: number;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  /** 将confirmData对应的原始数据返回给使用者 */
  onConfirmChange: (confirmData: SelectItem[]) => void;
  setDeleteConfirmInfo: React.Dispatch<React.SetStateAction<DeleteInfo>>;
}

const ListItem: FC<Props> = ({
  myPlan,
  setMyPlan,
  editFlag,
  showItem,
  showIndex,
  dragIndex,
  dragHandleProps,
  onConfirmChange,
  setDeleteConfirmInfo,
}) => {
  const {
    state: { hide, curSelectPlanId },
    update,
  } = useCtx();

  const [listItemHover, setListItemHover] = useState<number | undefined>();
  const [dragIconHover, setDragIconHover] = useState<number | undefined>(undefined);
  const [deleteIconHover, setDeleteIconHover] = useState<number | undefined>(undefined);
  const [editIconHover, setEditIconHover] = useState<number | undefined>(undefined);
  const { openTemplateModal, updateBatchPlan } = usePlanApi();
  /** 选中某个模板,将该模板指标返回给使用者并关闭弹窗 */
  const onCheckMyPlan = useMemoizedFn((showItem: PlanItem) => {
    if (isUndefined(editIconHover) && isUndefined(deleteIconHover)) {
      /* if (curSelectPlanId === showItem?.planId) {
        //取消选中，恢复系统模板
        const systemPlan = allPlan.find((item) => item.description === DefaultPlan.IsDefault);
        if (systemPlan) {
          const { content, planId } = systemPlan;
          update((draft) => {
            draft.confirmSelected = content ?? [];
            draft.curSelectPlanId = planId;
          });
          onConfirmChange(content ?? []);
        }
      } else {
        const { content, planId } = showItem;
        update((draft) => {
          draft.confirmSelected = content ?? [];
          draft.curSelectPlanId = planId;
        });
        onConfirmChange(content ?? []);
      } */

      const { content, planId } = showItem;
      update((draft) => {
        draft.confirmSelected = content ?? [];
        draft.curSelectPlanId = planId;
      });
      onConfirmChange(content ?? []);

      hide();
    }
  });

  // 删除模板按钮
  const deleteModal = useMemo(
    () => (
      <>
        {showItem.description === DefaultPlan.IsDefault ? null : (
          <span
            onMouseOver={() => setDeleteIconHover(showIndex)}
            onMouseOut={() => setDeleteIconHover(undefined)}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirmInfo({
                planId: showItem.planId,
                visible: true,
                remark: showItem.remark === DefaultPlan.IsDefault ? DefaultPlan.IsDefault : DefaultPlan.NotDefault,
              });
            }}
          >
            <Image
              src={
                deleteIconHover === showIndex
                  ? require('@pages/area/landTopic/components/transferSelect/icons/deleteActive.svg')
                  : require('@pages/area/landTopic/components/transferSelect/icons/delete.svg')
              }
              style={{ marginRight: '16px', marginBottom: '2px', cursor: 'pointer' }}
            />
          </span>
        )}
      </>
    ),
    [deleteIconHover, setDeleteConfirmInfo, showIndex, showItem.description, showItem.planId, showItem.remark],
  );

  // 拖拽模板按钮
  const dragModal = useMemo(
    () => (
      <span
        {...dragHandleProps}
        onMouseOver={() => setDragIconHover(showIndex)}
        onMouseOut={() => setDragIconHover(undefined)}
      >
        <Image
          src={
            dragIconHover === showIndex || dragIndex === showIndex
              ? require('@pages/area/landTopic/components/transferSelect/icons/dragActive.svg')
              : require('@pages/area/landTopic/components/transferSelect/icons/drag.svg')
          }
          style={{ marginBottom: '3px', cursor: 'grab' }}
          size={12}
        />
      </span>
    ),
    [dragHandleProps, dragIconHover, dragIndex, showIndex],
  );

  return (
    <div
      onMouseOver={() => setListItemHover(showIndex)}
      onMouseOut={() => setListItemHover(undefined)}
      className={cn(isUndefined(dragIndex) ? styles.myPlanListItemActive : '', styles.myPlanListItem)}
      onClick={() => onCheckMyPlan(showItem)}
    >
      <div
        className={cn(styles.dragWrapper, styles.flexWrapper)}
        style={{
          display: listItemHover === showIndex && isUndefined(dragIndex) ? 'flex' : 'none',
        }}
      >
        {dragModal}
      </div>

      <div
        className={cn(styles.listWrapper, styles.flexWrapper, styles.flex1, styles.flexBetween)}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.planItemText}>
          <span
            className={styles.planItemTextDetail}
            style={{
              // 当且仅当 不是默认方案且hover且没有选中
              maxWidth:
                listItemHover === showIndex &&
                showItem.description !== DefaultPlan.IsDefault &&
                showItem.remark !== DefaultPlan.IsDefault
                  ? '180px'
                  : '200px',
              color: curSelectPlanId === showItem.planId && !editFlag ? '#0171F6' : '',
            }}
          >
            {showItem.planName}
            {editFlag && showItem.description !== DefaultPlan.IsDefault ? (
              <div
                onMouseOver={() => setEditIconHover(showIndex)}
                onMouseOut={() => setEditIconHover(undefined)}
                style={{
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#5c5c5c',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  update((draft) => {
                    draft.editPlanNameModalVisible = true;
                    draft.curEditPlan = { ...showItem };
                  });
                }}
              >
                <Image
                  src={
                    editIconHover === showIndex
                      ? require('@pages/area/landTopic/components/transferSelect/icons/editActive.svg')
                      : require('@pages/area/landTopic/components/transferSelect/icons/edit.svg')
                  }
                  style={{
                    margin: '0 4px 1px 6px',
                  }}
                />
              </div>
            ) : null}
          </span>

          {!editFlag ? (
            <>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  /* 当前点击的不是默认模板才执行 */
                  if (myPlan[showIndex].remark !== DefaultPlan.IsDefault) {
                    let clonePlan = cloneDeep(myPlan);
                    /* 先把旧的默认模板清掉，在将当前点击的模板设为默认 */
                    clonePlan.forEach((item) => (item.remark = DefaultPlan.NotDefault));
                    clonePlan[showIndex].remark = DefaultPlan.IsDefault;
                    setMyPlan(clonePlan);
                    let updatePlan = cloneDeep(clonePlan);
                    /* 调用接口更新 */
                    updateBatchPlan(
                      updatePlan.reverse().reduce((pre, cur, index) => {
                        pre.push({
                          planId: cur.planId,
                          planName: cur.planName,
                          sort: index,
                          remark: cur.remark,
                        });
                        return pre;
                      }, [] as PlanItem[]),
                      false,
                    );
                  }
                }}
                style={{
                  display: listItemHover === showIndex && isUndefined(dragIndex) ? 'inline-flex' : 'none',
                  marginLeft: showItem.description === DefaultPlan.IsDefault ? '12px' : '4px',
                }}
              >
                <Radio checked={showItem.remark === DefaultPlan.IsDefault}>
                  {showItem.remark !== DefaultPlan.IsDefault ? '设为默认' : '默认'}
                </Radio>
              </div>

              {showItem.remark === DefaultPlan.IsDefault && !editFlag && listItemHover !== showIndex ? (
                <Image
                  src={require('@pages/area/landTopic/components/transferSelect/icons/defaultTag@1x.png')}
                  src1x={require('@pages/area/landTopic/components/transferSelect/icons/defaultTag@1x.png')}
                  src2x={require('@pages/area/landTopic/components/transferSelect/icons/defaultTag@2x.png')}
                  style={{ marginLeft: '4px' }}
                />
              ) : null}
            </>
          ) : null}
        </div>

        {!editFlag ? (
          <>
            {/* 系统默认模板不可重选 */}
            {showItem.description === DefaultPlan.IsDefault ? null : (
              <div
                className={styles.flexWrapper}
                style={{
                  display: listItemHover === showIndex && isUndefined(dragIndex) ? 'flex' : 'none',
                }}
              >
                <div
                  onMouseOver={() => setEditIconHover(showIndex)}
                  onMouseOut={() => setEditIconHover(undefined)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#5c5c5c',
                    marginRight: '20px',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openTemplateModal(showItem);
                  }}
                >
                  <Image
                    src={
                      editIconHover === showIndex
                        ? require('@pages/area/landTopic/components/transferSelect/icons/editActive.svg')
                        : require('@pages/area/landTopic/components/transferSelect/icons/edit.svg')
                    }
                    style={{
                      margin: '0 0 1px 0',
                    }}
                  />
                  {/* <span style={{ color: editIconHover === showIndex ? '#0171f6' : '#5c5c5c' }}>编辑</span> */}
                </div>

                {deleteModal}
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* 管理模板 */}
      {editFlag ? (
        <div className={styles.flexWrapper}>
          {/* 系统默认模板不可删除 */}
          {deleteModal}
        </div>
      ) : (
        <Image
          src={require('@pages/area/landTopic/components/transferSelect/icons/planCheck.svg')}
          style={{
            marginRight: '16px',
            marginBottom: '2px',
            display: curSelectPlanId === showItem.planId && listItemHover !== showIndex ? 'block' : 'none',
            cursor: 'pointer',
          }}
        />
      )}
    </div>
  );
};

export default memo(ListItem);
