import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { highlight } from '@/utils/dom';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

// import { getLevel, Level } from '../../../utils/area';
import { useCtx } from '../context';

function emptyContent(text: any) {
  return text ? text : '-';
}

export default function useColumns() {
  const history = useHistory();
  const {
    state: { code, modalRequestParams, modalTitle },
    update,
  } = useCtx();

  /** 配置弹窗请求参数 */
  const handleModalOpenClick = useMemoizedFn((bankTypeName, title, bankType, branchType) => {
    // const level = getLevel(code);
    update((d) => {
      d.modalVisible = true;
      d.modalTitle = bankTypeName === '总计' ? `${title}总计明细` : `${bankTypeName}_${title}明细`;
      d.sheetNames = { '0': title };
      let areaCode = {
        regionCode: code,
      };
      d.modalRequestParams = {
        bankType: bankType,
        branchType: branchType,
        moduleType: 1,
        skip: 0,
        sort: '',
        ...areaCode,
      };
    });
  });

  const columns = useMemo(
    () => [
      {
        title: '银行类型',
        dataIndex: 'bankTypeName',
        width: 180,
        fixed: 'left',
        resizable: { max: 940 },
        render: (text: string, row: any) => {
          return (
            <NameWrap
              className={cn({
                secondLevel: row.bankTypeLevel === 2,
                firstLevel: row.bankTypeLevel === 1,
                total: row.bankTypeName === '总计',
              })}
              title={text}
            >
              {text}
            </NameWrap>
          );
        },
      },
      {
        title: '法人机构(个)',
        dataIndex: 'corporationCount',
        width: 124,
        resizable: true,
        align: 'right',
        render: (text: number, row: any) => {
          return (
            <DigitalWrap>
              <span
                className={cn({ blue: text !== 0, total: row.bankTypeName === '总计' })}
                onClick={() => {
                  if (row.corporationCount !== 0) {
                    handleModalOpenClick(row.bankTypeName, '法人机构', row.bankType, 1);
                  }
                }}
              >
                {formatNumber(text, 0)}
              </span>
            </DigitalWrap>
          );
        },
      },
      {
        title: '一级分行(个)',
        dataIndex: 'firstLevelBranchCount',
        width: 124,
        resizable: true,
        align: 'right',
        render: (text: number, row: any) => {
          return (
            <DigitalWrap>
              <span
                className={cn({ blue: text !== 0, total: row.bankTypeName === '总计' })}
                onClick={() => {
                  if (row.firstLevelBranchCount !== 0) {
                    handleModalOpenClick(row.bankTypeName, '一级分行', row.bankType, 2);
                  }
                }}
              >
                {formatNumber(text, 0)}
              </span>
            </DigitalWrap>
          );
        },
      },
      {
        title: '二级分行(个)',
        dataIndex: 'secondLevelBranchCount',
        width: 124,
        resizable: true,
        align: 'right',
        render: (text: number, row: any) => {
          return (
            <DigitalWrap>
              <span
                className={cn({ blue: text !== 0, total: row.bankTypeName === '总计' })}
                onClick={() => {
                  if (row.secondLevelBranchCount !== 0) {
                    handleModalOpenClick(row.bankTypeName, '二级分行', row.bankType, 3);
                  }
                }}
              >
                {formatNumber(text, 0)}
              </span>
            </DigitalWrap>
          );
        },
      },
      {
        title: '其他营业网点(个)',
        dataIndex: 'otherBusinessOutletsCount',
        width: 128,
        resizable: true,
        align: 'right',
        render: (text: number, row: any) => {
          return (
            <DigitalWrap>
              <span
                className={cn({ blue: text !== 0, total: row.bankTypeName === '总计' })}
                onClick={() => {
                  if (row.otherBusinessOutletsCount !== 0) {
                    handleModalOpenClick(row.bankTypeName, '其他营业网点', row.bankType, 4);
                  }
                }}
              >
                {formatNumber(text, 0)}
              </span>
            </DigitalWrap>
          );
        },
      },
    ],
    [handleModalOpenClick],
  );

  const modalInitColumns = useMemo(() => {
    const type = modalTitle.split('_')[0];
    const isTotalModal = modalTitle.includes('总计');

    switch (modalRequestParams?.branchType) {
      // 法人机构
      case 1:
        //总计弹窗
        if (isTotalModal) {
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
              title: '银行名称',
              dataIndex: 'itName',
              width: 206,
              fixed: 'left',
              render: (text: string, row: any) => {
                return (
                  <LineWrap
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
                    title={row.enterpriseInfo.itName}
                  >
                    {modalRequestParams?.text
                      ? highlight(row.enterpriseInfo.itName, modalRequestParams.text)
                      : row.enterpriseInfo.itName}
                  </LineWrap>
                );
              },
            },
            {
              title: '银行类型',
              dataIndex: 'bankType',
              width: 114,
              render: (text: string) => {
                return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
              },
            },
            {
              title: '成立日期',
              dataIndex: 'establishDate',
              sorter: true,
              width: 92,
              render: (text: string) => {
                return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
              },
            },
            {
              title: '法定代表人',
              dataIndex: 'legalRepresentative',
              width: 128,
              render: (text: string) => {
                return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
              },
            },
            {
              title: <div style={{ textAlign: 'center' }}>注册资本</div>,
              dataIndex: 'registerCapital',
              width: 101,
              sorter: true,
              align: 'right',
              render: (text: string) => {
                return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
              },
            },
            {
              title: '金融许可编码',
              dataIndex: 'financialLicenseCode',
              width: 139,
              render: (text: string) => {
                return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
              },
            },
            {
              title: '注册地',
              dataIndex: 'registerArea',
              width: 107,
              ellipsis: true,
              render: (text: string) => {
                return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
              },
            },
          ];
        } else {
          if (type !== '小型农村金融机构' && type !== '新型农村金融机构') {
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
                title: '企业名称',
                dataIndex: 'itName',
                width: 206,
                fixed: 'left',
                render: (text: string, row: any) => {
                  return (
                    <LineWrap
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
                      title={row.enterpriseInfo.itName}
                    >
                      {row.enterpriseInfo.itName}
                    </LineWrap>
                  );
                },
              },
              {
                title: '成立日期',
                dataIndex: 'establishDate',
                sorter: true,
                width: 92,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: '法定代表人',
                dataIndex: 'legalRepresentative',
                width: 128,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: <div style={{ textAlign: 'center' }}>注册资本</div>,
                dataIndex: 'registerCapital',
                width: 134,
                align: 'right',
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: '金融许可编码',
                dataIndex: 'financialLicenseCode',
                width: 139,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: '注册地',
                dataIndex: 'registerArea',
                width: 189,
                ellipsis: true,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
            ];
          } else {
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
                title: '企业名称',
                dataIndex: 'itName',
                width: 206,
                align: 'left',
                fixed: 'left',
                render: (text: string, row: any) => {
                  return (
                    <LineWrap
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
                      title={row.enterpriseInfo.itName}
                    >
                      {row.enterpriseInfo.itName}
                    </LineWrap>
                  );
                },
              },
              {
                title: '类型',
                dataIndex: 'bankType',
                width: 92,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: '成立日期',
                dataIndex: 'establishDate',
                sorter: true,
                width: 92,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: '法定代表人',
                dataIndex: 'legalRepresentative',
                width: 128,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: <div style={{ textAlign: 'center' }}>注册资本</div>,
                dataIndex: 'registerCapital',
                width: 137,
                align: 'right',
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: '金融许可编码',
                dataIndex: 'financialLicenseCode',
                width: 139,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: '注册地',
                dataIndex: 'registerArea',
                width: 83,
                ellipsis: true,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
            ];
          }
        }
      default:
        //分行总计弹窗
        if (isTotalModal) {
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
              title: '银行名称',
              dataIndex: 'itName',
              width: 206,
              fixed: 'left',
              render: (text: string, row: any) => {
                return (
                  <LineWrap
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
                    title={row.enterpriseInfo.itName}
                  >
                    {modalRequestParams?.text
                      ? highlight(row.enterpriseInfo.itName, modalRequestParams.text)
                      : row.enterpriseInfo.itName}
                  </LineWrap>
                );
              },
            },
            {
              title: '所属总行类型',
              dataIndex: 'bankType',
              align: 'center',
              width: 120,
              render: (text: string) => {
                const content = text ? text : '-';
                return <LineWrap title={content}>{content}</LineWrap>;
              },
            },
            {
              title: '成立日期',
              dataIndex: 'establishDate',
              sorter: true,
              width: 92,
              render: (text: string) => {
                const content = text ? text : '-';
                return <LineWrap title={content}>{content}</LineWrap>;
              },
            },
            {
              title: '负责人',
              dataIndex: 'legalRepresentative',
              width: 110,
              render: (text: string) => {
                const content = text ? text : '-';
                return <LineWrap title={content}>{content}</LineWrap>;
              },
            },
            {
              title: '金融许可编码',
              dataIndex: 'financialLicenseCode',
              width: 140,
              render: (text: string) => {
                const content = text ? text : '-';
                return <LineWrap title={content}>{content}</LineWrap>;
              },
            },
            {
              title: <div style={{ textAlign: 'center' }}>注册地</div>,
              dataIndex: 'registerArea',
              align: 'left',
              width: 130,
              ellipsis: true,
              render: (text: string) => {
                const content = text ? text : '-';
                return <LineWrap title={content}>{content}</LineWrap>;
              },
            },
            {
              title: '上级机构',
              dataIndex: 'registerArea',
              width: 193,
              render: (text: string, row: any) => {
                return (
                  <LineWrap
                    className={cn({ link: !!row.parentITCode })}
                    onClick={() => {
                      if (row.parentITCode) {
                        history.push(
                          urlJoin(
                            dynamicLink(LINK_DETAIL_ENTERPRISE, { anchor: '' }),
                            urlQueriesSerialize({ type: 'company', code: row.parentITCode }),
                            '#企业速览',
                          ),
                        );
                      }
                    }}
                    title={row.parentITCodeName}
                  >
                    {row.parentITCodeName}
                  </LineWrap>
                );
              },
            },
          ];
        } else {
          if (type === '小型农村金融机构' || type === '新型农村金融机构') {
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
                title: '企业名称',
                dataIndex: 'itName',
                width: 193,
                fixed: 'left',
                render: (text: string, row: any) => {
                  return (
                    <LineWrap
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
                      title={row.enterpriseInfo.itName}
                    >
                      {row.enterpriseInfo.itName}
                    </LineWrap>
                  );
                },
              },
              {
                title: '类型',
                dataIndex: 'bankType',
                width: 92,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: '成立日期',
                dataIndex: 'establishDate',
                sorter: true,
                width: 92,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: <div style={{ textAlign: 'center' }}>负责人</div>,
                dataIndex: 'legalRepresentative',
                width: 128,
                align: 'left',
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: '金融许可编码',
                dataIndex: 'financialLicenseCode',
                width: 140,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: <div style={{ textAlign: 'center' }}>注册地</div>,
                dataIndex: 'registerArea',
                width: 142,
                align: 'left',
                ellipsis: true,
                render: (text: string) => {
                  return <LineWrap title={emptyContent(text)}>{emptyContent(text)}</LineWrap>;
                },
              },
              {
                title: '上级机构',
                width: 193,
                align: 'left',
                render: (text: string, row: any) => {
                  return (
                    <LineWrap
                      className={cn({ link: !!row.parentITCode })}
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
                      title={row.parentITCodeName}
                    >
                      {row.parentITCodeName}
                    </LineWrap>
                  );
                },
              },
            ];
          }
          return [
            {
              title: '序号',
              dataIndex: 'index',
              className: 'pdd-8',
              fixed: 'left',
              width: Math.max(`${Number(modalRequestParams?.skip)}`.length * 10 + 22, 42),
            },
            {
              title: '企业名称',
              dataIndex: 'itName',
              width: 193,
              fixed: 'left',
              render: (text: string, row: any) => {
                return (
                  <LineWrap
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
                    title={row.enterpriseInfo.itName}
                  >
                    {row.enterpriseInfo.itName}
                  </LineWrap>
                );
              },
            },
            {
              title: '成立日期',
              dataIndex: 'establishDate',
              sorter: true,
              width: 92,
              render: (text: string) => {
                const content = text ? text : '-';
                return <LineWrap title={content}>{content}</LineWrap>;
              },
            },
            {
              title: '负责人',
              dataIndex: 'legalRepresentative',
              width: 120,
              render: (text: string) => {
                const content = text ? text : '-';
                return <LineWrap title={content}>{content}</LineWrap>;
              },
            },
            {
              title: '金融许可编码',
              dataIndex: 'financialLicenseCode',
              width: 140,
              render: (text: string) => {
                const content = text ? text : '-';
                return <LineWrap title={content}>{content}</LineWrap>;
              },
            },
            {
              title: <div style={{ textAlign: 'center' }}>注册地</div>,
              dataIndex: 'registerArea',
              align: 'left',
              width: 142,
              ellipsis: true,
              render: (text: string) => {
                const content = text ? text : '-';
                return <LineWrap title={content}>{content}</LineWrap>;
              },
            },
            {
              title: '上级机构',
              dataIndex: 'registerArea',
              width: 193,
              render: (text: string, row: any) => {
                return (
                  <LineWrap
                    className={cn({ link: !!row.parentITCode })}
                    onClick={() => {
                      if (row.parentITCode) {
                        history.push(
                          urlJoin(
                            dynamicLink(LINK_DETAIL_ENTERPRISE, { anchor: '' }),
                            urlQueriesSerialize({ type: 'company', code: row.parentITCode }),
                            '#企业速览',
                          ),
                        );
                      }
                    }}
                    title={row.parentITCodeName}
                  >
                    {row.parentITCodeName}
                  </LineWrap>
                );
              },
            },
          ];
        }
    }
  }, [history, modalRequestParams, modalTitle]);

  const modalColumns = useMemo(() => {
    return modalInitColumns.map((o, i) => ({ ...o, resizable: i === 0 ? false : true }));
  }, [modalInitColumns]);

  return {
    columns,
    modalColumns,
  };
}

const NameWrap = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &.firstLevel {
    color: #141414;
  }
  &.secondLevel {
    color: #595959;
    margin-left: 13px;
  }
  &.total {
    font-size: 13px;
    color: #141414;
    font-weight: 600;
  }
`;

const DigitalWrap = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  .blue {
    cursor: pointer;
    color: #025cdc;
    &:hover {
      text-decoration: underline;
    }
  }
  .total {
    font-size: 13px;
    font-weight: Bold;
  }
`;

export const LineWrap = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &.link {
    color: #025cdc;
    &:hover {
      text-decoration: underline;
    }
    cursor: pointer;
  }
`;
