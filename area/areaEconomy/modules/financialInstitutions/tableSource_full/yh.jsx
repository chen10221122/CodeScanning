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

const TableYh = ({
  getCount,
  params,
  pageSize,
  type,
  resField,
  conditionHeight,
  filterConditionRef,
  scroll,
  sticky,
  tabTitle = '银行大全',
}) => {
  useTitle(tabTitle);
  const history = useHistory();
  /* 排序 */
  const [currentSort, setCurrentSort] = useState();
  useEffect(() => {
    filterConditionRef.current.sortChange(type, currentSort?.value || '');
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

  // 请求数据的时候就不去改变数据参数
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

  // 解决双滚动条处理
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [info.data]);

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
        className: 'pdd-8 fixedIndex',
        render: (_, __, i) => {
          return info.currentSkip + i + 1;
        },
      },
      {
        title: (
          <SortField
            sortOpt={{ key: '企业名称', name: '企业名称', value: '公司名称' }}
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
        title: <span title="信用评级">信用评级</span>,
        dataIndex: 'rating',
        width: 100,
        align: 'center',
        resizable: true,
        render(rating) {
          const text = rating ? rating.replace('级', '') : '-';
          return <span title={text}>{text}</span>;
        },
      },
      {
        title: <span title="">类型</span>,
        dataIndex: 'itType',
        width: 100,
        align: 'center',
        resizable: true,
        render(value) {
          return <span title={value}>{value}</span>;
        },
      },
      {
        title: <span title="企业性质">企业性质</span>,
        dataIndex: 'property',
        width: 90,
        align: 'center',
        resizable: true,
        render(property) {
          return <span title={property || '-'}>{property || '-'}</span>;
        },
      },
      {
        title: <span title="上市/发债">上市/发债</span>,
        dataIndex: 'range',
        width: 100,
        align: 'center',
        resizable: true,
        render(range) {
          return <span title={range || '-'}>{range || '-'}</span>;
        },
      },
      {
        title: <span title="法定代表人">法定代表人</span>,
        dataIndex: 'represent',
        width: 120,
        align: 'center',
        resizable: true,
        wrapLine: true,
        render(_, raw) {
          return raw.represent ? (
            <div className="overflow-text" title={raw.represent}>
              {raw.represent}
            </div>
          ) : (
            '-'
          );
        },
      },
      {
        title: (
          <SortField
            sortOpt={{ key: '注册资本', name: '注册资本', value: '注册资本' }}
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
        dataIndex: 'areas',
        width: 104,
        align: 'center',
        // resizable: true,
        render(value) {
          return <span title={value || '-'}>{value || '-'}</span>;
        },
      },
      {
        title: <span title="报告期">报告期</span>,
        dataIndex: 'reportDate',
        width: 100,
        align: 'center',
        resizable: true,
        render(_, raw) {
          const value = raw.reportDate ? dayjs(raw.reportDate).format('YYYY') + '年度' : '-';
          return <span title={value}>{value}</span>;
        },
      },
      {
        title: (
          <SortField
            sortOpt={{ key: '营业收入', name: '营业收入', value: '营业收入' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
          />
        ),
        dataIndex: 'revenues',
        width: 120,
        align: 'right',
        className: 'sortField',
        resizable: true,
        render(revenues) {
          return <span title={revenues || '-'}>{revenues || '-'}</span>;
        },
      },
      {
        title: (
          <SortField
            sortOpt={{ key: '总资产', name: '总资产', value: '总资产' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
          />
        ),
        dataIndex: 'totalAssets',
        width: 120,
        align: 'right',
        className: 'sortField',
        resizable: true,
        render(totalAssets) {
          return <span title={totalAssets || '-'}>{totalAssets || '-'}</span>;
        },
      },
      {
        title: (
          <SortField
            sortOpt={{ key: '净利润', name: '净利润', value: '净利润' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
          />
        ),
        dataIndex: 'profits',
        width: 120,
        align: 'right',
        className: 'sortField',
        resizable: true,
        render(profits) {
          return <span title={profits || '-'}>{profits || '-'}</span>;
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
            sticky={sticky}
            stripe={true}
            pagination={null}
          />
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
        </>
      ) : !pending ? (
        <Empty type={Empty.NO_SCREEN_DATA} style={{ marginTop: `${loadingTop}px` }} />
      ) : (
        <div />
      )}
    </>
  );
};

export default memo(TableYh);
