import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';

import Icon from '@/components/icon';
import { LineWrap } from '@/pages/area/areaF9/modules/regionalFinancialResources/bankDestributeByType/useColumns';
import CompanyName from '@/pages/area/financialResources/module/common/companyName';
import { MIN_WIDTH, PADDING, sortDescend } from '@/pages/area/financialResources/module/common/const';
import { Pager } from '@/pages/area/financialResources/module/common/type';
import TagShow from '@/pages/area/financialResources/module/creditDetail/tagShow';
import { downloadFile, windowOpen } from '@/utils/download';
import { getExternalLink, getFileSymbolName } from '@/utils/format';
import { transformUrl } from '@/utils/url';

import { PostionTagShowStyle } from '../useColumns';

const useColumns = ({ pager, keyWord }: { pager: Pager; keyWord?: string }) => {
  const history = useHistory();
  const [checked, setChecked] = useState(true);

  const handleMainRating = useMemoizedFn((fileUrl: string, text: string) => {
    const FileType = (url: string) => url.split('.').pop() || '';
    return (
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => {
          const type = FileType(fileUrl);
          const name = new Date() + '.' + type;
          if (['docx', 'doc', 'xls', 'xlsx'].includes(type)) {
            downloadFile(name, fileUrl, type);
          } else {
            const ret = getExternalLink(fileUrl);
            if (typeof ret === 'string') {
              windowOpen(transformUrl(fileUrl)!, '_parent');
            } else {
              history.push(ret);
            }
          }
        }}
      >
        <>
          <span>{text}</span>
          <Icon style={{ width: '14px', height: '14px', marginLeft: '4px' }} symbol={getFileSymbolName(fileUrl)} />
        </>
      </div>
    );
  });

  const column = useMemo(
    () =>
      [
        {
          title: '序号',
          dataIndex: 'index',
          width: Math.max(`${pager.current * pager.pageSize}`.length * 10 + PADDING, MIN_WIDTH),
          className: 'pdd-8 before-tag-show',
          fixed: 'left',
          align: 'center',
          render: (text: string, obj: any, i: number) => {
            return <span>{(pager.current - 1) * pager.pageSize + i + 1}</span>;
          },
        },
        {
          title: (
            <>
              <div>获本行授信企业(发债主体)</div>
              <TagShow setTagShow={setChecked} pageTagIsNeedShow={checked} style={PostionTagShowStyle}></TagShow>
            </>
          ),
          dataIndex: 'itName',
          align: 'left',
          fixed: 'left',
          width: 262,
          resizable: { max: 780 - Math.max(`${pager.current * pager.pageSize}`.length * 10 + PADDING, MIN_WIDTH) },
          className: 'first-tag-show',
          render: (text?: string, raw?: any) => {
            const { itCode2, itName, tags } = raw || {};
            return <CompanyName code={itCode2} name={itName} keyWord={keyWord} tag={tags} showExternal={checked} />;
          },
        },
        {
          title: <div style={{ textAlign: 'center' }}>截止日期</div>,
          dataIndex: 'reportPeriod',
          align: 'center',
          width: 92,
          sorter: true,
          key: '6',
          sortDirections: sortDescend,
          render: (text?: string) => <LineWrap title={text}>{text || '-'}</LineWrap>,
        },
        {
          title: <div style={{ textAlign: 'center' }}>授信额度(亿元)</div>,
          dataIndex: 'creditLimit',
          align: 'right',
          width: 127,
          sorter: true,
          key: '2',
          render: (text?: string) => <LineWrap title={text}>{text || '-'}</LineWrap>,
        },
        {
          title: <div style={{ textAlign: 'center' }}>已使用(亿元)</div>,
          dataIndex: 'used',
          align: 'right',
          width: 114,
          sorter: true,
          key: '3',
          sortDirections: sortDescend,
          render: (used?: string) => <LineWrap title={used}>{used || '-'}</LineWrap>,
        },
        {
          title: <div style={{ textAlign: 'center' }}>未使用(亿元)</div>,
          dataIndex: 'nonUsed',
          align: 'right',
          width: 114,
          sorter: true,
          key: '4',
          sortDirections: sortDescend,
          render: (text?: string) => <LineWrap title={text}>{text || '-'}</LineWrap>,
        },
        {
          title: <div style={{ textAlign: 'center' }}>授信家数(家)</div>,
          dataIndex: 'creditNumber',
          align: 'right',
          width: 114,
          sorter: true,
          key: '5',
          sortDirections: sortDescend,
          render: (text?: string) => <LineWrap title={text}>{text || '-'}</LineWrap>,
        },
        {
          title: <div style={{ textAlign: 'center' }}>主体评级</div>,
          dataIndex: 'mainRating',
          align: 'center',
          width: 92,
          sorter: true,
          key: 'mainRating',
          sortDirections: sortDescend,
          render: (text?: string, raw?: any) => {
            const { url: fileUrl } = raw || {};
            if (!text) return '-';
            if (!fileUrl) return <div>{text}</div>;
            return handleMainRating(fileUrl, text);
          },
        },
        {
          title: <div style={{ textAlign: 'center' }}>法定代表人</div>,
          dataIndex: 'legalRepresentative',
          align: 'left',
          width: 132,
          render: (text?: string) => <LineWrap title={text}>{text || '-'}</LineWrap>,
        },
        {
          title: <div style={{ textAlign: 'center' }}>注册资本</div>,
          dataIndex: 'registerCapital',
          align: 'right',
          width: 134,
          sorter: true,
          key: 'registerCapital',
          sortDirections: sortDescend,
          render: (text?: string) => <LineWrap title={text}>{text || '-'}</LineWrap>,
        },
        {
          title: <div style={{ textAlign: 'center' }}>成立日期</div>,
          dataIndex: 'establishDate',
          align: 'right',
          width: 92,
          sorter: true,
          key: 'establishDate',
          sortDirections: sortDescend,
          render: (text?: string) => <LineWrap title={text}>{text || '-'}</LineWrap>,
        },
        {
          title: <div style={{ textAlign: 'center' }}>国标行业</div>,
          dataIndex: 'industry',
          align: 'left',
          width: 204,
          ellipsis: true,
          render: (text?: string) => <LineWrap title={text}>{text || '-'}</LineWrap>,
        },
        {
          title: <div style={{ textAlign: 'center' }}>所属地区</div>,
          dataIndex: 'registerArea',
          align: 'left',
          width: 189,
          render: (text?: string) => <LineWrap title={text}>{text || '-'}</LineWrap>,
        },
      ].map((o, i) => ({ resizable: i === 0 ? false : true, ellipsis: true, ...o })),
    [pager, checked, keyWord, handleMainRating],
  );
  return column;
};

export default useColumns;
