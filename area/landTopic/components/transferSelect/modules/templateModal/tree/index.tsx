import { FC, memo, Key, ReactNode, useRef } from 'react';

import { useSize } from 'ahooks';
import { Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';

import { SelectItem } from '@pages/area/landTopic/components/transferSelect/types';

import { Image } from '@/components/layout';

import styles from '@pages/area/landTopic/components/transferSelect/modules/templateModal/tree/style.module.less';

interface Props {
  /** 树节点数据 */
  treeData: SelectItem[];
  /** 当前选中的节点 */
  checkedKeys: Key[];
  /** 当前展开的节点 */
  expandedKeys?: Key[];
  /** 点击复选框触发 */
  onCheck: (checkedKeys: Key[] | { checked: Key[]; halfChecked: Key[] }, info: any) => void;
  /** 点击树节点触发 */
  onSelect?: (keys: Key[], currNode: any) => void;
  /** 点击展开图标触发 */
  onExpand?: (keys: Key[], currNode: any) => void;
}

const ITree: FC<Props> = ({ treeData, checkedKeys, expandedKeys, onCheck, onSelect, onExpand }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { height } = useSize(containerRef) || {};

  const getTitleRender = (nodeData: Record<string, any>): ReactNode => {
    const { title, parent, hasVipIcon, isSelectAll } = nodeData;
    return (
      <>
        {/* @ts-ignore */}
        <span style={{ fontWeight: parent.length || isSelectAll ? '400' : '500' }}>{title}</span>
        {hasVipIcon ? (
          <Image className="vip-icon" src={require('@/assets/images/common/vip.svg')} w={13} h={12} />
        ) : null}
      </>
    );
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <Tree
        checkable
        blockNode
        showLine
        titleRender={getTitleRender}
        onCheck={onCheck}
        treeData={treeData as unknown as DataNode[]}
        checkedKeys={checkedKeys}
        expandedKeys={expandedKeys}
        onSelect={onSelect}
        onExpand={onExpand}
        height={height}
        switcherIcon={<></>}
      />
    </div>
  );
};

export default memo(ITree);
