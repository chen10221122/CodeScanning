import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { isUndefined } from 'lodash';

import { Table } from '@/components/antd';
import { LINK_DETAIL_ENTERPRISE, LINK_AREA_ECONOMY } from '@/configs/routerMap';
import { handleTableDataFormat } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { defaultIndicators } from './index';
// import Table from './financeTable';
const equityRelationshipList = { 1: '直接控股', 2: '间接控股' };

export const optionalColumns = [
  {
    title: <span title="总资产(亿元)">总资产(亿元)</span>,
    dataIndex: 'BD0320_011',
    key: 'BD0320_011',
    width: 119,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text, { unit: 1e8 })}
        </span>
      );
    },
  },
  {
    title: <span title="货币资金(亿元)">货币资金(亿元)</span>,
    dataIndex: 'BD0320_013',
    key: 'BD0320_013',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text, { unit: 1e8 })}
        </span>
      );
    },
  },
  {
    title: <span title="">土地资产(亿元)</span>,
    dataIndex: 'BD0320_029',
    key: 'BD0320_029',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text, { unit: 1e8 })}
        </span>
      );
    },
  },
  {
    title: <span title="受限资产(亿元)">受限资产(亿元)</span>,
    dataIndex: 'BD0320_025',
    key: 'BD0320_025',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text, { unit: 1e8 })}
        </span>
      );
    },
  },
  {
    title: <span title="应收账款(亿元)">应收账款(亿元)</span>,
    dataIndex: 'BD0320_014',
    key: 'BD0320_014',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text, { unit: 1e8 })}
        </span>
      );
    },
  },
  {
    title: <span title="应收类款项来自政府占比(%)">应收类款项来自政府占比(%)</span>,
    dataIndex: 'BD0320_027',
    key: 'BD0320_027',
    width: 189,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text)}
        </span>
      );
    },
  },
  {
    title: <span title="营业收入(亿元)">营业收入(亿元)</span>,
    dataIndex: 'BD0320_012',
    key: 'BD0320_012',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text, { unit: 1e8 })}
        </span>
      );
    },
  },
  {
    title: <span title="公益性&准公益性主营占比(%)">公益性&准公益性主营占比(%)</span>,
    dataIndex: 'BD0320_028',
    key: 'BD0320_028',
    width: 199,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text)}
        </span>
      );
    },
  },
  {
    title: <span title="归母净利润(亿元)">归母净利润(亿元)</span>,
    dataIndex: 'BD0320_015',
    key: 'BD0320_015',
    width: 139,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text, { unit: 1e8 })}
        </span>
      );
    },
  },
  {
    title: <span title="政府补助(亿元)">政府补助(亿元)</span>,
    dataIndex: 'BD0320_026',
    key: 'BD0320_026',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text, { unit: 1e8 })}
        </span>
      );
    },
  },
  {
    title: <span title="总资产报酬率(%)">总资产报酬率(%)</span>,
    dataIndex: 'BD0320_016',
    key: 'BD0320_016',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text)}>
          {handleTableDataFormat(text)}
        </span>
      );
    },
  },
  {
    title: <span title="有息债务(亿元)">有息债务(亿元)</span>,
    dataIndex: 'BD0320_021',
    key: 'BD0320_021',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text, { unit: 1e8 })}
        </span>
      );
    },
  },
  {
    title: <span title="短期债务(亿元)">短期债务(亿元)</span>,
    dataIndex: 'BD0320_022',
    key: 'BD0320_022',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text, { unit: 1e8 })}
        </span>
      );
    },
  },
  {
    title: <span title="借款(亿元)">借款(亿元)</span>,
    dataIndex: 'BD0320_020',
    key: 'BD0320_020',
    width: 119,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text)}>
          {handleTableDataFormat(text, { unit: 1e8 })}
        </span>
      );
    },
  },
  {
    title: <span title="债券余额(亿元)">债券余额(亿元)</span>,
    dataIndex: 'BD0320_002',
    key: 'BD0320_002',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text)}>
          {handleTableDataFormat(text)}
        </span>
      );
    },
  },
  {
    title: <span title="私募债占比(%)">私募债占比(%)</span>,
    dataIndex: 'BD0320_004',
    key: 'BD0320_004',
    width: 139,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text)}>
          {handleTableDataFormat(text)}
        </span>
      );
    },
  },
  {
    title: <span title="非标融资(亿元)">非标融资(亿元)</span>,
    dataIndex: 'BD0320_019',
    key: 'BD0320_019',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text, { unit: 1e8 })}>
          {handleTableDataFormat(text, { unit: 1e8 })}
        </span>
      );
    },
  },
  {
    title: <span title="资产负债率(%)">资产负债率(%)</span>,
    dataIndex: 'BD0320_017',
    key: 'BD0320_017',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text)}>
          {handleTableDataFormat(text)}
        </span>
      );
    },
  },
  {
    title: <span title="债务资本化比率(%)">债务资本化比率(%)</span>,
    dataIndex: 'BD0320_018',
    key: 'BD0320_018',
    width: 149,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text)}>
          {handleTableDataFormat(text)}
        </span>
      );
    },
  },
  {
    title: <span title="对外担保比例(%)">对外担保比例(%)</span>,
    dataIndex: 'BD0320_005',
    key: 'BD0320_005',
    width: 139,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text)}>
          {handleTableDataFormat(text)}
        </span>
      );
    },
  },
  {
    title: <span title="EBITDA保障倍数(倍)">EBITDA保障倍数(倍)</span>,
    dataIndex: 'BD0320_023',
    key: 'BD0320_023',
    width: 150,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text)}>
          {handleTableDataFormat(text)}
        </span>
      );
    },
  },
  {
    title: <span title="EBITDA全部债务比(%)">EBITDA全部债务比(%)</span>,
    dataIndex: 'BD0320_024',
    key: 'BD0320_024',
    width: 159,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text * 100)}>
          {handleTableDataFormat(text * 100)}
        </span>
      );
    },
  },
  {
    title: <span title="授信余额(亿元)">授信余额(亿元)</span>,
    dataIndex: 'BD0320_009',
    key: 'BD0320_009',
    width: 129,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-right" title={handleTableDataFormat(text)}>
          {handleTableDataFormat(text)}
        </span>
      );
    },
  },
  {
    title: <span title="">报告期</span>,
    dataIndex: 'BD0320_010',
    key: 'BD0320_010',
    width: 119,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (date) => {
      return date ? date.split('T')[0] : '-';
    },
  },
  {
    title: <span title="实控人">实控人</span>,
    dataIndex: 'ITName_P',
    key: 'ITName_P',
    width: 369,
    align: 'center',
    // sorter: true,
    resizable: { max: 960 },
    render: (text) => {
      return (
        <span className="text-left" title={text ?? '-'}>
          {text ?? '-'}
        </span>
      );
    },
  },
];

