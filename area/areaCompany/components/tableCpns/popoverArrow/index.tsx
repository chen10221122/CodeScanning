import { useEffect, useState } from 'react';

import { useCreation, useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { Popover } from '@/components/antd';
import ArrowBlue from '@/pages/area/areaCompany/assets/arrow_blue.svg';
import ArrowGray from '@/pages/area/areaCompany/assets/arrow_gray.svg';
import { shortId } from '@/utils/share';

import styles from './styles.module.less';

export default ({
  data,
  classname,
  dontNeedMount,
  container,
  modalIsOpen,
}: {
  data?: string | React.ReactNode;
  classname?: string;
  dontNeedMount?: boolean;
  container?: HTMLElement | null;
  modalIsOpen?: boolean;
}) => {
  const [showLesseePopover, setShowLesseePopover] = useState<boolean>(false);
  const handleVisibleChange = useMemoizedFn((visible) => {
    setShowLesseePopover(visible);
  });
  const ID = useCreation(() => {
    return shortId();
  }, []);

  useEffect(() => {
    if (modalIsOpen) {
      setShowLesseePopover(false);
    }
  }, [modalIsOpen]);

  return (
    <Wrapper id={ID}>
      {data ? (
        <Popover
          placement="bottom"
          destroyTooltipOnHide={true}
          content={data}
          visible={showLesseePopover}
          // trigger="click"
          overlayClassName={cn('detail-arrow-popover-content', classname, styles.wrapper)}
          onVisibleChange={handleVisibleChange}
          getPopupContainer={() =>
            (dontNeedMount ? container || document.body : document.getElementById(ID)) as HTMLElement
          }
        >
          <span className={cn('arrow', { top: showLesseePopover })}>
            {/* <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconContent_icon_gengduo_zt2x"></use>
            </svg> */}
            <span className="icon"></span>
          </span>
        </Popover>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.span`
  flex-shrink: 0;
  .ant-popover-inner-content {
    ::-webkit-scrollbar {
      width: 6px !important;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #cfcfcf;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #b0b0b0;
    }
  }
  .detail-arrow-popover-content {
    max-width: 254px;
    min-width: 254px;
    .ant-popover-inner {
      padding: 8px 4px 8px 0 !important;
      .ant-popover-inner-content {
        padding: 0 8px 0 16px !important;
        max-height: 196px;
        overflow-y: scroll;
      }
    }
  }

  .arrow {
    cursor: pointer;
    display: inline-block;
    margin-left: 4px;
    line-height: 19px;
    .icon {
      width: 13px;
      height: 13px;
      display: inline-block;
      background: url(${ArrowGray});
      background-size: contain;
      transition: all 0.2s;
    }
    /* > svg {
      transition: all 0.2s;
    }
    &.ant-popover-open {
      > svg {
        transform: rotate(180deg);
      }
    } */
  }
  .ant-popover-open {
    .icon {
      background: url(${ArrowBlue});
      background-size: contain;
      transform: rotate(360deg);
    }
  }
`;
