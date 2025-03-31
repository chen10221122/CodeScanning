import { FC, memo, useState, Key } from 'react';

import { useMemoizedFn } from 'ahooks';

import { Flex } from '@/components/layout';

import { IParam, SelectItem } from '../../../types';
import { useCtx } from '../context';
import RightList from '../rightList';
import useRightList from '../rightList/useRightList';
import Search from '../search';
import useSearch from '../search/useSearch';
import Tree from '../tree';
import useTree from '../tree/useTree';
import styles from './styles.module.less';

interface Props {
  checkedNodes: SelectItem[];
  setCheckedNodes: React.Dispatch<React.SetStateAction<SelectItem[]>>;
  checkedNodeparamMap: Record<string, IParam | undefined>;
  setCheckedNodeParamMap: React.Dispatch<React.SetStateAction<Record<string, IParam | undefined>>>;
}

const SelectContent: FC<Props> = ({ checkedNodes, setCheckedNodes, checkedNodeparamMap, setCheckedNodeParamMap }) => {
  const [expandedFlag, setExpandedFlag] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const {
    state: { formatTreeData, allParentKey, defaultSelect, defaultSelectParam },
  } = useCtx();
  /* 左侧树的一些操作 */
  const { checkedKeys, onCheck, onSelect } = useTree({
    checkedNodes,
    setCheckedNodes,
    setExpandedKeys,
    setCheckedNodeParamMap,
  });

  /* 右侧列表的一些操作 */
  const { resetFlag, onReset, onDeleteAll, onDelete, onDragEnd } = useRightList({
    defaultNodes: defaultSelect,
    checkedNodes,
    defaultNodeParamMap: defaultSelectParam,
    selectNodeParamMap: checkedNodeparamMap,
    setCheckedNodes,
    setSelectNodeParamMap: setCheckedNodeParamMap,
  });

  /* 搜索的一些操作 */
  const { searchChange } = useSearch();

  /** 一键展开收起按钮方法 */
  const expandedOrClose = useMemoizedFn(() => {
    setExpandedKeys(expandedFlag ? [] : allParentKey);
    setExpandedFlag((preState) => !preState);
  });

  return (
    <>
      <div className={styles.overlayWrapper}>
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
              treeData={formatTreeData}
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
              checkedNodeParamMap={checkedNodeparamMap}
              setCheckedNodeParamMap={setCheckedNodeParamMap}
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
