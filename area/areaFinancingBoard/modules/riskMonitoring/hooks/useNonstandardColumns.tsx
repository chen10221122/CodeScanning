import { useMemo } from 'react';

import { PAGESIZE } from '@/pages/area/areaCompany/const';
import CompanyLink from '@/pages/area/areaFinancingBoard/components/Company/CompanyLink';
import LineEllipsis from '@/pages/area/areaFinancingBoard/components/LineEllipsis';
import type { DetailColumnsProps } from '@/pages/area/areaFinancingBoard/types';
const useColumns = ({ curPage }: DetailColumnsProps) => {
  const columns = useMemo(
    () => [
      {
        title: '序号',
        key: 'idx',
        dataIndex: 'idx',
        width: Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42),
        fixed: 'left',
        align: 'center',
        render: (_: any, __: any, idx: number) => (curPage - 1) * PAGESIZE + idx + 1,
      },
      {
        title: '披露日期',
        key: 'disclosureDate',
        dataIndex: 'disclosureDate',
        sorter: true,
        defaultSortOrder: 'descend',
        width: 100,
        fixed: 'left',
        align: 'center',
        resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '产品名称',
        key: 'productName',
        dataIndex: 'productName',
        width: 239,
        align: 'left',
        fixed: 'left',
        resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
        wrapLine: true,
        render: (text: string) => <LineEllipsis text={text} line={2} />,
      },
      {
        title: '产品类型',
        key: 'productType',
        dataIndex: 'productType',
        width: 101,
        align: 'left',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '风险类型',
        key: 'riskType',
        dataIndex: 'riskType',
        width: 101,
        align: 'left',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '金额(万元)',
        key: 'amount',
        dataIndex: 'amount',
        width: 99,
        align: 'right',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '融资方',
        key: 'financeParty',
        dataIndex: 'financeParty',
        width: 239,
        align: 'left',
        resizable: true,
        wrapLine: true,
        render(text: { financeName: string; financeCode2: string }[], row: Record<string, any>) {
          if (!text || text.length === 0) return '-';

          return text.length === 1 ? (
            <CompanyLink type={'company'} code={text[0].financeCode2} text={text[0].financeName} />
          ) : (
            <LineEllipsis
              text={text.reduce((res, cur, i) => (res += ` ${i !== 0 ? '，' : ''}${cur.financeName}`), '')}
              line={2}
            />
          );
        },
      },
      {
        title: '最终融资方',
        key: 'finalFinanceParty',
        dataIndex: 'finalFinanceParty',
        width: 239,
        align: 'left',
        resizable: true,
        wrapLine: true,
        render(text: { finalFinanceName: string; finalFinanceCode2: string }[], row: Record<string, any>) {
          if (!text || text.length === 0) return '-';

          return text.length === 1 ? (
            <CompanyLink type={'company'} code={text[0].finalFinanceCode2} text={text[0].finalFinanceName} />
          ) : (
            text.reduce((res, cur, i) => (res += ` ${i !== 0 ? '，' : ''}${cur.finalFinanceName}`), '')
          );
        },
      },
      {
        title: '是否已偿还',
        key: 'hasRepay',
        dataIndex: 'hasRepay',
        width: 88,
        align: 'center',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '地区',
        key: 'area',
        dataIndex: 'area',
        width: 140,
        align: 'left',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
    ],
    [curPage],
  );

  return columns;
};

export default useColumns;
