import { useEffect, useRef } from 'react';

import Category from '@pages/area/areaRank/components/category';
import Filter from '@pages/area/areaRank/components/filter';
import Header from '@pages/area/areaRank/components/header';
import RankDetail from '@pages/area/areaRank/components/rankDetail';
import Table from '@pages/area/areaRank/components/table';
import { useInit } from '@pages/area/areaRank/hooks/useInit';
import { useCtx } from '@pages/area/areaRank/provider';

import { DEFAULT_PAGE_BOTTOM_MARGIN, DEFAULT_PAGE_TOP_MARGIN, getConfig } from '@/app';
import NoPowerDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { Spin } from '@/components/antd';
import BackTop from '@/components/backTop';

import S from './styles.module.less';
const pageTopMargin = parseInt(getConfig((d) => d.css.pageTopMargin, DEFAULT_PAGE_TOP_MARGIN) as string) || 0;
const pageBottomMargin = parseInt(getConfig((d) => d.css.pageBottomMargin, DEFAULT_PAGE_BOTTOM_MARGIN) as string) || 0;

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
      <div
        className={S.wholeWrapper}
        ref={wholeModuleWrapperRef}
        style={{ opacity: fullLoading ? 0 : 1, minWidth: '1280px' }}
      >
        <Spin
          wrapperClassName={S.categoryLoadingWrapper}
          type={'thunder'}
          spinning={categoryLoading}
          translucent
          useTag
        >
          <Header />
          <div style={{ background: '#fafbfd' }}>
            <div
              className={S.container}
              style={{
                minWidth: '1280px',
                minHeight: `calc(100vh - ${pageTopMargin + pageBottomMargin + 40}px)`, // 减去框架头、底部高度及该模块header高度
              }}
            >
              <Category />
              {/* 用于翻页时滚动到此处 [/dog/] */}
              <div ref={scrollRef} className={S.scrollViewBlank} />
              <Filter />
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
