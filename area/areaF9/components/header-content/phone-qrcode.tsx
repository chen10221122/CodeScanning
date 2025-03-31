import * as React from 'react';
import { FC, useMemo, useRef } from 'react';

import { useBoolean, useMemoizedFn } from 'ahooks';
import { Popover } from 'antd';
import styled from 'styled-components';

import tipFocusPointer from '@/assets/images/area/guide_icon@2x.png';
import qrcodeGuideBg from '@/assets/images/area/qrcode-guide-bg.png';
import Icon from '@/components/icon';
import SkeletonScreen from '@/components/skeletonScreen';
import { AREA_ECONOMY_QRCODE_GUIDE } from '@/configs/localstorage';

import reloadBgOne from '../../assets/reload-bg-one.png';
import reloadBg from '../../assets/reload-bg.png';
import reloadLoading from '../../assets/reload-loading.png';
import reloadImg from '../../assets/reload.png';

type Prop = {
  /** 文字对应的图标 */
  icon?: string;
  /** 文字提示内容 */
  content?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 是否显示弹窗 */
  visible?: boolean;
  /** app 二维码的资源路径 */
  appQrcodeSrc: string;
  /** 小程序 二维码的资源路径 */
  appletQrcodeSrc: string;
  loading: boolean;
  setGuideShow?: () => void;
  zIndex?: number;
  /** 确认文字 */
  confirmText?: string | JSX.Element;
  styles?: React.CSSProperties;
  tipInfo?: JSX.Element | string;
  executeAppQrcode?: any;
  executeAppletQrcode?: any;
  title?: string;
  showApp: boolean;
  showApplet: boolean;
};
const PhoneQrcode: FC<Prop> = ({
  icon = require('@/assets/images/area/qrscan_icon@2x.png'),
  content = '扫一扫',
  style,
  appQrcodeSrc,
  appletQrcodeSrc,
  visible,
  loading,
  executeAppQrcode,
  executeAppletQrcode,
  showApp,
  showApplet,
  tipInfo = (
    <span className={'guide-context'}>
      手机扫描二维码，在<span className={'guide-context-color'}>{showApp ? '企业预警通app、' : ''}城投宝小程序</span>
      中也可查看地区详情啦~
    </span>
  ),
}: Prop) => {
  const ref = useRef<HTMLElement>();
  const [val, { setFalse }] = useBoolean(localStorage.getItem(AREA_ECONOMY_QRCODE_GUIDE) === null);
  const [reloadStatus, { setTrue, setFalse: setReloadFalse }] = useBoolean(false);
  const [reloadQrcodeStatus, { setTrue: setQrcodeTrue, setFalse: setReloadQrcodeFalse }] = useBoolean(false);

  const handleGuideShow = useMemoizedFn(() => {
    setFalse();
    window.localStorage.setItem(AREA_ECONOMY_QRCODE_GUIDE, 'true');
  });

  const handleAppReload = useMemoizedFn(() => {
    setTrue();
    executeAppQrcode().then((res: any) => {
      setReloadFalse();
    });
  });

  const handleAppletReload = useMemoizedFn(() => {
    setQrcodeTrue();
    executeAppletQrcode().then((res: any) => {
      setReloadQrcodeFalse();
    });
  });

  /** 二维码弹窗 */
  const PopoverContent = useMemo(() => {
    return (
      <PopoverContentWrap
        isTwoCode={showApp && showApplet}
        style={{ width: showApp && showApplet ? '642px' : '262px' }}
        loading={loading && !reloadStatus && !reloadQrcodeStatus}
      >
        <div className="content-top">该栏目支持移动端查看</div>
        <div>
          <div className="content-middle">
            {loading && !reloadStatus && !reloadQrcodeStatus ? (
              <div style={{ width: '86%', marginLeft: '46px' }}>
                <SkeletonScreen num={1} firstStyle={{ paddingTop: '33px' }} otherStyle={{ paddingTop: '22px' }} />
              </div>
            ) : (
              <>
                {showApp ? (
                  <div className="app-qrcode">
                    {appQrcodeSrc ? (
                      <img
                        className="qrcode-img"
                        style={{ border: '1px solid #ebebeb' }}
                        src={appQrcodeSrc}
                        alt="wechat-qrcode"
                      />
                    ) : !reloadStatus ? (
                      <div className="loadingFail">
                        <img className="reloadImg" src={reloadImg} width="36" height="36" alt="" />
                        <img className="qrcode-img" src={reloadBg} alt="wechat-qrcode" />
                        <span className="text-left">
                          加载失败，
                          <span onClick={handleAppReload} className="text-right">
                            重新加载
                          </span>
                        </span>
                      </div>
                    ) : (
                      <div className="loadingFail">
                        <img
                          className="reloadImg reloadImg-loading"
                          src={reloadLoading}
                          width="36"
                          height="36"
                          alt=""
                        />
                        <img className="qrcode-img" src={reloadBg} alt="wechat-qrcode" />
                        <span className="text-left-one">加载中，请稍等</span>
                      </div>
                    )}
                  </div>
                ) : null}

                {showApplet ? (
                  <div className="wechat-qrcode">
                    {appletQrcodeSrc ? (
                      <img
                        className="qrcode-img"
                        style={{ border: '1px solid #ebebeb' }}
                        src={appletQrcodeSrc}
                        alt="wechat-qrcode"
                      />
                    ) : !reloadQrcodeStatus ? (
                      <div className="loadingFail">
                        <img className="reloadImg" src={reloadImg} width="36" height="36" alt="" />
                        <img className="qrcode-img" src={reloadBgOne} alt="wechat-qrcode" />
                        <span className="text-left">
                          加载失败，
                          <span onClick={handleAppletReload} className="text-right">
                            重新加载
                          </span>
                        </span>
                      </div>
                    ) : (
                      <div className="loadingFail">
                        <img
                          className="reloadImg reloadImg-loading"
                          src={reloadLoading}
                          width="36"
                          height="36"
                          alt=""
                        />
                        <img className="qrcode-img" src={reloadBgOne} alt="wechat-qrcode" />
                        <span className="text-left-one">加载中，请稍等</span>
                      </div>
                    )}
                  </div>
                ) : null}
              </>
            )}
          </div>
          <div className="content-bottom">
            {loading && !reloadStatus && !reloadQrcodeStatus ? (
              <div className="placeholder" />
            ) : (
              <>
                {showApp ? (
                  <div className="qrcode-detail">
                    <div className="qrcode-detail-name">企业预警通APP</div>
                    <div className="qrcode-detail-content app-content">打开企业预警通APP扫码即查看地区详情</div>
                  </div>
                ) : null}

                {showApplet ? (
                  <div className="qrcode-detail qrcode-detail-wechat">
                    <div className="qrcode-detail-name">城投宝小程序</div>
                    <div className="qrcode-detail-content wechat-content">打开微信扫码即查看地区详情</div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </PopoverContentWrap>
    );
  }, [
    appQrcodeSrc,
    appletQrcodeSrc,
    handleAppReload,
    handleAppletReload,
    loading,
    reloadQrcodeStatus,
    reloadStatus,
    showApp,
    showApplet,
  ]);

  return (
    <QrcodeContainer>
      <div>
        <TipsContainer visible={val}>
          {tipInfo}
          <span className={'confirm-text'} onClick={handleGuideShow}>
            知道了
          </span>
          <span className={'focus-pointer'} />
        </TipsContainer>
      </div>
      <Popover
        content={PopoverContent}
        placement="bottomRight"
        getPopupContainer={() => ref.current as HTMLElement}
        onVisibleChange={(visible) => {
          if (visible) {
            // setGuideShow();
          }
        }}
      >
        <ToolWrap
          onMouseEnter={() => {
            visible = true;
            setFalse();
            handleGuideShow();
          }}
          style={style}
          ref={ref}
        >
          <span className="tool-icon">
            <Icon image={icon} style={{ width: '14px', height: '14px', transform: 'translateY(-1px)' }} />
          </span>

          <span className="tool-content">{content}</span>
        </ToolWrap>
      </Popover>
    </QrcodeContainer>
  );
};

const QrcodeContainer = styled.div`
  .ant-popover-inner {
    border-radius: 6px;
  }
`;

const PopoverContentWrap = styled.div<any>`
  width: 642px;
  height: 307px;
  margin: -12px -16px;

  &::after {
    width: 0;
    height: 0;
    top: -3px;
    right: 26px;
    content: '';
    position: absolute;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid #ffffff;
  }

  .content-top {
    padding: 6px 10px;
    width: 140px;
    /* height: 28px; */
    background-color: #fff3e0;
    border-radius: 4px 0 4px 0;
    color: #ff8721;
    font-size: 12px;
    margin-bottom: 11px;
    border-top-left-radius: 6px;
  }

  .content-middle {
    padding-bottom: ${(props) => (props.loading ? '0' : '20px')};
    display: flex;
    align-items: center;

    .app-qrcode,
    .wechat-qrcode {
      position: relative;
      box-sizing: border-box;
      /* border: 1px solid #ebebeb;
      border-radius: 6px; */

      .qrcode-img {
        width: 154px;
        height: 154px;
        border-radius: 6px;
      }

      .loadingFail {
        .reloadImg {
          position: absolute;
          top: 45px;
          left: 59px;
        }

        .reloadImg-loading {
          animation: reloadImgRotate 2s linear infinite;
        }

        @keyframes reloadImgRotate {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }

        .text-left {
          position: absolute;
          left: 23px;
          top: 94px;
          font-size: 12px;
          font-weight: 400;
          color: #262626;
        }

        .text-left-one {
          position: absolute;
          left: 35px;
          top: 94px;
          font-size: 12px;
          font-weight: 400;
          color: #262626;
        }

        .text-right {
          cursor: pointer;
          font-size: 12px;
          font-weight: 400;
          color: #2874f9;
        }
      }
    }

    .app-qrcode {
      margin-left: ${(props) => (props.isTwoCode ? '115px' : '54px')};
    }

    .wechat-qrcode {
      margin-left: ${(props) => (props.isTwoCode ? '115px' : '54px')};
    }
  }

  .content-bottom {
    background: url(${(props) =>
        props.isTwoCode
          ? require('@/assets/images/area/popBg@2x.png')
          : require('@/assets/images/area/singlePop@2x.png')})
      no-repeat center center/contain;
    display: flex;
    align-items: center;

    margin-top: ${(props) => (props.loading ? '-5px' : '0')};

    .placeholder {
      width: 154px;
      height: 99px;
      text-align: center;
      margin-left: 115px;
    }

    .qrcode-detail {
      width: 154px;
      height: ${(props) => (props.isTwoCode ? '99px' : '140px')};
      text-align: center;
      margin-left: ${(props) => (props.isTwoCode ? '115px' : '54px')};
      .qrcode-detail-name {
        font-size: 20px;
        font-weight: 500;
        color: #0171f6;
        margin-bottom: 4px;
      }

      .qrcode-detail-content {
        font-size: 12px;
        color: #5c5c5c;
        margin: auto;
        line-height: 18px;
      }

      .app-content {
        width: 140px;
      }

      .wechat-content {
        width: 111px;
      }
    }

    .qrcode-detail-wechat {
      margin-left: ${(props) => (props.isTwoCode ? '115px' : '54px')};
    }
  }
`;

const ToolWrap = styled.div<any>`
  cursor: pointer;
  font-size: 13px;
  /* height: 28px; */

  .tool-icon {
    margin-right: 4px;
  }

  .tool-content {
    color: #000000;
    vertical-align: middle;
    font-weight: 400;
  }

  .ant-popover {
    padding-top: 4px !important;
    top: 34px !important;

    .ant-popover-content .ant-popover-arrow {
      top: 0;
    }
  }
`;

const TipsContainer = styled.div<any>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  width: 382px;
  height: 126px;
  /* background: linear-gradient(222deg, #51c5ff 0%, #0b78fa 70%); */
  color: #4b5264;
  border-radius: 4px;
  position: absolute;
  top: 29px;
  right: 50px;
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
    right: 67px;
  }
`;

export default PhoneQrcode;
