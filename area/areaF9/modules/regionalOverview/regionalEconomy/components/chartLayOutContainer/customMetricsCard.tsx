import { memo } from 'react';

import { PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { Icon } from '@/components';

import { CARDHEIGHT, CardContainer } from './chartCard';

const iconStyle = { width: 12, height: 12, marginLeft: '4px', verticalAlign: '-2px' };
function CustomMetricsCard({ className = '', cardType = '', style = {}, onClick = () => {} }) {
  return (
    <CustomMetricsCardContainer onClick={onClick} className={className} style={className === 'small' ? style : {}}>
      <PlusCircleOutlined className="icon" size={16} />
      <span className="text">
        自定义指标{cardType === '' && <Icon style={iconStyle} image={require('@/assets/images/power/vip.png')} />}
      </span>
    </CustomMetricsCardContainer>
  );
}

export default memo(CustomMetricsCard);

const CustomMetricsCardContainer = styled(CardContainer)`
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  align-items: center;
  justify-content: space-evenly;
  // z-index: 2;

  .icon {
    font-size: 16px;
    color: #bab9b9;
  }

  .text {
    font-size: 13px;
    line-height: 13px;
    color: #5c5c5c;
    align-items: center;
  }

  &.small {
    width: 17px;
    height: ${CARDHEIGHT}px;
    padding: 2px 4px;
    background: #eff6ff;
    border-radius: 0px 4px 4px 0px;
    position: absolute;
    right: -18px;
    .icon,
    .text {
      font-size: 9px;
      line-height: 9px;
      color: #0171f6;
    }
  }
`;
