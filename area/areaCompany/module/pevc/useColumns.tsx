import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import Icon from '@/components/icon';
import PEVCTAG from '@/pages/area/areaCompany/assets/pevc_tag.svg';
import { LinkToBond } from '@/pages/area/areaCompany/components/tableCpns/linkToF9';
import PopoverArrow from '@/pages/area/areaCompany/components/tableCpns/popoverArrow';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { highlight } from '@/utils/dom';

interface Props {
  curPage: number;
  curDataCounts: number;
  restParams: Record<string, any>;
}

export default ({ curPage, curDataCounts, restParams }: Props) => {
  const renderTrack = useMemoizedFn((text: string[]) => (
    <>
      {text && text.length
        ? text.slice(0, 3).map((item, idx) => (
            <TrackContainer key={idx}>
              <TextWrap>{item}</TextWrap>
              {idx > 1 && text.length > 3 ? (
                <PopoverArrow
                  data={text.map((t, i) => (
                    <div key={i} className="popItem">
                      {t}
                    </div>
                  ))}
                  dontNeedMount={curDataCounts < 3}
                  container={curDataCounts < 3 ? document.getElementById('area-company-index-container') : null}
                />
              ) : null}
            </TrackContainer>
          ))
        : '-'}
    </>
  ));

  return useMemo(
    () => [
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
        key: 'enterpriseInfo',
        dataIndex: 'enterpriseInfo',
        width: 233,
        fixed: 'left',
        align: 'left',
        render(_: string, all: Record<string, any>) {
          return (
            <LinkToBond
              code={all.enterpriseInfo.itCode}
              name={highlight(all.enterpriseInfo.itName, restParams.text)}
              type="company"
            />
          );
        },
      },
      {
        title: '披露日期',
        key: 'disclosureDate',
        dataIndex: 'disclosureDate',
        sorter: true,
        defaultSortOrder: 'descend',
        width: 94,
        align: 'center',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '项目',
        key: 'project',
        dataIndex: 'project',
        sorter: true,
        width: 129,
        align: 'left',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '主赛道',
        key: 'firstTrack',
        dataIndex: 'firstTrack',
        sorter: true,
        width: 119,
        align: 'left',
        render: renderTrack,
      },
      {
        title: '细分赛道',
        key: 'secondTrack',
        dataIndex: 'secondTrack',
        sorter: true,
        width: 119,
        align: 'left',
        render: renderTrack,
      },
      {
        title: '子赛道',
        key: 'threeTrack',
        dataIndex: 'threeTrack',
        sorter: true,
        width: 119,
        align: 'left',
        render: renderTrack,
      },
      {
        title: '融资轮次',
        key: 'financingRounds',
        dataIndex: 'financingRounds',
        sorter: true,
        width: 97,
        align: 'center',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '融资金额',
        key: 'financingAmount',
        dataIndex: 'financingAmount',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 111,
        align: 'right',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '注册资本',
        key: 'registeredCapital',
        dataIndex: 'registeredCapital',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 118,
        align: 'right',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '成立日期',
        key: 'establishmentDate',
        dataIndex: 'establishmentDate',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 93,
        align: 'center',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      // {
      //   title: '证监会行业',
      //   key: 'industryOfCSRC',
      //   dataIndex: 'industryOfCSRC',
      //   sorter: true,
      //   width: 194,
      //   align: 'left',
      //   render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      // },
      {
        title: '所属地区',
        key: 'area',
        dataIndex: 'area',
        width: 190,
        align: 'left',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '投资方名称',
        key: 'investors.itName',
        dataIndex: 'investors',
        sorter: true,
        width: 233,
        align: 'left',
        render(investors: Record<string, any>[]) {
          const investorsStr =
            investors && investors.length && investors[0].itName
              ? investors.map((item) => item.itName || '').join(',')
              : '';
          return (
            <TextWrap showPopContent={investorsStr}>
              {investors && investors.length && investors[0].itName ? (
                <>
                  {investors.map((investor, idx) => {
                    const name = (
                      <TagContainer>
                        <span className={cn({ 'has-margin-right': investor.tags && investor.tags.length })}>
                          {investor.itName || '-'}
                        </span>
                        {investor.tags && investor.tags.length ? (
                          <span className="tag-icon">
                            <Icon image={PEVCTAG} width={36} height={20} />
                          </span>
                        ) : (
                          ''
                        )}
                        {idx < investors.length - 1 ? ',' : ''}
                      </TagContainer>
                    );
                    return <LinkToBond code={investor.itCode} name={name as any} type="company" key={idx} />;
                  })}
                </>
              ) : (
                '-'
              )}
            </TextWrap>
          );
        },
      },
    ],
    [curPage, renderTrack, restParams.text],
  );
};

const TrackContainer = styled.div`
  display: flex;
  align-items: center;
  > {
    flex-shrink: 0;
  }

  .detail-arrow-popover-content {
    .ant-popover-inner {
      padding: 6px 4px 6px 0 !important;
      .ant-popover-inner-content {
        /* 箭头8+上下padding12+176=196 */
        max-height: 176px;
      }
    }
    .popItem {
      font-size: 13px;
      height: 20px;
      line-height: 20px;
      &:not(:first-of-type) {
        margin-top: 6px;
      }
    }
  }
`;
const TagContainer = styled.span`
  .has-margin-right {
    margin-right: 4px;
  }
  .tag-icon {
    vertical-align: -1px;
  }
`;
