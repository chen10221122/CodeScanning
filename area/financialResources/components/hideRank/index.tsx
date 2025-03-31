import { FC, memo, useMemo, useState } from 'react';

import { Switch } from '@dzh/components';
import { Popover } from 'antd';
import styled from 'styled-components';

interface IProps {
  showText?: string;
  tipText?: string;
  placement?: any;
  checked?: boolean;
  onChange?: () => void;
  className?: string;
}

const Index: FC<IProps> = ({ placement = 'bottom', tipText, showText, checked, onChange, className }) => {
  const [isTip] = useState(!!tipText);

  const tipContent = useMemo(() => {
    return (
      <Popover
        overlayClassName={'filter-hiderank-popover'}
        content={<div>{tipText}</div>}
        placement={placement}
        align={{
          offset: [0, -3],
        }}
        getPopupContainer={() => document.querySelector('.area-financialResources-common-filter') as HTMLElement}
      >
        <img className="update-help-img" src={require('@/assets/images/common/help.png')} alt="" />
      </Popover>
    );
  }, [tipText, placement]);

  return (
    <Wrap className={className}>
      <Switch size="22" checked={checked} onChange={onChange} />
      <div className="">{showText}</div>
      {isTip && tipContent}
    </Wrap>
  );
};

export default memo(Index);

const Wrap = styled.div`
  display: flex;
  align-items: center;

  .ant-switch {
    margin-right: 4px;
  }

  .title {
    margin-left: 6px;
    font-size: 13px;
    font-weight: 400;
    color: #595959;
    line-height: 1;
  }
`;
