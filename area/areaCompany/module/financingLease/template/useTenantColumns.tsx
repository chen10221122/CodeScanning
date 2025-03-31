import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import { TextWrap } from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import Ellipsis from '@/pages/finance/financingLease/components/ellipsis';
import { formatNumber } from '@/utils/format';

import { LesseeTags } from './const';

export default (handleNumModal: Function) => {
  return useMemoizedFn(({ curPage, restParams }: { curPage: number; restParams: Record<string, any> }) =>
    useMemo(
      () => [
        {
          title: '序号',
          align: 'center',
          fixed: 'left',
          width: 42 + Math.max((String(curPage * PAGESIZE).length - 2) * 13, 0),
          render: (_: any, __: any, idx: number) => (curPage - 1) * PAGESIZE + idx + 1,
        },
        {
          title: '承租人',
          dataIndex: 'lessee',
          key: 'lessee',
          align: 'left',
          fixed: 'left',
          width: 232,
          render(text: Record<string, any>[]) {
            const tags: string[] =
              text && text[0]?.leaserTag
                ? text[0].leaserTag.split(',').map((item: number) => LesseeTags[Number(item)] || '')
                : [];
            return (
              <CoNameAndTags
                code={text ? text[0]?.itcode2 : ''}
                name={text ? text[0]?.itname : ''}
                tag={
                  tags.length
                    ? // @ts-ignore
                      [...new Set(tags)]
                    : []
                }
                keyword={restParams.text}
                isFinancing
              />
            );
          },
        },
        {
          title: '新增租赁事件数',
          dataIndex: 'leaseEventNum',
          key: 'leaseEventNum',
          sorter: true,
          defaultSortOrder: 'descend',
          align: 'right',
          width: 132,
          render: (text: string, record: Record<string, any>) => (
            <span
              className="numberModal"
              onClick={() =>
                handleNumModal({
                  record,
                  type: 'leaseEventNum',
                  restParams,
                })
              }
            >
              <TextWrap>{formatNumber(text, 0) || '-'}</TextWrap>
            </span>
          ),
        },
        {
          title: '登记金额(万元)',
          dataIndex: 'financedMoney',
          key: 'financedMoney',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          align: 'right',
          width: 146,
          render: (txt: string) => <TextWrap>{txt || '-'}</TextWrap>,
        },
        {
          title: '出租人数量',
          dataIndex: 'leaserNum',
          key: 'leaserNum',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          align: 'right',
          width: 110,
          render: (text: string, record: Record<string, any>) => (
            <span
              className="numberModal"
              onClick={() =>
                handleNumModal({
                  record,
                  type: 'leaserNum',
                  restParams,
                })
              }
            >
              <TextWrap>{formatNumber(text, 0) || '-'}</TextWrap>
            </span>
          ),
        },
        {
          title: '注册资本',
          dataIndex: 'registerCapital',
          key: 'registerCapital',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          align: 'right',
          width: 154,
          render: (txt: string) => <TextWrap>{txt || '-'}</TextWrap>,
        },
        {
          title: '国标行业',
          // 门类-industry 大类-secondIndustry 中类-thirdIndustry 小类-fourThIndustry
          dataIndex: 'fourThIndustry',
          key: 'fourThIndustry',
          align: 'left',
          width: 220,
          render: getIndustryRender(),
        },
        {
          title: '所属地区',
          key: 'area',
          dataIndex: 'area',
          align: 'left',
          width: 189,
          render(text: string) {
            // const area = [];
            // if (record.province && record.province !== '-') area.push(handleProvinceAlias(text));
            // if (record.city && record.city !== '-') area.push(record.city);
            // if (record.county && record.county !== '-') area.push(record.county);
            return text ? (
              <TextWrap showPopContent={text}>
                <Ellipsis
                  text={text}
                  getPopupContainer={document.getElementById('area-company-承租人') as HTMLDivElement}
                />
              </TextWrap>
            ) : (
              '-'
            );
          },
        },
      ],
      [curPage, restParams],
    ),
  );
};
