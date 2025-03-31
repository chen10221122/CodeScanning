import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import CommonLink from '@/app/components/CommonLink';
import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import { TextWrap } from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import Ellipsis from '@/pages/finance/financingLease/components/ellipsis';
import PDF_image from '@/pages/finance/financingLeaseNew/images/PDF.svg';
import { formatNumber, getExternalLink } from '@/utils/format';

import { LeaserTags } from './const';

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
          title: '出租人',
          dataIndex: 'leaser',
          key: 'leaser',
          align: 'left',
          fixed: 'left',
          width: 232,
          render(text: Record<string, any>[]) {
            const tags: string[] =
              text && text[0]?.leaserTag ? text[0].leaserTag.split(',').map((item: string) => LeaserTags[+item]) : [];
            return (
              <CoNameAndTags
                code={text ? text[0]?.itcode2 : ''}
                name={text ? text[0]?.itname : ''}
                tag={tags.length ? Array.from(new Set(tags)) : []}
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
          width: 128,
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '承租人数量',
          dataIndex: 'lesseeNum',
          key: 'lesseeNum',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          align: 'right',
          width: 106,
          render: (text: string, record: Record<string, any>) =>
            text ? (
              <span
                className="numberModal"
                onClick={() =>
                  handleNumModal({
                    record,
                    type: 'lesseeNum',
                    restParams,
                  })
                }
              >
                <TextWrap>{formatNumber(text, 0) || '-'}</TextWrap>
              </span>
            ) : (
              '-'
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
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '信用评级',
          dataIndex: 'creditRating',
          key: 'creditRating',
          align: 'center',
          width: 94,
          render: (text: string, record: Record<string, any>) => (
            <div className="creditRating">
              <span title={text || ''}>{text || '-'}</span>
              {record?.creditRatingAddress && (
                <CommonLink to={getExternalLink(record?.creditRatingAddress, true)}>
                  <img src={PDF_image} alt="" />
                </CommonLink>
              )}
            </div>
          ),
        },
        {
          title: '出租人类型',
          dataIndex: 'leaserType',
          key: 'leaserType',
          align: 'center',
          width: 106,
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '出租人性质',
          dataIndex: 'leaserProperty',
          key: 'leaserProperty',
          align: 'center',
          width: 106,
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '所属地区',
          dataIndex: 'area1',
          key: 'area1',
          align: 'left',
          width: 189,
          render(text: string) {
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
