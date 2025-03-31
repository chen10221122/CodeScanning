import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import dayjs from 'dayjs';

import { getFullInfo } from '@/apis/full';
import { useTitle } from '@/app/libs/route';
import { Empty, Table as TableFinance } from '@/components/antd';
import PaginationWithCheck from '@/components/paginationWithCheck';
import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import useExtraColumn, { DEFAULTNOSORTCOLUMNOPTION } from '@/pages/full/financingInstitution/common/useExtraColumn';
import SortField from '@/pages/full/financingInstitution/components/SortField';
import { addKey } from '@/pages/full/financingInstitution/utils';
import { useAsync, useImmer, useWindowSize } from '@/utils/hooks';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

// FD0016_006 是intelligentSort字段默认值 初始不可为''
// 进入页面默认按照最新规模降序排 即intelligentSort: FD0016_006
const defaultCurrentSort = {
  value: 'FD0016_006',
};

const TableJj = ({
  getCount,
  params,
  pageSize,
  type,
  resField,
  conditionHeight,
  filterConditionRef,
  scroll,
  sticky,
  tabTitle = '基金公司大全',
}) => {
  useTitle(tabTitle);
  const history = useHistory();
  /* 排序 */
  const [currentSort, setCurrentSort] = useState(defaultCurrentSort);
  useEffect(() => {
    filterConditionRef.current.sortChange(type, currentSort?.value || '', 'intelligentSort');
  }, [currentSort?.value, filterConditionRef, type]);
  const { height } = useWindowSize();
  const loadingTop = height * 0.1;

  const [info, setInfo] = useImmer({ total: 0, data: [], currentSkip: 0, currentPage: 1 });
  const { execute: getInfo, data: infoData, pending, error } = useAsync(getFullInfo);

  const extraColumn = useExtraColumn(DEFAULTNOSORTCOLUMNOPTION);

  useEffect(() => {
    if (error?.returncode === 100 || error?.returncode === 500) {
      setInfo((old) => {
        old.data = [];
        old.total = 0;
      });
      getCount(0);
    }
  }, [error, getCount, setInfo]);

  useEffect(() => {
    getInfo(params, type);
    setInfo((d) => {
      d.currentSkip = params.skip;
      d.currentPage = Math.ceil(params.skip / 10 + 1);
    });
  }, [getInfo, params, type, setInfo]);

  useEffect(() => {
    if (infoData && !pending) {
      getCount(info.total);
      setInfo((old) => {
        old.data = infoData[resField[0]];
        old.total = infoData[resField[1]];
      });
    }
  }, [getCount, info.total, infoData, pending, resField, setInfo]);

  const handlePageChg = useCallback(
    (page) => {
      let currentSkip = pageSize * (page - 1);
      filterConditionRef.current.setSkip(currentSkip, type);
      setInfo((old) => {
        old.currentSkip = currentSkip;
        old.currentPage = page;
      });
    },
    [filterConditionRef, setInfo, type, pageSize],
  );

  const columns = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        width: 60,
        align: 'center',
        fixed: 'left',
        className: 'pdd-8',
        render: (_, __, i) => {
          return info.currentSkip + i + 1;
        },
      },
      {
        title: (
          <SortField
            sortOpt={{ key: '企业名称', name: '企业名称', value: 'prefixLetter' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
          />
        ),
        dataIndex: 'company',
        width: 220,
        align: 'left',
        fixed: 'left',
        className: 'sortField',
        wrapLine: true,
        resizable: { max: 880 },
        render(_, raw) {
          return raw.company ? (
            <div
              className="company-name"
              onClick={() =>
                history.push(
                  urlJoin(
                    dynamicLink(LINK_DETAIL_ENTERPRISE, {
                      key: '',
                    }),
                    urlQueriesSerialize({ type: 'company', code: raw?.itcode2 || raw?.itcode }),
                  ),
                )
              }
            >
              {params.keyword !== '' && raw?.company.includes(params.keyword) ? (
                <span
                  title={raw.company}
                  dangerouslySetInnerHTML={{
                    __html: raw.company.replace(
                      params.keyword,
                      `<span class="highlight-text">${params.keyword}</span>`,
                    ),
                  }}
                ></span>
              ) : (
                <span title={raw.company}>{raw.company}</span>
              )}
            </div>
          ) : (
            '-'
          );
        },
      },
      {
        title: <span title="最新基金只数">最新基金只数</span>,
        dataIndex: 'fundNumber',
        width: 110,
        align: 'right',
        resizable: true,
        render(fundNumber) {
          return <span title={fundNumber || '-'}>{fundNumber || '-'}</span>;
        },
      },
      {
        title: <span title="最新管理规模">最新管理规模</span>,
        dataIndex: 'manageScale',
        width: 120,
        align: 'right',
        resizable: true,
        render(manageScale) {
          return <span title={manageScale || '-'}>{manageScale || '-'}</span>;
        },
      },
      {
        title: <span title="股东类型">股东类型</span>,
        dataIndex: 'companyType',
        width: 100,
        align: 'center',
        resizable: true,
        render(companyType) {
          return <span title={companyType || '-'}>{companyType || '-'}</span>;
        },
      },
      {
        title: <span title="法定代表人">法定代表人</span>,
        dataIndex: 'legalPerson',
        width: 120,
        align: 'center',
        wrapLine: true,
        resizable: true,
        render(legalPerson) {
          return <span title={legalPerson || '-'}>{legalPerson || '-'}</span>;
        },
      },
      {
        title: (
          <SortField
            sortOpt={{ key: '注册资本', name: '注册资本', value: 'FD0016_004' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
          />
        ),
        dataIndex: 'capital',
        width: 100,
        align: 'right',
        className: 'sortField',
        resizable: true,
        render(capital) {
          return <span title={capital || '-'}>{capital || '-'}</span>;
        },
      },
      ...extraColumn,
      {
        title: <span title="地区">地区</span>,
        dataIndex: 'area',
        width: 90,
        align: 'center',
        // resizable: true,
        render(area) {
          return <span title={area || '-'}>{area || '-'}</span>;
        },
      },
      {
        title: <span title="报告期">报告期</span>,
        dataIndex: 'reportPeriod',
        width: 100,
        align: 'center',
        resizable: true,
        render(_, raw) {
          const value = raw.reportPeriod ? dayjs(raw.reportPeriod).format('YYYY') + '年度' : '-';
          return <span title={value}>{value}</span>;
        },
      },
      {
        title: <span title="营业收入">营业收入</span>,
        dataIndex: 'revenue',
        width: 120,
        align: 'right',
        resizable: true,
        render(revenue) {
          return <span title={revenue || '-'}>{revenue || '-'}</span>;
        },
      },
      {
        title: <span title="总资产">总资产</span>,
        dataIndex: 'totalAssets',
        width: 120,
        align: 'right',
        resizable: true,
        render(totalAssets) {
          return <span title={totalAssets || '-'}>{totalAssets || '-'}</span>;
        },
      },
      {
        title: <span title="净利润">净利润</span>,
        dataIndex: 'netProfit',
        width: 120,
        align: 'right',
        resizable: true,
        render(netProfit) {
          return <span title={netProfit || '-'}>{netProfit || '-'}</span>;
        },
      },
    ],
    [currentSort, history, info.currentSkip, params.keyword, extraColumn],
  );

  return (
    <>
      {info.data.length ? (
        <>
          <TableFinance
            type="stickyTable"
            columns={columns}
            dataSource={addKey(info.data)}
            scroll={scroll}
            stripe={true}
            sticky={{
              offsetHeader: 142,
              getContainer: () => document.getElementById('tabsWrapper') || window,
            }}
            pagination={null}
          />
          {!pending ? (
            <PaginationWithCheck
              current={info.currentPage}
              className="pagination"
              hideOnSinglePage={true}
              pageSize={pageSize}
              total={info.total}
              size="small"
              showSizeChanger={false}
              onPageChange={handlePageChg}
            />
          ) : null}
        </>
      ) : !pending ? (
        <Empty type={Empty.NO_SCREEN_DATA} style={{ marginTop: `${loadingTop}px` }} />
      ) : (
        <div />
      )}
    </>
  );
};

export default memo(TableJj);
