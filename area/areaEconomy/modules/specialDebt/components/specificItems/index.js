import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';

import { Empty, Row, Table, Spin } from '@/components/antd';
import PaginationWithCheck from '@/components/paginationWithCheck';
import SkeletonScreen from '@/components/skeletonScreen';
import { AREA_IS_CHANGE_STATUS } from '@/configs/localstorage';
import { LINK_AREA_ITEM_DETAIL } from '@/configs/routerMap';
import LgEmpty from '@/pages/area/areaEconomy/components/LgEmpty';
import useTableScroll from '@/pages/detail/common/useTableScroll';
import { urlQueriesSerialize } from '@/utils/url';

import { ChangeScreenStyle } from '../../../../style';
import * as S from '../../../../style';
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
      render(text, row, index) {
        return condition.skip + index + 1;
      },
    },
    {
      title: <span title="项目名称">项目名称</span>,
      width: 270,
      align: 'left',
      dataIndex: 'projectName',
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
    const wrap = document.getElementById('tabsWrapper');
    wrap.style.overflow = loading ? 'hidden' : 'overlay';

    if (firstPageChange) {
      // 上方的模块,12是模块之间的间隔高度(两个), 补充头部的高度差
      const prevModelHeight = document.getElementById('special_debt_projects_container').clientHeight + 12 + 30;
      wrap.scrollTop = prevModelHeight;
    }
    // 监听tableData是为了确保已经有了数据
  }, [loading, tableData, firstPageChange]);

  return (
    <S.Container id="specialDebt" style={{ paddingBottom: '4px' }}>
      <FilterContainer>
        <div className="screen-wrap custom-area-economy-screen-wrap">
          <Row className="select-wrap">
            <div className="card-title">{title}</div>
          </Row>
        </div>
      </FilterContainer>

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
                  sticky={{ offsetHeader: 142, getContainer: () => document.getElementById('tabsWrapper') || window }}
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
            <LgEmpty show={!loading && !tableData?.length} type={Empty.NO_DATA_LG} />
          )}
        </div>
      )}
    </S.Container>
  );
};

const FilterContainer = styled.div`
  position: sticky;
  z-index: 7;
  top: 102px;
  padding: 10px 0;
  margin: 6px 0 2px;
  box-sizing: content-box;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  height: 20px;
`;
