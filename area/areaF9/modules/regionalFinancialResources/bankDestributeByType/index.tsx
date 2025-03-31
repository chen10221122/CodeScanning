import { memo, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Switch } from '@dzh/components';
import dayjs from 'dayjs';
import styled from 'styled-components';

import ExportDoc from '@/components/exportDoc';
import { useSelector } from '@/pages/area/areaF9/context';

import { getLevel, Level } from '../../../utils/area';
import DetailModal from '../common/detailModal';
import { Provider, useCtx } from '../context';
import { pageType } from '../type';
import Table from './table';
import useColumns from './useColumns';
import WrapperContainer from './wrapperContainer';

const Index = () => {
  const { code } = useParams<any>();
  const {
    state: { tableCondition, exportName, firstLoading },
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
        d.page = pageType.BYTYPE;
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
        d.exportName = `${regionName}-${currNode}-${dayjs().format('YYYY.MM.DD')}`;
      });
    }
  }, [areaInfo, code, update, currNode]);

  const { columns, modalColumns } = useColumns();

  const Content = (
    <ContentWrap>
      <Table columns={columns} offsetHeader={35} />
      <DetailModal columns={modalColumns} />
    </ContentWrap>
  );

  const RightContent = useMemo(
    () => (
      <Right>
        <div className="switchNode">
          <Switch
            size="22"
            checked={tableCondition.hiddenBlankRow}
            onClick={() =>
              update((d) => {
                d.tableCondition.hiddenBlankRow = !tableCondition.hiddenBlankRow;
                d.conditionChangeLoading = true;
              })
            }
          />
          隐藏空行
        </div>
        <div>
          <ExportDoc
            condition={{
              module_type: 'regionalFinancialResource_areabank_by_type_stat',
              ...tableCondition,
            }}
            filename={exportName}
          />
        </div>
      </Right>
    ),
    [exportName, tableCondition, update],
  );

  return (
    <WrapperContainer loading={firstLoading} title={currNode} content={Content} headerRightContent={RightContent} />
  );
};

const Page = () => (
  <Provider>
    <Index />
  </Provider>
);

export default memo(Page);

const Right = styled.div`
  font-size: 12px;
  color: #141414;
  display: flex;
  align-items: inherit;
  .switchNode {
    display: flex;
    align-items: center;
    .ant-switch.dzh-switch {
      margin-right: 4px;
    }
  }
  div:not(:last-child) {
    margin-right: 24px;
  }
`;

const ContentWrap = styled.div`
  padding-bottom: 16px;
`;
