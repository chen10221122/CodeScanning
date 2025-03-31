import { FC, FunctionComponentElement, memo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { LINK_DETAIL_ENTERPRISE, LINK_DETAIL_BOND } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

export const LinkToBond: FC<{
  code?: string;
  name?: string | FunctionComponentElement<{}>;
  type: 'co' | 'company';
  limitLine?: number;
}> = memo(({ code, name, type, limitLine }) => {
  const history = useHistory();
  const linkToF9 = useMemoizedFn((): void => {
    if (code) {
      history.push(
        urlJoin(
          dynamicLink(type === 'company' ? LINK_DETAIL_ENTERPRISE : LINK_DETAIL_BOND, { key: 'overview' }),
          urlQueriesSerialize({ type: type, code: code ? code : '' }),
        ),
        '',
      );
    }
  });
  return (
    <HasCode onClick={linkToF9} code={code} limitLine={limitLine}>
      {name ? name : '-'}
    </HasCode>
  );
});

export const NormalLink = ({ code, type, children }: { code: string; type: string; children: any }) => {
  const history = useHistory();
  const linkToF9 = useMemoizedFn((): void => {
    if (code) {
      history.push(
        urlJoin(
          dynamicLink(type === 'company' ? LINK_DETAIL_ENTERPRISE : LINK_DETAIL_BOND, { key: 'overview' }),
          urlQueriesSerialize({ type: type, code: code ? code : '' }),
        ),
        '',
      );
    }
  });
  return <span onClick={linkToF9}>{children}</span>;
};

const HasCode = styled.span<{ code?: string; limitLine?: number }>`
  font-size: 13px;
  color: ${(props) => (props?.code ? '#025CDC' : '#141414')};
  line-height: 19px;
  cursor: pointer;

  ${({ limitLine }) => {
    return limitLine
      ? `
      white-space: normal;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: ${limitLine};
      -webkit-box-orient: vertical;
  `
      : ``;
  }}

  &:hover {
    text-decoration: ${(props) => (props?.code ? 'underline' : 'none')};
  }
`;
