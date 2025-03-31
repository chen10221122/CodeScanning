import { FC, memo, useState, useRef, useEffect, useMemo, Key } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd';

import { useBoolean, useMemoizedFn, useSize, useKeyPress, useClickAway } from 'ahooks';
import cn from 'classnames';
import { isArray, isUndefined } from 'lodash';

import { PagePlatform } from '@dataView/provider/pagePlatformContext';
import { normalizeConfig } from '@dataView/utils/indicators';

import { Icon } from '@/components';
import DeleteActive from '@/components/advanceSearch/components/extraModal/images/delete-active.png';
import { Image } from '@/components/layout';
import Clear from '@/components/transferSelect/icons/clear.svg';
import { NormalChildItem } from '@/pages/dataView/components/Indicators/types';

import { useMetricEditParam } from '../../../hooks';
import { IParam, SelectItem, ignoreParamName } from '../../../types';
import { useCtx } from '../context';
import MetricEditModal from '../metricEditModal/metricEditModal';
import styles from './style.module.less';

interface Props {
  resetFlag: boolean;
  checkedNodes: SelectItem[];
  checkedNodeParamMap: Record<string, IParam | undefined>;
  setCheckedNodeParamMap: React.Dispatch<React.SetStateAction<Record<string, IParam | undefined>>>;
  onDelete: (node: SelectItem[]) => void;
  onDeleteAll: () => void;
  onReset: () => void;
  onDragEnd: (result: DropResult, provided: ResponderProvided) => void;
}

const RightList: FC<Props> = ({
  resetFlag,
  checkedNodes,
  checkedNodeParamMap,
  setCheckedNodeParamMap,
  onDelete,
  onDeleteAll,
  onReset,
  onDragEnd,
}) => {
  const [deleteStatus, { setTrue, setFalse }] = useBoolean(false);
  const [dragIndex, setDragIndex] = useState<number | undefined>(undefined);
  const [dragIconHover, setDragIconHover] = useState<number | undefined>(undefined);
  const [deleteIconHover, setDeleteIconHover] = useState<number | undefined>(undefined);
  const [batchSelect, setBatchSelect] = useState<SelectItem[]>([]);
  const [editState, setEditState] = useState<{ visible: boolean; indexId: string; data?: any; [T: string]: any }>({
    visible: false,
    indexId: '',
  });
  const {
    state: { maxSelect, checkMaxLimit, drag },
    update,
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

  const { getMetricEditParamAsync } = useMetricEditParam();
  const handleEditMetric = useMemoizedFn((row) => {
    const { indexId, needConfig, title, resultType, sortList, indexNote, unit, headName, extraProperties } = row;
    if (indexId && needConfig) {
      getMetricEditParamAsync(
        { indicator: row.indexId, isDefault: true, pageType: PagePlatform.Area },
        { resultType, sortList, indexNote, unit, headName, indexName: title, extraProperties },
      ).then((res) => {
        const { moduleConfig } = res.data;
        if (moduleConfig) {
          const newConfig = normalizeConfig(moduleConfig);
          if (isArray(newConfig)) {
            newConfig.forEach((item) => {
              if (['auditYear', 'date'].includes(item?.key ?? '')) {
                item.readonly = true;
                item.disabled = true;
              }
              if (ignoreParamName.includes(item?.name ?? '')) {
                item.readonly = true;
                item.disabled = true;
              }
            });
            setEditState({
              visible: true,
              title: '指标参数修改-' + title,
              indexId: row.indexId,
              data: newConfig,
            });
          } else if (newConfig?.actions?.default?.length) {
            newConfig.actions.default.forEach((item) => {
              if (['auditYear', 'date'].includes(item?.key || '')) {
                item.readonly = true;
                item.disabled = true;
              }
              if (ignoreParamName.includes(item?.name ?? '')) {
                item.readonly = true;
                item.disabled = true;
              }
            });
            setEditState({
              visible: true,
              title: '指标参数修改-' + title,
              indexId: row.indexId,
              data: {
                actions: { default: newConfig.actions.default },
              },
            });
          }
        }
      });
    }
  });

  const handleVisibleChange = useMemoizedFn((visible: boolean, indexId: string, values?: NormalChildItem[]) => {
    if (indexId) {
      const newParam: IParam = { indexId, paramMap: {} };
      values?.forEach((value) => {
        newParam.paramMap = {
          ...newParam.paramMap,
          [value.key]: [value.value],
        };
      });
      update((d) => {
        d.selectedNodeParam = { ...d.selectedNodeParam, [indexId]: newParam };
      });
    }
    setEditState({ visible: false, indexId: '' });
  });

  /** Droppable的样式对象 */
  const droppableHeight = useMemo(() => ({ height: `${22 * checkedNodes.length}px` }), [checkedNodes.length]);

  return (
    <>
      {editState.visible && <MetricEditModal {...editState} onVisibleChange={handleVisibleChange} />}
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
              <Icon image={!(checkedNodes?.length === 0) ? DeleteActive : Clear} size={12} className={styles.topImg} />
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
                                {drag ? (
                                  <span className={cn(styles['drag-icon-box'])}>
                                    <i
                                      {...provided.dragHandleProps}
                                      onMouseDown={clearBatch}
                                      className={cn(styles.drag)}
                                    >
                                      <Image
                                        onMouseOver={() => setDragIconHover(index)}
                                        onMouseOut={() => setDragIconHover(undefined)}
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
                                  </span>
                                ) : null}
                                <span className={styles['drag-title']}>{dragItem.title}</span>
                                <span className={cn(styles['drag-icon-box'], styles['last'])}>
                                  <i
                                    onMouseOver={() => setDeleteIconHover(index)}
                                    onMouseOut={() => setDeleteIconHover(undefined)}
                                    onClick={() => {
                                      if (batchSelect.find(({ key }) => key === dragItem.key)) onDelete(batchSelect);
                                      else onDelete([dragItem]);
                                    }}
                                    className={styles.close}
                                  >
                                    <Icon
                                      unicode={'\ue61f'}
                                      style={{
                                        color: deleteIconHover === index ? '#0171f6' : '#999999',
                                        display: dragIndex === index ? 'block' : '',
                                      }}
                                      size={12}
                                    />
                                  </i>
                                  {dragItem.needConfig && (
                                    <i className={cn(styles.edit)}>
                                      <Image
                                        onClick={() => handleEditMetric(dragItem)}
                                        src={require('@/assets/images/bond/icon_edit@2x.png')}
                                        w={12}
                                        h={12}
                                      />
                                    </i>
                                  )}
                                </span>
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
    </>
  );
};

export default memo(RightList);
