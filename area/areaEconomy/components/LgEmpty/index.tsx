import { memo, FC } from 'react';

import styled from 'styled-components';

import { Empty } from '@/components/antd';
import * as types from '@/components/antd/empty/types';
import { Value } from '@/utils/utility-types';

interface Props {
  show: Boolean;
  style?: any;
  type?: Value<typeof types>;
  [p: string]: any;
}

const LgEmpty: FC<Props> = memo(({ show, style = {}, type, ...props }) => {
  return show ? (
    <EmptyWrapper style={style}>
      <Empty type={type} {...props} />
    </EmptyWrapper>
  ) : null;
});

const EmptyWrapper = styled.div`
  min-height: calc(100vh - 507px);
  padding-top: calc(33vh - 170px);
`;

export default LgEmpty;
