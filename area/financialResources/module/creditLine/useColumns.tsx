import { FC, useMemo, useState } from 'react';

import { Popover } from 'antd';
import cn from 'classnames';
import styled from 'styled-components';

import IndexSvg from '@/assets/images/area/index.svg';
import { LineWrap } from '@/pages/area/areaF9/modules/regionalFinancialResources/bankDestributeByType/useColumns';
import CompanyName from '@/pages/area/financialResources/module/common/companyName';
import { MIN_WIDTH, PADDING } from '@/pages/area/financialResources/module/common/const';
import { Pager, detailType } from '@/pages/area/financialResources/module/common/type';
import TagShow from '@/pages/area/financialResources/module/creditDetail/tagShow';
import SortField from '@/pages/area/financialResources/module/creditLine/sort';

export const PostionTagShowStyle: React.CSSProperties = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-55%)',
};

const External = ({ params, callback }: { params: detailType; callback: (item: detailType) => void }) => {
  return (
    <div
      className="external"
      onClick={() => {
        callback(params);
      }}
    >
      <img style={{ cursor: 'pointer', width: 12, height: 12, verticalAlign: 'unset' }} src={IndexSvg} alt="" />
    </div>
  );
};

const Title: FC<{ title: string; popContent: string }> = ({ title, popContent }) => {
  return (
    <PopoverWrapper>
      <span className="title">{title}</span>
      <Popover
        overlayClassName="creditLine-debtIssuerCount-popover"
        placement={'bottom'}
        align={{
          offset: [0, -3],
        }}
        content={popContent}
        getPopupContainer={() => document.querySelector('#area-financialResources-creditLine') as HTMLElement}
      >
        <img className="update-help-img" height={12} src={require('@/assets/images/common/help.png')} alt="" />
      </Popover>
    </PopoverWrapper>
  );
};

