import { memo, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { Spin } from '@dzh/components';
import * as ls from 'local-storage';
import styled from 'styled-components';

import NoPayDialog from '@/app/components/dialog/power/noPayCreatLimit';
import NoPowerDialog from '@/app/components/dialog/power/noPayNotice';
import area_diff from '@/assets/images/power/area_diff.png';
import more_indic from '@/assets/images/power/more_indic.png';
import { LINK_AREA_F9 } from '@/configs/routerMap';
import { useTab } from '@/libs/route';
import { HeaderContent, SideLayoutChildTypeEnum } from '@/pages/area/areaF9/components';
import CalculateIndicModal from '@/pages/area/areaF9/components/header-content/calculateIndicModal';
import { useModalData } from '@/pages/area/areaF9/components/header-content/calculateIndicModal/useModalData';
import SideMenu from '@/pages/area/areaF9/components/sideBarLayout/sideMenu';
import { useSelector } from '@/pages/area/areaF9/context';
import { useCollections, useInitData, useMenus, useParams, useCheck } from '@/pages/area/areaF9/hooks';
import { useGetAreaOptions } from '@/pages/area/areaF9/hooks/useGetAreaOptions';
import RankDetail from '@/pages/area/areaF9/modules/regionalOverview/areaRank/components/rankDetail';
import { dynamicLink } from '@/utils/router';
import RouterView from '@/utils/router/routerView';

import SideLayout from './SideBarLayout';

const AREAFINANCING_BOARD_CODE = 'areafinancing_board_code';

const Main = () => {
  const domRef = useRef(null);
  const history = useHistory();
  const { key, code, module, hash, searchCode } = useParams();
  const areafinancingBoardCode = ls.get(AREAFINANCING_BOARD_CODE);
  useGetAreaOptions();
  const { remove } = useTab();

  /** 溯源弹窗 */
  const { modalInfo, closeModal, ...res } = useModalData();

  // 地区跳转次数权限弹窗
  const showPowerDialog = useSelector((store) => store.showPowerDialog);
  const showPayPowerDialog = useSelector((store) => store.showPayPowerDialog);
  const showMoreIndicDialog = useSelector((store) => store.showMoreIndicDialog);
  const pointLoading = useSelector((store) => store.loading);
  const { collections } = useSelector((store) => ({
    collections: store.collectionData,
  }));

  useCheck();

  const { loading, setPowerDialogVisible, setPayPowerDialogVisible, setMoreIndicPowerDialogVisible } = useInitData();
  const {
    menus,
    searchChange,
    keyword,
    showNoData,
    isHideNoDataNode,
    openKeys,
    selectedKey,
    openChange,
    handleJumpClick,
    flatMenus,
  } = useMenus({ key, code, module, hash });
  const { handleCollection, handleEditCollection } = useCollections({ regionCode: code });

  /** 兼容url中不带code的路由 */
  if (!code && !areafinancingBoardCode) {
    const url = `${dynamicLink(LINK_AREA_F9, { key, code: searchCode || '110000' })}${window.location.search}${
      window.location.hash
    }`;
    if (!process.env.REACT_APP_TERMINAL_FLAG) {
      remove();
    }
    history.replace(url);
  }

  return (
    <MainContainer id="area-areaf9-main-index-dom" ref={domRef}>
      <Spin spinning={loading || pointLoading} type="thunder" direction="vertical" tip="加载中">
        <SideLayout>
          <HeaderContent type={SideLayoutChildTypeEnum.HEADER} />
          <SideMenu
            type={SideLayoutChildTypeEnum.SIDE}
            hideDataIconHistoryKey={`area_f9_${code}`}
            menus={menus}
            onChange={searchChange}
            keyword={keyword}
            onShowNoData={showNoData}
            isHideNoDataNode={isHideNoDataNode}
            openKeys={openKeys}
            selectedKeys={selectedKey}
            onClick={handleJumpClick}
            onOpenChange={openChange}
            onCollection={handleCollection}
            collections={collections}
            flatMenus={flatMenus}
            onEditCollection={handleEditCollection}
          />
          <RouterView />
        </SideLayout>
        {/* 模块权限检测 */}
        <NoPowerDialog visible={showPayPowerDialog} setVisible={setPayPowerDialogVisible} type="areaDiff">
          <DialogContentStyle />
        </NoPowerDialog>
        {/* 地区跳转次数权限 */}
        <NoPayDialog visible={showPowerDialog} setVisible={setPowerDialogVisible} type="areaEconomyQuickView">
          <DialogContentStyle />
        </NoPayDialog>
        {/* 更多指标权限 */}
        <NoPayDialog
          visible={showMoreIndicDialog}
          setVisible={setMoreIndicPowerDialogVisible}
          type
          customMsgTxt="开通VIP可使用该功能：一键导入当前列表企业至企业数据浏览器，支持查询更多指标"
        >
          <DialogContentStyle isMoreIndic={true} />
        </NoPayDialog>
        {/* 超大城市、特大城市溯源弹窗 */}
        <CalculateIndicModal {...modalInfo} onClose={closeModal} container={domRef.current!} {...res} />
        {/* 榜单弹窗 */}
        <RankDetail />
      </Spin>
    </MainContainer>
  );
};

export default memo(Main);

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const DialogContentStyle = styled.div<any>`
  background: #ffffff;
  border-radius: 4px;
  height: 174px;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 7px;
    left: 12px;
    right: 12px;
    bottom: 7px;
    background: url(${({ isMoreIndic }) => (isMoreIndic ? more_indic : area_diff)});
    background-size: cover;
  }
`;
