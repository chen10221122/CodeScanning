import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

interface props {
  position: {
    x: number;
    y: number;
  };
  visibleKey: string;
}
const AreaUpdateTip = ({ position, visibleKey }: props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(!localStorage.getItem(visibleKey));
  }, [visibleKey]);

  const close = useMemoizedFn((e) => {
    e.stopPropagation();
    localStorage.setItem(visibleKey, '1');
    setVisible(false);
  });

  return (
    <AreaUpdateTipWrap visible={visible} position={position}>
      <div className="tipButton"></div>
      <div className="tipContent">
        <div className="text">正式用户可无限选择地区数量</div>
        <div className="close" onClick={close}>
          知道了
        </div>
      </div>
    </AreaUpdateTipWrap>
  );
};

export default AreaUpdateTip;

const AreaUpdateTipWrap = styled.div<{ visible: boolean; position: props['position'] }>`
  position: relative;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  z-index: 1000;
  width: 0px;
  height: 0px;
  .tipButton {
    position: absolute;
    left: ${(props) => props.position.x}px;
    top: ${(props) => props.position.y}px;
    width: 34px;
    height: 34px;
    background: url(${require('@/pages/area/components/areaUpdateTip/img/button.png')}) center center no-repeat;
    background-size: contain;
  }
  .tipContent {
    width: 326px;
    height: 94px;
    position: absolute;
    left: ${(props) => props.position.x - 56}px;
    top: ${(props) => props.position.y + 30}px;
    padding: 16px 15px;
    color: #4b5264;
    font-size: 14px;
    line-height: 20px;
    background: url(${require('@/pages/area/components/areaUpdateTip/img/bg.png')}) center center no-repeat;
    border-radius: 4px;
    box-shadow: 0px 4px 11px 1px #e3ebf8;
    .close {
      position: absolute;
      bottom: 12px;
      right: 18px;
      cursor: pointer;
      width: 70px;
      height: 28px;
      background: #2d87fc;
      border-radius: 2px;
      font-size: 14px;
      color: #ffffff;
      line-height: 20px;
      padding: 4px 14px;
    }
  }
`;
