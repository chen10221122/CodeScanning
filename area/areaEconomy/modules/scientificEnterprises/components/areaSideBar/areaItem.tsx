import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { useBoolean, useMemoizedFn } from 'ahooks';
import { Popover } from 'antd';
import { isEmpty, cloneDeep } from 'lodash';
import styled from 'styled-components';

import { ThirdSelectPopover, ThirdSelectRowItem } from '@/components/screen';
import { ThirdSelectWithParentRowItem } from '@/components/screen/items/types';
import { getThirdWithParentFlattenData } from '@/components/screen/utils';

import arrow from '../../image/arrow.webp';
import arrowActive from '../../image/arrow_active.webp';
import { useCtx } from '../../provider/ctx';
import { IAreaTreeItem } from '../../types';

type TItem<T = string> = {
  key?: T;
  name: T;
  value: T;
  shortName?: T;
  children?: TItem[];
  _fullName?: T;
  _index?: number;
};

interface IAreaItemProps {
  item: IAreaTreeItem;
}

export const Item: FC<IAreaItemProps> = ({ item }) => {
  /** 挂载dom */
  const ref = useRef<HTMLSpanElement>(null);
  /** ctx */
  const {
    state: { selectedAreaList, areaTree },
    update,
  } = useCtx();

  const rebuildData = useMemo(() => cloneDeep(item.children), [item]);
  /** 重新组织数据结构 携带父子级关系*/
  const withParentData = useMemo<ThirdSelectWithParentRowItem[]>(
    () => (rebuildData ? getThirdWithParentFlattenData(rebuildData) : []),
    [rebuildData],
  );

  /** 弹窗显示隐藏 */
  const [visible /*setTrue, setFalse */] = useBoolean(false);

  /** 所有下属地区的value列表 */
  const [childrenList, setChildrenList] = useState<string[]>();
  useEffect(() => {
    const draft: string[] = [];
    const getChildValue = (Tree: TItem) => {
      const entryNode = Tree.children;
      if (!isEmpty(entryNode)) {
        for (let i = 0; i < entryNode!.length; i++) {
          draft.push(entryNode![i].value);
          if (!isEmpty(entryNode![i].children)) {
            getChildValue(entryNode![i]);
          }
        }
      }
    };
    getChildValue(item as any);
    setChildrenList(draft);
  }, [item]);

  /** 点击处理，隐藏弹窗 */
  // useClickAway(
  //   () => {
  //     setFalse();
  //   },
  //   () => ref.current,
  // );

  /** 侧边筛选改变 */
  const itemChange = useMemoizedFn((rows: ThirdSelectRowItem[]) => {
    update((draft) => {
      if (!isEmpty(rows)) {
        const list = getParentNode(areaTree, rows?.[0].value);
        if (!list) {
          draft.selectedAreaList = rows;
        } else {
          const flag = list.sort((a: any, b: any) => a.key - b.key);
          draft.selectedAreaList = flag;
        }
      }
    });
  });

  // const currentSelectedCode = useMemo(() => {
  //   if (selectedAreaList && selectedAreaList[0]?.value !== '100000') {
  //     return selectedAreaList.slice(-1)?.[0]?.value;
  //   } else {
  //     return '100000';
  //   }
  // }, [selectedAreaList]);

  const forceValues = useMemo<ThirdSelectWithParentRowItem[] | undefined>(() => {
    let currCode: string;
    /** 存在选中且不为全国项 */
    if (selectedAreaList && selectedAreaList[0]?.value !== '100000') {
      /** 返回选中的最后一项 目标项*/
      currCode = selectedAreaList.slice(-1)?.[0]?.value;
    } else {
      currCode = '100000';
    }

    /** 存在Code 且code在当前筛选项的子集中 */
    if (currCode && childrenList?.includes(currCode)) {
      let item: ThirdSelectWithParentRowItem | undefined;
      /** 找出该项在数据结构重构后，是哪一个 */
      item = withParentData.find((d) => {
        return currCode === (d.value as string);
      });
      return item ? [item] : [];
    }
    return undefined;
  }, [withParentData, childrenList, selectedAreaList]);

  /** 三级地区筛选部分 */
  const AreaScreen = useMemo(() => {
    if (item.value === '100000') return null;
    return (
      <ThirdSelectPopover
        data={rebuildData as ThirdSelectRowItem[]}
        multiple={false}
        // onConfirm={() => setFalse()}
        onChange={itemChange}
        value={forceValues}
      />
    );
  }, [item, itemChange, /**setFalse,*/ forceValues, rebuildData]);

  const onNodeClick = useMemoizedFn((e) => {
    /** 箭头点击 */
    if (e.target.className === 'arrowOuter' || e.target.className === 'arrow') {
      // setTrue();
    } else if (e.target.className === 'title') {
      /** 按钮主体积点击 */
      update((draft) => {
        draft.selectedAreaList = [{ ...item }];
      });
    }
  });

  return (
    <ContentWapper
      active={item?.value === selectedAreaList?.[0]?.value}
      popoverVisible={visible}
      arrowActived={childrenList?.includes((selectedAreaList?.slice(-1) as any)?.value as string) as boolean}
      onClick={onNodeClick}
    >
      <span className="title">{item?.shortName}</span>
      {item.value === '100000' ? (
        <span />
      ) : (
        <Popover
          title={null}
          content={AreaScreen}
          getPopupContainer={() => ref.current || document.body}
          placement={'rightTop'}
          trigger="hover"
          // visible={visible}
        >
          <span
            style={{ height: '28px', width: '30px', display: 'inline-block', textAlign: 'right' }}
            ref={ref}
            className="arrowOuter"
          >
            <span className="arrowContainer">
              <span className="arrow"></span>
            </span>
          </span>
        </Popover>
      )}
    </ContentWapper>
  );
};

