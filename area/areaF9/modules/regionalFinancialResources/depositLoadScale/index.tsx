import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import dayjs from 'dayjs';

import WrapperContainer from '@pages/area/areaF9/modules/regionalFinancialResources/common/wrapperContainer';

import BackTop from '@/components/backTop';
import { useSelector } from '@/pages/area/areaF9/context';

import { getLevel, Level } from '../../../utils/area';
import Filter from '../common/filter';
import { ContentWrap } from '../common/style';
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

  useEffect(() => {
    if (code && areaInfo) {
      const level = getLevel(code);
      const regionName = areaInfo?.regionName || '';
      update((d) => {
        d.code = code;
        d.page = pageType.SCALE;
        switch (level) {
          case Level.PROVINCE:
            d.tableCondition.regionCode = code;
            break;
          case Level.CITY:
            d.tableCondition.regionCode = code;
            break;
          default:
            d.tableCondition.regionCode = code;
            break;
        }
        d.tableCondition.year = `[${dayjs().subtract(10, 'year').format('YYYY')}, ${dayjs().format('YYYY')}]`;
        d.exportName = `${regionName}-存贷款规模-${dayjs().format('YYYY.MM.DD')}`;
        d.module_type = 'depositAndLoanScale';
      });
    }
  }, [areaInfo, code, update]);

  const columns = useColumns();

  const Content = (
    <ContentWrap>
      <Table columns={columns} offsetHeader={48} />
      <BackTop target={() => (document.querySelector('.main-container') as HTMLElement) || document.body} />
    </ContentWrap>
  );

  return (
    <WrapperContainer
      loading={firstLoading}
      title="存贷款规模"
      content={Content}
      titleSticky={-30}
      headerBottomContent={
        <div style={{ marginTop: 8, marginBottom: 3, fontSize: 13 }}>
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
