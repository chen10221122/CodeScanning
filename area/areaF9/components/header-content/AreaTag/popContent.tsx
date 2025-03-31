import { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
// eslint-disable-next-line
import styled from 'styled-components';

import { Icon } from '@/components';
import { Table } from '@/components/antd';
import { LINK_AREA_REGIONALLIST } from '@/configs/routerMap/areaF9';
import hotIcon from '@/pages/area/areaF9/modules/regionalOverview/areaRank/images/hot.svg';
import moreIcon from '@/pages/detail/modules/bond/f9/images/news-more.png';
import { windowOpen } from '@/utils/download';
import { getExternalLink } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
interface PopContentProps {
  regionCode: string;
  list: Record<string, any>[];
  allCount: number;
  hanldeOpenModal: Function;
  year: string;
  handleOutClose: Function;
}
const iconStyle = { width: 14, height: 14, marginLeft: 4, verticalAlign: 'text-top' };

const PopContent: FC<PopContentProps> = ({ regionCode, list, allCount, hanldeOpenModal, year, handleOutClose }) => {
  const history = useHistory();

  /** 文件 */
  const handleClickFile = useMemoizedFn((url) => {
    if (url) {
      const ret = getExternalLink(url);
      if (typeof ret === 'string') {
        windowOpen(url);
      } else {
        history.push(ret);
      }
    }
  });

  const columns = useMemo(() => {
    return [
      {
        title: '榜单名称',
        dataIndex: 'name',
        align: 'left',
        render: (name: string, o: Record<string, any>) => {
          return (
            <BondName>
              <div onClick={() => hanldeOpenModal(o)}>
                <span title={name}>
                  {name}
                  {o?.isHotList === '1' ? <Icon style={iconStyle} image={hotIcon} /> : null}
                </span>
              </div>
              {o.url ? (
                <div onClick={() => handleClickFile(o.url)}>
                  <Icon symbol={'iconHTML'} />
                </div>
              ) : null}
            </BondName>
          );
        },
      },
    ];
  }, [handleClickFile, hanldeOpenModal]);

  /** 跳转更多 */
  const handleJumpMore = useMemoizedFn(() => {
    // handleOutClose();
    if (regionCode) {
      history.push(dynamicLink(LINK_AREA_REGIONALLIST, { code: regionCode }));
    }
  });

  return (
    <>
      <ContentHeader>
        {year}年榜单
        <span>{allCount}</span>
      </ContentHeader>
      <Table isStatic type="stickyTable" rowKey={(k: any) => JSON.stringify(k)} dataSource={list} columns={columns} />
      <MoreContainer>
        <ContentMoreTpl onClick={handleJumpMore}>查看更多</ContentMoreTpl>
      </MoreContainer>
    </>
  );
};

export default PopContent;

const ContentHeader = styled.div`
  height: 20px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #141414;
  line-height: 20px;
  font-weight: 700;
  span {
    height: 20px;
    margin-left: 6px;
    font-size: 13px;
    font-family: Arial, Arial-Regular;
    font-style: italic;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 20px;
  }
`;

const MoreContainer = styled.div`
  height: 32px;
  line-height: 32px;
  border: 1px solid #f2f4f9;
  border-top: none;
  border-radius: 2px;
`;
const ContentMoreTpl = styled.div`
  font-weight: normal;
  font-size: 13px;
  color: #0171f6;
  cursor: pointer;
  width: fit-content;
  margin: 0 auto;
  position: relative;
  &:hover {
    text-decoration: underline;
  }
  &::after {
    content: '';
    display: block;
    width: 9px;
    height: 9px;
    position: absolute;
    top: 50%;
    right: -13px;
    transform: translateY(-50%);
    background-image: url(${moreIcon});
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
`;

const BondName = styled.div`
  display: flex;
  align-items: center;
  > div {
    &:first-of-type {
      word-break: break-all;
      cursor: pointer;
      color: #025cdc;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      &:hover {
        text-decoration: underline;
      }
    }
    &:nth-of-type(2) {
      margin-left: auto;
      padding-left: 14px;
      cursor: pointer;
    }
  }
`;
