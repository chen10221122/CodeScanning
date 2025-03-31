import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { Popover } from 'antd';
import styled from 'styled-components';

import { LINK_DETAIL_ENTERPRISE, LINK_AREA_F9 } from '@/configs/routerMap';
import { EnterpriseWrap, EllipsisWrap } from '@/pages/area/areaF9/modules/regionalFinancialResources/common/style';
import { useConditionCtx } from '@/pages/area/areaFinanceResource/components/layout/context';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import '@/assets/styles/less/popover.less';

const typeMap = new Map<string, string>([
  ['1', '法人机构'],
  ['2', '一级分行'],
  ['3', '二级分行'],
  ['4', '其他营业网点'],
]);

export default function useColumns(emptyAttribute: any, containerId?: string) {
  const {
    state: { modalRequestParams, condition, hiddenBlankColumn },
    update,
  } = useConditionCtx();
  const history = useHistory();

  const renderEllipsis = useMemoizedFn((text: string) => {
    const content = text ? text : '-';
    return (
      <EllipsisWrap className="ellipsis" title={content}>
        {content}
      </EllipsisWrap>
    );
  });

  const personColumns = useMemo(
    () =>
      [
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
          dataIndex: 'enterpriseInfo',
          width: 251,
          align: 'left',
          render: (text: string, row: any) => {
            return (
              <EllipsisWrap
                className={row.enterpriseInfo.itCode ? 'link ellipsis' : 'ellipsis'}
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
              </EllipsisWrap>
            );
          },
        },
        {
          title: '成立日期',
          dataIndex: 'establishDate',
          sorter: true,
          width: 92,
          render: renderEllipsis,
        },
        {
          title: '法定代表人',
          dataIndex: 'legalRepresentative',
          width: 128,
          align: 'left',
          render: renderEllipsis,
        },
        {
          title: '注册资本',
          dataIndex: 'registerCapital',
          width: 134,
          align: 'right',
          render: renderEllipsis,
        },
        {
          title: '金融许可编码',
          dataIndex: 'financialLicenseCode',
          width: 139,
          render: renderEllipsis,
        },
        {
          title: '注册地',
          dataIndex: 'registerArea',
          width: 180,
          align: 'left',
          render: renderEllipsis,
        },
      ].map((i) => {
        return {
          ...i,
          resizable: i.dataIndex === 'index' ? false : true,
        };
      }),
    [history, modalRequestParams, renderEllipsis],
  );

  const otherColumns = useMemo(
    () =>
      [
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
          dataIndex: 'enterpriseInfo',
          width: 238,
          align: 'left',
          render: (text: string, row: any) => {
            return (
              <EllipsisWrap
                className={row.enterpriseInfo.itCode ? 'link ellipsis' : 'ellipsis'}
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
              </EllipsisWrap>
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
            return content;
          },
        },
        {
          title: '负责人',
          dataIndex: 'legalRepresentative',
          width: 128,
          align: 'left',
          render: (text: string) => {
            const content = text ? text : '-';
            return content;
          },
        },
        {
          title: '金融许可编码',
          dataIndex: 'financialLicenseCode',
          width: 139,
          render: (text: string) => {
            const content = text ? text : '-';
            return content;
          },
        },
        {
          title: '注册地',
          dataIndex: 'registerArea',
          width: 142,
          align: 'left',
          render: (text: string) => {
            const content = text ? text : '-';
            return content;
          },
        },
        {
          title: '上级机构',
          dataIndex: 'registerArea',
          width: 185,
          align: 'left',
          render: (text: string, row: any) => {
            const content = row.parentITCodeName ? row.parentITCodeName : '-';
            return (
              <EnterpriseWrap
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
              </EnterpriseWrap>
            );
          },
        },
      ].map((i) => {
        return {
          ...i,
          resizable: i.dataIndex === 'index' ? false : true,
        };
      }),
    [history, modalRequestParams],
  );

  const handleModalRequest = useMemoizedFn((row, bankType) => {
    return {
      ...modalRequestParams,
      regionCode: [row.provinceCode, row.countyCode, row.cityCode].filter(Boolean).toString(),
      // provinceCode: row.provinceCode,
      // countyCode: row.countyCode,
      // cityCode: row.cityCode,
      moduleType: 3,
      bankType,
      branchType: condition.branchType,
      skip: 0,
    };
  });

  const emptyColumnNums = useMemo(() => {
    if (hiddenBlankColumn) {
      return Object.keys(emptyAttribute).reduce((count, key) => {
        if (emptyAttribute[key] === true) {
          return count + 1;
        }
        return count;
      }, 0);
    } else {
      return 0;
    }
  }, [emptyAttribute, hiddenBlankColumn]);

  const columns = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        width: Math.max(`${Number(condition.skip)}`.length * 10 + 22, 42),
        sorter: false,
        className: 'pdd-8',
        fixed: 'left',
      },
      {
        title: '地区',
        dataIndex: 'regionName',
        align: 'left',
        width: 157,
        sorter: true,
        fixed: 'left',
        render: (text: string, row: any) => {
          const code =
            condition.regionLevel === '1'
              ? row.provinceCode
              : condition.regionLevel === '2'
              ? row.cityCode
              : row.countyCode;
          return (
            <AreaWrap
              onClick={() => {
                history.push(urlJoin(dynamicLink(LINK_AREA_F9, { key: 'bankDistributionByType', code })));
              }}
            >
              <span>{text}</span>
            </AreaWrap>
          );
        },
      },
      {
        title: '银行金融资源分布',
        align: 'left',
        children: [
          {
            title: '政策性银行',
            align: 'right',
            dataIndex: 'policyBankNum',
            width: `${9.3 + (emptyColumnNums * 10) / (9 - emptyColumnNums)}%`,
            sorter: true,
            render: (text: number, row: any) => {
              return (
                <EnterpriseWrap
                  className={text !== 0 ? 'link' : ''}
                  onClick={() => {
                    if (text === 0) return;
                    update((d) => {
                      d.area = row.regionName;
                      d.visible = true;
                      d.modalTitle = `政策性银行-${typeMap.get(condition.branchType)}明细`;
                      d.modalColumns = condition.branchType === '1' ? personColumns : otherColumns;
                      d.modalRequestParams = handleModalRequest(row, 1);
                      d.modalExport =
                        condition.branchType === '1'
                          ? 'regionalFinancialResource_areabank_corporation_info'
                          : 'regionalFinancialResource_areabank_branch_info';
                    });
                  }}
                >
                  {text}
                </EnterpriseWrap>
              );
            },
          },
          {
            title: '大型商业银行',
            align: 'right',
            dataIndex: 'largeCommBankNum',
            width: `${10.4 + (emptyColumnNums * 10) / (9 - emptyColumnNums)}%`,
            sorter: true,
            render: (text: number, row: any) => {
              return (
                <EnterpriseWrap
                  className={text !== 0 ? 'link' : ''}
                  onClick={() => {
                    if (text === 0) return;
                    update((d) => {
                      d.area = row.regionName;
                      d.visible = true;
                      d.modalTitle = `大型商业银行-${typeMap.get(condition.branchType)}明细`;
                      d.modalColumns = condition.branchType === '1' ? personColumns : otherColumns;
                      d.modalRequestParams = handleModalRequest(row, 2);
                      d.modalExport =
                        condition.branchType === '1'
                          ? 'regionalFinancialResource_areabank_corporation_info'
                          : 'regionalFinancialResource_areabank_branch_info';
                    });
                  }}
                >
                  {text}
                </EnterpriseWrap>
              );
            },
          },
          {
            title: '股份制商业银行',
            align: 'right',
            dataIndex: 'stockCommBankNum',
            width: `${10.6 + (emptyColumnNums * 10) / (9 - emptyColumnNums)}%`,
            sorter: true,
            render: (text: number, row: any) => {
              return (
                <EnterpriseWrap
                  className={text !== 0 ? 'link' : ''}
                  onClick={() => {
                    if (text === 0) return;
                    update((d) => {
                      d.area = row.regionName;
                      d.visible = true;
                      d.modalTitle = `股份制商业银行-${typeMap.get(condition.branchType)}明细`;
                      d.modalColumns = condition.branchType === '1' ? personColumns : otherColumns;
                      d.modalRequestParams = handleModalRequest(row, 3);
                      d.modalExport =
                        condition.branchType === '1'
                          ? 'regionalFinancialResource_areabank_corporation_info'
                          : 'regionalFinancialResource_areabank_branch_info';
                    });
                  }}
                >
                  {text}
                </EnterpriseWrap>
              );
            },
          },
          {
            title: '城市商业银行',
            align: 'right',
            width: `${9.5 + (emptyColumnNums * 10) / (9 - emptyColumnNums)}%`,
            dataIndex: 'cityCommBankNum',
            sorter: true,
            render: (text: number, row: any) => {
              return (
                <EnterpriseWrap
                  className={text !== 0 ? 'link' : ''}
                  onClick={() => {
                    if (text === 0) return;
                    update((d) => {
                      d.area = row.regionName;
                      d.visible = true;
                      d.modalTitle = `城市商业银行-${typeMap.get(condition.branchType)}明细`;
                      d.modalColumns = condition.branchType === '1' ? personColumns : otherColumns;
                      d.modalRequestParams = handleModalRequest(row, 4);
                      d.modalExport =
                        condition.branchType === '1'
                          ? 'regionalFinancialResource_areabank_corporation_info'
                          : 'regionalFinancialResource_areabank_branch_info';
                    });
                  }}
                >
                  {text}
                </EnterpriseWrap>
              );
            },
          },
          {
            title: '农村商业银行',
            align: 'right',
            width: `${9.4 + (emptyColumnNums * 10) / (9 - emptyColumnNums)}%`,
            dataIndex: 'ruralCommBankNum',
            sorter: true,
            render: (text: number, row: any) => {
              return (
                <EnterpriseWrap
                  className={text !== 0 ? 'link' : ''}
                  onClick={() => {
                    if (text === 0) return;
                    update((d) => {
                      d.area = row.regionName;
                      d.visible = true;
                      d.modalTitle = `农村商业银行-${typeMap.get(condition.branchType)}明细`;
                      d.modalColumns = condition.branchType === '1' ? personColumns : otherColumns;
                      d.modalRequestParams = handleModalRequest(row, 5);
                      d.modalExport =
                        condition.branchType === '1'
                          ? 'regionalFinancialResource_areabank_corporation_info'
                          : 'regionalFinancialResource_areabank_branch_info';
                    });
                  }}
                >
                  {text}
                </EnterpriseWrap>
              );
            },
          },
          {
            title: '农村信用社',
            align: 'right',
            width: `${9.3 + (emptyColumnNums * 10) / (9 - emptyColumnNums)}%`,
            dataIndex: 'ruralCreditClubNum',
            sorter: true,
            render: (text: number, row: any) => {
              return (
                <EnterpriseWrap
                  className={text !== 0 ? 'link' : ''}
                  onClick={() => {
                    if (text === 0) return;
                    update((d) => {
                      d.area = row.regionName;
                      d.visible = true;
                      d.modalTitle = `农村信用社-${typeMap.get(condition.branchType)}明细`;
                      d.modalColumns = condition.branchType === '1' ? personColumns : otherColumns;
                      d.modalRequestParams = handleModalRequest(row, 6);
                      d.modalExport =
                        condition.branchType === '1'
                          ? 'regionalFinancialResource_areabank_corporation_info'
                          : 'regionalFinancialResource_areabank_branch_info';
                    });
                  }}
                >
                  {text}
                </EnterpriseWrap>
              );
            },
          },
          {
            title: '村镇银行',
            align: 'right',
            dataIndex: 'ruralBankNum',
            width: `${8.1 + (emptyColumnNums * 10) / (9 - emptyColumnNums)}%`,
            sorter: true,
            render: (text: number, row: any) => {
              return (
                <EnterpriseWrap
                  className={text !== 0 ? 'link' : ''}
                  onClick={() => {
                    if (text === 0) return;
                    update((d) => {
                      d.area = row.regionName;
                      d.visible = true;
                      d.modalTitle = `村镇银行-${typeMap.get(condition.branchType)}明细`;
                      d.modalColumns = condition.branchType === '1' ? personColumns : otherColumns;
                      d.modalRequestParams = handleModalRequest(row, 7);
                      d.modalExport =
                        condition.branchType === '1'
                          ? 'regionalFinancialResource_areabank_corporation_info'
                          : 'regionalFinancialResource_areabank_branch_info';
                    });
                  }}
                >
                  {text}
                </EnterpriseWrap>
              );
            },
          },
          {
            title: '民营银行',
            align: 'right',
            width: `${9.5 + (emptyColumnNums * 10) / (9 - emptyColumnNums)}%`,
            dataIndex: 'privateBankNum',
            sorter: true,
            render: (text: number, row: any) => {
              return (
                <EnterpriseWrap
                  className={text !== 0 ? 'link' : ''}
                  onClick={() => {
                    if (text === 0) return;
                    update((d) => {
                      d.area = row.regionName;
                      d.visible = true;
                      d.modalTitle = `民营银行-${typeMap.get(condition.branchType)}明细`;
                      d.modalColumns = condition.branchType === '1' ? personColumns : otherColumns;
                      d.modalRequestParams = handleModalRequest(row, 8);
                      d.modalExport =
                        condition.branchType === '1'
                          ? 'regionalFinancialResource_areabank_corporation_info'
                          : 'regionalFinancialResource_areabank_branch_info';
                    });
                  }}
                >
                  {text}
                </EnterpriseWrap>
              );
            },
          },
          {
            title: (
              <PopoverWrapper>
                <span>其他银行</span>
                <Popover
                  overlayClassName="areaFinanceResource-popover"
                  placement={'bottomLeft'}
                  align={{
                    offset: [-13, -3],
                  }}
                  content={'其他银行范围包括农村合作银行、住房储蓄银行、外资银行、农村资金互助社'}
                  getPopupContainer={() =>
                    document.querySelector(`#${containerId ? containerId : 'areaFinancingWrapper'}`) as HTMLElement
                  }
                >
                  <img className="update-help-img" height={12} src={require('./question.png')} alt="" />
                </Popover>
              </PopoverWrapper>
            ),
            align: 'right',
            dataIndex: 'otherBankNum',
            sorter: true,
            render: (text: number, row: any) => {
              return (
                <EnterpriseWrap
                  className={text !== 0 ? 'link' : ''}
                  onClick={() => {
                    if (text === 0) return;
                    update((d) => {
                      d.area = row.regionName;
                      d.visible = true;
                      d.modalTitle = `其他银行-${typeMap.get(condition.branchType)}明细`;
                      d.modalColumns = condition.branchType === '1' ? personColumns : otherColumns;
                      d.modalRequestParams = handleModalRequest(row, 9);
                      d.modalExport =
                        condition.branchType === '1'
                          ? 'regionalFinancialResource_areabank_corporation_info'
                          : 'regionalFinancialResource_areabank_branch_info';
                    });
                  }}
                >
                  {text}
                </EnterpriseWrap>
              );
            },
          },
        ].filter((item: any) => !hiddenBlankColumn || !emptyAttribute[item.dataIndex]),
      },
    ];
  }, [
    condition.branchType,
    condition.regionLevel,
    condition.skip,
    emptyAttribute,
    emptyColumnNums,
    handleModalRequest,
    hiddenBlankColumn,
    history,
    otherColumns,
    personColumns,
    update,
    containerId,
  ]);

  return columns;
}

const PopoverWrapper = styled.span`
  display: flex;
  align-items: center;
  .update-help-img {
    margin-left: 4px;
  }
`;

const AreaWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: #025cdc;
  span {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .ellipse {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    text-align: left;
    margin-right: 6px;
  }
`;
