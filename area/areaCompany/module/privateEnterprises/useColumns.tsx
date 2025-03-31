import { useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import Icon from '@/components/icon';
import GreenDownSvg from '@/pages/area/areaCompany/assets/green_down.svg';
import RedUpSvg from '@/pages/area/areaCompany/assets/red_up.svg';
import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import { LinkToFile } from '@/pages/area/areaCompany/components/tableCpns/openOrDownloadFiles';
import PopoverWrap from '@/pages/area/areaCompany/components/tableCpns/popoverWrap';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { formatNumber } from '@/utils/format';

interface Props {
  curPage: number;
  restParams: Record<string, any>;
}

const RankList = [null, RedUpSvg, GreenDownSvg];
const getRepeatColumns = (handleOpenModal: Function, restParams: Record<string, any>) => [
  {
    title: '排名',
    key: 'rank',
    dataIndex: 'rank',
    sorter: true,
    width: 98,
    align: 'center',
    render(text: string, all: Record<string, any>) {
      return text ? (
        <RankStyle>
          <span className="rank-name">{formatNumber(text, 0)}</span>
          <span
            className={cn('rank-desc', {
              'rank-desc-normal': all.changeDirection === '0',
              'rank-desc-up': all.changeDirection === '1',
              'rank-desc-down': all.changeDirection === '2',
            })}
          >
            {all.changeDirection ? (
              <>
                {all.changeDirection !== '0' ? (
                  <>
                    <Icon image={RankList[all.changeDirection]} size={12} />
                    <span className="rank-desc-count">{all.changeNum}</span>
                  </>
                ) : (
                  '持平'
                )}
              </>
            ) : null}
          </span>
        </RankStyle>
      ) : (
        '-'
      );
    },
  },
  {
    title: '连续状态',
    key: 'label',
    dataIndex: 'label',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 93,
    align: 'center',
    render(text: string) {
      return text ? <TextWrap>{text}</TextWrap> : '-';
    },
  },
  {
    title: '入选榜单',
    key: 'tagBeans',
    dataIndex: 'tagBeans',
    width: 224,
    align: 'left',
    render: (tagBeans: Record<string, any>[], all: Record<string, any>) => (
      <TextWrap line={3}>
        {tagBeans && tagBeans.length
          ? tagBeans.map((item) => (
              <span
                className={item.tagCode ? 'numberModal' : ''}
                onClick={() =>
                  item.tagCode
                    ? handleOpenModal({
                        ...restParams,
                        ...item,
                        itCode2: all.code,
                      })
                    : null
                }
              >
                {item.tagName || '-'}
              </span>
            ))
          : '-'}
      </TextWrap>
    ),
  },
  {
    title: '原文',
    key: 'fileUrl',
    dataIndex: 'fileUrl',
    width: 52,
    align: 'center',
    render: (_: string, record: any) => {
      return <LinkToFile originalText={record.fileUrl} /* fileName={record.sFileName} */ />;
    },
  },
];

const TagWithPop = ({
  tagBeans,
  all,
  handleOpenModal,
  restParams,
}: {
  tagBeans: Record<string, any>[];
  all: Record<string, any>;
  handleOpenModal: Function;
  restParams: Record<string, any>;
}) => {
  const popRef = useRef<any>();
  const onClick = useMemoizedFn((item: Record<string, any>) => {
    handleOpenModal({
      ...restParams,
      ...item,
      itCode2: all.code,
    });
    if (popRef.current && popRef.current.closePopover) {
      popRef.current.closePopover();
    }
  });
  return (
    <PopoverWrap
      ref={popRef}
      content={
        <>
          {tagBeans.map((item) => (
            <div
              key={item.tagCode}
              className={item.tagCode ? 'numberModal' : ''}
              onClick={() => (item.tagCode ? onClick(item) : null)}
            >
              {item.tagName || '-'}
            </div>
          ))}
        </>
      }
      className="private-tag-popover-content"
      container={document.getElementById('area-company-index-container') || document.body}
    >
      <TagStyle>
        <span>{all.tagNum}</span>
      </TagStyle>
    </PopoverWrap>
  );
};
const getNoRepeatColumus = (handleOpenModal: Function, restParams: Record<string, any>) => [
  {
    title: '入选榜单',
    key: 'tagBeans',
    dataIndex: 'tagBeans',
    width: 94,
    align: 'center',
    render: (tagBeans: Record<string, any>[], all: Record<string, any>) => (
      <>
        {tagBeans && tagBeans.length ? (
          <TagWithPop tagBeans={tagBeans} all={all} handleOpenModal={handleOpenModal} restParams={restParams} />
        ) : (
          '-'
        )}
      </>
    ),
  },
];

const repeatRestColumns = [
  {
    title: '榜单公布日期',
    key: 'declareDate',
    dataIndex: 'declareDate',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 120,
    align: 'center',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
  {
    title: '认定单位',
    key: 'identityUnit',
    dataIndex: 'identityUnit',
    width: 115,
    align: 'left',
    render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
  },
  {
    title: '认定范围',
    key: 'identityRange',
    dataIndex: 'identityRange',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 94,
    align: 'center',
    render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
  },
  {
    title: '数据来源',
    key: 'dataSource',
    dataIndex: 'dataSource',
    width: 116,
    align: 'left',
    render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
  },
];

export default (handleOpenModal: Function) => {
  return useMemoizedFn(({ curPage, restParams }: Props) =>
    useMemo(() => {
      // 是否企业去重
      const isNoRepeatFun = restParams.isUnRepeated ? getNoRepeatColumus : getRepeatColumns;
      return [
        {
          title: '序号',
          key: 'idx',
          dataIndex: 'idx',
          width: 42 + Math.max((String(curPage * PAGESIZE).length - 2) * 13, 0),
          fixed: 'left',
          align: 'center',
          render: (_: any, __: any, idx: number) => (curPage - 1) * PAGESIZE + idx + 1,
        },
        {
          title: '企业名称',
          key: 'name',
          dataIndex: 'name',
          sorter: true,
          width: 233,
          fixed: 'left',
          align: 'left',
          render(_: string, all: Record<string, any>) {
            return <CoNameAndTags code={all.code} name={all.name} tag={all.tags} keyword={restParams.likeStr} />;
          },
        },
        ...isNoRepeatFun(handleOpenModal, restParams),
        {
          title: '法定代表人',
          key: 'legalRepresentative',
          dataIndex: 'legalRepresentative',
          width: 132,
          align: 'left',
          render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
        },
        {
          title: '注册资本',
          key: 'registeredCapital',
          dataIndex: 'registeredCapital',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 146,
          align: 'right',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '成立日期',
          key: 'incorporationDate',
          dataIndex: 'incorporationDate',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 94,
          align: 'center',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '所属地区',
          key: 'provinceName',
          dataIndex: 'provinceName',
          width: 190,
          align: 'left',
          render: (text: string, all: Record<string, any>) => {
            const areaList = [];
            if (text) areaList.push(text);
            if (all.cityName) areaList.push(all.cityName);
            if (all.countyName) areaList.push(all.countyName);
            return <TextWrap>{areaList.length ? areaList.join('-') : '-'}</TextWrap>;
          },
        },
        {
          title: '行业',
          key: 'industryLevel1',
          dataIndex: 'industryLevel1',
          width: 220,
          align: 'left',
          render: getIndustryRender(['industryLevel1', 'industryLevel2', 'industryLevel3', 'industryLevel4']),
        },
        ...(restParams.isUnRepeated ? [] : repeatRestColumns),
        {
          tittle: '',
          resizable: false,
        },
      ];
    }, [curPage, restParams]),
  );
};

const RankStyle = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  .rank-name {
    flex: 0 1 50%;
    margin-right: 3px;
    font-size: 13px;
    color: #141414;
    text-align: right;
  }
  .rank-desc {
    flex: 0 1 50%;
    margin-left: 3px;
    font-size: 12px;
    display: flex;
    align-items: center;
    text-align: left;
  }
  .rank-desc-normal {
    color: #52acf5;
  }
  .rank-desc-up {
    color: #ff4d4f;
  }
  .rank-desc-down {
    color: #4cca72;
  }
`;

const TagStyle = styled.div`
  cursor: pointer;
  position: relative;
  width: 20px;
  height: 20px;
  left: 50%;
  transform: translateX(-50%);
  &::before {
    display: block;
    content: '';
    width: 100%;
    height: 100%;
    opacity: 0.2;
    background: rgba(255, 147, 71, 0.37);
    border: 1px solid #ff7500;
    border-radius: 11px;
  }
  span {
    position: relative;
    top: -19px;
    color: #ff7500;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
  }
`;
