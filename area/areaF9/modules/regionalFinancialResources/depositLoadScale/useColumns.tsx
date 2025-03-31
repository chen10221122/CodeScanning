import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { getLevel, Level } from '../../../utils/area';
import { EllipsisWrap } from '../common/style';
import { useCtx } from '../context';

export default function useColumns() {
  const {
    state: { tableCondition, isOpenSource, code },
  } = useCtx();
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
          className={guid && isOpenSource ? 'openSource ellipsis' : 'ellipsis'}
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

  const columns = useMemo(() => {
    const level = getLevel(code);
    switch (level) {
      case Level.PROVINCE:
        return [
          {
            title: '年份',
            dataIndex: 'year',
            width: 66,
            sorter: true,
            wrapLine: true,
            resizable: { max: 940 - Math.max(`${Number(tableCondition?.skip)}`.length * 10 + 22, 42) },
            fixed: 'left',
            align: 'center',
            sortDirections: ['ascend', 'descend'],
          },
          {
            title: <span>总资产(亿元)</span>,
            dataIndex: 'totalAsset',
            width: 114,
            sorter: true,
            resizable: true,
            wrapLine: true,
            align: 'right',
            render: (text: string, row: any) => {
              return renderFunc('总资产', row);
            },
          },
          {
            title: <span>总负债(亿元)</span>,
            dataIndex: 'totalDebt',
            width: 114,
            sorter: true,
            resizable: true,
            wrapLine: true,
            align: 'right',
            render: (text: string, row: any) => {
              return renderFunc('总负债', row);
            },
          },
          {
            title: <span>贷款余额-本外币(亿元)</span>,
            dataIndex: 'loanBalanceBwb',
            width: 174,
            sorter: true,
            resizable: true,
            wrapLine: true,
            align: 'right',
            render: (text: string, row: any) => {
              return renderFunc('贷款余额-本外币', row);
            },
          },
          {
            title: <span>存款余额-本外币(亿元)</span>,
            dataIndex: 'depositBalanceBwb',
            width: 174,
            sorter: true,
            resizable: true,
            wrapLine: true,
            align: 'right',
            render: (text: string, row: any) => {
              return renderFunc('存款余额-本外币', row);
            },
          },
          {
            title: <span>贷款余额-人民币(亿元)</span>,
            dataIndex: 'loanBalanceRmb',
            width: 174,
            sorter: true,
            resizable: true,
            wrapLine: true,
            align: 'right',
            render: (text: string, row: any) => {
              return renderFunc('贷款余额-人民币', row);
            },
          },
          {
            title: <span>存款余额-人民币(亿元)</span>,
            dataIndex: 'depositBalanceRmb',
            width: 174,
            sorter: true,
            resizable: true,
            wrapLine: true,
            align: 'right',
            render: (text: string, row: any) => {
              return renderFunc('存款余额-人民币', row);
            },
          },
          {
            title: <span>不良贷款余额(亿元)</span>,
            dataIndex: 'nonPerformingLoanBlance',
            width: 153,
            sorter: true,
            resizable: true,
            wrapLine: true,
            align: 'right',
            render: (text: string, row: any) => {
              return renderFunc('不良贷款余额', row);
            },
          },
          {
            title: <span>不良贷款率(%)</span>,
            dataIndex: 'nonPerformingLoanRate',
            width: 127,
            sorter: true,
            resizable: true,
            wrapLine: true,
            align: 'right',
            render: (text: string, row: any) => {
              return renderFunc('不良贷款率(%)', row);
            },
          },
          {
            tittle: '',
            resizable: false,
          },
        ];
      default:
        return [
          {
            title: '序号',
            dataIndex: 'index',
            className: 'pdd-8',
            fixed: 'left',
            width: Math.max(`${Number(tableCondition?.skip)}`.length * 10 + 22, 42),
          },
          {
            title: <span>年份</span>,
            dataIndex: 'year',
            width: 66,
            sorter: true,
            wrapLine: true,
            resizable: { max: 940 - Math.max(`${Number(tableCondition?.skip)}`.length * 10 + 22, 42) },
            fixed: 'left',
          },
          {
            title: <span>贷款余额-本外币(亿元)</span>,
            dataIndex: 'loanBalanceBwb',
            width: 174,
            sorter: true,
            resizable: true,
            wrapLine: true,
            align: 'right',
            render: (text: string, row: any) => {
              return renderFunc('贷款余额-本外币', row);
            },
          },
          {
            title: <span>存款余额-本外币(亿元)</span>,
            dataIndex: 'depositBalanceBwb',
            width: 174,
            sorter: true,
            resizable: true,
            wrapLine: true,
            align: 'right',
            render: (text: string, row: any) => {
              return renderFunc('存款余额-本外币', row);
            },
          },
          {
            title: <span>贷款余额-人民币(亿元)</span>,
            dataIndex: 'loanBalanceRmb',
            width: 174,
            sorter: true,
            resizable: true,
            wrapLine: true,
            align: 'right',
            render: (text: string, row: any) => {
              return renderFunc('贷款余额-人民币', row);
            },
          },
          {
            title: <span>存款余额-人民币(亿元)</span>,
            dataIndex: 'depositBalanceRmb',
            width: 174,
            sorter: true,
            resizable: true,
            wrapLine: true,
            align: 'right',
            render: (text: string, row: any) => {
              return renderFunc('存款余额-人民币', row);
            },
          },
          {
            tittle: '',
            resizable: false,
          },
        ];
    }
  }, [code, renderFunc, tableCondition?.skip]);

  return columns;
}
