import { useEffect, useRef, useMemo } from 'react';

import { WrapperContainer } from '@pages/area/areaF9/components';

import NoPowerDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { Spin } from '@/components/antd';
// import BackTop from '@/components/backTop';

import Filter from './components/filter';
// import RankDetail from './components/rankDetail';
import Table from './components/table';
import { useInit } from './hooks/useInit';
import { useCtx } from './provider';
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

  const Content = useMemo(() => {
    return (
      <div className={S.wholeWrapper} ref={wholeModuleWrapperRef} style={{ opacity: 1 }}>
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
              <Table />
            </div>
          </div>
        </Spin>
        {/* <RankDetail /> */}
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
      </div>
    );
  }, [categoryLoading, permissionModalVisible, update]);

  return (
    <>
      <WrapperContainer
        loading={fullLoading}
        content={Content}
        containerStyle={{
          minWidth: '930px',
          overflow: 'hidden scroll',
        }}
        headerRightContent={<Filter />}
      ></WrapperContainer>
    </>
  );
}
