import { useMemo, useCallback } from 'react';
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

import SortField from './components/sortField';

type PropsType = {
  params: any;
  currentSort: any;
  setCurrentSort: any;
  tableRef: any;
  data: any;
};

// const getWidth = (from: number) => {
//   const biggestNum = from + 50;
//   return biggestNum <= 50 ? 44 : biggestNum.toString().length * 34;
// };

export default function useColumns({
  params,
  currentSort,
  setCurrentSort,
  tableRef,
  data,
}: // totalData,
// totalDataError,
// setClickCopy,
PropsType) {
  const history = useHistory();

  const getHightLightEl = useCallback(
    (originText: string) => {
      const searchWord = params?.text || '';
      if (!searchWord || !originText.includes(searchWord)) return originText;
      const __html = originText.replace(searchWord, `<span class='highlight-text'>${searchWord}</span>`);
      return <div dangerouslySetInnerHTML={{ __html }} />;
    },
    [params?.text],
  );

  const onCopyBtnClick = useMemoizedFn((key) => {
    navigator.clipboard.writeText(data.map((o: Record<string, string>) => o[key]).join('\n'));
    message.success('复制成功');
  });

  const columns = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        fixed: 'left',
        width: Math.max(`${params.skip}`.length * 12, 45),
        resizable: false,
        className: 'dzh-table-column-index',
        render: (_: any, __: any, i: number) => {
          return params.skip + i + 1;
        },
      },
      { title: '债券代码', dataIndex: 'bondCode', fixed: 'left', width: 112, align: 'left', resizable: { max: 200 } },
      {
        title: (
          <>
            债券简称
            <AddBtn
              text={'债券简称'}
              container={() => tableRef.current}
              onClickWithHasPower={() => {
                onCopyBtnClick('shortName');
              }}
            />
          </>
        ),
        dataIndex: 'shortName',
        fixed: 'left',
        width: 195,
        align: 'left',
        resizable: { max: 680 - Math.max(`${params.skip}`.length * 12, 45), min: 200 },
        render(shortName: string, raw: any) {
          if (!shortName) return '';

          return (
            <div
              className={classNames('name', { link: raw?.TRCode })}
              onClick={() => {
                if (raw?.TRCode) {
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_BOND, { key: '' }),
                      urlQueriesSerialize({ type: 'co', code: raw?.TRCode }),
                    ),
                  );
                }
              }}
            >
              {getHightLightEl(shortName)}
            </div>
          );
        },
      },
      {
        title: (
          <SortField
            sortOpt={{ key: '最新违约日', name: '最新违约日期降序', value: '1' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
          />
        ),
        dataIndex: 'latestDate',
        width: 110,
        align: 'center',
        resizable: true,
        render(latestDate: string) {
          return latestDate ? dayjs(latestDate).format('YYYY-MM-DD') : '';
        },
      },
      {
        title: '最新违约金额',
        dataIndex: 'amount',
        align: 'right',
        width: 110,
        resizable: true,
        render(amount: string) {
          return amount ? amount + '亿' : '';
        },
      },
      {
        title: (
          <>
            发行人
            <AddBtn
              text={'发行人'}
              container={() => tableRef.current}
              onClickWithHasPower={() => {
                onCopyBtnClick('orgName');
              }}
            />
          </>
        ),
        dataIndex: 'orgName',
        resizable: true,
        width: 260,
        render(orgName: string, raw: any) {
          if (!orgName) return '';
          return (
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
              {getHightLightEl(orgName)}
            </div>
          );
        },
      },
      {
        title: '主承',
        dataIndex: 'underwriter',
        align: 'left',
        width: 210,
        resizable: true,
        render(underwriter: string) {
          return underwriter ? getHightLightEl(underwriter) : '-';
        },
      },
      { title: '违约原因', dataIndex: 'reason', align: 'center', width: 100, resizable: true },
      { title: '最新违约类型', dataIndex: 'cashflowType', align: 'center', width: 110, resizable: true },
      {
        title: (
          <SortField
            sortOpt={{ key: '累计违约金额', name: '累计违约金额降序', value: '2' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
          />
        ),
        dataIndex: 'allAmount',
        width: 125,
        align: 'right',
        resizable: true,
        render(allAmount: string) {
          return allAmount ? allAmount + '亿' : '';
        },
      },
      {
        title: '首次违约日',
        dataIndex: 'firstDate',
        align: 'center',
        width: 110,
        resizable: true,
        render(firstDate: string) {
          return firstDate ? dayjs(firstDate).format('YYYY-MM-DD') : '';
        },
      },
      { title: '企业性质', dataIndex: 'enterpriseProperty', align: 'left', width: 110, resizable: true },
      { title: '行业', dataIndex: 'industry', align: 'left', width: 85, resizable: true },
      { title: '地区', dataIndex: 'district', align: 'left', width: 154, resizable: true },
      { title: '最新主体评级', dataIndex: 'entityRating', align: 'center', width: 110, resizable: true },
      { title: '债券市场', dataIndex: 'Exchange', align: 'center', width: 85, resizable: true },
      { title: '债券类型', dataIndex: 'bondType', align: 'center', width: 120, resizable: true },
      { title: '', width: '', dataIndex: 'blank', key: 'blank', resizable: true },
    ],
    [currentSort, setCurrentSort, params.skip, tableRef, getHightLightEl, history, onCopyBtnClick],
  );

  return columns;
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
