import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import MultipleTag from '../common/mutipleTag';
import * as S from '../common/style';
import { useCtx } from '../context';

const typeMap = new Map<string, string>([
  ['政策性银行', '1'],
  ['国有银行', '2'],
  ['股份制银行', '3'],
  ['城商行', '4'],
  ['农商行', '5'],
  ['农信社', '6'],
  ['村镇银行', '7'],
  ['民营银行', '8'],
  ['其他银行', '9'],
]);

export default function useColumns() {
  const history = useHistory();
  const {
    state: { modalRequestParams, tableCondition },
    update,
  } = useCtx();

  /** 配置弹窗请求参数 */
  const handleModalOpenClick = useMemoizedFn((bankTypeName, title, bankType, branchType, itCode) => {
    update((d) => {
      d.modalVisible = true;
      d.modalTitle = `${bankTypeName}_${title}明细`;
      d.sheetNames = { '0': title };
      d.modalRequestParams = {
        ...modalRequestParams,
        code: itCode,
        branchType: branchType,
        moduleType: 2,
        skip: 0,
        sort: '',
      };
    });
  });

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
        title: '银行名称',
        dataIndex: 'itName',
        width: 232,
        fixed: 'left',
        align: 'left',
        resizable: { max: 940 - Math.max(`${Number(modalRequestParams?.skip)}`.length * 10 + 22, 42) },
        sorter: true,
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
      {
        title: <span>分类</span>,
        dataIndex: 'organizationType',
        width: 80,
        resizable: true,
        align: 'center',
        sorter: true,
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.Ellipsis>{content}</S.Ellipsis>;
        },
      },
      {
        title: <span>银行类型</span>,
        dataIndex: 'bankType',
        width: 92,
        resizable: true,
        align: 'center',
        sorter: true,
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.Ellipsis>{content}</S.Ellipsis>;
        },
      },
      {
        title: <span>区域内一级分行数量</span>,
        dataIndex: 'firstLevelBranchCount',
        width: 157,
        resizable: true,
        align: 'right',
        sorter: true,
        render: (text: number, row: any) => {
          return (
            <DigitalWrap>
              <span
                className={cn({ blue: text !== 0 })}
                onClick={() => {
                  if (row.firstLevelBranchCount !== 0) {
                    handleModalOpenClick(
                      row.enterpriseInfo?.itName,
                      '一级分行',
                      typeMap.get(row.bankType),
                      2,
                      row.enterpriseInfo?.itCode,
                    );
                  }
                }}
              >
                {text}
              </span>
            </DigitalWrap>
          );
        },
      },
      {
        title: <span>区域内二级分行数量</span>,
        dataIndex: 'secondLevelBranchCount',
        width: 157,
        resizable: true,
        align: 'right',
        sorter: true,
        render: (text: number, row: any) => {
          return (
            <DigitalWrap>
              <span
                className={cn({ blue: text !== 0 })}
                onClick={() => {
                  if (row.secondLevelBranchCount !== 0) {
                    handleModalOpenClick(
                      row.enterpriseInfo?.itName,
                      '二级分行',
                      typeMap.get(row.bankType),
                      3,
                      row.enterpriseInfo?.itCode,
                    );
                  }
                }}
              >
                {text}
              </span>
            </DigitalWrap>
          );
        },
      },
      {
        title: <span>区域内其他营业网点数量</span>,
        dataIndex: 'otherBusinessOutletsCount',
        width: 185,
        resizable: true,
        align: 'right',
        sorter: true,
        render: (text: number, row: any) => {
          return (
            <DigitalWrap>
              <span
                className={cn({ blue: text !== 0 })}
                onClick={() => {
                  if (row.otherBusinessOutletsCount !== 0) {
                    handleModalOpenClick(
                      row.enterpriseInfo?.itName,
                      '其他营业网点',
                      typeMap.get(row.bankType),
                      4,
                      row.enterpriseInfo?.itCode,
                    );
                  }
                }}
              >
                {text}
              </span>
            </DigitalWrap>
          );
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
          return <S.Ellipsis>{content}</S.Ellipsis>;
        },
      },
      {
        title: <span>法定代表人</span>,
        dataIndex: 'legalRepresentative',
        width: 132,
        resizable: true,
        align: 'left',
        sorter: true,
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.Ellipsis>{content}</S.Ellipsis>;
        },
      },
      {
        title: <span>金融许可编码</span>,
        dataIndex: 'financialLicenseCode',
        width: 139,
        resizable: true,
        align: 'center',
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.Ellipsis>{content}</S.Ellipsis>;
        },
      },
      {
        title: <div style={{ textAlign: 'center' }}>注册地</div>,
        dataIndex: 'registerArea',
        width: 189,
        resizable: true,
        align: 'left',
        render: (text: number, row: any) => {
          const content = text ? text : '-';
          return <S.Ellipsis>{content}</S.Ellipsis>;
        },
      },
      {
        tittle: '',
        resizable: false,
      },
    ],
    [handleModalOpenClick, modalRequestParams?.skip, tableCondition.text],
  );

  const modalColumns = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        className: 'pdd-8',
        fixed: 'left',
        align: 'center',
        width: Math.max(`${Number(modalRequestParams?.skip)}`.length * 10 + 22, 42),
      },
      {
        title: '分支机构名称',
        dataIndex: 'enterpriseInfo',
        width: 193,
        render: (text: string, row: any) => {
          return (
            <S.EnterpriseWrap
              className={cn({ link: !!row.enterpriseInfo.itCode })}
              onClick={() => {
                if (row.enterpriseInfo.itCode) {
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE),
                      urlQueriesSerialize({ type: 'company', code: row.enterpriseInfo.itCode }),
                      '#企业速览',
                    ),
                  );
                }
              }}
            >
              {row.enterpriseInfo.itName}
            </S.EnterpriseWrap>
          );
        },
      },
      {
        title: '成立日期',
        dataIndex: 'establishDate',
        sorter: true,
        width: 92,
        align: 'center',
        render: (text: string) => {
          const content = text ? text : '-';
          return content;
        },
      },
      {
        title: '负责人',
        dataIndex: 'legalRepresentative',
        width: 120,
        render: (text: string) => {
          const content = text ? text : '-';
          return content;
        },
      },
      {
        title: '金融许可编码',
        dataIndex: 'financialLicenseCode',
        width: 140,
        align: 'center',
        render: (text: string) => {
          const content = text ? text : '-';
          return content;
        },
      },
      {
        title: '注册地',
        dataIndex: 'registerArea',
        width: 142,
        render: (text: string) => {
          const content = text ? text : '-';
          return content;
        },
      },
      {
        title: '上级机构',
        dataIndex: 'registerArea',
        width: 185,
        render: (text: string, row: any) => {
          const content = row.parentITCodeName ? row.parentITCodeName : '-';
          return (
            <S.EnterpriseWrap
              className={row.parentITCode ? 'link' : ''}
              onClick={() => {
                if (row.parentITCode) {
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE),
                      urlQueriesSerialize({ type: 'company', code: row.parentITCode }),
                      '#企业速览',
                    ),
                  );
                }
              }}
            >
              {content}
            </S.EnterpriseWrap>
          );
        },
      },
    ];
  }, [history, modalRequestParams]);

  return {
    columns,
    modalColumns,
  };
}

const DigitalWrap = styled.div`
  .blue {
    cursor: pointer;
    color: #025cdc;
    &:hover {
      text-decoration: underline;
    }
  }
`;