const useColumns = ({
  pager,
  keyWord,
  currentSort,
  setCurrentSort,
  sortChange,
  handleDetail,
}: {
  pager: Pager;
  keyWord?: string;
  currentSort: any;
  setCurrentSort: any;
  sortChange: any;
  handleDetail: (item: detailType) => void;
}) => {
  const [checked, setChecked] = useState(true);

  const column = useMemo(
    () =>
      [
        {
          title: <div>序号</div>,
          dataIndex: 'index',
          width: Math.max(`${pager.current * pager.pageSize}`.length * 8 + PADDING, MIN_WIDTH),
          fixed: 'left',
          align: 'center',
          className: 'pdd-8 before-tag-show',
          render: (text: string, obj: any, i: number) => {
            return <span>{(pager.current - 1) * pager.pageSize + i + 1}</span>;
          },
        },
        {
          title: (
            <>
              <div>授信银行</div>
              <TagShow setTagShow={setChecked} pageTagIsNeedShow={checked} style={PostionTagShowStyle}></TagShow>
            </>
          ),
          dataIndex: 'itName',
          fixed: 'left',
          isSort: true,
          align: 'left',
          rule: 'desc',
          width: 232,
          resizable: { max: 780 - Math.max(`${pager.current * pager.pageSize}`.length * 8 + PADDING, MIN_WIDTH) },
          className: 'first-tag-show',
          render: (text?: string, raw?: any) => {
            const { itCode2: code, itName: name, tags } = raw || {};
            return (
              <CompanyName
                keyWord={keyWord}
                code={code}
                name={name}
                tag={tags}
                external={
                  <External
                    params={{ code, name, columnName: '授信规模历年趋势', type: 'chart' }}
                    callback={handleDetail}
                  />
                }
                showExternal={checked}
              />
            );
          },
        },
        {
          title: '银行类型',
          dataIndex: 'bankType',
          isSort: true,
          rule: 'desc',
          width: 92,
          ellipsis: true,
          resizable: true,
          render: (text?: string) => <LineWrap>{text || '-'}</LineWrap>,
        },
        {
          title: (
            <Title
              title={'区域内授信企业数量(发债企业)'}
              popContent={
                '截止所选年度，可获取的区域内有授信额度的发债企业数量。若所选年度发债企业未更新授信额度数据，则采用前两年内的最新数据补充。'
              }
            />
          ),
          dataIndex: 'debtIssuerCount',
          align: 'right',
          isSort: true,
          rule: 'asc',
          width: 147,
          ellipsis: false,
          resizable: true,
          render: (text?: string, raw?: any) => {
            const { itName, itCode2: itCode, year } = raw || {};
            return (
              <LineWrap
                className={cn({ link: itCode && text })}
                onClick={() => {
                  if (itCode && text) {
                    handleDetail({
                      type: 'list',
                      code: itCode,
                      name: itName,
                      year: year || '',
                      columnName: '获本行授信企业(发债主体)明细',
                    });
                  }
                }}
              >
                {text || '-'}
              </LineWrap>
            );
          },
        },
        {
          title: <Title title={'区域内授信总额度(亿元)'} popContent={'区域内发债企业获本行授信额度加总。'} />,
          dataIndex: 'creditLimit',
          align: 'right',
          isSort: true,
          rule: 'desc',
          width: 147,
          ellipsis: false,
          resizable: true,
          render: (text?: string) => <LineWrap>{text || '-'}</LineWrap>,
        },
        {
          title: <Title title={'全国授信总额度(亿元)'} popContent={'全国发债企业获本行授信额度加总。'} />,
          dataIndex: 'totalCreditLimit',
          align: 'right',
          rule: 'asc',
          width: 147,
          isSort: true,
          ellipsis: false,
          resizable: true,
          render: (text?: string) => <LineWrap>{text || '-'}</LineWrap>,
        },
        {
          title: (
            <Title
              title={'区域授信额度占全国比'}
              popContent={'区域内发债企业获本行的授信总额度占全国发债企业获本行授信总额度的比重。'}
            />
          ),
          dataIndex: 'divisorOne',
          align: 'right',
          isSort: true,
          rule: 'asc',
          width: 147,
          ellipsis: false,
          resizable: true,
          render: (text?: string) => <LineWrap>{text || '-'}</LineWrap>,
        },
        {
          title: (
            <Title
              title={'本行在区域内市场份额占比'}
              popContent={'区域内发债企业获本行的授信总额度占区域内发债企业获所有金融机构授信总额度的比重。'}
            />
          ),
          dataIndex: 'divisorTwo',
          align: 'right',
          isSort: true,
          rule: 'asc',
          width: 147,
          ellipsis: false,
          resizable: true,
          render: (text?: string) => <LineWrap>{text || '-'}</LineWrap>,
        },
      ].map((item) => {
        if (item?.isSort) {
          return {
            ...item,
            title: (
              <SortWrapper className={item.dataIndex !== 'index' ? 'customClassName' : ''}>
                <SortField
                  sortChange={sortChange}
                  sortOpt={{
                    key: item.dataIndex,
                    value: item.title,
                    rule: item?.rule,
                  }}
                  currentSort={currentSort}
                  setCurrentSort={setCurrentSort}
                  className="custom-sort-field-wrap"
                  isLoop={true}
                />
              </SortWrapper>
            ),
          };
        } else {
          return item;
        }
      }),
    [pager, checked, keyWord, handleDetail, sortChange, currentSort, setCurrentSort],
  );
  return column;
};

export default useColumns;

const SortWrapper = styled.span`
  div {
    align-items: baseline !important;
  }
  span:first-child {
    text-align: center;
  }
  span.title {
    width: 91px;
    text-align: right;
  }
  &.customClassName {
    display: inline-block;
    height: 100%;
  }
`;

const PopoverWrapper = styled.span`
  display: flex;
  align-items: baseline;
  .update-help-img {
    transform: translateY(1px);
  }
`;
