import { memo, useRef, useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';

import { WrapperContainer } from '@pages/area/areaF9/components';
import { useSelector } from '@pages/area/areaF9/context';
import { useParams } from '@pages/area/areaF9/hooks';

import { Icon } from '@/components';
import { Empty } from '@/components/antd';
import useUpdateModalInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useModalBaseInfo';
import useTraceInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useTraceSource';
import useUpdateTipInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useUpdateTip';
import UpdateModal from '@/pages/area/areaDebt/components/updateTip/modal';
import { WHOLE_NATION_CODE } from '@/pages/bond/cityInvestMap/content';

import Filter from './common/filter';
import Table from './common/table';
import { Provider, useCtx as useRegionCtx } from './context';

const TipStyle = { display: 'flex', alignItem: 'center' };

const Index = () => {
  const areaInfo = useSelector((store) => store.areaInfo);
  const { regionCode } = useParams();
  const areaTree = useSelector((store) => store.areaTree);
  const [codes, setCodes] = useState('');

  const domRef = useRef(null);
  const { traceSource, traceCref } = useTraceInfo({ switchSize: '22' });
  const { UpdateTipCref, handleTblCell, openUpdate } = useUpdateTipInfo(true, true);
  const { modalInfo, openModal, closeModal, contetHolder } = useUpdateModalInfo();

  useEffect(() => {
    if (areaTree?.length) {
      const findElementWithValue = (arr: any[], value: string) => {
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i];
          if (element.value === value) {
            return element;
          } else if (Array.isArray(element?.children)) {
            const subResult: any[] = findElementWithValue(element?.children, value);
            if (subResult !== null) {
              return subResult;
            }
          }
        }
        return null;
      };

      let _codes: string[] = [];
      const node: any[] = findElementWithValue(areaTree, regionCode!)?.children || [];

      for (const item of node) {
        _codes.push(item.value);
      }

      setCodes(_codes.toString());
    }
  }, [areaTree, regionCode]);

  const {
    state: { tableLoading, tableError },
    update,
  } = useRegionCtx();

  const openDataSource = useSelector((store) => store.openDataSource);

  /** 跳转code */
  const jumpCode = useMemo(() => {
    return regionCode === WHOLE_NATION_CODE ? undefined : regionCode;
  }, [regionCode]);

  useEffect(() => {
    if (!codes?.length) {
      setTimeout(() => {
        update((d) => {
          d.tableLoading = false;
        });
      }, 4000);
    }
  }, [codes?.length, update]);

  useEffect(() => {
    if (tableLoading) {
      document.querySelector('.main-container')?.scrollTo({ top: 0 });
    }
  }, [tableLoading]);

  useEffect(() => {
    update((draft) => {
      draft.openSource = traceSource;
    });
  }, [traceSource, update]);

  const Content = useMemo(() => {
    return (
      <>
        {tableError ? <Empty type={Empty.NO_NEW_RELATED_DATA} style={{ marginTop: '100px' }}></Empty> : null}
        <TblStyle ref={domRef} style={{ display: tableError ? 'none' : 'block' }}>
          <Table
            allRegionCode={codes}
            mainRegionCode={regionCode}
            sticky={{
              offsetHeader: 71,
              getContainer: () => document.querySelector('.main-container') as HTMLElement,
            }}
            loading={tableLoading}
            showTableLoaidng={false}
            openModal={openModal}
            handleTblCell={handleTblCell}
            openUpdate={openUpdate}
            pageCode={'areaF9DistrictEconomy'}
            UpdateTipCref={UpdateTipCref}
            openDataSource={openDataSource}
          />
          <UpdateModal
            {...modalInfo}
            onClose={closeModal}
            container={domRef.current!}
            openDataSource={openDataSource}
          />
          {contetHolder}
        </TblStyle>
      </>
    );
  }, [
    tableError,
    codes,
    regionCode,
    tableLoading,
    openModal,
    handleTblCell,
    openUpdate,
    UpdateTipCref,
    modalInfo,
    closeModal,
    contetHolder,
    openDataSource,
  ]);

  return (
    <WrapperContainer
      loading={tableLoading}
      content={Content}
      headerBottomContent={
        <div style={{ marginTop: '8px' }}>
          <Filter
            localCity={areaInfo?.regionName}
            regionCode={jumpCode}
            curRegionCode={regionCode}
            moduleType={'subarea_regional_economies'}
            isCityInvestMapContent
            UpdateTip={<div style={TipStyle}>{traceCref}</div>}
            pageCode={'areaF9DistrictEconomy'}
            openDataSource={openDataSource}
          />
        </div>
      }
    ></WrapperContainer>
  );
};

/** 辖区经济和区域间比较tab内容，isRegionCompare为true时为区域间比较 */
const RegionAnalysis = () => (
  <Provider>
    <Index />
  </Provider>
);

export default memo(RegionAnalysis);

export const IconStyle = styled(Icon)`
  margin-right: 2px;
  transform: scale(${12 / 13});
`;

export const TooltipContent = styled.div`
  color: #434343;
  font-size: 12px;
  line-height: 20px;
  padding: 0 8px;
`;

const TblStyle = styled.div`
  width: 100% !important;
  overflow: inherit !important;
  .update-bottom-tip {
    padding-bottom: 16px;
  }
`;
