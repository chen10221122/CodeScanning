import { memo, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

import { useUpdateEffect } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import WrapperContainer from '@pages/area/areaF9/modules/regionalFinancialResources/common/wrapperContainer';

import BackTop from '@/components/backTop';
import { useSelector } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks';

import { getLevel, Level } from '../../../utils/area';
import Filter from '../common/filter';
import Table from '../common/table';
import { Provider, useCtx } from '../context';
import { pageType } from '../type';
import useColumns from './useColumns';

const Index = () => {
  const { code, module: organizationType } = useParams();
  const {
    state: { firstLoading },
    update,
  } = useCtx();

  const areaInfo = useSelector((store) => store.areaInfo);
  const currNode = (useSelector((store) => store.curNodeBranchName) || '').split('-').pop();

  useEffect(() => {
    update((d) => {
      // 重置筛选项
      d.searchRef?.setInputValue('');
      d.searchRef?.toggleInput(false);
      d.resetParams();
    });
  }, [organizationType, update]);

  // 避免页面loading重复出现
  useUpdateEffect(() => {
    update((d) => {
      // 重置表格分页排序
      d.tableCondition.organizationType = organizationType;
      d.tableCondition.skip = 0;
      d.tableCondition.sortKey = '';
      d.tableCondition.sortRule = '';
      d.tableCondition.sort = '';
      d.tableData = [];
      d.total = 0;
      d.tableError = 0;

      // 重置页面loading
      d.firstLoading = true;

      (document.querySelector('.main-container') as HTMLElement).scrollTop = 0;
    });

    return () => {};
  }, [organizationType, update]);

  useEffect(() => {
    if (code && areaInfo) {
      const level = getLevel(code);
      const regionName = areaInfo?.regionName || '';
      update((d) => {
        d.code = code;
        d.page = pageType.NONE;
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
        d.module_type = 'nonBankInstitution';
        d.sheetNames = { '0': currNode };
        d.filterRequestParams.organizationType = organizationType;
      });
    }
  }, [areaInfo, code, update, currNode, organizationType]);

  const { columns } = useColumns();

  const Content = (
    <ContentWrap>
      <Table columns={columns} offsetHeader={36} />
      <BackTop target={() => (document.querySelector('.main-container') as HTMLElement) || document.body} />
    </ContentWrap>
  );

  return (
    <WrapperContainer
      loading={firstLoading}
      title={currNode}
      content={Content}
      headerBottomContent={
        <div style={{ marginTop: 4, marginBottom: -3 }}>
          <Filter moduleId={organizationType} />
        </div>
      }
      titleSticky={-32}
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
