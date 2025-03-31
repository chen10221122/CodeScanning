import { memo } from 'react';

import { ProExcelNum, ExportDoc } from '@dzh/pro-components';
import Screen, { Options } from '@dzh/screen';
import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import DateScreen from '@pages/area/areaF9/modules/regionalLand/components/dateScreen';

import { LAND_USE, SUPPLY_MODE, MONTH_OPTIONS } from '@/pages/area/areaF9/modules/regionalLand/commonMenu';
import { useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/businessType/provider';
import { removeObjectNil, shortId } from '@/utils/share';

import S from '@pages/area/landTopic/styles.module.less';

const HeaderFilter = ({ areaCodeObj }: { areaCodeObj: { [x: string]: string | undefined } }) => {
  const {
    state: { total, dateFilter, otherFilter, sortKey, sortRule, screenKey, fileBase64, statisticsScope },
    update,
  } = useCtx();
  const options: Options[] = [{ ...LAND_USE }, { ...SUPPLY_MODE }, { ...MONTH_OPTIONS }];

  const onDateScreenChange = useMemoizedFn((v) => {
    update((draft) => {
      draft.dateFilter = v;
      draft.currentPage = 1;
    });
  });
  const onScreenChange = useMemoizedFn((_, allSelected) => {
    const results = allSelected.reduce((pre: any, { value, filed }: { value: string; filed: string }) => {
      if (value) pre[filed] = `${pre[filed] ? `${pre[filed]},` : ''}${value}`;
      return pre;
    }, {});
    update((draft) => {
      draft.otherFilter = results;
      draft.currentPage = 1;
    });
  });

  const date: string = Object.keys(dateFilter)[0] || 'dealDate';
  const exportCondition = removeObjectNil({
    downloadType: 'export',
    fileType: 3,
    fileId: shortId(),
    ...otherFilter,
    [date]: `(*,${dayjs().format('YYYY-MM-DD')}]`,
    ...areaCodeObj,
    statisticsScope,
    picCol: 9,
    sort: sortKey && sortRule ? `${sortKey}:${sortRule}` : '',
    size: 50,
    from: 0,
    exportFlag: true,
    module_type: 'landDeal_enterpriseType_web',
    sheetNames: { '0': '土地成交统计(按企业类型)' },
    fileUrl: '/100000/area/industrialPlaning',
    frequency: 1,
    isPost: true,
  });
  return (
    <ExportDoc.Provider>
      <Container>
        <LeftScreen key={screenKey}>
          <DateScreen isDetail onChange={onDateScreenChange} />
          <Screen options={options} onChange={onScreenChange} />
        </LeftScreen>
        <div className={`${S['num-export']} right-export`}>
          <ProExcelNum total={total} />
          <ExportDoc
            images={fileBase64}
            condition={exportCondition}
            getContainer={(document.getElementById('main-container') as HTMLDivElement) || window}
            filename={`土地成交统计_按企业类型_${dayjs().format('YYYYMMDD')}`}
          />
        </div>
      </Container>
    </ExportDoc.Provider>
  );
};

export default memo(HeaderFilter);

export const LeftScreen = styled.div`
  display: flex;
  align-items: center;
  flex-flow: wrap;
  row-gap: 4px;
  grid-gap: 4px 0;
`;

export const Container = styled.div`
  height: fit-content;
  background: #fff;
  padding: 4px 4px 8px 8px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  position: sticky;
  z-index: 7;
  top: 0px;
  .right-export {
    font-size: 13px !important;
    height: 24px;
    margin-left: 40px;
    white-space: nowrap;
  }
  .dzh-excel-num .dzh-excel-num-total {
    color: #3e3e3e;
  }
`;
