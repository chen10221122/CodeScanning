import { useState, forwardRef, useImperativeHandle } from 'react';

import { useMemoizedFn } from 'ahooks';
import { PopoverProps } from 'antd';
import cn from 'classnames';

import { Popover } from '@/components/antd';

interface PopoverWrapProps extends PopoverProps {
  container: HTMLElement;
  className?: string;
  modalIsOpen?: boolean;
}

const PopoverWrap = forwardRef(({ content, container, className, children }: PopoverWrapProps, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  const handleVisibleChange = useMemoizedFn((visible) => {
    setVisible(visible);
  });

  useImperativeHandle(ref, () => ({
    closePopover: () => setVisible(false),
  }));

  return (
    <Popover
      placement="bottom"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      destroyTooltipOnHide={true}
      content={content}
      overlayClassName={cn(className)}
      getPopupContainer={() => container || document.body}
    >
      {children}
    </Popover>
  );
});

export default PopoverWrap;
