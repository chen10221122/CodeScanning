import { FC, memo } from 'react';
import { useHistory } from 'react-router';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { highlight } from '@/utils/dom';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

const LinkToF9: FC<{ code?: string; name?: string; keyword?: string }> = ({ code, name, keyword }) => {
  const history = useHistory();
  const linkToF9 = useMemoizedFn((): void => {
    history.push(
      urlJoin(
        dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
        urlQueriesSerialize({ type: 'company', code: code ? code : '' }),
      ),
      '',
    );
  });
  return (
    <HasCode onClick={linkToF9} code={code}>
      {keyword ? highlight(name as string, keyword) : name}
      {/* <span style={{width: '6px', height: '13px', display: 'inline-block'}}/> */}
    </HasCode>
  );
};

export default memo(LinkToF9);

const HasCode = styled.span<{ code?: string }>`
  font-size: 13px;
  color: ${(props) => (props?.code ? '#025CDC' : '#141414')};
  line-height: 19px;
  cursor: pointer;
  &:hover {
    text-decoration: ${(props) => (props?.code ? 'underline' : 'none')};
  }
`;
