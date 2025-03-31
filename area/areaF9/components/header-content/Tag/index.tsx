import { useState, useRef, useMemo, memo, FC } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { Popover } from '@/components/antd';
import Arrow from '@/pages/area/areaF9/assets/arrow.svg';
import ArrowHover from '@/pages/area/areaF9/assets/arrow_hover.svg';
import MoreArrow from '@/pages/area/areaF9/assets/more-arrow.svg';
import PopContent from '@/pages/area/areaF9/components/header-content/Tag/popContent';

import style from '@/pages/area/areaF9/components/header-content/Tag/style.module.less';

interface TagProps {
  data: any;
  /** tab配置 */
  tabConfig: any;
  /** 浮窗标题 */
  title: string;
  /** 导出参数 */
  condition: any;
  /** 标签以更多浮窗展示 */
  showMore?: boolean;
  /** 控制外层更多浮窗展示 */
  setListVisible?: Function;
  /** 是否是人口规模标签 */
  isCity?: boolean;
  /** 标签不显示悬浮框 */
  noPopver?: boolean;
  filename: string;
}

const MAXWIDTH = 230;
const Tag: FC<TagProps> = ({
  data,
  tabConfig,
  title,
  showMore,
  condition,
  setListVisible,
  isCity,
  noPopver,
  filename,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const handleVisibleChange = useMemoizedFn((visible) => {
    setVisible(visible);
  });

  /** 内外层浮窗关闭 */
  const handleClose = useMemoizedFn(() => {
    setVisible(false);
    setListVisible?.(false);
  });

  const Content = useMemo(() => {
    return (
      <AreaTags>
        <div className={showMore ? 'more-tag-content' : 'tag-content'}>
          <div className="content">{title}</div>
          {!noPopver ? <div className="img" /> : null}
        </div>
      </AreaTags>
    );
  }, [noPopver, showMore, title]);

  return !noPopver ? (
    <Container ref={wrapRef}>
      <Popover
        placement={showMore ? 'rightTop' : 'bottomRight'}
        visible={visible}
        onVisibleChange={handleVisibleChange}
        content={
          <PopContent
            data={data}
            title={title}
            tabConfig={tabConfig}
            handleClose={handleClose}
            condition={condition}
            filename={filename}
            isCity={isCity}
          />
        }
        overlayClassName={style['tag-popover']}
        getPopupContainer={() => wrapRef.current || document.body}
        align={{ offset: [0, -4] }}
      >
        {Content}
      </Popover>
    </Container>
  ) : (
    Content
  );
};

export default memo(Tag);

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
    .img {
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
    .img {
      width: 10px;
      height: 10px;
      background-image: url(${Arrow});
      background-size: 10px;
    }
    &:hover {
      cursor: pointer;
      .img {
        background-image: url(${ArrowHover});
      }
    }
  }
`;
