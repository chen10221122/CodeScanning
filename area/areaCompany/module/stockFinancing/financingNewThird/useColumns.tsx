import { useMemo } from 'react';

import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { formatNumberAndFixedFloat } from '@/utils/format';

import Label from './label';

import S from '@pages/area/areaFinancing/style.module.less';

interface Props {
  current: number;
  restParams: Record<string, any>;
}

export default ({ current, restParams }: Props) => {
  return useMemo(
    () =>
      [
        {
          title: '序号',
          key: 'idx',
          dataIndex: 'idx',
          width: 42 + Math.max((String(current * PAGESIZE).length - 2) * 13, 0),
          fixed: 'left',
          align: 'center',
          render: (_: any, __: any, idx: number) => (current - 1) * PAGESIZE + idx + 1,
        },
        {
          title: '企业名称',
          key: 'name',
          dataIndex: 'name',
          sorter: true,
          width: 233,
          fixed: 'left',
          render(_: string, all: Record<string, any>) {
            return (
              <div style={{ textAlign: 'left' }}>
                <CoNameAndTags code={all.itCode} name={all.name} keyword={restParams.keyWord} tag={[]} />
              </div>
            );
          },
        },
        {
          title: '股票代码',
          key: 'stockCode',
          dataIndex: 'stockCode',
          sorter: true,
          width: 140,
          align: 'center',
          render: (text: string, row: Record<string, any>) => {
            let labelText = row.stockCodeLabel;
            return (
              <div style={{ display: 'flex' }}>
                <div
                  className={S.overflow}
                  style={{
                    textAlign: 'left',
                    flex: 1,
                    maxWidth: labelText ? 'calc(100% - 44px)' : '100%',
                    whiteSpace: 'normal',
                  }}
                  title={text}
                >
                  {text}
                </div>
                {labelText ? <Label labelText={labelText} /> : null}
              </div>
            );
          },
        },
        {
          title: '发行日期',
          key: 'issueDate',
          dataIndex: 'issueDate',
          sorter: true,
          defaultSortOrder: 'descend',
          width: 93,
          align: 'center',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '市场分层',
          key: 'listingSector',
          dataIndex: 'listingSector',
          sorter: true,
          width: 93,
          align: 'center',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '增发价格(元)',
          key: 'addIssuePrice',
          dataIndex: 'addIssuePrice',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 115,
          align: 'right',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '增发数量(万股)',
          key: 'addIssueNumber',
          dataIndex: 'addIssueNumber',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 128,
          align: 'right',
          render: (text: string) => <TextWrap>{text ? formatNumberAndFixedFloat(text) : '-'}</TextWrap>,
        },
        {
          title: '募资总额(万元)',
          key: 'fundAmount',
          dataIndex: 'fundAmount',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 128,
          align: 'right',
          render: (text: string) => <TextWrap>{text ? formatNumberAndFixedFloat(text) : '-'}</TextWrap>,
        },
        {
          title: '增发股份上市日',
          key: 'addIssueListingDate',
          dataIndex: 'addIssueListingDate',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 132,
          align: 'center',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '发行对象',
          key: 'issuerName',
          dataIndex: 'issuerName',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 250,
          align: 'left',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '注册资本',
          key: 'registeredCapital',
          dataIndex: 'registeredCapital',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 111,
          align: 'right',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '成立日期',
          key: 'foundData',
          dataIndex: 'foundData',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 93,
          align: 'center',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '证监会行业',
          key: 'industryName',
          dataIndex: 'industryName',
          sorter: true,
          width: 194,
          align: 'left',
          render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
        },
        {
          title: '所属地区',
          key: 'regionName',
          dataIndex: 'regionName',
          width: 190,
          align: 'left',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
      ].map((o, i) => ({ ...o, resizable: !!i })),
    [current, restParams.keyWord],
  );
};
