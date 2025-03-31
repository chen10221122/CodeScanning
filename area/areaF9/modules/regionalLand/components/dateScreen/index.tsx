import { FC, memo, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayJs from 'dayjs';
import { isArray } from 'lodash';
import styled from 'styled-components';

import { getOptions } from '@pages/area/areaF9/modules/regionalLand/components/dateScreen/menuCfg';

import { Screen, RowItem } from '@/components/screen';

interface Props {
  isDetail: boolean;
  onChange: (v: Record<string, string>) => void;
}

const DateScreen: FC<Props> = ({ isDetail, onChange }) => {
  const options = useMemo(() => getOptions(isDetail), [isDetail]);

  const onScreenChange = useMemoizedFn((_, allSelected: RowItem[]) => {
    let key = '',
      curValue = '';
    allSelected.forEach(({ value, field }) => {
      if (field === 'type') {
        key = value;
      } else {
        if (isArray(value)) {
          curValue = `[${dayJs(value[0]).format('YYYY-MM-DD')},${dayJs(value[1]).format('YYYY-MM-DD')}]`;
        } else {
          curValue = value;
        }
      }
    });
    onChange({ [key]: curValue });
  });

  return (
    <Container>
      <span className="label">日期口径</span>
      <Screen options={options} onChange={onScreenChange} />
    </Container>
  );
};

export default memo(DateScreen);

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;
  .label {
    font-size: 12px;
    color: #141414;
    line-height: 18px;
    margin-right: 6px;
  }
  .ant-dropdown-trigger {
    margin-bottom: 0;
    border: 1px solid #c4dcf5;
    border-radius: 2px;
    padding: 3.5px 8px;
    font-size: 12px;
    line-height: 15px;
  }
`;
