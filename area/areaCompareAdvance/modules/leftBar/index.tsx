import { memo, useState, useEffect, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { selectItem } from '@/components/transferSelect/types';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import { RowConfig } from '@/pages/area/areaCompareAdvance/types';
import HandleButton from '@/pages/dataView/Sidebar/HandleButton';

interface TitleItem {
  key: string | number;
  title: string;
  iconList: any[];
}

const LeftBar = () => {
  const {
    state: { grid, indicatorTree },
  } = useCtx();

  // 已选指标一级标题
  const [anchorTitles, setAnchorTitles] = useState<TitleItem[]>([]);
  const [activeAnchor, setActiveAnchor] = useState('');
  const [leftBarWidth, setLeftBarWidth] = useState(128);
  const prevRowKey = useRef('');

  useEffect(() => {
    if (indicatorTree?.length) {
      setAnchorTitles(
        indicatorTree.map((d: selectItem) => ({
          key: d.key || d.title,
          title: d.title,
          iconList: d.iconList,
        })),
      );
      setActiveAnchor(indicatorTree[0].title);
    }
  }, [indicatorTree]);

  /** 找到表格可视区域内第一行元素，用来确定右侧锚点哪个一级标题高亮 */
  const handleScroll = useMemoizedFn(() => {
    // 表格元素
    const parentTop = (document.querySelector('.ag-body-viewport') as Element)?.getBoundingClientRect().top;
    // 找到所有的行元素
    const titleElement = document.querySelectorAll('.ag-title-item');
    titleElement.forEach((ele) => {
      const childTop = ele.getBoundingClientRect().top;
      const margin = parentTop - childTop;
      // 找到表格可视区域的第一行元素
      if (0 <= margin && margin <= 30) {
        const title = ele.className.split(' ')[1];
        setActiveAnchor(title);
      }
    });
  });

  useEffect(() => {
    const wrap = document.querySelector('.ag-body-viewport') as Element;
    if (wrap) {
      wrap.addEventListener('scroll', handleScroll, true);
      return () => {
        wrap.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [handleScroll, anchorTitles]);

  /** 处理滚动的指定位置，并且指定区域高亮 */
  const scrollAndFlashRows = useMemoizedFn((row: RowConfig) => {
    setTimeout(() => {
      if (grid && grid.api) {
        const rowNode = grid.api.getRowNode(row.key);
        if (rowNode) {
          grid.api.ensureNodeVisible(rowNode, 'top');
          rowNode.data.focused = true;
          if (prevRowKey.current && prevRowKey.current !== row.key) {
            const prevRowNode = grid.api.getRowNode(prevRowKey.current);
            prevRowNode.data.focused = false;
            grid.api.redrawRows({ rowNodes: [rowNode, prevRowNode] });
          } else {
            grid.api.redrawRows({ rowNodes: [rowNode] });
          }
          prevRowKey.current = row.key!;
        }
      }
    });
  });

  const processCollapse = useMemoizedFn((collapse) => {
    setLeftBarWidth(collapse ? 0 : 128);
  });

  return (
    <LeftWrap>
      <MenuContent width={leftBarWidth}>
        <div className="menu">目录</div>
        <div className="indicators">
          {anchorTitles.map(({ key, title, iconList }: TitleItem, i: number) => (
            <div className="indic-wrap">
              <div
                key={key}
                title={title}
                className={cn('indic-item', { 'active-item': activeAnchor === title })}
                onClick={() => {
                  scrollAndFlashRows({ key: title });
                }}
              >
                <span className="indic-item-title">{title}</span>
                {iconList?.includes('NEW') ? (
                  <img className="indic-new-pic" src="https://cdn.finchina.com/app/pic/f9/icon/NEW.svg" alt="" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </MenuContent>
      <HandleButton onChange={processCollapse} />
    </LeftWrap>
  );
};

export default memo(LeftBar);

const LeftWrap = styled.div`
  position: relative;
  background: #fafbfd;
`;

const MenuContent = styled.div<{ width: number }>`
  width: ${(prop) => prop?.width + 'px'};
  height: 100%;
  overflow: hidden;
  padding-bottom: 52px;

  .menu {
    /* height: 20px; */
    font-size: 13px;
    font-weight: 500;
    color: #141414;
    line-height: 20px;
    padding: 8px 12px 4px;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .indicators {
    position: relative;
    padding-left: 12px;
    padding-right: 16px;

    &::after {
      content: '';
      position: absolute;
      top: 7px;
      left: 13px;
      width: 1px;
      height: ${(284 / 300) * 100}%;
      background: #f0f0f0;
    }

    .indic-wrap {
      position: relative;
    }

    .indic-item {
      margin: 6px 0 6px 8px;
      font-size: 12px;
      font-weight: 400;
      color: #595959;
      line-height: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;

      &::before {
        content: '';
        width: 4px;
        height: 4px;
        background: #d8d8d8;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -1px;
        z-index: 3;
      }

      .indic-item-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .indic-new-pic {
        min-width: 14px;
        width: 14px;
        height: 14px;
        margin-left: 4px;
      }
    }
    .active-item {
      color: #0171f6;
      &::before {
        background: #0171f6;
      }
    }
  }
`;
