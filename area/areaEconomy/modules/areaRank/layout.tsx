import { useEffect, useRef } from 'react';

import styled from 'styled-components';

import NoPowerDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { Spin } from '@/components/antd';
import BackTop from '@/components/backTop';
import Filter from '@/pages/area/areaEconomy/modules/areaRank/components/filter';
import RankDetail from '@/pages/area/areaEconomy/modules/areaRank/components/rankDetail';
import Table from '@/pages/area/areaEconomy/modules/areaRank/components/table';
import { useInit } from '@/pages/area/areaEconomy/modules/areaRank/hooks/useInit';
import { useCtx } from '@/pages/area/areaEconomy/modules/areaRank/provider';

import S from './styles.module.less';

export default function Layout() {
  const {
    state: { permissionModalVisible, categoryLoading, fullLoading },
    update,
  } = useCtx();
  const scrollRef = useRef(null);
  const wholeModuleWrapperRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      update((d) => {
        d.scrollTargetRef = scrollRef.current;
      });
    }
  });
  useEffect(() => {
    if (wholeModuleWrapperRef.current) {
      update((d) => {
        d.wholeModuleWrapperRef = wholeModuleWrapperRef.current;
      });
    }
  });
  useInit();
  return (
    <>
      {fullLoading ? <Spin spinning={true} type="fullThunder" /> : null}
      <div className={S.wholeWrapper} ref={wholeModuleWrapperRef} style={{ opacity: fullLoading ? 0 : 1 }}>
        <Spin
          wrapperClassName={S.categoryLoadingWrapper}
          type={'thunder'}
          spinning={categoryLoading}
          translucent
          useTag
        >
          {/* <Header /> */}
          <div style={{ background: '#fafbfd' }}>
            <div className={S.container}>
              {/* <Category /> */}
              {/* 用于翻页时滚动到此处 [/dog/] */}
              <div ref={scrollRef} className={S.scrollViewBlank} />
              <Filter />
              <StickyTop />
              <Table />
            </div>
          </div>
        </Spin>
        <RankDetail />
        <NoPowerDialog
          visible={permissionModalVisible}
          setVisible={() => {
            update((d) => {
              d.permissionModalVisible = false;
            });
          }}
          type="cloud_total_count_limit"
          key={123}
        />
        <BackTop target={() => window} />
      </div>
    </>
  );
}

const StickyTop = styled.div`
  position: sticky;
  top: 102px;
  height: 12px;
  background-color: #fff;
  z-index: 7;
`;
