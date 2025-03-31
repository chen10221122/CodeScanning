import { useMemo, useState } from 'react';

import cn from 'classnames';

import { LineWrap } from '@/pages/area/areaF9/modules/regionalFinancialResources/bankDestributeByType/useColumns';
import CompanyName from '@/pages/area/financialResources/module/common/companyName';
import { MIN_WIDTH, PADDING, sortDescend } from '@/pages/area/financialResources/module/common/const';
import { Pager, detailType } from '@/pages/area/financialResources/module/common/type';
import TagShow from '@/pages/area/financialResources/module/creditDetail/tagShow';
import { LinkToFile } from '@/pages/cloudTotal/modules/table/linkToFile';

export const PostionTagShowStyle: React.CSSProperties = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-55%)',
};

const useColumns = ({
  pager,
  keyWord,
  handleDetail,
}: {
  pager: Pager;
  handleDetail: (item: detailType) => void;
  keyWord?: string;
}) => {
  const [checked, setChecked] = useState(true);

  const column = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        width: Math.max(`${pager.current * pager.pageSize}`.length * 8 + PADDING, MIN_WIDTH),
        className: 'pdd-8 before-tag-show',
        fixed: 'left',
        align: 'center',
        render: (text: string, obj: any, i: number) => {
          return <span>{(pager.current - 1) * pager.pageSize + i + 1}</span>;
        },
        hideInSetting: true,
      },
      {
        title: (
          <>
            <div>获授信企业(发债主体)</div>
            <TagShow setTagShow={setChecked} pageTagIsNeedShow={checked} style={PostionTagShowStyle}></TagShow>
          </>
        ),
        dataIndex: 'itName',
        align: 'left',
        width: 318,
        sorter: true,
        key: '1',
        fixed: 'left',
        className: 'first-tag-show',
        resizable: { max: 780 - Math.max(`${pager.current * pager.pageSize}`.length * 8 + PADDING, MIN_WIDTH) },
        sortDirections: sortDescend,
        render: (itName?: string, raw?: any) => {
          const { itCode2, tags } = raw || {};
          return (
            <CompanyName
              code={itCode2}
              name={itName}
              keyWord={keyWord}
              tag={tags}
              maxWidth={289}
              showExternal={checked}
            />
          );
        },
      },
      {
        title: <span>授信额度(亿元)</span>,
        dataIndex: 'creditLimit',
        align: 'right',
        width: 136,
        sorter: true,
        key: '2',
        resizable: true,
        render: (text?: string) => <LineWrap title={text}>{text || '-'}</LineWrap>,
      },
      {
        title: <span>已使用(亿元)</span>,
        dataIndex: 'used',
        align: 'right',
        width: 136,
        sortDirections: sortDescend,
        sorter: true,
        key: '3',
        resizable: true,
        render: (used?: string) => <LineWrap title={used}>{used || '-'}</LineWrap>,
      },
      {
        title: <span>未使用(亿元)</span>,
        dataIndex: 'nonUsed',
        align: 'right',
        width: 136,
        sortDirections: sortDescend,
        sorter: true,
        key: '4',
        resizable: true,
        render: (text?: string) => <LineWrap title={text}>{text || '-'}</LineWrap>,
      },
      {
        title: <span>授信机构数量</span>,
        dataIndex: 'creditInstitutionNumber',
        sortDirections: sortDescend,
        align: 'right',
        width: 136,
        sorter: true,
        key: '5',
        resizable: true,
        render: (text?: string, raw?: any) => {
          const { itName, itCode2: itCode, reportPeriod } = raw || {};
          return (
            <LineWrap
              title={text}
              className={cn({ link: itCode && text })}
              onClick={() => {
                if (itCode && text) {
                  handleDetail({
                    code: itCode,
                    name: itName,
                    columnName: '授信机构明细',
                    year: reportPeriod || '',
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
        title: <span>截止日期</span>,
        dataIndex: 'reportPeriod',
        sortDirections: sortDescend,
        align: 'left',
        width: 116,
        sorter: true,
        key: '6',
        resizable: true,
        render: (text?: string, row?: any) => (
          <LineWrap title={text}>
            <span>{text || '-'}</span>
            {row.filePath ? (
              <span style={{ marginLeft: 4 }}>
                <LinkToFile height={14} originalText={row.filePath} />
              </span>
            ) : null}
          </LineWrap>
        ),
      },
    ],
    [pager, checked, keyWord, handleDetail],
  );
  return column;
};

export default useColumns;
