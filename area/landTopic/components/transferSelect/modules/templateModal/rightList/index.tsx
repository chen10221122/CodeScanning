import { FC, memo, useState, useRef, useEffect, useMemo, Key } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd';

import { useBoolean, useMemoizedFn, useSize, useKeyPress, useClickAway } from 'ahooks';
import cn from 'classnames';
import { isUndefined } from 'lodash';

import { SelectItem } from '@pages/area/landTopic/components/transferSelect';
import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import Clear from '@pages/area/landTopic/components/transferSelect/icons/clear.svg';

import { Icon } from '@/components';
import DeleteActive from '@/components/advanceSearch/components/extraModal/images/delete-active.png';
import { Image } from '@/components/layout';

import styles from '@pages/area/landTopic/components/transferSelect/modules/templateModal/rightList/style.module.less';

interface Props {
  resetFlag: boolean;
  checkedNodes: SelectItem[];
  onDelete: (node: SelectItem[]) => void;
  onDeleteAll: () => void;
  onReset: () => void;
  onDragEnd: (result: DropResult, provided: ResponderProvided) => void;
}

const RightList: FC<Props> = ({ resetFlag, checkedNodes, onDelete, onDeleteAll, onReset, onDragEnd }) => {
  const [deleteStatus, { setTrue, setFalse }] = useBoolean(false);
  const [dragIndex, setDragIndex] = useState<number | undefined>(undefined);
  const [dragIconHover, setDragIconHover] = useState<number | undefined>(undefined);
  const [deleteIconHover, setDeleteIconHover] = useState<number | undefined>(undefined);
  const [batchSelect, setBatchSelect] = useState<SelectItem[]>([]);
  const {
    state: { maxSelect, checkMaxLimit },
  } = useCtx();
  /** 滚动容器节点 */
  const scrollDom = useRef<HTMLDivElement>(null);
  /** 内容节点 */
  const contentDom = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<SelectItem[]>(checkedNodes);
  const { height } = useSize(contentDom) || {};
  const shiftPressRef = useRef(false);
  const clickRowRef = useRef<Key>();

  useKeyPress(['shift'], (e) => (shiftPressRef.current = e.type === 'keydown'), { events: ['keyup', 'keydown'] });

  useKeyPress(
    ['delete', 'backspace'],
    () => {
      batchSelect.length && onDelete(batchSelect);
    },
    { events: ['keyup'] },
  );

  const clearBatch = useMemoizedFn(() => {
    clickRowRef.current = undefined;
    setBatchSelect([]);
  });

  useClickAway(() => {
    clearBatch();
  }, contentDom);

  /* 新增选中时，滚动条置底 */
  useEffect(() => {
    if (checkedNodes.length > selectedRef.current.length) {
      scrollDom?.current?.scroll({ top: height, behavior: 'auto' });
    }
    selectedRef.current = checkedNodes;
  }, [height, checkedNodes]);

  const deleteAll = useMemoizedFn(() => {
    setFalse();
    onDeleteAll();
  });

  const onDragStart = useMemoizedFn((initial) => {
    if (initial?.source) setDragIndex(initial?.source?.index);
  });

  const handleDragEnd = useMemoizedFn((result, provided) => {
    setDragIndex(undefined);
    onDragEnd(result, provided);
  });

  /** Droppable的样式对象 */
  const droppableHeight = useMemo(() => ({ height: `${22 * checkedNodes.length}px` }), [checkedNodes.length]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.left}>
          <span>已选</span>
          <span className={styles.count}>
            <span className={styles.countBlue}>{checkedNodes.length}</span>
            {checkMaxLimit ? `/${maxSelect}` : null}
          </span>
        </div>
        <div className={styles.right}>
          <div
            onMouseOver={() => checkedNodes?.length && setTrue()}
            onMouseOut={() => checkedNodes?.length && setFalse()}
            onClick={deleteAll}
            className={cn(styles.delete, {
              [styles.active]: deleteStatus,
              [styles.disabled]: checkedNodes?.length === 0,
            })}
          >
            <Icon
              image={deleteStatus || checkedNodes?.length ? DeleteActive : Clear}
              size={12}
              className={styles.topImg}
            />
            <span className={styles.topText}>清空</span>
          </div>

          <div onClick={onReset} className={cn(resetFlag ? styles.active : styles.disabled, styles.reset)}>
            <Icon unicode={'\ue710'} size={12} className={styles.topIcon} />
            <span className={styles.topText}>恢复默认</span>
          </div>
        </div>
      </div>

      <div className={styles['content-wrap']} ref={scrollDom}>
        <DragDropContext onDragEnd={handleDragEnd} onDragStart={onDragStart}>
          <Droppable droppableId="transferListContent">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <div ref={contentDom} style={droppableHeight}>
                  {checkedNodes.map((dragItem, index) => {
                    return (
                      <Draggable key={dragItem.key} draggableId={String(dragItem.key)} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <div
                              className={cn(styles.content, styles.unSelect, {
                                [styles.contentHover]: isUndefined(dragIndex),
                                [styles.contentActive]:
                                  isUndefined(dragIndex) && batchSelect.find((item) => item.key === dragItem.key),
                              })}
                              onClick={(e) => {
                                e.preventDefault();
                                if (!shiftPressRef.current) {
                                  clickRowRef.current = dragItem.key;
                                  setBatchSelect([dragItem]);
                                } else {
                                  const newBatchSelect: SelectItem[] = [];
                                  for (let i = 0; i < checkedNodes.length; i++) {
                                    const element = checkedNodes[i];
                                    if ([clickRowRef.current, dragItem.key].includes(element.key)) {
                                      newBatchSelect.push(element);
                                      if (newBatchSelect.length > 1 || clickRowRef.current === dragItem.key) break;
                                    } else if (newBatchSelect.length) newBatchSelect.push(element);
                                  }
                                  setBatchSelect(newBatchSelect);
                                }
                              }}
                            >
                              {dragItem.title}
                              <>
                                <span
                                  onMouseOver={() => setDeleteIconHover(index)}
                                  onMouseOut={() => setDeleteIconHover(undefined)}
                                  onClick={() => {
                                    if (batchSelect.find(({ key }) => key === dragItem.key)) onDelete(batchSelect);
                                    else onDelete([dragItem]);
                                  }}
                                >
                                  <Icon
                                    unicode={'\ue61f'}
                                    style={{
                                      color: deleteIconHover === index ? '#0171f6' : '#999999',
                                      display: dragIndex === index ? 'block' : '',
                                    }}
                                    className={styles.close}
                                    size={12}
                                  />
                                </span>
                                <i {...provided.dragHandleProps} onMouseDown={clearBatch}>
                                  <Image
                                    onMouseOver={() => setDragIconHover(index)}
                                    onMouseOut={() => setDragIconHover(undefined)}
                                    className={cn(styles.drag)}
                                    // style={{ display: dragIndex === index ? 'block' : '' }}
                                    src={
                                      dragIndex === index || dragIconHover === index
                                        ? require('@/assets/images/bond/moveActive.png')
                                        : require('@/assets/images/bond/move.png')
                                    }
                                    w={12}
                                    h={12}
                                  />
                                </i>
                              </>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* ui要求最后一项距离底部13px */}
        <div style={{ height: '10px' }} />
      </div>
    </div>
  );
};

export default memo(RightList);
