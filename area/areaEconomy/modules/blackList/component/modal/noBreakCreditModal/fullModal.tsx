import { FC, useEffect, useRef } from 'react';

import styled from 'styled-components';

import { Icon } from '@/components';
interface Props {
  onClose?: any;
  children?: any;
  visible: boolean;
}

const FullModal: FC<Props> & {
  Header: typeof Header;
  SectionTitle: typeof SectionTitle;
  Container: typeof Container;
  Content: typeof Content;
} = ({ onClose, visible, children }) => {
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapper.current) {
      wrapper.current.scrollTop = 0;
    }
  }, []);

  return (
    <PopupContainer style={{ display: visible ? 'block' : 'none' }}>
      <div
        className="mask"
        onClick={() => {
          onClose?.();
        }}
      />
      <PopupContent className="popupBlackListContent">
        <PopupContentInner>
          <div
            className="cancel"
            onClick={() => {
              onClose?.();
            }}
          >
            <Icon className="iconfont iconicon_quxiao2x" style={{ color: '#595959' }} />
          </div>
          <div className="pop-box" ref={wrapper} id="fullModalContainer">
            {children}
          </div>
        </PopupContentInner>
      </PopupContent>
    </PopupContainer>
  );
};

const Header = ({ children, ...restProps }: any) => {
  return <HeaderStyleWrapper {...restProps}>{children}</HeaderStyleWrapper>;
};
const SectionTitle = ({ children, ...restProps }: any) => {
  return <SectionTitleWrapper {...restProps}>{children}</SectionTitleWrapper>;
};
const Container = ({ children, ...restProps }: any) => {
  return <ContainerWrapper {...restProps}>{children}</ContainerWrapper>;
};
const Content = ({ children, ...restProps }: any) => {
  return <div {...restProps}>{children}</div>;
};

FullModal.Header = Header;
FullModal.SectionTitle = SectionTitle;
FullModal.Container = Container;
FullModal.Content = Content;

export default FullModal;

export const HeaderStyleWrapper = styled.div`
  font-size: 15px;
  font-weight: 500;
  text-align: left;
  color: #111111;
  line-height: 23px;
  padding-top: 20px;
  padding-bottom: 22px;
`;
export const SectionTitleWrapper = styled.div`
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #000000;
  line-height: 1;
  position: relative;
  padding-left: 10px;
  margin-bottom: 10px;
  &:before {
    content: '';
    display: inline-block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 3px;
    height: 14px;
    background: #ff9349;
    border-radius: 2px;
  }
`;
export const ContainerWrapper = styled.div`
  padding: 0 32px;
  min-height: 400px;
`;
const PopupContainer = styled.div`
  /* 根节点root */
  position: absolute;
  top: 0px;
  bottom: 0;
  left: 54px;
  right: 0;
  overflow-y: overlay;
  z-index: 999;
  height: 100%;
  padding-top: 60px;

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.34);
    z-index: 2;
  }
`;
const PopupContentInner = styled.div`
  position: relative;
`;

const PopupContent = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  height: 100%;
  overflow-y: hidden;
  z-index: 2;

  .pop-box {
    //background: #f6f6f6;
    background-color: #fff;
    width: 900px;
    border: 1px solid #f6f6f6;
    border-radius: 5px;
    box-shadow: 0 9px 7px 0 rgba(195, 195, 195, 0.5);
    margin-bottom: 30px;
    position: relative;
    z-index: 13;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    overflow-y: overlay;

    &:hover {
      &::-webkit-scrollbar,
      &::-webkit-scrollbar-thumb {
        visibility: visible;
      }
    }

    &::-webkit-scrollbar,
    &::-webkit-scrollbar-thumb {
      visibility: hidden;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: #e0e0e0;
    }
  }

  .cancel {
    position: absolute;
    width: 24px;
    height: 24px;
    background: #ffffff;
    text-align: center;
    box-sizing: border-box;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dfdfdf;
    border-radius: 50%;
    box-shadow: 0 2px 9px 2px rgba(0, 0, 0, 0.09), 0 1px 2px -2px rgba(0, 0, 0, 0.16);
    right: -12px;
    top: 18px;
    z-index: 14;
    cursor: pointer;

    & > i {
      font-size: 12px;
      transform: scale(${8 / 12});
    }
  }
`;