const getParentNode = (list: any[], value: string) => {
  for (let i in list) {
    if (list[i].value === value) {
      return [list[i]];
    }
    if (list[i]?.children) {
      let node: any = getParentNode(list[i].children, value);
      if (node !== undefined) {
        return node.concat(list[i]);
      }
    }
  }
};

const ContentWapper = styled.span<{ active?: boolean; popoverVisible?: boolean; ref?: any; arrowActived: boolean }>`
  width: 100px;
  height: 28px;
  background: ${({ active }) => (active ? 'rgba(1,113,246,0.06)' : '#fff')};
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  &:hover {
    .title {
      color: #0171f6;
    }
  }
  .title {
    width: 100%;
    font-size: 13px;
    font-weight: 400;
    color: ${({ active }) => (active ? '#0171F6' : '#000')};
    line-height: 28px;
    padding-left: 12px;
  }
  .arrowOuter {
    &:hover {
      .arrowContainer {
        background-color: #ebebeb;
        .arrow {
          background-repeat: no-repeat;
          background: url(${arrowActive});
          background-size: 100% 100%;
        }
      }
    }
    /** 针对西藏省筛选高度塌陷解决 */
    .screen-select-list-wrapper > ul {
      min-height: 319px !important;
    }
  }
  .arrowContainer {
    width: 14px;
    height: 14px;
    border-radius: 2px;
    display: inline-block;
    margin: 7px 7px 0 0;
    text-align: left;
    &:hover {
      background-color: #ebebeb;
      .arrow {
        background-repeat: no-repeat;
        background: url(${arrowActive});
        background-size: 100% 100%;
      }
    }
    .arrow {
      width: 10px;
      height: 10px;
      display: inline-block;
      background-repeat: no-repeat;
      background: ${({ active, arrowActived }) => (active || arrowActived ? `url(${arrowActive})` : `url(${arrow})`)};
      background-size: 100% 100%;
      margin: 0 0 4px 2px;
    }
    ${({ popoverVisible }) => {
      if (popoverVisible) {
        return `
            background-color: #ebebeb;
            .arrow {
              background-repeat: no-repeat;
              background: url(${arrowActive});
              background-size: 100% 100%;
            }
          `;
      } else {
        return '';
      }
    }}
  }
`;
