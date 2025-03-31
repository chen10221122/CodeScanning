import { useState, useRef, useMemo } from 'react';

import { useMemoizedFn, useSize } from 'ahooks';
import styled from 'styled-components';

import { Popover } from '@/components/antd';
import Arrow from '@/pages/area/areaF9/assets/arrow.svg';
import ArrowHover from '@/pages/area/areaF9/assets/arrow_hover.svg';
import MoreArrow from '@/pages/area/areaF9/assets/more-arrow.svg';
import PopContent from '@/pages/area/areaF9/components/header-content/AreaTag/popContent';
import { useRankModal, useParams } from '@/pages/area/areaF9/hooks';

import style from '@/pages/area/areaF9/components/header-content/AreaTag/style.module.less';

const MAXWIDTH = 230;

function AreaTag({
  list,
  showMore,
  allCount,
  condition,
  setListVisible,
}: {
  list: any;
  allCount: any;
  condition: any;
  setListVisible?: Function;
  showMore?: boolean;
}) {
  const { regionCode } = useParams();
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const contentSize = useSize(contentRef);

  const { handleOpenModal } = useRankModal();

  const overTitle = useMemo(() => {
    // 2 -> border
    return contentSize && contentSize.width < MAXWIDTH - 2 ? null : list?.[0]?.name || '';
  }, [contentSize, list]);

  const handleVisibleChange = useMemoizedFn((visible) => {
    setVisible(visible);
  });

  /** 关闭外层浮窗 */
  const handleOutClose = useMemoizedFn(() => {
    setVisible(false);
    setListVisible?.(false);
  });

  const handleOpen = useMemoizedFn((info: Record<string, any>) => {
    handleOpenModal(info);
    handleOutClose();
  });

  const Content = useMemo(() => {
    return (
      <AreaTags ref={contentRef}>
        <div className={showMore ? 'more-tag-content' : 'tag-content'}>
          <div className="content" title={overTitle}>
            {list[0]?.name}
          </div>
        </div>
      </AreaTags>
    );
  }, [list, overTitle, showMore]);

  return list.length ? (
    <Container ref={wrapRef}>
      <Popover
        placement={showMore ? 'rightTop' : 'bottomRight'}
        visible={visible}
        onVisibleChange={handleVisibleChange}
        content={
          <PopContent
            regionCode={regionCode}
            list={list}
            allCount={allCount}
            hanldeOpenModal={handleOpen}
            year={condition.year}
            handleOutClose={handleOutClose}
          />
        }
        overlayClassName={style['area-tag-popover']}
        getPopupContainer={() => wrapRef.current || document.body}
        align={{ offset: [0, -4] }}
      >
        {Content}
      </Popover>
    </Container>
  ) : null;
}

export default AreaTag;

const Container = styled.div`
  /* 表格样式 */
  .ant-table-container {
    border-color: #f2f4f9;
  }
`;

const AreaTags = styled.div`
  .more-tag-content,
  .tag-content {
    display: flex;
    align-items: center;
  }
  .more-tag-content {
    height: 30px;
    background: #fff;
    color: #0171f6;
    padding: 0 16px;
    &:hover {
      cursor: pointer;
      background: #e3eeff;
    }
    .content {
      max-width: 146px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 16px;
      line-height: 13px;
    }
    &::after {
      content: '';
      width: 6px;
      height: 9px;
      background-image: url(${MoreArrow});
      background-size: 6px 9px;
    }
  }
  .tag-content {
    max-width: ${MAXWIDTH}px;
    height: 20px;
    margin-left: 6px;
    display: flex;
    align-items: center;
    padding: 0 6px;
    border-radius: 2px;
    border: 1px solid rgba(1, 113, 246, 0.2);
    color: #0171f6;
    .content {
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 18px;
      font-size: 12px;
      margin-right: 2px;
    }
    &::after {
      content: '';
      width: 10px;
      height: 10px;
      background: url(${Arrow}) center center no-repeat;
      background-size: 10px;
    }
    &:hover {
      cursor: pointer;
      &::after {
        content: '';
        background: url(${ArrowHover}) center center no-repeat;
      }
    }
  }
`;
