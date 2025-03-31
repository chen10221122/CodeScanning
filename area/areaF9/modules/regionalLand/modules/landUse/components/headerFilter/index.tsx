import { memo } from 'react';

import { ExportDoc } from '@dzh/pro-components';
import Screen, { Options } from '@dzh/screen';
import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import DateScreen from '@pages/area/areaF9/modules/regionalLand/components/dateScreen';

import {
  SUPPLY_MODE,
  ENTERPRISE_TYPE,
  MONTH_OPTIONS,
  OPTIONSCHART,
} from '@/pages/area/areaF9/modules/regionalLand/commonMenu';
import { useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/provider';

const OPTIONS: Options[] = [{ ...SUPPLY_MODE }, { ...ENTERPRISE_TYPE }, { ...MONTH_OPTIONS }];

interface HeaderFilterParams {
  total: number;
  condition: any;
  fileBase64: string;
  setCurrentPage: (v: number) => void;
}
// screenkey传过来用以重置筛选
const HeaderFilter = ({ total, condition, fileBase64, setCurrentPage }: HeaderFilterParams) => {
  const {
    state: { screenKey },
    update,
  } = useCtx();

  const onDateScreenChange = useMemoizedFn((v) => {
    update((draft) => {
      draft.dateFilter = v;
    });
    setCurrentPage(1);
  });

  const onScreenChange = useMemoizedFn((_, allSelected) => {
    const results = allSelected.reduce((pre: any, { value, filed }: { value: string; filed: string }) => {
      if (value) {
        if (pre[filed]) {
          pre[filed] = `${pre[filed]},${value}`;
        } else {
          pre[filed] = value;
        }
      }
      return pre;
    }, {});
    update((draft) => {
      draft.otherFilter = results;
    });
    setCurrentPage(1);
  });

  // 图上面的筛选
  const onScreenChangeChart = useMemoizedFn((v) => {
    update((draft) => {
      draft.chartType = v;
    });
  });

  return (
    <ExportDoc.Provider>
      <Container>
        <LeftScreen key={screenKey}>
          <DateScreen isDetail={true} onChange={onDateScreenChange} />
          <Screen options={OPTIONS} onChange={onScreenChange} />
          <div className="chart-screen">
            <Screen options={OPTIONSCHART} onChange={onScreenChangeChart} />
          </div>
        </LeftScreen>
        <RightScreen>
          <div className="count">
            共 <span className="nums">{total}</span> 条
          </div>
          <ExportDoc
            images={fileBase64}
            condition={condition}
            getContainer={(document.getElementById('main-container') as HTMLDivElement) || window}
            filename={`土地成交统计_按土地用途_${dayjs().format('YYYYMMDD')}`}
          />
        </RightScreen>
      </Container>
    </ExportDoc.Provider>
  );
};

export default memo(HeaderFilter);

const LeftScreen = styled.div`
  display: flex;
  align-items: center;
  .chart-screen {
    margin-left: 24px;
  }
`;
const RightScreen = styled.div`
  display: flex;
  font-size: 13px !important;
  align-items: center;
  .count {
    margin-right: 24px;
    font-size: 13px;
    color: #8c8c8c;
  }
  .nums {
    color: #3e3e3e;
  }
`;

const Container = styled.div`
  height: fit-content;
  background: #fff;
  padding: 4px 4px 8px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  z-index: 7;
  top: 0;
`;
