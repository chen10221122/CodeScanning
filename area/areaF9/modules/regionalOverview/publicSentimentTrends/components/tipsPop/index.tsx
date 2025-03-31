import { FC, memo } from 'react';

import { useBoolean, useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import tipFocusPointer from '@/assets/images/area/guide_icon@2x.png';
import qrcodeGuideBg from '@/assets/images/area/qrcode-guide-bg.png';

interface initProps {
  containerId: string;
  zIndex?: number;
  /** 确认文字 */
  confirmText?: string | JSX.Element;
  containerStyles?: React.CSSProperties;
  pointerStyles?: React.CSSProperties;
  tipInfo?: JSX.Element | string;
}

const InitWrapper: FC<initProps> = ({
  containerId = 'tips_custom_guide',
  tipInfo = <span className={'guide-context'}>默认为您精选“重要”资讯，支持查看全部资讯~</span>,
  containerStyles,
  pointerStyles,
}) => {
  const [val, { setFalse }] = useBoolean(localStorage.getItem(containerId) === null);

  const handleGuideShow = useMemoizedFn(() => {
    setFalse();
    window.localStorage.setItem(containerId, 'true');
  });

  return (
    <TipsContainer visible={val} style={containerStyles}>
      {tipInfo}
      <span className={'confirm-text'} onClick={handleGuideShow}>
        知道了
      </span>
      <span className={'focus-pointer'} style={pointerStyles} />
    </TipsContainer>
  );
};

export default memo(InitWrapper);

const TipsContainer = styled.div<any>`
  display: ${(props) => (props.visible ? 'block' : 'none')} !important;
  width: 382px;
  height: 126px;
  /* background: linear-gradient(222deg, #51c5ff 0%, #0b78fa 70%); */
  color: #4b5264;
  border-radius: 4px;
  position: absolute;
  top: 25px;
  left: 50px;
  z-index: ${(props) => props.zIndex ?? 10};
  padding: 24px 26px 36px 26px;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  line-height: 20px;
  background-image: url('${qrcodeGuideBg}');
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .guide-context {
    line-height: 20px;

    .guide-context-color {
      color: #398ffe;
    }
  }

  .confirm-text {
    cursor: pointer;
    display: inline-block;
    width: 70px;
    height: 28px;
    background-color: #2d87fc;
    border-radius: 2px;
    color: #ffffff;
    line-height: 28px;
    text-align: center;
    position: absolute;
    bottom: 36px;
    right: 39px;
  }

  .focus-pointer {
    width: 34px;
    height: 34px;
    position: absolute;
    background: url(${tipFocusPointer}) no-repeat;
    background-size: 100% 100%;
    top: -25px;
    left: 67px;
  }
`;
