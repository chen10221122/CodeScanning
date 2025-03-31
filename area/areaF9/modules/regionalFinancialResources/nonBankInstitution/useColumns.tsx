import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Image } from '@/components/layout';
import { getExternalLink } from '@/utils/format';

import MultipleTag from '../common/mutipleTag';
import * as S from '../common/style';
import { useCtx } from '../context';

export default function useColumns() {
  const {
    state: { modalRequestParams, tableCondition },
  } = useCtx();

  const columns = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        className: 'pdd-8',
        fixed: 'left',
        align: 'center',
        width: Math.max(`${Number(modalRequestParams?.skip)}`.length * 10 + 22, 42),
      },
      {
        title: <div style={{ textAlign: 'center' }}>机构名称</div>,
        dataIndex: 'itName',
        width: 232,
        fixed: 'left',
        align: 'left',
        className: 'title-center',
        resizable: { max: 940 - Math.max(`${Number(modalRequestParams?.skip)}`.length * 10 + 22, 42) },
        wrapLine: true,
        render: (text: string, row: any) => {
          const data = {
            code: row.enterpriseInfo?.itCode,
            name: row.enterpriseInfo?.itName,
            blueTags: row.enterpriseInfo?.tags,
          };
          return <MultipleTag data={data} searchValue={tableCondition.text} />;
        },
      },
      /*  {
        title: <span>机构类型</span>,
        dataIndex: 'organizationType',
        width: 116,
        resizable: true,
        wrapLine: true,
        sorter: true,
        sortDirections: ['ascend', 'descend'],
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.WrapLine>{content}</S.WrapLine>;
        },
      }, */
      {
        title: <span>法定代表人</span>,
        dataIndex: 'legalRepresentative',
        width: 132,
        resizable: true,
        sorter: true,
        wrapLine: true,
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return content;
        },
      },
      {
        title: <span>注册资本</span>,
        dataIndex: 'registerCapital',
        width: 134,
        resizable: true,
        align: 'right',
        sorter: true,
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.WrapLine>{content}</S.WrapLine>;
        },
      },
      {
        title: <span>成立日期</span>,
        dataIndex: 'establishDate',
        width: 92,
        resizable: true,
        align: 'center',
        sorter: true,
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.WrapLine>{content}</S.WrapLine>;
        },
      },
      {
        title: <div style={{ textAlign: 'center' }}>注册地</div>,
        dataIndex: 'registerArea',
        width: 189,
        resizable: true,
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.WrapLine>{content}</S.WrapLine>;
        },
      },
      {
        title: <span>主体评级</span>,
        dataIndex: 'mainRating',
        width: 105,
        align: 'center',
        sorter: true,
        resizable: true,
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return (
            <S.WrapLine>
              <span>{content}</span>
              {row.url ? (
                <Link to={getExternalLink(row.url, true)}>
                  <Image height={14} src={require('./PDF@2x.png')} style={{ marginLeft: 4 }} />
                </Link>
              ) : null}
            </S.WrapLine>
          );
        },
      },
      {
        title: <span>报告期</span>,
        dataIndex: 'reportPeriod',
        width: 87,
        resizable: true,
        align: 'center',
        sorter: true,
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.WrapLine>{content}</S.WrapLine>;
        },
      },
      {
        title: <span>营业收入</span>,
        dataIndex: 'operatingRevenue',
        width: 92,
        resizable: true,
        align: 'right',
        sorter: true,
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.WrapLine>{content}</S.WrapLine>;
        },
      },
      {
        title: <span>总资产</span>,
        dataIndex: 'totalAsset',
        width: 95,
        resizable: true,
        align: 'right',
        sorter: true,
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.WrapLine>{content}</S.WrapLine>;
        },
      },
      {
        title: <span>净利润</span>,
        dataIndex: 'netProfit',
        width: 92,
        resizable: true,
        align: 'right',
        sorter: true,
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.WrapLine>{content}</S.WrapLine>;
        },
      },
      {
        tittle: '',
        resizable: false,
      },
    ],
    [modalRequestParams?.skip, tableCondition.text],
  );

  return {
    columns,
  };
}
