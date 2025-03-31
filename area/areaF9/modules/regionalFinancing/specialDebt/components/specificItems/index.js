import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';

import { Empty, Spin, Table } from '@/components/antd';
import PaginationWithCheck from '@/components/paginationWithCheck';
import SkeletonScreen from '@/components/skeletonScreen';
import { AREA_IS_CHANGE_STATUS } from '@/configs/localstorage';
import { LINK_AREA_ITEM_DETAIL } from '@/configs/routerMap';
import { ItemEnum, TitleItem } from '@/pages/area/areaF9/components';
import * as S from '@/pages/area/areaF9/style';
import useTableScroll from '@/pages/detail/common/useTableScroll';
import { urlQueriesSerialize } from '@/utils/url';

import DropLink from './tableDropdownLink';

// import Table from './financeTable';
// import Table from './financeTable';
const emptyFilter = (val) => {
  return val || val === 0 ? parseFloat(val).toFixed(2) : '-';
};
export default ({
  title,
  condition,
  tableData,
  isSpecificItemLoading,
  loading,
  pager,
  handlePageChange,
  execute,
  error,
  firstPageChange,
  searchType,
}) => {
  const history = useHistory();
  const scrollTo = useTableScroll('#项目明细');
  const columns = [
    {
      title: '序号',
      width: 58,
      align: 'center',
      className: 'pdd-8',
      fixed: 'left',
      render(text, row, index) {
        return condition.skip + index + 1;
      },
    },
    {
      title: <span title="项目名称">项目名称</span>,
      width: 270,
      align: 'left',
      dataIndex: 'projectName',
      fixed: 'left',
      resizable: { max: 960 },
      render: (text, row) => {
        return (
          <div
            className="table-under-link"
            onClick={() => history.push(`${LINK_AREA_ITEM_DETAIL}?projectCode=${row.projectCode}`)}
          >
            <span title={text || '-'}>{text || '-'}</span>
          </div>
        );
      },
    },
    {
      title: <span title="项目总投资(亿)">项目总投资(亿)</span>,
      width: 118,
      className: 'padding-10',
      align: 'right',
      dataIndex: 'projectTotalAmount',
      resizable: { max: 960 },
      render: (text) => {
        return <span title={emptyFilter(text)}>{emptyFilter(text)}</span>;
      },
    },
    {
      title: <span title="项目资本金(亿)">项目资本金(亿)</span>,
      width: 118,
      className: 'padding-10',
      align: 'right',
      dataIndex: 'projectCapitalFunds',
      resizable: { max: 960 },
      render: (text) => {
        return <span title={emptyFilter(text)}>{emptyFilter(text)}</span>;
      },
    },
    {
      title: <span title="项目收益倍数(倍)">项目收益倍数(倍)</span>,
      dataIndex: 'projectCoverageMultiple',
      width: 118,
      align: 'right',
      resizable: { max: 960 },
      render: (text) => {
        return <span title={emptyFilter(text)}>{emptyFilter(text)}</span>;
      },
    },
    {
      title: <span title="专项债金额(亿)">专项债金额(亿)</span>,
      dataIndex: 'thisYearBondAmount',
      width: 118,
      align: 'right',
      resizable: { max: 960 },
      render: (text) => {
        return <span title={emptyFilter(text)}>{emptyFilter(text)}</span>;
      },
    },
    {
      title: <span title="专项债用作资本金(亿)">专项债用作资本金(亿)</span>,
      dataIndex: 'thisYearCapitalAmount',
      width: 118,
      align: 'right',
      resizable: { max: 960 },
      render: (text) => {
        return <span title={emptyFilter(text)}>{emptyFilter(text)}</span>;
      },
    },
    {
      title: <span title="项目主体">项目主体</span>,
      dataIndex: 'personInfo',
      width: 244,
      align: 'left',
      resizable: { max: 960 },
      render: (text) => {
        const valueObj =
          text?.length && text.filter((o) => o.personType === 1)?.length ? text.filter((o) => o.personType === 1) : [];
        let nameList = [],
          urlList = [];
        valueObj.forEach((element) => {
          nameList.push(element?.personName);
          element.personCode2
            ? urlList.push(
              '/detail/enterprise/overview' + urlQueriesSerialize({ code: element.personCode2, type: 'company' }),
            )
            : urlList.push('');
        });
        return <DropLink nameList={nameList} urlList={urlList} tabId="specialDebt"></DropLink>;
      },
    },
  ];

  useEffect(() => {
    const wrap = document.querySelector('.main-container');
    wrap.style.overflow = loading ? 'hidden' : 'overlay';

    if (firstPageChange) {
      // 上方的模块,12是模块之间的间隔高度(两个), 补充头部的高度差
      const prevModelHeight = document.getElementById('special_debt_projects_container').clientHeight + 12 + 30;
      wrap.scrollTop = prevModelHeight;
    }
    // 监听tableData是为了确保已经有了数据
  }, [loading, tableData, firstPageChange]);

  // 解决双滚动条
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [tableData]);

  return (
    <S.Container id="specialDebt" style={{ paddingBottom: '4px' }}>
      <TitleItem type={ItemEnum.XMMX}></TitleItem>

      {isSpecificItemLoading && sessionStorage.getItem(AREA_IS_CHANGE_STATUS) !== '1' ? (
        <div style={{ height: 'calc(100vh - 543px)' }}>
          <SkeletonScreen num={1} firstStyle={{ paddingTop: '23px' }} />
        </div>
      ) : (
        <div className="area-economy-table-wrap">
          {error ? (
            <Empty type={Empty.MODULE_LOAD_FAIL} onClick={() => execute({ ...condition })} />
          ) : tableData?.length ? (
            <ChangeScreenStyle>
              <Spin
                type="square"
                spinning={
                  loading && sessionStorage.getItem(AREA_IS_CHANGE_STATUS) !== '1' && searchType !== 'screenType'
                }
              >
                <Table
                  rowKey="projectName"
                  className="specific-table specialDebt-table"
                  columns={columns}
                  type="stickyTable"
                  dataSource={tableData}
                  scrollTo={scrollTo}
                  scroll={{
                    x: 900,
                  }}
                  sticky={{
                    offsetHeader: 38,
                    getContainer: () => document.querySelector('.main-container') || window,
                  }}
                  pagination={null}
                  onChange={null}
                  hideOnSinglePage
                />
                <PaginationWithCheck
                  size="small"
                  current={pager.current}
                  pageSize={pager.pagesize}
                  total={pager.total}
                  hideOnSinglePage={true}
                  showSizeChanger={false}
                  onPageChange={handlePageChange}
                />
              </Spin>
            </ChangeScreenStyle>
          ) : (
            <Empty type={Empty.NO_MODULE_RELATED} className="module-empty" />
          )}
        </div>
      )}
    </S.Container>
  );
};

export const ChangeScreenStyle = styled.div`
  .ant-spin-nested-loading {
    & > div > .ant-spin {
      max-height: 400px !important;
      display: block;
      height: 100%;
      left: 0;
      max-height: 400px;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 5;
    }
    .ant-spin-blur {
      overflow: initial;
      opacity: 0.1;
    }
  }

  .ant-spin-nested-loading > div > .ant-spin .ant-spin-dot {
    // top: 200px;
  }
  /* 去除表格阴影 */
  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: none;
  }
`;
