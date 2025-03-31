import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';

import { AreaTechnologyInnovation, useAreaTechnologyInnovationFn } from '@dataView/components/areaTraceModal';

import NoPowerDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { Spin } from '@/components/antd';
import AreaDialog from '@/components/dialog/areaModal';
import ToolTipDialog from '@/components/dialog/power/ToolTipDialog';
import { AREA_COMPARE_SELECTED_CODE } from '@/configs/localstorage';
import { ProLayout } from '@/layouts/ProLayout';
import { useTab } from '@/libs/route';
import AreaSelectDialog from '@/pages/area/areaCompareAdvance/components/AreaSelectorModal';
import useAreaOperate from '@/pages/area/areaCompareAdvance/hooks/useAreaOperate';
import useJump from '@/pages/area/areaCompareAdvance/hooks/useJump';
import useUpdateModalInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useModalBaseInfo';
import useTraceSource from '@/pages/area/areaDebt/components/updateTip/hooks/useTraceSource';
import CalculateIndicModal from '@/pages/area/areaDebt/components/updateTip/modal/calculateIndicModal';
import AreaBondModal from '@/pages/bond/chineseDollarBondStatistics/components/detailModal';
import useDetail from '@/pages/bond/chineseDollarBondStatistics/hooks/useDetail';
import { ColumnTypeEnums } from '@/pages/bond/chineseDollarBondStatistics/types';

import DataViewDetail from '../AgGridTable/AgGrid';
import CompareRecord from '../components/compareRecord';
import { renderMessage } from '../config';
import { useCtx, LIMIT_SELECT } from '../context';
import exampleImage from '../imgs/exampleImg.png';
import BottomBar from '../modules/bottomBar';
import HeaderBar from '../modules/headerBar';
import IndicatorDialog from '../modules/IndicatorDialog';
import LeftBar from '../modules/leftBar';
import S from '../styles.module.less';

