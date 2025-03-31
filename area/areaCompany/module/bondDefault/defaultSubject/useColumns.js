import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import styled from 'styled-components';

import AddBtn from '@/components/combinationDropdownSelect/addBtn';
import { LINK_DETAIL_BOND, LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

// const getWidth = (from) => {
//   const biggestNum = from + 50;
//   return biggestNum <= 50 ? 44 : biggestNum.toString().length * 34;
// };

export default function useColumns({
  setDefaultDetailVisible,
  showDefaultDetailModal,
  params,
  tableRef,
  data,
  // totalData,
  // totalDataError,
  // setClickCopy,
}) {
  const history = useHistory();

  const onCopyBtnClick = useMemoizedFn((key) => {
    navigator.clipboard.writeText(data.map((o) => o[key]).join('\n'));
    message.success('复制成功');
  });

  const columns = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        width: Math.max(`${params.skip}`.length * 12, 45),
        fixed: 'left',
        align: 'center',
        className: 'dzh-table-column-index',
        resizable: false,
        render: (_, __, i) => {
          return <span>{params.skip + i + 1}</span>;
        },
      },
      {
        title: (
          <>
            违约主体
            <AddBtn
              text={'违约主体'}
              container={() => tableRef.current}
              onClickWithHasPower={() => {
                onCopyBtnClick('orgName');
              }}
            />
          </>
        ),
        dataIndex: 'orgName',
        align: 'left',
        fixed: 'left',
        width: 244,
        resizable: { max: 780 - Math.max(`${params.skip}`.length * 12, 45), min: 250 },
        render: (_, raw, i) => {
          return raw.orgName ? (
            <div
              className={classNames('name', { link: raw?.itCode || raw.itCode2 })}
              onClick={() => {
                if (raw?.itCode || raw.itCode2) {
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE, { key: '' }),
                      urlQueriesSerialize({ type: 'company', code: raw?.itCode2 || raw.itCode }),
                    ),
                  );
                }
              }}
            >
              {params?.text && raw.orgName.includes(params.text) ? (
                <div
                  title={raw.orgName}
                  dangerouslySetInnerHTML={{
                    __html: raw.orgName.replace(params.text, `<span class='highlight-text'>${params.text}</span>`),
                  }}
                />
              ) : (
                <div title={raw.orgName}>{raw.orgName}</div>
              )}
            </div>
          ) : (
            ''
          );
        },
      },
      {
        title: '首次违约日期',
        dataIndex: 'firstDate',
        width: 110,
        align: 'center',
        resizable: true,
        render(_, raw) {
          const value = raw.firstDate ? dayjs(raw.firstDate).format('YYYY-MM-DD') : '-';
          return <WrapLine title={value}>{value}</WrapLine>;
        },
      },
      {
        title: '违约只数(只)',
        dataIndex: 'count',
        width: 103,
        align: 'right',
        resizable: true,
        render(_, raw) {
          return raw.count ? (
            <div
              className={classNames('name', { link: true })}
              onClick={() => showDefaultDetailModal(raw)}
              title={raw.count + '只'}
            >
              {raw.count}
            </div>
          ) : (
            '-'
          );
        },
      },
      {
        title: '违约金额(亿)',
        dataIndex: 'defaultAmount',
        width: 107,
        align: 'right',
        resizable: true,
        render(_, raw) {
          const value = raw.defaultAmount ? raw.defaultAmount : '-';
          return <WrapLine title={value}>{value}</WrapLine>;
        },
      },
      {
        title: '已偿还(亿)',
        dataIndex: 'repayAmount',
        width: 94,
        align: 'right',
        resizable: true,
        render(_, raw) {
          const value = raw.repayAmount ? raw.repayAmount : '-';
          return <WrapLine title={value}>{value}</WrapLine>;
        },
      },
      {
        title: '偿还进度(%)',
        dataIndex: 'repayProgress',
        width: 107,
        align: 'right',
        resizable: true,
        render(_, raw) {
          const value = raw.repayProgress ? raw.repayProgress : '-';
          return <WrapLine title={value}>{value}</WrapLine>;
        },
      },
      {
        title: '行业',
        dataIndex: 'industry',
        width: 101,
        align: 'left',
        resizable: true,
        render(value) {
          return <WrapLine title={value || '-'}>{value || '-'}</WrapLine>;
        },
      },
      {
        title: '地区',
        dataIndex: 'area',
        width: 75,
        align: 'left',
        resizable: true,
        render(value) {
          return <WrapLine title={value || '-'}>{value || '-'}</WrapLine>;
        },
      },
      {
        title: '企业性质',
        dataIndex: 'enterpriseProperty',
        width: 97,
        align: 'left',
        resizable: true,
        render(value) {
          return <WrapLine title={value || '-'}>{value || '-'}</WrapLine>;
        },
      },
      // {
      //   title: '申万行业',
      //   dataIndex: '',
      //   width: 101,
      //   render() {
      //     return <span title={'-'}>{'-'}</span>;
      //   },
      // },
      {
        title: '所属地区',
        width: 154,
        align: 'left',
        dataIndex: 'district',
        resizable: true,
        render(value) {
          return <WrapLine title={value || '-'}>{value || '-'}</WrapLine>;
        },
      },
      { title: '', width: '', dataIndex: 'blank', key: 'blank', resizable: true },
    ],
    [params.skip, params.text, onCopyBtnClick, tableRef, history, showDefaultDetailModal],
  );

  const detailColumns = useMemo(() => {
    return [
      {
        title: '债券简称',
        dataIndex: 'bondName',
        key: 'bondName',
        width: 187,
        align: 'left',
        render: (bondName, raw) => {
          return (
            <div
              className={classNames('bond-name', { 'link-bond': raw?.trCode })}
              onClick={() => {
                if (raw?.trCode) {
                  setDefaultDetailVisible(false);
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_BOND, { key: '' }),
                      urlQueriesSerialize({ type: 'co', code: raw?.trCode }),
                    ),
                  );
                }
              }}
            >
              {bondName}
            </div>
          );
        },
      },
      {
        title: '违约金额(亿)',
        dataIndex: 'defaultAmount',
        key: 'defaultAmount',
        align: 'right',
      },
      {
        title: '已偿还(亿)',
        dataIndex: 'repayAmount',
        key: 'repayAmount',
        align: 'right',
      },
      {
        title: '偿还进度(%)',
        dataIndex: 'repayProgress',
        key: 'repayProgress',
        align: 'right',
      },
    ];
  }, [history, setDefaultDetailVisible]);

  return { columns, detailColumns };
}

export const WrapLine = styled.div`
  color: #141414;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 1 !important;
  -webkit-box-orient: vertical !important;
  box-sizing: border-box;
`;
