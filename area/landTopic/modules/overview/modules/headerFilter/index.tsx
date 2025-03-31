import { memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { LAND_USE, STATISTICAL_RANGE, SUPPLY_MODE, ENTERPRISE_TYPE } from '@pages/area/landTopic/commonMenu';
import DateScreen from '@pages/area/landTopic/components/dateScreen';
import { useCtx, LAND_TOPIC_OVERVIEW_MAIN_EXPORT } from '@pages/area/landTopic/modules/overview/provider';

import { Options, Screen } from '@/components/screen';

const OPTIONS: Options[] = [{ ...LAND_USE }, { ...SUPPLY_MODE }, { ...STATISTICAL_RANGE }, { ...ENTERPRISE_TYPE }];

const HeaderFilter = () => {
  const {
    state: { screenKey },
    update,
  } = useCtx();

  const onDateScreenChange = useMemoizedFn((v) => {
    update((draft) => {
      draft.dateFilter = v;
    });
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
  });

  return (
    <Container>
      <LeftScreen key={screenKey}>
        <DateScreen isDetail={false} onChange={onDateScreenChange} />
        <Screen options={OPTIONS} onChange={onScreenChange} />
      </LeftScreen>
      <div id={LAND_TOPIC_OVERVIEW_MAIN_EXPORT} />
    </Container>
  );
};

export default memo(HeaderFilter);

const LeftScreen = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  height: 30px;
  background: #fff;
  padding: 3px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
