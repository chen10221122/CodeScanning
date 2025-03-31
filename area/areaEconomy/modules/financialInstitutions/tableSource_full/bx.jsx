import { memo, useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { getFullInfo } from '@/apis/full';
import { useTitle } from '@/app/libs/route';
import { Empty, Table as TableFinance } from '@/components/antd';
import PaginationWithCheck from '@/components/paginationWithCheck';
import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import useExtraColumn, { DEFAULTNOSORTCOLUMNOPTION } from '@/pages/full/financingInstitution/common/useExtraColumn';
import { addKey, getSortParams } from '@/pages/full/financingInstitution/utils/index';
import { useAsync, useImmer, useWindowSize } from '@/utils/hooks';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

const TableBx = ({
  getCount,
  params,
  pageSize,
  type,
  resField,
  filterConditionRef,
  scroll,
  sticky,
  tabTitle = '保险机构大全',
}) => {
  useTitle(tabTitle);
  const history = useHistory();
  /* 排序 */
  const [currentSort, setCurrentSort] = useImmer({
    value: '',
    rule: '',
  });
  useEffect(() => {
    filterConditionRef.current.sortChange(type, currentSort?.value || '', 'sort', currentSort?.rule || '');
  }, [currentSort?.value, filterConditionRef, type, currentSort?.rule]);
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

  const [sortlist, setSortlist] = useImmer({
    企业名称: '',
    风险综合评级: '',
    类型: '',
    企业性质: '',
    '上市/发债': '',
    法定代表人: '',
    注册资本: '',
    地区: '',
    报告期: '',
    营业收入: '',
    总资产: '',
    净利润: '',
  });

  // 表格排序
  const onChange = useCallback(
    (_, __, sorter) => {
      let order = '';
      if (sorter.order === 'ascend') {
        order = 'asc';
      } else if (sorter.order === 'descend') {
        order = 'desc';
      }

      let title = sorter?.column?.title?.props?.title ? getSortParams(sorter?.column?.title?.props?.title) : '';

      setCurrentSort((draft) => {
        draft.value = title;
        draft.rule = order;
      });

      let _sort = { ...sortlist };
      Object.keys(_sort).forEach((t) => {
        if (sorter?.column?.title?.props?.title) {
          setSortlist((d) => {
            if (t === sorter?.column?.title?.props?.title) {
              d[t] = sorter.order;
            } else {
              d[t] = '';
            }
          });
        } else {
          setSortlist((d) => {
            d[t] = '';
          });
        }
      });
    },
    [setCurrentSort, setSortlist, sortlist],
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
        title: <span title="企业名称">企业名称</span>,
        dataIndex: 'company',
        fixed: 'left',
        width: 220,
        align: 'left',
        sorter: () => {},
        sortOrder: sortlist['企业名称'],
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
        title: <span title="风险综合评级">风险综合评级</span>,
        dataIndex: 'rating',
        width: 120,
        align: 'center',
        sorter: () => {},
        sortOrder: sortlist['风险综合评级'],
        resizable: true,
        wrapLine: true,
        render(rating) {
          return <span title={rating || '-'}>{rating || '-'}</span>;
        },
      },
      {
        title: <span title="类型">类型</span>,
        dataIndex: 'itType',
        width: 90,
        align: 'center',
        sorter: () => {},
        sortOrder: sortlist['类型'],
        resizable: true,
        wrapLine: true,
        render(itType) {
          return <span title={itType || '-'}>{itType || '-'}</span>;
        },
      },
      {
        title: <span title="企业性质">企业性质</span>,
        dataIndex: 'property',
        width: 90,
        align: 'center',
        sorter: () => {},
        sortOrder: sortlist['企业性质'],
        resizable: true,
        wrapLine: true,
        render(property) {
          return <span title={property || '-'}>{property || '-'}</span>;
        },
      },
      {
        sorter: () => {},
        sortOrder: sortlist['上市/发债'],
        title: <span title="上市/发债">上市/发债</span>,
        dataIndex: 'ipoBond',
        width: 120,
        align: 'center',
        resizable: true,
        wrapLine: true,
        render(range) {
          return <span title={range || '-'}>{range || '-'}</span>;
        },
      },
      {
        title: <span title="法定代表人">法定代表人</span>,
        dataIndex: 'represent',
        width: 120,
        align: 'center',
        sorter: () => {},
        sortOrder: sortlist['法定代表人'],
        wrapLine: true,
        resizable: true,
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
        title: <span title="注册资本">注册资本</span>,
        sorter: () => {},
        sortOrder: sortlist['注册资本'],
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
        width: 100,
        align: 'right ',
        className: 'sortField',
        resizable: true,
        wrapLine: true,
        dataIndex: 'capital',
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
        sorter: () => {},
        sortOrder: sortlist['地区'],
        // resizable: true,
        wrapLine: true,
        render(areas) {
          return <span title={areas || '-'}>{areas || '-'}</span>;
        },
      },
      {
        title: <span title="报告期">报告期</span>,
        dataIndex: 'reportDate',
        width: 100,
        align: 'center',
        sorter: () => {},
        sortOrder: sortlist['报告期'],
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
        resizable: true,
        wrapLine: true,
        render(_, raw) {
          const value = raw.reportDate ? dayjs(raw.reportDate).format('YYYY') + '年度' : '-';
          return <span title={value}>{value}</span>;
        },
      },
      {
        title: <span title="营业收入">营业收入</span>,
        dataIndex: 'revenues',
        width: 120,
        align: 'right',
        sorter: () => {},
        sortOrder: sortlist['营业收入'],
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
        wrapLine: true,
        className: 'sortField',
        resizable: true,
        render(revenues) {
          return <span title={revenues || '-'}>{revenues || '-'}</span>;
        },
      },
      {
        title: <span title="总资产">总资产</span>,
        dataIndex: 'totalAssets',
        width: 120,
        align: 'right',
        sorter: () => {},
        sortOrder: sortlist['总资产'],
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
        wrapLine: true,
        className: 'sortField',
        resizable: true,
        render(totalAssets) {
          return <span title={totalAssets || '-'}>{totalAssets || '-'}</span>;
        },
      },
      {
        title: <span title="净利润">净利润</span>,
        dataIndex: 'profits',
        width: 120,
        align: 'right',
        sorter: () => {},
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
        sortOrder: sortlist['净利润'],
        className: 'sortField',
        resizable: true,
        wrapLine: true,
        render(profits) {
          return <span title={profits || '-'}>{profits || '-'}</span>;
        },
      },
    ],
    [history, info.currentSkip, params.keyword, sortlist, extraColumn],
  );

  return (
    <BXContent>
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
              onChange={onChange}
              showSorterTooltip={false}
              // locale="filterReset"
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
    </BXContent>
  );
};

export default memo(TableBx);

const BXContent = styled.div`
  .ant-table-column-sort {
    background: #fff !important;
  }
  .ant-table-column-has-sorters {
    height: 32px !important;
    &:hover {
      background: #f8faff !important;
    }
  }
  .ant-table-column-sorters {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 16px !important;
    /* &::after {
          display: none;
        } */
    .ant-table-column-sorter {
      margin-left: 4px;
      /* height:16px; */
      padding-top: 1px;
    }
  }
  .ant-table-column-title {
    white-space: nowrap;
  }
`;
