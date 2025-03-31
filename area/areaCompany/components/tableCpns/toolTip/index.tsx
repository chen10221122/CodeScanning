import { FC, memo } from 'react';

import { Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';

import Icon from '@/components/icon';

/** title是字符串，并且该组件会将title中所有的空格换成换行 */
const TableTooltip: FC<{
  title?: string;
  className?: string;
  icon?: JSX.Element;
  placement?: TooltipPlacement;
  getPopupContainer?: () => HTMLElement;
}> = ({ title, className, placement, getPopupContainer, icon }) => {

  return (
    <Tooltip
      title={
        <div
          dangerouslySetInnerHTML={{
            __html: title?.replace(/\s/g, '<br/>') ?? '',
          }}
        />
      }
      placement={placement}
      arrowPointAtCenter
      color={'#fff'}
      overlayStyle={{ maxWidth: '410px' }}
      getPopupContainer={getPopupContainer}
      overlayInnerStyle={{
        padding: '12px',
        color: '#434343',
        // width: '410px',
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: '20px',
        fontFamily: 'PingFangSC, PingFangSC-Regular',
        verticalAlign: '0',
      }}
    >
      <span style={{ position: 'relative', bottom: '2px' }} className={className}>
        {icon ?? (
          <Icon unicode="&#xe6df;" size={12} style={{ marginLeft: '2px', cursor: 'pointer', color: '#a7a7a7' }} />
        )}
      </span>
    </Tooltip>
  );
};

export default memo(TableTooltip);
