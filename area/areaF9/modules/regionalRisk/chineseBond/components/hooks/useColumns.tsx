import { memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { getConfig } from '@/app';
import AddBtn from '@/components/combinationDropdownSelect/addBtn';
import { QuestionIcon } from '@/pages/default/bondDefault/modules/defaultOffshore/components';
import {
  NORMAL_PADDING,
  NORMAL_WIDTH,
  ONE_NUM_WIDTH,
  PAGE_SIZE,
} from '@/pages/default/bondDefault/modules/defaultOffshore/constants';
import { useLinkToF9, useLinkToOverview } from '@/pages/default/bondDefault/modules/defaultOffshore/hooks/useLinkToF9';
import { highlight } from '@/utils/dom';

export enum EPAGETYPE {
  BOND = 'bond' /** 债券页 */,
  SUBJECT = 'subject' /** 主体页 */,
}

/**
 * [境外违约债券]
 * sort=key1:asc,key2:desc
 * (asc:正向排序,desc:反向排序)
 */
const bondSortMap = new Map<string, string>([
  ['BD0355_006', 'defaultDate'],
  ['BD0355_002', 'defaultAmount'],
  ['BD0277_013', 'issueScale'] /** 发行规模 */,
  ['BD0277_023', 'latestCouponRate'] /** 最新息票利率 */,
  ['BD0277_015', 'valueDate'] /** 起息日 */,
  ['BD0277_016', 'cashDate'] /** 兑付日 */,
]);
/**
 * [境外违约主体]
 * sortKey: 'xxx'
 * sortOrder: 1正序(从小到大)  -1(从大到小,默认值)
 */
const subjectSortMap = new Map<string, string>([
  ['min_date', 'firstDefaultDate'],
  ['count_itCode', 'defaultNumber'],
  ['sum_itCode', 'defaultAmount'],
]);

type TProps = {
  pageType?: EPAGETYPE;
  openModal?: (itcode: string, defaultEntity: string) => void;
  params: any;
  getContainer?: () => HTMLElement;
  onCopyBtnClick?: (key: string, obj: Object) => void;
};

const getWidth = (from: number) => {
  const biggestNum = from + PAGE_SIZE;
  return biggestNum <= PAGE_SIZE ? NORMAL_WIDTH : biggestNum.toString().length * ONE_NUM_WIDTH + NORMAL_PADDING + 2;
};

export const useColumns = ({ params, getContainer, onCopyBtnClick, pageType, openModal }: TProps) => {
  const linkF9 = useLinkToF9();
  const companyRender = useMemoizedFn((codeField: string) => {
    return (text: string, record: any) => {
      return (
        <ClampText
          code={record?.[codeField]}
          title={text}
          onClick={() => {
            if (record?.[codeField]) linkF9(record?.[codeField]);
            return;
          }}
        >
          {text ? highlight(text, params?.text) : '-'}
        </ClampText>
      );
    };
  });
  const linkToOverview = useLinkToOverview();
  /** 计算排序字段对应 order */
  const sortField = useMemoizedFn((dataIndex: string) => {
    if (params.sort) {
      /** exp : sort=key1:asc  */
      const [field, order] = params?.sort?.split(':') ?? ['', ''];
      if (bondSortMap.get(field) === dataIndex) {
        switch (order) {
          case 'desc':
            return 'descend';
          case 'asc':
            return 'ascend';
          default:
            return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  });

  const nowrapRender = useMemoizedFn((text) => {
    return <div style={{ whiteSpace: 'nowrap' }}>{text ? highlight(text, params?.text) : '-'}</div>;
  });

  const ISINClick = useMemoizedFn(() => {
    onCopyBtnClick?.('ISIN', { dollarBondScene: 'co' });
  });

  const issuerNameClick = useMemoizedFn(() => {
    onCopyBtnClick?.('issuerName', { dollarBondScene: 'company' });
  });
  const defaultDetail = useMemoizedFn((text: string, record: any) => (
    <DetailStyle onClick={() => openModal!(record?.itCode, record?.defaultEntity)} title={text + '只'}>
      {text + '只'}
    </DetailStyle>
  ));

  const subjectIssuerNameClick = useMemoizedFn(() => {
    onCopyBtnClick?.('defaultEntity', { dollarBondScene: 'company' });
  });
  const subjectSortField = useMemoizedFn((dataIndex: string) => {
    if (params.sortKey && params.sortOrder) {
      const [field, order] = [params?.sortKey, params?.sortOrder];
      if (subjectSortMap.get(field) === dataIndex) {
        switch (order) {
          case '1':
            return 'ascend';
          case '-1':
            return 'descend';
          default:
            return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  });
  const bondColumns = [
    {
      title: '序号',
      width: getWidth(params.from),
      align: 'center',
      fixed: 'left',
      key: 'num',
      className: 'pdd-8',
      render: (_: any, __: any, idx: number) => params.from + idx + 1,
      resizable: false,
    },
    {
      title: (
        <>
          ISIN代码
          {getContainer ? <AddBtn text={'ISIN代码'} container={getContainer} onClickWithHasPower={ISINClick} /> : null}
        </>
      ),
      dataIndex: 'ISIN',
      fixed: 'left',
      width: 121,
      align: 'left',
      render: nowrapRender,
      resizable: { max: 200 },
    },
    {
      title: '债券全称',
      dataIndex: 'bondFullName',
      fixed: 'left',
      width: 223,
      align: 'left',
      resizable: { max: Math.max(580 - getWidth(params.from), 223), min: 230 },
      render: (text: string, row: Record<string, any>) =>
        row?.isHaveF9 === '1' && !getConfig((d) => d.components.preventChineseDollarBondsJump) ? (
          <LinkToF9 title={text || row?.bondFullName} hasHover={true} onClick={() => linkToOverview(row?.ISIN)}>
            {highlight(text || row?.bondFullName) || '-'}
          </LinkToF9>
        ) : (
          text || row?.bondFullName
        ),
    },
    {
      title: '违约日期',
      dataIndex: 'defaultDate',
      width: 99,
      align: 'center',
      sorter: true,
      sortOrder: sortField('defaultDate'),
      render: normalRender,
      resizable: false,
    },
    {
      title: (
        <>
          信用主体
          {getContainer ? (
            <AddBtn text={'信用主体'} container={getContainer} onClickWithHasPower={issuerNameClick} />
          ) : null}
        </>
      ),
      dataIndex: 'parentCompany',
      width: 223,
      align: 'left',
      resizable: true,
      render: companyRender('parentCompanyItCode'),
    },
    { title: '违约原因', dataIndex: 'defaultReason', width: 116, align: 'left', render: normalRender, resizable: true },
    {
      title: (
        <>
          违约金额(亿美元)
          <QuestionIcon
            content="按照违约当日汇率换算"
            styles={{ margin: '0 0 0 6px', position: 'relative', top: '2px' }}
          />
        </>
      ),
      resizable: true,
      dataIndex: 'defaultAmount',
      width: 160,
      align: 'right',
      sorter: true,
      sortOrder: sortField('defaultAmount'),
      render: normalRender,
    },
    {
      title: '违约金额币种',
      dataIndex: 'defaultAmountCurrency',
      width: 105,
      resizable: true,
      align: 'center',
      render: normalRender,
    },
    {
      title: '发行人',
      dataIndex: 'issuerName',
      width: 223,
      align: 'left',
      resizable: true,
      render: companyRender('issuerItCode'),
    },
    {
      title: '发行规模(亿元)',
      dataIndex: 'issueScale',
      width: 130,
      sorter: true,
      resizable: true,
      sortOrder: sortField('issueScale'),
      align: 'right',
      render: normalRender,
    },
    {
      title: '起息日',
      resizable: true,
      dataIndex: 'valueDate',
      width: 99,
      sorter: true,
      sortOrder: sortField('valueDate'),
      align: 'center',
      render: normalRender,
    },
    {
      title: '最新票息利率(%)',
      dataIndex: 'latestCouponRate',
      width: 142,
      sorter: true,
      resizable: true,
      sortOrder: sortField('latestCouponRate'),
      align: 'right',
      render: normalRender,
    },
    {
      title: '兑付日',
      dataIndex: 'cashDate',
      width: 96,
      sorter: true,
      resizable: true,
      sortOrder: sortField('cashDate'),
      align: 'center',
      render: normalRender,
    },
    {
      title: '企业性质',
      dataIndex: 'enterpriseNature',
      width: 101,
      align: 'left',
      render: withoutWordBreakRender,
      resizable: true,
    },
    { title: '主体评级', dataIndex: 'entityRate', width: 85, align: 'center', render: normalRender, resizable: true },
    {
      title: '行业',
      dataIndex: 'industry',
      width: 102,
      align: 'left',
      render: withoutWordBreakRender,
      resizable: true,
    },
    {
      title: '所属地区',
      dataIndex: 'district',
      width: 155,
      align: 'left',
      render: normalRender,
    },
  ];
  const subjectColumns = [
    {
      title: '序号',
      width: getWidth(params.from),
      align: 'center',
      key: 'nums',
      fixed: 'left',
      resizable: false,
      className: 'pdd-8',
      render(_: any, __: any, idx: number) {
        return params.from + idx + 1;
      },
    },
    {
      title: (
        <>
          违约主体
          {getContainer ? (
            <AddBtn text={'违约主体'} container={getContainer} onClickWithHasPower={subjectIssuerNameClick} />
          ) : null}
        </>
      ),
      dataIndex: 'defaultEntity',
      width: 280,
      align: 'left',
      resizable: { max: 780 - Math.max(getWidth(params.from), 42), min: 300 },
      fixed: 'left',
      render: companyRender('itCode'),
    },
    {
      title: '首次违约日期',
      dataIndex: 'firstDefaultDate',
      width: 120,
      align: 'center',
      sorter: true,
      resizable: true,
      sortOrder: subjectSortField('firstDefaultDate'),
      render: normalRender,
    },
    {
      title: '违约只数',
      dataIndex: 'defaultNumber',
      width: 97,
      align: 'right',
      sorter: true,
      resizable: false,
      sortOrder: subjectSortField('defaultNumber'),
      render: defaultDetail,
    },
    {
      title: (
        <>
          违约金额(亿美元)
          <QuestionIcon
            content="按照违约当日汇率换算"
            styles={{ margin: '0 0 0 4px', position: 'relative', top: '1px' }}
          />
        </>
      ),
      dataIndex: 'defaultAmount',
      width: 163,
      align: 'right',
      sorter: true,
      resizable: true,
      sortOrder: subjectSortField('defaultAmount'),
      render: normalRender,
    },
    { title: '主体评级', dataIndex: 'entityRate', width: 115, align: 'center', render: normalRender, resizable: true },
    {
      title: '行业',
      dataIndex: 'industry',
      width: 102,
      align: 'left',
      render: withoutWordBreakRender,
      resizable: true,
    },
    {
      title: '企业性质',
      dataIndex: 'enterpriseProperty',
      width: 141,
      align: 'left',
      render: withoutWordBreakRender,
      resizable: true,
    },
    {
      title: '所属地区',
      dataIndex: 'district',
      width: 155,
      align: 'left',
      resizable: true,
      render: normalRender,
    },
    { title: '', width: '', dataIndex: 'blank' },
  ];
  return pageType === EPAGETYPE.BOND ? bondColumns : subjectColumns;
};

const normalRender = (text: string | null | undefined) => {
  return <span title={text ? text : '-'}>{text ? text : '-'}</span>;
};

const withoutWordBreakRender = (text: string | null | undefined) => {
  return <WithoutBreak title={text ? text : '-'}>{text ? text : '-'}</WithoutBreak>;
};

const DetailStyle = styled.div`
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  color: #025cdc;
  line-height: 20px;
  &:hover {
    text-decoration: underline;
    color: #025cdc;
  }
`;

export const ClampText = memo(styled.a<{ code?: string }>`
  ${({ code }) => {
    if (code) {
      return `
          color: #025CDC;
          cursor: pointer;
          display:block;
              overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
          &:hover {
            text-decoration: underline;
            color: #025CDC;
          }
        `;
    }
  }}
`);
export const LinkToF9 = styled.div<{ width?: number; hasHover?: boolean; minWidth?: number }>`
  font-size: 13px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ hasHover }) =>
    hasHover ? `color: #025cdc; cursor: pointer; :hover { text-decoration: underline; }` : `color: #141414;`}
`;
export const WithoutBreak = styled.div`
  white-space: nowrap;
`;
