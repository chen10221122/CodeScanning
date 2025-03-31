import { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';

import { Image } from '@/components/layout';
import { LINK_AREA_F9, LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { EllipsisWrap } from '@/pages/area/areaF9/modules/regionalFinancialResources/common/style';
import { useConditionCtx } from '@/pages/area/areaFinanceResource/components/layout/context';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

export default function useColumns() {
  const {
    state: { reginLevel, isOpenSource, modalRequestParams, condition, endYear },
    update,
  } = useConditionCtx();
  const history = useHistory();

  const renderFunc = useCallback(
    (text, row) => {
      let content = '-',
        guid: any = undefined;
      for (let item of row.indicatorList) {
        if (item.indicName === text) {
          content = item.mValue;
          guid = item.guid;
          break;
        }
      }
      return (
        <EllipsisWrap
          className={guid && isOpenSource ? 'openSource' : ''}
          onClick={() => {
            if (guid && isOpenSource) {
              setTimeout(() => {
                history.push(
                  urlJoin(
                    LINK_INFORMATION_TRACE,
                    urlQueriesSerialize({
                      guId: guid,
                    }),
                  ),
                );
              }, 100);
            }
          }}
        >
          {content}
        </EllipsisWrap>
      );
    },
    [history, isOpenSource],
  );

  useEffect(() => {
    let columns: any[] = [];
    if (reginLevel === 'province') {
      columns = [
        {
          title: '单位：亿元',
          align: 'left',
          className: 'textLeft',
          children: [
            {
              title: '年份',
              dataIndex: 'year',
              align: 'center',
              width: 70,
            },
            {
              title: '总资产',
              align: 'right',
              width: 95,
              render: (text: string, row: any) => {
                return renderFunc('总资产', row);
              },
            },
            {
              title: '总负债',
              align: 'right',
              width: 95,
              render: (text: string, row: any) => {
                return renderFunc('总负债', row);
              },
            },
            {
              title: '贷款余额-本外币',
              align: 'right',
              width: 148,
              render: (text: string, row: any) => {
                return renderFunc('贷款余额-本外币', row);
              },
            },
            {
              title: '存款余额-本外币',
              align: 'right',
              width: 148,
              render: (text: string, row: any) => {
                return renderFunc('存款余额-本外币', row);
              },
            },
            {
              title: '存款余额-人民币',
              align: 'right',
              width: 148,
              render: (text: string, row: any) => {
                return renderFunc('存款余额-人民币', row);
              },
            },
            {
              title: '不良贷款余额',
              align: 'right',
              width: 135,
              render: (text: string, row: any) => {
                return renderFunc('不良贷款余额', row);
              },
            },
            {
              title: '不良贷款率(%)',
              align: 'right',
              width: 127,
              render: (text: string, row: any) => {
                return renderFunc('不良贷款率(%)', row);
              },
            },
          ],
        },
      ];
    } else {
      columns = [
        {
          title: '单位：亿元',
          align: 'left',
          className: 'textLeft',
          children: [
            {
              title: '年份',
              dataIndex: 'year',
              align: 'center',
              width: 70,
            },
            {
              title: '贷款余额-本外币',
              align: 'right',
              width: 224,
              render: (text: string, row: any) => {
                return renderFunc('贷款余额-本外币', row);
              },
            },
            {
              title: '存款余额-本外币',
              align: 'right',
              width: 224,
              render: (text: string, row: any) => {
                return renderFunc('存款余额-本外币', row);
              },
            },
            {
              title: '存款余额-人民币',
              align: 'right',
              width: 224,
              render: (text: string, row: any) => {
                return renderFunc('存款余额-人民币', row);
              },
            },
            {
              title: '贷款余额-人民币',
              align: 'right',
              width: 224,
              render: (text: string, row: any) => {
                return renderFunc('贷款余额-人民币', row);
              },
            },
          ],
        },
      ];
    }
    update((d) => {
      d.modalColumns = columns;
    });
  }, [modalRequestParams.skip, reginLevel, renderFunc, update]);

  return useMemo(() => {
    switch (reginLevel) {
      case 'province':
        return [
          {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            width: Math.max(`${Number(condition.skip)}`.length * 10 + 22, 42),
            sorter: false,
            fixed: 'left',
            className: 'pdd-8',
          },
          {
            title: '地区',
            dataIndex: 'region',
            align: 'center',
            width: 175,
            fixed: 'left',
            sorter: true,
            wrapLine: true,
            resizable: { max: 940 - Math.max(`${Number(condition.skip)}`.length * 10 + 22, 42) },
            render: (text: string, row: any) => {
              return (
                <AreaWrap>
                  <span
                    onClick={() => {
                      history.push(
                        urlJoin(dynamicLink(LINK_AREA_F9, { key: 'depositLoadScale', code: row.provinceCode })),
                      );
                    }}
                  >
                    {text}
                  </span>
                  <Image
                    onClick={() => {
                      update((d) => {
                        d.modalTitle = `${text}-历年存贷款规模`;
                        d.sheetNames = { 0: `${text}-历年存贷款规模` };
                        d.modalRequestParams = {
                          ...modalRequestParams,
                          year: `[${Number(endYear) - 9}, ${endYear}]`,
                          regionCode: reginLevel === 'province' ? row.provinceCode : '',
                          // provinceCode: reginLevel === 'province' ? row.provinceCode : '',
                          // cityCode: '',
                          // countyCode: '',
                          skip: 0,
                        };
                        d.visible = true;
                      });
                    }}
                    height={12}
                    src={require('./icon@2x.png')}
                  />
                </AreaWrap>
              );
            },
          },
          {
            title: '总资产(亿元)',
            align: 'right',
            dataIndex: 'totalAsset',
            width: 114,
            sorter: true,
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return renderFunc('总资产', row);
            },
          },
          {
            title: '总负债(亿元)',
            align: 'right',
            dataIndex: 'totalDebt',
            width: 114,
            sorter: true,
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return renderFunc('总负债', row);
            },
          },
          {
            title: '贷款余额-本外币(亿元)',
            align: 'right',
            dataIndex: 'loanBalanceBwb',
            width: 174,
            sorter: true,
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return renderFunc('贷款余额-本外币', row);
            },
          },
          {
            title: '存款余额-本外币(亿元)',
            align: 'right',
            width: 174,
            dataIndex: 'depositBalanceBwb',
            sorter: true,
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return renderFunc('存款余额-本外币', row);
            },
          },
          {
            title: '贷款余额-人民币(亿元)',
            align: 'right',
            width: 174,
            dataIndex: 'loanBalanceRmb',
            sorter: true,
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return renderFunc('贷款余额-人民币', row);
            },
          },
          {
            title: '存款余额-人民币(亿元)',
            align: 'right',
            width: 174,
            dataIndex: 'depositBalanceRmb',
            sorter: true,
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return renderFunc('存款余额-人民币', row);
            },
          },
          {
            title: '不良贷款余额(亿元)',
            align: 'right',
            dataIndex: 'nonPerformingLoanBlance',
            width: 153,
            sorter: true,
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return renderFunc('不良贷款余额', row);
            },
          },
          {
            title: '不良贷款率(%)',
            align: 'right',
            width: 127,
            dataIndex: 'nonPerformingLoanRate',
            sorter: true,
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return renderFunc('不良贷款率(%)', row);
            },
          },
          {
            title: '',
            resizable: false,
          },
        ];
      default:
        return [
          {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            width: Math.max(`${Number(condition.skip)}`.length * 10 + 22, 42),
            sorter: false,
            fixed: 'left',
            className: 'pdd-8',
          },
          {
            title: '地区',
            dataIndex: 'region',
            align: 'center',
            width: 185,
            sorter: true,
            resizable: { max: 940 - Math.max(`${Number(condition.skip)}`.length * 10 + 22, 42) },
            wrapLine: true,
            fixed: 'left',
            render: (text: string, row: any) => {
              return (
                <AreaWrap>
                  <span
                    onClick={() => {
                      history.push(
                        dynamicLink(LINK_AREA_F9, {
                          key: 'depositLoadScale',
                          code: reginLevel === 'city' ? row.cityCode : row.countyCode,
                        }),
                      );
                    }}
                  >
                    {text}
                  </span>
                  <Image
                    onClick={() => {
                      update((d) => {
                        d.modalTitle = `${text}-历年存贷款规模`;
                        d.sheetNames = { 0: `${text}-历年存贷款规模` };
                        d.modalRequestParams = {
                          ...modalRequestParams,
                          year: `[${Number(endYear) - 9}, ${endYear}]`,
                          regionCode: [
                            reginLevel === 'county' ? row.countyCode : '',
                            reginLevel === 'city' ? row.cityCode : '',
                          ]
                            .filter(Boolean)
                            .toString(),
                          // cityCode: reginLevel === 'city' ? row.cityCode : '',
                          // countyCode: reginLevel === 'county' ? row.countyCode : '',
                          // provinceCode: '',
                          skip: 0,
                        };
                        d.visible = true;
                      });
                    }}
                    height={12}
                    src={require('./icon@2x.png')}
                  />
                </AreaWrap>
              );
            },
          },
          {
            title: '贷款余额-本外币(亿元)',
            align: 'right',
            dataIndex: 'loanBalanceBwb',
            width: 174,
            sorter: true,
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return renderFunc('贷款余额-本外币', row);
            },
          },
          {
            title: '存款余额-本外币(亿元)',
            align: 'right',
            width: 174,
            dataIndex: 'depositBalanceBwb',
            sorter: true,
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return renderFunc('存款余额-本外币', row);
            },
          },
          {
            title: '贷款余额-人民币(亿元)',
            align: 'right',
            width: 174,
            dataIndex: 'loanBalanceRmb',
            sorter: true,
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return renderFunc('贷款余额-人民币', row);
            },
          },
          {
            title: '存款余额-人民币(亿元)',
            align: 'right',
            sorter: true,
            width: 174,
            resizable: true,
            wrapLine: true,
            dataIndex: 'depositBalanceRmb',
            render: (text: string, row: any) => {
              return renderFunc('存款余额-人民币', row);
            },
          },
          {
            title: '',
            dataIndex: 'none-empty-column',
          },
        ];
    }
  }, [condition.skip, endYear, history, modalRequestParams, reginLevel, renderFunc, update]);
}

const AreaWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: #025cdc;
  position: relative;
  span {
    min-width: fit-content;
    white-space: nowrap;
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
  img {
    cursor: pointer;
  }
`;
