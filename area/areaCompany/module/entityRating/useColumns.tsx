import { useCreation } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { LinkToFile } from '@/pages/area/areaCompany/components/tableCpns/openOrDownloadFiles';
import { useLinkF9 } from '@/pages/detail/modules/enterprise/businessWarning/modules/ipr/hooks';
import { highlight } from '@/utils/dom';

const ratingOutlook = new Map([
  ['1', '正面'],
  ['2', '稳定'],
  ['3', '负面'],
  ['4', '列入评级观察(可能调高)'],
  ['5', '列入评级观察(可能调低)'],
  ['6', '列入评级观察(走势不明)'],
  ['7', '待决'],
]);

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
        width: getWidth(condition.skip),
        render: (_: any, __: any, i: number) => {
          return <Text>{condition.skip + i + 1}</Text>;
        },
      },
      {
        title: '发债主体',
        dataIndex: 'entityName',
        align: 'left',
        fixed: 'left',
        resizable: { max: Math.max(780 - getWidth(condition.from), 247), min: 247 },
        width: 247,
        render: (_: any, raw: any, i: number) => {
          return (
            <SingeLine code={raw?.entityCode} onClick={() => link(raw?.entityCode)}>
              {highlight(_, condition.keyword) ?? '-'}
            </SingeLine>
          );
        },
      },
      {
        title: '评级日期',
        dataIndex: 'rantingDate',
        align: 'center',
        width: 92,
        resizable: true,
        render: (_: any, __: any, i: number) => {
          return <Text>{_ ? dayjs(_).format('YYYY-MM-DD') : '-'}</Text>;
        },
      },
      {
        title: '主体评级',
        dataIndex: 'thisRaiting',
        align: 'center',
        resizable: true,
        width: 78,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '评级展望',
        dataIndex: 'raitingOutlook',
        resizable: true,
        align: 'left',
        width: 182,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{ratingOutlook.get(_) ?? '-'}</WrapLine>;
        },
      },
      {
        title: '上次评级',
        dataIndex: 'lastRaiting',
        resizable: true,
        align: 'center',
        width: 78,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '评级方向',
        dataIndex: 'rateTrend',
        resizable: true,
        align: 'center',
        width: 78,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '评级公司',
        dataIndex: 'ragingOrgSimpleName',
        resizable: true,
        align: 'left',
        width: 127,
        render: (_: any, raw: any, i: number) => {
          return (
            <SingeLine code={raw?.raitingOrgCode} onClick={() => link(raw?.raitingOrgCode)}>
              {_ ?? '-'}
            </SingeLine>
          );
        },
      },
      {
        title: '披露日期',
        dataIndex: 'declaredate',
        resizable: true,
        align: 'center',
        width: 115,
        render: (_: any, __: any, i: number) => {
          const path = __?.pdfPath;
          return (
            <Pdf>
              <span>{_ ? dayjs(_).format('YYYY-MM-DD') : '-'}</span>{' '}
              <span>{path ? <LinkToFile originalText={path} /> : <span></span>}</span>
            </Pdf>
          );
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
        dataIndex: 'swIndustryTopLevel',
        resizable: true,
        align: 'left',
        width: 102,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '所属地区',
        dataIndex: 'distinct',
        resizable: true,
        align: 'left',
        width: 157,
        render: (_: any, __: any, i: number) => {
          return <WrapLine>{_ ?? '-'}</WrapLine>;
        },
      },
      {
        title: '是否债券担保人',
        dataIndex: 'isguarantee',
        resizable: true,
        align: 'center',
        width: 120,
        render: (_: any, __: any, i: number) => {
          return <Text>{_ === '1' ? '是' : _ ? '否' : '-'}</Text>;
        },
      },
      {
        title: '是否地方融资平台',
        dataIndex: 'islgfp',
        resizable: true,
        align: 'center',
        width: 133,
        render: (_: any, __: any, i: number) => {
          return <Text>{_ === '1' ? '是' : _ ? '否' : '-'}</Text>;
        },
      },
      { title: '', width: '', dataIndex: 'blank', key: 'blank' },
    ];
    if (page === 'oversea') return _columns.filter(filterOverseas);
    return _columns;
  }, [condition, page]);
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

const Pdf = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
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
