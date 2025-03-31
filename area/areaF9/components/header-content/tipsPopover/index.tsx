import { FC, memo } from 'react';

import styled from 'styled-components';

import { Tooltip } from '@/components/antd';
import TipIcon from '@/pages/bond/bondIssuance/images/tip_icon.svg';
import TipIconActive from '@/pages/bond/bondIssuance/images/tip_icon_active.svg';

import styles from '@/pages/area/areaF9/components/header-content/tipsPopover/style.module.less';
interface Props {
  content: any;
}
const TipsPopover: FC<Props> = ({ content }) => {
  return (
    <Tooltip
      color="#fff"
      placement="bottom"
      title={() => <TooltipContent>{content}</TooltipContent>}
      overlayClassName={styles['tips-popover']}
    >
      <Img />
    </Tooltip>
  );
};
export default memo(TipsPopover);

const TooltipContent = styled.div`
  font-size: 12px;
  color: #434343;
  line-height: 18px;
`;
const Img = styled.div`
  display: inline-block;
  margin-left: 4px;
  width: 12px;
  height: 12px;
  background-image: url(${TipIcon});
  background-size: 12px;
  &:hover {
    background-image: url(${TipIconActive});
    cursor: pointer;
  }
`;
