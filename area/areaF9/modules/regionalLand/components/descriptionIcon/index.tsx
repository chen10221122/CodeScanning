import { FC, memo } from 'react';

import styled from 'styled-components';

const DescriptionIcon: FC<any> = ({ value }) => {
  return <DescriptionContainer>{value}</DescriptionContainer>;
};
export default memo(DescriptionIcon);

const DescriptionContainer = styled.div`
  width: 600px;
  height: 20px;
  font-size: 12px;
  text-align: left;
  color: #5c5c5c;
  line-height: 20px;
`;
