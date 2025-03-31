import { useRef } from 'react';

import { Popover } from 'antd';
import styled from 'styled-components';

import styles from '@/pages/area/areaFinancingBoard/modules/financingScale/modules/enterprise/Table/style.module.less';

const Index = ({
  title,
  style,
  helper,
  rightComp,
}: {
  title: string;
  style?: any;
  helper?: string;
  rightComp?: JSX.Element;
}) => {
  const domRef = useRef<HTMLDivElement>(null);

  return (
    <Wrapper ref={domRef} style={style || { paddingBottom: '6px' }}>
      <div className="title">
        <span className="title-text">{title}</span>
        {helper && (
          <Popover
            overlayClassName={styles['board-popover']}
            placement={'bottom'}
            align={{
              offset: [0, -3],
            }}
            content={helper}
            destroyTooltipOnHide={true}
            getPopupContainer={() => domRef.current || document.body}
          >
            <img className="update-help-img" height={12} src={require('@/assets/images/common/help.png')} alt="" />
          </Popover>
        )}
      </div>
      <div className="header-right">{rightComp}</div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    display: flex;
    align-items: center;
    position: relative;
    height: 20px;
    margin-left: 2px;
    font-size: 13px;
    font-weight: 500;
    color: #262626;
    line-height: 20px;
    font-family: PingFangSC, PingFangSC-Medium;
    /* &::before {
      position: absolute;
      left: -6px;
      top: 4px;
      width: 2px;
      height: 13px;
      background: #ff9347;
      border-radius: 2px;
      content: '';
    } */
  }
  .update-help-img {
    margin-left: 2px;
    cursor: pointer;
  }
`;

export default Index;
