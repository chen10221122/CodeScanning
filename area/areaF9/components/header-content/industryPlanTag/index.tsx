import { FC, memo, useMemo } from 'react';
import { useHistory } from 'react-router';

import { Icon, Popover } from '@dzh/components';
import { useMemoizedFn, useReactive } from 'ahooks';
import styled, { createGlobalStyle } from 'styled-components';

import { LINK_AREA_INDUSTRIAL_PLANING } from '@/configs/routerMap';
import { useParams } from '@/pages/area/areaF9/hooks';
import { dynamicLink } from '@/utils/router';
import { urlJoin } from '@/utils/url';

import IconMore from './icon_more.svg';
import PopoverBg from './popover_bg.png';

interface Props {
  content: string;
  getPopupContainer: () => HTMLElement;
}

const IndustryPlanTag: FC<Props> = ({ content, getPopupContainer }) => {
  const history = useHistory();
  const { code, key } = useParams();
  const popVisible = useReactive({ current: false });

  const handleJump = useMemoizedFn(() => {
    popVisible.current = false;
    history.push(urlJoin(dynamicLink(LINK_AREA_INDUSTRIAL_PLANING, { code })));
  });

  const isCurrentPage = useMemo(() => LINK_AREA_INDUSTRIAL_PLANING.includes(key), [key]);

  const popContentDom = useMemo(() => {
    return (
      <PopoverContentContainer>
        <div className="industry-plan-tag-content">
          {content
            ? content.split('\n').map((item) => (
                <div className="industry-plan-tag-content-item" key={item}>
                  {item}
                </div>
              ))
            : ''}
        </div>
        {isCurrentPage ? null : (
          <div className="industry-plan-tag-more" onClick={handleJump}>
            <span className="industry-plan-tag-more-txt">查看更多</span>
            <Icon size={8} image={IconMore} />
          </div>
        )}
      </PopoverContentContainer>
    );
  }, [content, isCurrentPage, handleJump]);

  return (
    <>
      <PopoverGlobalStyle />
      <Popover
        open={popVisible.current}
        onOpenChange={(open: boolean) => {
          popVisible.current = open;
        }}
        content={popContentDom}
        getPopupContainer={getPopupContainer}
        placement="bottomLeft"
        overlayClassName="industry-plan-tag-popover-overlay"
        limitContent={false}
      >
        <div className="area-introduce-text">产业规划</div>
      </Popover>
    </>
  );
};

export default memo(IndustryPlanTag);

const PopoverGlobalStyle = createGlobalStyle`
  .industry-plan-tag-popover-overlay {
    .ant-popover-inner {
      background: linear-gradient(360deg,#f4f8ff 0%, #fafcff 100%);
    }
    .ant-popover-inner-content {
      background-image: url(${PopoverBg});
      background-position: bottom;
      background-repeat: no-repeat;
      background-size: cover;
    }
    &.dzh-popover-no-title .ant-popover-inner-content .dzh-popover-inner-content-body {
      padding: 0 16px;
    }
  }
`;

const PopoverContentContainer = styled.div`
  width: 488px;

  .industry-plan-tag-content {
    font-size: 12px;
    color: #262626;
    line-height: 20px;
    .industry-plan-tag-content-item:not(:first-of-type) {
      margin-top: 6px;
    }
  }

  .industry-plan-tag-more {
    width: 100%;
    height: 32px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.5px solid rgba(1, 113, 246, 0.28);
    border-radius: 2px;
    cursor: pointer;

    .industry-plan-tag-more-txt {
      font-size: 12px;
      color: #0171f6;
      line-height: 32px;
      margin-right: 2px;
    }
  }
`;
