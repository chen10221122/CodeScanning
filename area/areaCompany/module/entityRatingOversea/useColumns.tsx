import { useCreation } from 'ahooks';
import styled from 'styled-components';

import { useLinkF9 } from '@/pages/detail/modules/enterprise/businessWarning/modules/ipr/hooks';
import { highlight } from '@/utils/dom';

const enterpriseNature = new Map([
  ['1', '央企'],
  ['2', '地方国企'],
  ['3', '其他国企'],
  ['4', '民营企业'],
  ['5', '集体企业'],
  ['6', '外资企业'],
  ['7', '中外合资企业'],
]);
const getWidth = (from: number) => {
  const biggestNum = from + 50;
  return biggestNum <= 50 ? 44 : biggestNum.toString().length * 8 + 24 + 2;
};
export default ({ page, condition }: { page: string; condition: any }) => {
  const link = useLinkF9();
  return useCreation(() => {
    const _columns = [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        fixed: 'left',
        className: 'pdd-8',
        width: getWidth(condition.from),
        render: (_: any, __: any, i: number) => {
          return <Text>{condition.from + i + 1}</Text>;
        },
      },
      {
        title: '发债主体',
        dataIndex: 'entityName',
        resizable: { max: Math.max(780 - getWidth(condition.from), 247), min: 247 },
        align: 'left',
        fixed: 'left',
        width: 247,
        render: (_: any, raw: any, i: number) => {
          return (
            <SingeLine code={raw?.entityCode} onClick={() => link(raw?.entityCode)}>
              {highlight(_, condition.text) ?? '-'}
            </SingeLine>
          );
        },
      },
      {
        title: '评级日期',
        dataIndex: 'ratingDate',
        resizable: true,
        align: 'center',
        width: 92,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '评级类型',
        dataIndex: 'ratingType',
        resizable: true,
        align: 'center',
        width: 92,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '主体评级',
        dataIndex: 'thisRating',
        resizable: true,
        align: 'center',
        width: 78,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '评级展望',
        dataIndex: 'ratingOutlook',
        resizable: true,
        align: 'left',
        width: 182,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '上次评级',
        dataIndex: 'lastRating',
        resizable: true,
        align: 'center',
        width: 78,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '评级方向',
        dataIndex: 'direction',
        resizable: true,
        align: 'center',
        width: 78,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '评级公司',
        dataIndex: 'ratingOrgName',
        resizable: true,
        align: 'left',
        width: 127,
        render: (_: any, raw: any, i: number) => {
          return (
            <SingeLine code={raw?.ratingOrgCode} onClick={() => link(raw?.ratingOrgCode)}>
              {_ ?? '-'}
            </SingeLine>
          );
        },
      },
      {
        title: '披露日期',
        dataIndex: 'declareDate',
        resizable: true,
        align: 'center',
        width: 108,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '企业性质',
        dataIndex: 'enterpriseNature',
        resizable: true,
        align: 'left',
        width: 104,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{enterpriseNature.get(_) ?? '-'}</WrapLine>;
        },
      },
      {
        title: '申万行业',
        dataIndex: 'swIndustry',
        resizable: true,
        align: 'left',
        width: 102,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '所属地区',
        dataIndex: 'district',
        resizable: true,
        align: 'left',
        width: 157,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '是否债券担保人',
        dataIndex: 'index',
        resizable: true,
        align: 'center',
        width: 114,
        render: (_: any, __: any, i: number) => {
          return 1;
        },
      },
      {
        title: '是否城投平台',
        dataIndex: 'localFinancing',
        resizable: true,
        align: 'center',
        width: 127,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      { title: '', width: '', dataIndex: 'blank', key: 'blank' },
    ];
    if (page === 'oversea') return _columns.filter(filterOverseas);
    return _columns;
  }, [page, condition]);
};

const filterOverseas = (i: Record<string, any>) => {
  return i.title !== '是否债券担保人';
};

const SingeLine = styled.div<{ code: string | undefined }>`
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  white-space: nowrap;

  ${({ code }) =>
    code
      ? `
  color: #025CDC;
  &:hover {
    text-decoration:underline;
    cursor: pointer;
  }
  `
      : ''}
`;

const Text = styled.span`
  color: #141414;
`;

export const WrapLine = styled.div`
  color: #141414;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 1 !important;
  -webkit-box-orient: vertical !important;
  box-sizing: border-box;
`;
