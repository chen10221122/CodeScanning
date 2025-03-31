import { memo, FC, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { useMemoizedFn } from 'ahooks';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import EmptyContent from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/content/emptyContent';
import ListItem from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/content/listItem';
import { DeleteInfo } from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/deleteModal';
import {
  /*DefaultPlan*/ PlanItem,
} from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import { SelectItem } from '@pages/area/landTopic/components/transferSelect/types';

import styles from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/content/styles.module.less';
interface Props {
  editFlag: boolean;
  myPlan: PlanItem[];
  setMyPlan: React.Dispatch<React.SetStateAction<PlanItem[]>>;
  /** 将confirmData对应的原始数据返回给使用者 */
  onConfirmChange: (confirmData: SelectItem[]) => void;
  setDeleteConfirmInfo: React.Dispatch<React.SetStateAction<DeleteInfo>>;
}

const Content: FC<Props> = ({ editFlag, myPlan, setMyPlan, onConfirmChange, setDeleteConfirmInfo }) => {
  const {
    state: { customPlan },
  } = useCtx();

  const [dragIndex, setDragIndex] = useState<number | undefined>(undefined);

  /** Droppable的样式对象 */
  const droppableHeight = useMemo(() => ({ height: `${30 * customPlan.length}px` }), [customPlan.length]);

  /** 拖拽开始触发 */
  const onDragStart = useMemoizedFn((initial) => {
    if (initial?.source) setDragIndex(initial?.source?.index);
  });

  /** 拖拽结束触发 */
  const onDragEnd = useMemoizedFn((result) => {
    setDragIndex(undefined);
    /** 拖拽结束触发 */
    if (!result?.destination || !result?.source) return;
    if (result.destination.index !== result.source.index)
      setMyPlan((prevState) => {
        let [d] = prevState.splice(result.source.index, 1);
        prevState.splice(result.destination.index, 0, d);
        return [...prevState];
      });
  });

  return (
    <div className={styles.overlayContent}>
      {myPlan.length === 1 ? (
        <EmptyContent myPlan={myPlan} />
      ) : (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={droppableHeight}>
                {myPlan.map((dragItem, index) => {
                  // 需求24028不展示‘系统模板’
                  // return dragItem.description !== DefaultPlan.IsDefault ? (
                  //   <Draggable key={dragItem.planId} draggableId={dragItem.planId} index={index}>{children}</Draggable>
                  // ) : null;
                  return (
                    <Draggable key={dragItem.planId} draggableId={dragItem.planId} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}>
                          <ListItem
                            myPlan={myPlan}
                            setMyPlan={setMyPlan}
                            editFlag={editFlag}
                            showItem={dragItem}
                            showIndex={index}
                            dragIndex={dragIndex}
                            dragHandleProps={provided.dragHandleProps}
                            onConfirmChange={onConfirmChange}
                            setDeleteConfirmInfo={setDeleteConfirmInfo}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};
export default memo(Content);