export default function PageLayout() {
  const {
    state: {
      showModal,
      showPayLimit,
      isToolOpen,
      recordVisible,
      areaInfo,
      indicatorModalVisible,
      areaSelectCode,
      indexIds,
      firstMainLoading,
      indicatorDetailParams,
    },
    update,
  } = useCtx();

  const { addArea } = useAreaOperate();
  const { handleJump } = useJump();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const havePay = useSelector((store: any) => store.user.info).havePay || false;

  const onJump = useMemoizedFn((codes) => {
    if (indexIds?.length) {
      handleJump(codes);
    } else {
      update((d) => {
        d.jumpCodes = codes;
      });
    }
  });

  useTab({
    onActive() {
      const newAreaCode = localStorage.getItem(AREA_COMPARE_SELECTED_CODE) || '';
      /** 上限 */
      const selectLimit = havePay ? LIMIT_SELECT.VIP : LIMIT_SELECT.NORMAL;

      if (newAreaCode) {
        localStorage.removeItem(AREA_COMPARE_SELECTED_CODE);
        const codeList = JSON.parse(newAreaCode);

        if (Array.isArray(codeList)) {
          // 区域经济大全、相似经济跳转本页面
          onJump(codeList);
        } else {
          // 区域经济F9跳转本页面
          if (indexIds?.length) {
            const hasCode = areaSelectCode?.includes(newAreaCode);
            if (hasCode) {
              // 地区已存在
              renderMessage('此地区已添加！');
            } else {
              // 添加地区
              const selectedCodes = areaSelectCode?.split(',') || [];
              if (selectedCodes.length < selectLimit) {
                const newCodes = areaSelectCode ? areaSelectCode + `,${newAreaCode}` : newAreaCode;
                update((d) => {
                  d.areaSelectCode = newCodes;
                });
                // 页面跳转需要调地区接口
                addArea(newCodes.split(','));
              } else {
                // 地区已达上限
                if (havePay) {
                  // 会员的上限提示
                  update((d) => {
                    d.showPayLimit = true;
                  });
                } else {
                  // 非会员的上限提示
                  renderMessage('地区添加已达上限，您可删除后添加，或者升级VIP，获得更多权益', true);
                }
              }
            }
          } else {
            update((d) => {
              d.jumpCodes = [newAreaCode];
            });
          }
        }
      }
    },
  });

  /** 溯源按钮 */
  const { traceSource, traceCref } = useTraceSource({
    defaultSource: false,
    disabled: !isToolOpen,
    exampleImage,
    switchSize: '22',
  });
  /** 溯源弹窗 */
  const { modalInfo, openModal, closeModal } = useUpdateModalInfo();
  // 科创类弹窗
  const technologyInnovationProps = useAreaTechnologyInnovationFn();
  const {
    setVisible: setTechnologyInnovationVisible,
    setTitle: setTechnologyInnovationTitle,
    setParams: setTechnologyInnovationParams,
    setType: setTechnologyInnovationType,
  } = technologyInnovationProps || {};

  // 中资美元债弹窗
  const [modalType, setModalType] = useState<ColumnTypeEnums>(ColumnTypeEnums.Expire);
  const {
    visible,
    setVisible,
    modalInfo: dollorBondModalInfo,
    modalParam,
    curPage,
    setCurPage,
    updateParams,
    handleClick,
    handlePageChange,
    handleTableChange,
  } = useDetail(modalType);

  useEffect(() => {
    // 初始化数据
    update((d) => {
      d.isToolOpen = !!areaInfo?.length;
      d.openSource = traceSource;
      d.handleOpenModal = openModal;
    });
  }, [traceSource, areaInfo?.length, openModal, update]);

  useEffect(() => {
    // 科技型企业内容处理
    update((d) => {
      d.setTechnologyInnovationVisible = setTechnologyInnovationVisible;
      d.setTechnologyInnovationTitle = setTechnologyInnovationTitle;
      d.setTechnologyInnovationParams = setTechnologyInnovationParams;
      d.setTechnologyInnovationType = setTechnologyInnovationType;
    });
  }, [
    setTechnologyInnovationParams,
    setTechnologyInnovationTitle,
    setTechnologyInnovationType,
    setTechnologyInnovationVisible,
    update,
  ]);

  useEffect(() => {
    // 中资美元债弹窗处理
    update((d) => {
      d.setModalType = setModalType;
      d.handleClick = handleClick;
    });
  }, [handleClick, update]);

  return (
    <div
      ref={wrapperRef}
      tabIndex={0}
      className={S.AreaComparePageWrapper}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <Spin type={'thunder'} spinning={firstMainLoading}>
        <ProLayout className={S.proLayout}>
          <LeftBar />
          <ProLayout.Content className={S.ContentWrapper}>
            <HeaderBar traceCref={traceCref} />
            <DataViewDetail />
            <BottomBar />
          </ProLayout.Content>
        </ProLayout>
      </Spin>

      {/* 计算指标弹窗 */}
      <CalculateIndicModal {...modalInfo} onClose={closeModal} container={wrapperRef.current! || document.body} />
      {/* {contetHolder} */}

      {/*无权限弹窗*/}
      <NoPowerDialog
        className="custon-new-combination"
        visible={showModal}
        setVisible={() => {
          update((d) => {
            d.showModal = false;
          });
        }}
        type="advanceSearchCombination"
        customMsgTxt="此功能为VIP专属功能，开通VIP版即可使用"
      />

      {/** 添加、替换地区弹窗 */}
      <AreaSelectDialog />
      {/** 指标图表溯源弹窗 */}
      {indicatorModalVisible && <IndicatorDialog wrapRef={wrapperRef} />}

      {/** 指标明细弹窗 */}
      <AreaDialog
        condition={indicatorDetailParams || {}}
        close={() => {
          update((draft) => {
            draft.indicatorDetailParams = {};
          });
        }}
        getContainer={wrapperRef.current! || document.body}
      />

      {/* 科创企业类弹窗 */}
      {/* 榜单明细弹窗 */}
      <AreaTechnologyInnovation
        {...technologyInnovationProps}
        getContainer={() => wrapperRef.current! || document.body}
      />

      {/* 美元债弹窗 */}
      {visible ? (
        <AreaBondModal
          visible={visible}
          setVisible={setVisible}
          page={curPage}
          setCurPage={setCurPage}
          onPageChange={handlePageChange}
          onTableChange={handleTableChange}
          modalParam={modalParam}
          modalInfo={dollorBondModalInfo}
          modalType={modalType}
          updateParams={updateParams}
          containerID={wrapperRef.current || document.body}
          wrapClassName={'dollorBondModal'}
        />
      ) : null}

      {/** 对比记录弹窗 */}
      {recordVisible && (
        <CompareRecord
          visible={recordVisible}
          onCancel={() => {
            update((d) => {
              d.recordVisible = false;
            });
          }}
          onSelect={(list) => {
            addArea(list);
            update((draft) => {
              draft.areaSelectCode = list.toString();
              draft.isCompare = true;
              draft.recordVisible = false;
            });
          }}
        />
      )}

      {/* 数据查询上限提示弹窗 */}
      <ToolTipDialog
        visible={showPayLimit}
        onCancel={() => {
          update((d) => {
            d.showPayLimit = false;
          });
        }}
        hasPayOverLimit={{
          content: ['功能使用已达上限，更多需求请联系客服定制！'],
        }}
      />
    </div>
  );
}
