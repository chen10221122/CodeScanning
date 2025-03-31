import { FC, memo, useState, Key, useMemo, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import RightList from '@pages/area/landTopic/components/transferSelect/modules/templateModal/rightList';
import useRightList from '@pages/area/landTopic/components/transferSelect/modules/templateModal/rightList/useRightList';
import Search from '@pages/area/landTopic/components/transferSelect/modules/templateModal/search';
import useSearch from '@pages/area/landTopic/components/transferSelect/modules/templateModal/search/useSearch';
import Tree from '@pages/area/landTopic/components/transferSelect/modules/templateModal/tree';
import useTree from '@pages/area/landTopic/components/transferSelect/modules/templateModal/tree/useTree';
import { SelectItem } from '@pages/area/landTopic/components/transferSelect/types';
import { initData } from '@pages/area/landTopic/components/transferSelect/utils';

import { Flex } from '@/components/layout';

import styles from '@pages/area/landTopic/components/transferSelect/modules/templateModal/selectContent/styles.module.less';

interface Props {
  isAddModal: boolean;
  checkedNodes: SelectItem[];
  setCheckedNodes: React.Dispatch<React.SetStateAction<SelectItem[]>>;
  /* 父节点是否允许选中 */
  parentCheckable?: boolean;
  /** 子树下的节点都没有子节点时，是否有全部选项，默认true, parentCheckable为false生效*/
  hasSelectAll?: boolean;
  [key: string]: any;
}

const DEFAULT_EXPAND_KES: any[] = [];

const SelectContent: FC<Props> = ({
  isAddModal,
  checkedNodes,
  setCheckedNodes,
  parentCheckable = false,
  hasSelectAll = true,
}) => {
  const [expandedFlag, setExpandedFlag] = useState(false);
  const {
    state: {
      formatTreeData,
      allParentKey,
      curEditPlan,
      defaultSelect,
      customPlan,
      maxPlan,
      editModalVisible,
      addModalVisible,
      defaultExpandKes = DEFAULT_EXPAND_KES,
    },
  } = useCtx();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>(defaultExpandKes || []);

  /* 左侧树的一些操作 */
  const { checkedKeys, onCheck, onSelect } = useTree({
    checkedNodes,
    setCheckedNodes,
    setExpandedKeys,
  });
  /** 有选中模板的话默认选中就取选中模板的，否则取一开始默认的 */
  const defaultNodes = useMemo(
    () => (isAddModal ? defaultSelect : curEditPlan?.content ?? defaultSelect),
    [curEditPlan?.content, defaultSelect, isAddModal],
  );

  /* 左侧目录树指标 */
  const treeData = useMemo(() => {
    let originTreeData = cloneDeep(formatTreeData);
    const initTreeData = isAddModal
      ? initData(
          cloneDeep(
            customPlan.map((d, i) => ({
              title: d.planName,
              key: `custom_${d.planId}`,
              children: (d.content || []).map((m) => ({
                ...m,
                active: false,
                key: `custom_${i}_${m.key}`,
                associatedKey: [m.key || '', ...(m.associatedKey || [])],
                ignoreIndicator: true, //右侧禁止显示自定义模板指标
              })),
            })),
          ),
          hasSelectAll,
          { sort: 10000 },
          [],
          [],
          parentCheckable,
          maxPlan,
        )
      : [];
    // console.log('customPlan======', [...originTreeData, ...initTreeData]);
    let idx = originTreeData.findIndex((d) => d.title === '常用指标');
    if (idx === -1) {
      return [...originTreeData, ...initTreeData];
    } else {
      originTreeData.splice(idx + 1, 0, ...initTreeData);
      return [...originTreeData];
    }
  }, [formatTreeData, customPlan, isAddModal, hasSelectAll, parentCheckable, maxPlan]);

  /* 右侧列表的一些操作 */
  const { resetFlag, onReset, onDeleteAll, onDelete, onDragEnd } = useRightList({
    defaultNodes,
    checkedNodes,
    setCheckedNodes,
  });

  /* 搜索的一些操作 */
  const { searchChange } = useSearch();

  /** 一键展开收起按钮方法 */
  const expandedOrClose = useMemoizedFn(() => {
    setExpandedKeys(
      expandedFlag ? [] : [...allParentKey, ...(isAddModal ? customPlan.map((d) => `custom_${d.planId}`) : [])],
    );
    setExpandedFlag((preState) => !preState);
  });

  useEffect(() => {
    if (!editModalVisible && !addModalVisible) {
      setExpandedKeys(defaultExpandKes);
      setExpandedFlag(false);
    }
    return () => {};
  }, [editModalVisible, addModalVisible, defaultExpandKes]);

  const wrapperStyle = useMemo(() => ({ height: `calc(100% - 33px)` }), []);
  return (
    <>
      <div style={wrapperStyle} className={styles.overlayWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.leftContent}>
            <div className={styles.topWrapper}>
              <div className={styles.text}>待选指标</div>
              <Flex align="center">
                <Search
                  checkedNodes={checkedNodes}
                  checkedKeys={checkedKeys}
                  onCheckChange={onCheck}
                  onSearchChange={searchChange}
                />
                <div className={styles.expandedCloseText} onClick={expandedOrClose}>
                  {expandedFlag ? '一键收起' : '一键展开'}
                </div>
              </Flex>
            </div>
            <Tree
              // @ts-ignore
              treeData={treeData}
              checkedKeys={checkedKeys}
              onCheck={onCheck}
              onSelect={onSelect}
              expandedKeys={expandedKeys}
              onExpand={setExpandedKeys}
            />
          </div>
          <div className={styles.rightContent}>
            <RightList
              resetFlag={resetFlag}
              checkedNodes={checkedNodes}
              onDelete={onDelete}
              onDeleteAll={onDeleteAll}
              onReset={onReset}
              onDragEnd={onDragEnd}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(SelectContent);
