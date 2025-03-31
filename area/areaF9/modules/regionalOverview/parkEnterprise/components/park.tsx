import { memo, useMemo } from 'react';

import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { Title } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/components/company';
import LevelTag from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/components/levelTag';

interface Props {
  list: {
    affiliationArea: string;
    affiliationAreaCode: string;
    levelStr: string;
  }[];
  keywords: string;
}

const Park = ({ list, keywords }: Props) => {
  const title = useMemo(() => {
    if (!isEmpty(list)) {
      return list.reduce(
        (res, c, i) =>
          (res += `${i !== 0 ? '；' : ''}${c.affiliationArea}${c.levelStr !== '其他' ? ' ' + c.levelStr : ''}`),
        '',
      );
    } else {
      return undefined;
    }
  }, [list]);

  return (
    <Wrapper>
      {list ? (
        <span title={title}>
          {list.map((o, i) => (
            <span key={o.affiliationAreaCode} className="normalCompany">
              {i !== 0 ? '；' : null}
              <span style={{ marginRight: o.levelStr !== '其他' ? '4px' : '' }}>
                {o.affiliationArea ? <Title content={o.affiliationArea} keywords={keywords} /> : '-'}
              </span>
              {o.levelStr ? <LevelTag tag={o.levelStr} /> : null}
            </span>
          ))}
        </span>
      ) : null}
    </Wrapper>
  );
};

export default memo(Park);

const Wrapper = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
