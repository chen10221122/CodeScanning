import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import dayjs from 'dayjs';
import styled from 'styled-components';

import WrapperContainer from '@pages/area/areaF9/modules/regionalFinancialResources/common/wrapperContainer';

import BackTop from '@/components/backTop';
import { useSelector } from '@/pages/area/areaF9/context';

import { getLevel, Level } from '../../../utils/area';
import DetailModal from '../common/detailModal';
import Filter from '../common/filter';
import Table from '../common/table';
import { Provider, useCtx } from '../context';
import { pageType } from '../type';
import useColumns from './useColumns';

const Index = () => {
  const { code } = useParams<any>();
  const {
    state: { firstLoading },
    update,
  } = useCtx();
  const areaInfo = useSelector((store) => store.areaInfo);
  const currNode = (useSelector((store) => store.curNodeBranchName) || '').split('-').pop();

  useEffect(() => {
    if (code && areaInfo) {
      const level = getLevel(code);
      const regionName = areaInfo?.regionName || '';
      update((d) => {
        d.code = code;
        d.page = pageType.BYBANK;
        switch (level) {
          case Level.PROVINCE:
            d.tableCondition.regionCode = code;
            d.filterRequestParams.regionCode = code;
            d.modalRequestParams.regionCode = code;
            break;
          case Level.CITY:
            d.tableCondition.regionCode = code;
            d.filterRequestParams.regionCode = code;
            d.modalRequestParams.regionCode = code;
            break;
          default:
            d.tableCondition.regionCode = code;
            d.filterRequestParams.regionCode = code;
            d.modalRequestParams.regionCode = code;
            break;
        }
        d.exportName = `${regionName}-${currNode}-${dayjs().format('YYYY.MM.DD')}`;
        d.module_type = 'regionalFinancialResource_areabank_by_bank';
      });
    }
  }, [areaInfo, code, update, currNode]);

  const { columns, modalColumns } = useColumns();

  const Content = (
    <ContentWrap>
      <Table columns={columns} offsetHeader={36} />
      <DetailModal columns={modalColumns} />
      <BackTop target={() => (document.querySelector('.main-container') as HTMLElement) || document.body} />
    </ContentWrap>
  );

  return (
    <WrapperContainer
      loading={firstLoading}
      title={currNode}
      content={Content}
      titleSticky={-32}
      headerBottomContent={
        <div style={{ marginTop: 4, marginBottom: -3 }}>
          <Filter />
        </div>
      }
    />
  );
};

const Page = () => (
  <Provider>
    <Index />
  </Provider>
);

export default memo(Page);

const ContentWrap = styled.div`
  padding-bottom: 16px;
`;
