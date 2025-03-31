import { useEffect, Key, useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';

import { TipType } from '@/components/advanceSearch/components/extraModal/errorMessage';

import { defaultCtxState, useCtx } from '../context';
import { IParam, SelectItem } from '../types';
import { getNodeByKey } from '../utils';

interface Props {
  checkedNodes: SelectItem[];
  setCheckedNodes: React.Dispatch<React.SetStateAction<SelectItem[]>>;
  setCheckedNodeParamMap: React.Dispatch<React.SetStateAction<Record<string, IParam | undefined>>>;
  setExpandedKeys: React.Dispatch<React.SetStateAction<Key[]>>;
}

export default function useTree({ checkedNodes, setCheckedNodes, setCheckedNodeParamMap, setExpandedKeys }: Props) {
  const {
    state: { formatTreeData, checkAllNodes, checkAllKeys, maxSelect, checkMaxLimit },
    update,
  } = useCtx();

  const curCheckAllKeysRef = useRef<Key[]>([]); // 存放当前选中的全选节点key,加这个是为了解决setCheckAllKeys异步更新的问题
  const canDisableRef = useRef<boolean>(true); // 是否可以禁用节点的标识,防止formatTreeData多次不必要更新
  const canAbleRef = useRef<boolean>(true); // 是否可以解除禁用节点的标识,防止formatTreeData多次不必要更新
  // const canUpdateRef = useRef<boolean>(false); //防止handleCheck多次update

  /* 根据selecting判断哪些全选项被选中了 */
  useEffect(() => {
    let allKeys: Key[] = [];
    checkAllNodes &&
      checkAllNodes?.forEach((checkAllNode) => {
        const { key, brotherNodes } = checkAllNode;
        /* 如果该全选项的每一个兄弟节点都在selecting,或在associatedKey中，那么该全选项就应该被选中 */
        const isEveryBrotherNodesChecked = brotherNodes?.every((brotherNode: SelectItem) =>
          checkedNodes.some((node) => {
            if (node?.associatedKey)
              return node.key === brotherNode.key || node.associatedKey.includes(brotherNode.key!);
            else return node.key === brotherNode.key;
          }),
        );
        if (isEveryBrotherNodesChecked) allKeys.push(key!);
      });
    update((draft) => {
      draft.checkAllKeys = allKeys;
    });
    curCheckAllKeysRef.current = allKeys;
  }, [checkAllNodes, checkedNodes, update]);

  /* 节点的禁用和解除禁用逻辑 */
  useEffect(() => {
    if (formatTreeData.length && checkMaxLimit) {
      /* 达到选择上限后，将未选中的节点置灰，不给选 */
      if (checkedNodes.length >= maxSelect && canDisableRef.current) {
        let newTreeData = cloneDeep(formatTreeData);
        const handleTreeDisable = (treeData: SelectItem[]) => {
          treeData.forEach((tree) => {
            const { key, isSelectAll, children } = tree;
            if (children) handleTreeDisable(children);
            // 对于未选中的选项(全选节点和普通节点)，将checkbox禁掉
            else if (
              (isSelectAll && !curCheckAllKeysRef.current.includes(key!)) ||
              (!isSelectAll &&
                !checkedNodes.some((checkItem) => {
                  if (checkItem?.associatedKey) return checkItem.key === key || checkItem.associatedKey.includes(key!);
                  else return checkItem.key === key;
                }))
            )
              tree.disableCheckbox = true;
            else tree.disableCheckbox = false; // 最后是选中的checkbox解开
          });
        };
        handleTreeDisable(newTreeData);
        update((draft) => {
          draft.formatTreeData = newTreeData;
        });
        canDisableRef.current = false;
        canAbleRef.current = true;
      }
      /* 未到选择上限时，将所有的节点解禁 */
      if (checkedNodes.length < maxSelect && canAbleRef.current) {
        let newTreeData = cloneDeep(formatTreeData);
        const handleTreeAble = (treeData: SelectItem[]) => {
          treeData.forEach((tree) => {
            if (tree.children) handleTreeAble(tree.children);
            // 对于未选中的选项(全选节点和普通节点)，将checkbox禁掉
            tree.disableCheckbox = false;
          });
        };
        handleTreeAble(newTreeData);
        update((draft) => {
          draft.formatTreeData = newTreeData;
        });
        canDisableRef.current = true;
        canAbleRef.current = false;
      }
    }
  }, [formatTreeData, checkedNodes, maxSelect, update, checkMaxLimit]);

  /** 根据点击的item处理选中或取消选中 */
  const handleCheck = useMemoizedFn((clickNode: SelectItem) => {
    /*
      isSelectAll表示点击的是不是全选项，brotherNodes表示点击全选时，要改变的兄弟节点们
      checked表示当前点击项的选中状态，false时表示当前是未选中的，点击它要做选中操作，反之相反
     */
    const { isSelectAll, brotherNodes, checked } = clickNode;
    const changeNodesAry: SelectItem[] = isSelectAll ? brotherNodes || [] : [clickNode];
    const changeNodes = changeNodesAry.reduce((pre, cur) => {
      const { associatedKey, ignoreIndicator } = cur;
      let associatedNode: SelectItem[] = [];
      if (!ignoreIndicator) pre.push(cur);
      if (associatedKey) {
        getNodeByKey(formatTreeData, associatedKey, associatedNode);
        pre = [...pre, ...associatedNode];
      }
      return pre;
    }, [] as SelectItem[]);
    const changedParamMap: Record<string, IParam | undefined> = {};
    /* 取消选中操作,selecting按顺序过滤掉changeNodes,并将associatedKey对应的指标也过滤掉 */
    if (checked) {
      setCheckedNodes((preState) =>
        preState.filter((preItem) =>
          changeNodes.every(({ associatedKey, key, indexId }) => {
            changedParamMap[indexId!] = undefined;
            const preItemKey = preItem.key;
            const diffKey = preItemKey !== key;
            return associatedKey ? diffKey && !associatedKey.includes(preItemKey!) : diffKey;
          }),
        ),
      );
      setCheckedNodeParamMap((preParamMap) => ({ ...preParamMap, ...changedParamMap }));
      // let resultNodes = checkedNodes.filter((preItem: any) =>
      //   changeNodes.every(({ associatedKey, key, indexId }) => {
      //     changedParamMap[indexId!] = undefined;
      //     const preItemKey = preItem.key;
      //     const diffKey = preItemKey !== key;
      //     return associatedKey ? diffKey && !associatedKey.includes(preItemKey!) : diffKey;
      //   }),
      // );
      // if (canUpdateRef.current) {
      //   update((d) => {
      //     d.selectedNodes = resultNodes;
      //     d.selectedNodeParam = { ...d.selectedNodeParam, ...changedParamMap };
      //   });
      //   canUpdateRef.current = false;
      // }
    } else {
      /*
        选中操作，对于selecting已有的changeNode，不做改变，否则就把changeNodes添加到selecting末尾
        配置了ignoreIndicator的不添加到selecting，
      */
      let newSelecting = cloneDeep(checkedNodes);
      changeNodes.forEach((changeItem) => {
        const { ignoreIndicator, indexId } = changeItem;
        if (indexId && !ignoreIndicator && newSelecting.every((preItem) => preItem.indexId !== indexId)) {
          newSelecting.push(changeItem);
          if (!changeItem.defaultParamMap) changedParamMap[indexId] = { indexId: indexId };
          else if (changeItem.defaultParamMap?.indexId) changedParamMap[indexId] = changeItem.defaultParamMap;
          else changedParamMap[indexId] = { indexId: indexId, paramMap: changeItem.defaultParamMap };
        }
      });
      /* 更新选中项前要做数量限制检查 */
      if (checkMaxLimit && newSelecting.length > maxSelect) {
        update((draft) => {
          draft.tipInfo = {
            visible: true,
            text: `最多可添加${maxSelect}个指标`,
            type: TipType.warn,
          };
        });
        setTimeout(() => {
          update((draft) => {
            draft.tipInfo = defaultCtxState.tipInfo;
          });
        }, 3000);
      } else {
        setCheckedNodes(newSelecting);
        setCheckedNodeParamMap((preParamMap) => ({ ...preParamMap, ...changedParamMap }));
        // if (canUpdateRef.current) {
        //   update((d) => {
        //     d.selectedNodes = [...newSelecting];
        //     d.selectedNodeParam = { ...d.selectedNodeParam, ...changedParamMap };
        //   });
        //   canUpdateRef.current = false;
        // }
      }
    }
  });

  /** 点击复选框触发 */
  const onCheck = useMemoizedFn((checkedKeys, { node }) => {
    // canUpdateRef.current = true;
    handleCheck(node);
  });

  /** 点击树节点触发 */
  const onSelect = useMemoizedFn((selectedKeys, { node }) => {
    /* 有子节点，则转为展开收起逻辑,否则就是选中和取消选中逻辑 */
    if (node?.children)
      /* 根据旧值判断，已有的去掉，没有的新加 */
      setExpandedKeys((preState) => {
        if (preState.includes(node.key)) {
          return preState.filter((item) => item !== node.key);
        } else {
          return [...preState, node.key];
        }
      });
    else handleCheck(node);
  });

  /** 当前选中的keys */
  const checkedKeys = useMemo(() => {
    /* 要将关联key也选中 */
    const allLeafKey = checkedNodes.reduce((pre, cur) => pre.concat(cur.key!, cur?.associatedKey || []), [] as Key[]);
    return [...checkAllKeys, ...allLeafKey];
  }, [checkAllKeys, checkedNodes]);

  return {
    checkedKeys,
    onCheck,
    onSelect,
  };
}