const PlatformTable = ({ params, data, total, handlePageChange, loading }) => {
  const curPage = Math.floor(params.skip / params.pagesize);

  const indicatorColumns = useMemo(() => {
    if (defaultIndicators === params?.includes) return optionalColumns;
    return optionalColumns.filter((column) => params?.includes?.includes(column.key));
  }, [params]);

  const columns = [
    {
      title: '序号',
      key: 'orderNumber',
      align: 'center',
      width: Math.max(`${(curPage - 1) * 50}`.length * 15, 66),
      // fixed: 'left',
      render: (_, row, index) => {
        return index + 1 + params.skip;
      },
    },
    {
      title: <span title="城投平台">城投平台</span>,
      dataIndex: 'ITName',
      key: 'ITName',
      align: 'left',
      width: 280,
      // fixed: 'left',
      // sorter: true,
      resizable: { max: 960 },
      render: (text, row) => {
        return (
          <Link
            title={text}
            to={urlJoin(
              dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
              urlQueriesSerialize({
                type: 'company',
                code: row.ITCode2,
              }),
            )}
            style={{ color: '#025CDC' }}
            className="company-name link table-under-link"
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: <span title="地区">地区</span>,
      dataIndex: 'DD0030_002',
      // sorter: true,
      key: 'DD0030_002',
      align: 'center',
      width: 89,
      resizable: { max: 960 },
      render: (text, { countiesCode, cityCode, provinceCode }) => {
        return !isUndefined(text) ? (
          <Link
            className="link inline-block"
            to={urlJoin(
              dynamicLink(LINK_AREA_ECONOMY, { key: 'regionEconomy' }),
              urlQueriesSerialize({
                code: countiesCode ?? cityCode ?? provinceCode,
              }),
            )}
            style={{ color: '#025CDC' }}
          >
            {text}
          </Link>
        ) : (
          '-'
        );
      },
    },
    {
      title: <span title="城投评分">城投评分</span>,
      dataIndex: 'CR0202_001',
      // sorter: true,
      key: 'CR0202_001',
      align: 'center',
      width: 89,
      resizable: { max: 960 },
      render: (text, row, index) => {
        return !isUndefined(text) ? (
          <span
            title={text.toFixed(2)}
            className="check"
            onClick={() => {
              // propData(getChildrenMsg, index, 2);
            }}
          >
            {text.toFixed(2)}
          </span>
        ) : (
          '-'
        );
      },
    },
    {
      title: <span title="省内排名">省内排名</span>,
      dataIndex: 'rank',
      // sorter: true,
      key: 'rank',
      width: 89,
      align: 'center',
      resizable: { max: 960 },
      render: (text, row) => {
        return (
          <div className="text-right" title={text && row?.total ? text + '/' + row?.total : '-'}>
            {text && row?.total ? text + '/' + row?.total : '-'}
          </div>
        );
      },
    },
    {
      title: <span title="行政级别">行政级别</span>,
      dataIndex: 'CR0084_012',
      // sorter: true,
      key: 'CR0084_012',
      width: 89,
      align: 'center',
      resizable: { max: 960 },
      render: (text) => {
        return <span title={text ?? '-'}>{text ?? '-'}</span>;
      },
    },
    {
      title: <span title="股东背景">股东背景</span>,
      dataIndex: 'CR0084_009',
      key: 'CR0084_009',
      // sorter: true,
      width: 89,
      align: 'center',
      resizable: { max: 960 },
      render: (text) => {
        return <span title={text ?? '-'}>{text ?? '-'}</span>;
      },
    },
    {
      title: <span title="股权关系">股权关系</span>,
      dataIndex: 'equityRelationship',
      // sorter: true,
      key: 'equityRelationship',
      width: 89,
      align: 'center',
      resizable: { max: 960 },
      render: (text) => {
        return <span title={equityRelationshipList[text] || '-'}>{equityRelationshipList[text] || '-'}</span>;
      },
    },
    {
      title: <span title="平台重要性">平台重要性</span>,
      dataIndex: 'importance',
      // sorter: true,
      key: 'importance',
      width: 109,
      align: 'center',
      resizable: { max: 960 },
      render: (text) => {
        return <span title={text ?? '-'}>{text ?? '-'}</span>;
      },
    },
    {
      title: <span title="城投口径">城投口径</span>,
      dataIndex: 'CR0084_016',
      // sorter: true,
      key: 'CR0084_016',
      width: 119,
      align: 'center',
      resizable: { max: 960 },
      render: (text) => {
        return <span title={text.replace('银保监会城投', '银保监会')}>{text.replace('银保监会城投', '银保监会')}</span>;
      },
    },
    {
      title: <span title="主体评级">主体评级</span>,
      dataIndex: 'BD0320_001',
      key: 'BD0320_001',
      width: 129,
      align: 'center',
      // sorter: true,
      resizable: { max: 960 },
      render: (text) => {
        return <span title={text ?? '-'}>{text ?? '-'}</span>;
      },
    },
    ...indicatorColumns,
  ];

  return (
    <Table
      stripe={true}
      type="stickyTable"
      rowKey="ITName"
      columns={columns}
      dataSource={data}
      scroll={{ x: 1470 }}
      sticky={{ offsetHeader: 168, getContainer: () => document.getElementById('tabsWrapper') || window }}
      onChange={handlePageChange}
      pagination={{
        total,
        size: 'small',
        pageSize: params.pagesize,
        current: curPage + 1,
        showSizeChanger: false,
        hideOnSinglePage: true,
      }}
    />
  );
};

export default memo(PlatformTable);
