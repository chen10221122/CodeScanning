import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Popover, message } from 'antd';

import AddBtn from '@/components/combinationDropdownSelect/addBtn';
import { Image } from '@/components/layout';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import CompanyLink from '@/pages/area/areaFinancingBoard/components/Company/CompanyLink';
import CompanyWithSpecialTags from '@/pages/area/areaFinancingBoard/components/Company/CompanyWithSpecialTags';
import type { DetailColumnsProps } from '@/pages/area/areaFinancingBoard/types';
import { LinkToFile } from '@/pages/bond/overdue/components/LinkToFile';

export default function useColumns({ curPage, tableRef, data }: DetailColumnsProps) {
  const onCopyBtnClick = useMemoizedFn((key) => {
    navigator.clipboard.writeText(data.map((o: Record<string, string>) => o[key]).join('\n'));
    message.success('复制成功');
  });

  const columns = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        fixed: 'left',
        width: Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42),
        className: 'pdd-8',
        render: (_: any, __: any, i: number) => {
          return (curPage - 1) * PAGESIZE + i + 1;
        },
      },
      {
        title: (
          <span>
            {'公告日期'}
            <Popover
              placement="bottom"
              arrowPointAtCenter
              overlayClassName="factoring_tip_special"
              content={<div> 信源公告的披露日期 </div>}
            >
              <Image
                width={12}
                height={12}
                style={{ cursor: 'pointer', position: 'relative', top: '-1px', marginLeft: '4px' }}
                src={require('../images/question@2x.png')}
              ></Image>
            </Popover>
          </span>
        ),
        sorter: true,
        defaultSortOrder: 'descend',
        align: 'center',
        key: 'reportDate',
        dataIndex: 'reportDate',
        width: 112,
        fixed: 'left',
        resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: (
          <>
            债务人
            <AddBtn
              text={'债务人'}
              container={() => tableRef.current}
              onClickWithHasPower={() => {
                onCopyBtnClick('debtor');
              }}
            />
          </>
        ),
        align: 'left',
        key: 'debtor',
        dataIndex: 'debtor',
        width: 232,
        fixed: 'left',
        resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
        wrapLine: true,
        render: (text: string, row: any) => {
          return (
            <CompanyWithSpecialTags
              type={'company'}
              data={{
                ...row,
                code: row.debtorItCode2,
                name: text,
                tags: row.debtorTag,
              }}
            />
          );
        },
      },
      {
        title: '披露方',
        align: 'left',
        key: 'disclosureParty',
        dataIndex: 'disclosureParty',
        width: 193,
        resizable: true,
        wrapLine: true,
        render: (text: string, row: any) => {
          return <CompanyLink type={'company'} code={row?.disclosurePartyItCode2} text={text} />;
        },
      },
      {
        title: '来源',
        align: 'center',
        key: 'source',
        dataIndex: 'source',
        width: 55,
        resizable: true,
        wrapLine: true,
        render(text: string, record: any, __: number) {
          return <>{text ? <LinkToFile originalText={text} /> : '-'}</>;
        },
      },
      {
        title: '债权人',
        align: 'left',
        key: 'creditor',
        dataIndex: 'creditor',
        width: 184,
        resizable: true,
        wrapLine: true,
        render: (text: string, row: any, __: number) => {
          return <CompanyLink type={'company'} code={row?.creditorItCode2} text={text} />;
        },
      },
      {
        title: '逾期金额(万元)',
        align: 'right',
        key: 'overdueAmount',
        dataIndex: 'overdueAmount',
        width: 147,
        sorter: true,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '债务类型',
        align: 'left',
        key: 'debtType',
        dataIndex: 'debtType',
        width: 120,
        sorter: true,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '逾期起始日',
        align: 'center',
        key: 'overdueStartDate',
        dataIndex: 'overdueStartDate',
        width: 109,
        sorter: true,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '逾期本金(万元)',
        align: 'right',
        key: 'overduePrincipal',
        dataIndex: 'overduePrincipal',
        width: 129,
        sorter: true,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '逾期利息(万元)',
        align: 'right',
        key: 'overdueInterest',
        dataIndex: 'overdueInterest',
        width: 129,
        sorter: true,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '行业',
        align: 'left',
        key: 'industryStr',
        dataIndex: 'industryStr',
        width: 134,
        resizable: true,
        wrapLine: true,
        render: (text?: string) => text || '-',
      },
      {
        title: '企业类型',
        align: 'center',
        key: 'companyType',
        dataIndex: 'companyType',
        width: 92,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '所属地区',
        align: 'left',
        key: 'area',
        dataIndex: 'area',
        width: 143,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: (
          <span>
            {'截止日期'}
            <Popover
              placement="bottomRight"
              overlayClassName="special_space factoring_tip_special "
              content={
                <div>
                  {' '}
                  公告披露的截止日期。若为定报，未披露截止日期时，则默认为定报对应的报告期；若为日常公告，未明确披露截止日期时，则默认为公告日期。{' '}
                </div>
              }
            >
              <Image
                width={12}
                height={12}
                style={{ cursor: 'pointer', position: 'relative', top: '-1px', marginLeft: '4px' }}
                src={require('../images/question@2x.png')}
              ></Image>
            </Popover>
          </span>
        ),
        align: 'center',
        key: 'endDate',
        dataIndex: 'endDate',
        width: 114,
        sorter: true,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
    ],
    [curPage, tableRef, onCopyBtnClick],
  );

  return columns;
}
