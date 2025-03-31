import { useState, useEffect } from 'react';

import { useRequest } from 'ahooks';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { request } from '@/app/libs/request';
import { Icon } from '@/components';
import { useParams } from '@/pages/area/areaF9/hooks';

interface IProps {
  jumpToAreaRank: number;
  setJumpToAreaRank: React.Dispatch<React.SetStateAction<number>>;
}

const api_prefix = '/finchinaAPP/v1';

export const getAreaRankTags = ({ regionCode }: { regionCode: string }) => {
  return request.get(`${api_prefix}/finchina-economy/v1/area/list/region_tags`, {
    params: { regionCode },
  });
};

function AreaTag({ jumpToAreaRank, setJumpToAreaRank }: IProps) {
  const { regionCode } = useParams();
  const [list, setList] = useState([]);

  const { run } = useRequest(getAreaRankTags, {
    manual: true,
    onSuccess(res: any) {
      setList(res?.data?.tagList);
    },
    onError() {
      setList([]);
    },
  });

  useEffect(() => {
    if (regionCode) {
      run({ regionCode });
    }
  }, [regionCode, run]);

  if (isEmpty(list)) {
    return null;
  }
  return (
    <AreaTags>
      {list.map((item: string) => {
        return <ListItem key={item}>{item}</ListItem>;
      })}
      <Wrap
        onClick={() => {
          setJumpToAreaRank(jumpToAreaRank + 1);
        }}
      >
        <span>更多</span>
        <Icon symbol="iconico_qiyeF9_right2x" style={{ width: 10, height: 10 }} />
      </Wrap>
    </AreaTags>
  );
}

export default AreaTag;

const AreaTags = styled.div`
  margin-left: 17px;
  display: flex;
  align-items: center;
`;

const ListItem = styled.div`
  padding: 0 8px;
  margin-right: 6px;
  height: 21px;
  background: #f2f8ff;
  border-radius: 2px;
  font-size: 12px;
  text-align: center;
  color: #0171f6;
  line-height: 21px;
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 21px;
  background: #f2f8ff;
  border-radius: 2px;
  cursor: pointer;
  span {
    font-size: 12px;
    line-height: 12px;
    color: #0171f6;
    margin-top: 1px;
    margin-right: 2px;
    &:hover {
      text-decoration: underline;
    }
  }
`;
