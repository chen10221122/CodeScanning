import { memo, FC, ReactNode, CSSProperties, useRef } from 'react';

import { Tooltip } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';

import Icon from '@/components/icon';

interface HelpTipProps {
  title: ReactNode;
  iconStyle?: CSSProperties;
  getContainer?: () => HTMLElement;
}

const OVERLAY_STYLE = { maxWidth: '410px' };
const OVERLAY_INNER_STYLE: CSSProperties = {
  padding: '8px',
  color: '#434343',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'left',
};

const HelpTipStyle: FC<HelpTipProps> = ({ title, iconStyle, getContainer }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const getPopupContainer = useMemoizedFn(() => containerRef.current || document.body);
  return (
    <span ref={containerRef}>
      <Tooltip
        title={title}
        placement="bottomLeft"
        arrowPointAtCenter
        color="#fff"
        overlayStyle={OVERLAY_STYLE}
        overlayInnerStyle={OVERLAY_INNER_STYLE}
        getPopupContainer={getContainer || getPopupContainer}
      >
        <span>
          <Icon
            unicode="&#xe6df;"
            size={12}
            style={{ marginLeft: '4px', cursor: 'pointer', color: '#a7a7a7', verticalAlign: 0, ...iconStyle }}
          />
        </span>
      </Tooltip>
    </span>
  );
};

export default memo(HelpTipStyle);
