import { useMemo } from 'react';

import styled from 'styled-components';

import { LINK_DECISION_DETAIL_NEW, LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { getProductType } from '@/pages/bond/nonStandardAssetRisk/_rebuildData';
import CustomLink from '@/pages/bond/nonStandardAssetRisk/components/customLink';
import { highlight } from '@/utils/dom';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import makeListData from '@/utils/topicCommon';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';
const RiskTypeNameMap = new Map<number, string>([
  [1, '风险提示'],
  [2, '已违约'],
  [3, '已还清'],
]);
type ParamsType = {
  keyword: string;
  data: any;
  skip: number;
  handleCheckClick: Function;
};
const CustomLinkT = CustomLink as any;
const getNewsSourceLink = (o: any) => {
  return o.id
    ? o.type === 'litigate'
      ? `${LINK_DECISION_DETAIL_NEW}?type=${o.type}&id=${o.guid}`
      : o.pcContentLink
    : '';
};
export default function useColumn({ keyword, data, skip, handleCheckClick }: ParamsType) {
  const column = useMemo(() => {
    return [
      {
        title: '序号',
        align: 'center',
        key: 'index',
        dataIndex: 'index',
        fixed: true,
        className: 'pdd-8',
        resizable: false,
        width: Math.max(`${skip}`.length * 12, 45),
        render(_: any, __: any, index: number) {
          return <>{skip + 1 + index}</>;
        },
      },
      {
        title: '产品名称',
        align: 'left',
        key: 'productName',
        dataIndex: 'productName',
        fixed: true,
        resizable: { max: 780 - (42 + Math.max((String(skip * 50).length - 2) * 8, 0)) },
        width: 315,
        render: (text: string, row: any) => {
          return text ? (
            <span title={row.productName}>{highlight(row.productName, keyword)}</span>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '产品类型',
        align: 'left',
        key: 'productType',
        dataIndex: 'productType',
        resizable: true,
        width: 127,
        render: (text: string) => {
          return text ? (
            <span title={getProductType(text)}>{getProductType(text)}</span>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '风险类型',
        align: 'left',
        key: 'riskType',
        dataIndex: 'riskType',
        resizable: true,
        width: 101,
        render: (_: string, row: any) => {
          return row.riskType ? (
            <span title={RiskTypeNameMap.get(row.riskType)}>{RiskTypeNameMap.get(row.riskType)}</span>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '违约金额(万元)',
        align: 'right',
        key: 'defaultAmount',
        dataIndex: 'defaultAmount',
        resizable: true,
        width: 115,
        render: (text: number) => {
          return text ? (
            <span title={formatNumber(text, 2)}>{formatNumber(text, 2)}</span>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '最新进展',
        align: 'center',
        key: 'financingSchedule',
        dataIndex: 'financingSchedule',
        resizable: true,
        width: 80,
        render: (text: string, row: any) => {
          return text ? (
            <LinkStyle
              onClick={() =>
                handleCheckClick(
                  keyword ? highlight(row.productName, keyword) : row.productName,
                  row.financingSchedule || '',
                )
              }
            >
              查看
            </LinkStyle>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '信源',
        align: 'center',
        key: 'id',
        dataIndex: 'id',
        resizable: true,
        width: 52,
        render: (text: string, row: any) => {
          return text && row.pcContentLink ? (
            <CustomLinkT className="blue-link" href={getNewsSourceLink(row)} target="_blank">
              查看
            </CustomLinkT>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '地区',
        align: 'left',
        key: 'province',
        dataIndex: 'province',
        resizable: true,
        width: 153,
        render: (text: string, row: any) => {
          return text ? <span title={text}>{text}</span> : <span className="empty-td">-</span>;
        },
      },
      {
        title: '融资方',
        align: 'left',
        key: 'financingCode',
        dataIndex: 'financingCode',
        resizable: true,
        width: 179,
        render: (text: string, row: any) => {
          return row.financingCode ? (
            <div className="wrap-td">
              <CustomLinkT
                className="title primary-hover"
                href={urlJoin(
                  dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                  urlQueriesSerialize({
                    type: 'company',
                    code: row.financingCode,
                  }),
                )}
                target="_blank"
                title={row.financingParty}
              >
                {highlight(row.financingParty, keyword)}
              </CustomLinkT>
            </div>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '管理人',
        align: 'left',
        key: 'managementCode',
        dataIndex: 'managementCode',
        resizable: true,
        width: 179,
        render: (text: string, row: any) => {
          return row.managementCode ? (
            <div className="wrap-td">
              {makeListData(row.managementParty, row.managementCode, keyword).map((ele: any) => {
                return (
                  <CustomLinkT
                    className="title primary-hover"
                    href={ele.link}
                    target="_blank"
                    title={ele.value}
                    key={ele.code}
                  >
                    {ele.value}
                  </CustomLinkT>
                );
              })}
            </div>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '担保人',
        align: 'left',
        key: 'guaranteeCode',
        dataIndex: 'guaranteeCode',
        resizable: true,
        width: 179,
        render: (text: string, row: any) => {
          return row.guaranteeCode ? (
            <div className="wrap-td">
              {makeListData(row.guaranteeParty, row.guaranteeCode, keyword).map((ele: any) => {
                return (
                  <CustomLinkT
                    className="title primary-hover"
                    href={ele.link}
                    target="_blank"
                    title={ele.value}
                    key={ele.code}
                  >
                    {ele.value}
                  </CustomLinkT>
                );
              })}
            </div>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '托管人',
        align: 'left',
        key: 'custodianCode',
        dataIndex: 'custodianCode',
        resizable: true,
        width: 179,
        render: (text: string, row: any) => {
          return row.custodianCode ? (
            <div className="wrap-td">
              {makeListData(row.custodian, row.custodianCode, keyword).map((ele: any) => {
                return (
                  <CustomLinkT
                    className="title primary-hover"
                    href={ele.link}
                    target="_blank"
                    title={ele.value}
                    key={ele.code}
                  >
                    {ele.value}
                  </CustomLinkT>
                );
              })}
            </div>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '委托人',
        align: 'left',
        key: 'attorneyCode',
        dataIndex: 'attorneyCode',
        resizable: true,
        width: 179,
        render: (text: string, row: any) => {
          return row.attorneyCode ? (
            <div className="wrap-td">
              {makeListData(row.attorneyName, row.attorneyCode, keyword).map((ele: any) => {
                return (
                  <CustomLinkT
                    className="title primary-hover"
                    href={ele.link}
                    target="_blank"
                    title={ele.value}
                    key={ele.code}
                  >
                    {ele.value}
                  </CustomLinkT>
                );
              })}
            </div>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '回购方',
        align: 'left',
        key: 'counterpurchaseCode',
        dataIndex: 'counterpurchaseCode',
        resizable: true,
        width: 179,
        render: (text: string, row: any) => {
          return row.counterpurchaseCode ? (
            <div className="wrap-td">
              {makeListData(row.counterpurchaseName, row.counterpurchaseCode, keyword).map((ele: any) => {
                return (
                  <CustomLinkT
                    className="title primary-hover"
                    href={ele.link}
                    target="_blank"
                    title={ele.value}
                    key={ele.code}
                  >
                    {ele.value}
                  </CustomLinkT>
                );
              })}
            </div>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '出租人',
        align: 'left',
        key: 'leaserCode',
        dataIndex: 'leaserCode',
        resizable: true,
        width: 179,
        render: (text: string, row: any) => {
          return row.leaserCode ? (
            <div className="wrap-td">
              {makeListData(row.leaserName, row.leaserCode, keyword).map((ele: any) => {
                return (
                  <CustomLinkT
                    className="title primary-hover"
                    href={ele.link}
                    target="_blank"
                    title={ele.value}
                    key={ele.code}
                  >
                    {ele.value}
                  </CustomLinkT>
                );
              })}
            </div>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '代销机构',
        align: 'left',
        key: 'salesAgencyCode',
        dataIndex: 'salesAgencyCode',
        resizable: true,
        width: 179,
        render: (text: string, row: any) => {
          return row.salesAgencyCode ? (
            <div className="wrap-td">
              {makeListData(row.salesAgency, row.salesAgencyCode, keyword).map((ele: any) => {
                return (
                  <CustomLinkT
                    className="title primary-hover"
                    href={ele.link}
                    target="_blank"
                    title={ele.value}
                    key={ele.code}
                  >
                    {ele.value}
                  </CustomLinkT>
                );
              })}
            </div>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '最终融资方',
        align: 'left',
        key: 'finalFinancingCode',
        dataIndex: 'finalFinancingCode',
        resizable: true,
        width: 179,
        render: (text: string, row: any) => {
          return row.finalFinancingCode ? (
            <div className="wrap-td">
              {makeListData(row.finalFinancingParty, row.finalFinancingCode, keyword).map((ele: any) => {
                return (
                  <CustomLinkT
                    className="title primary-hover"
                    href={ele.link}
                    target="_blank"
                    title={ele.value}
                    key={ele.code}
                  >
                    {ele.value}
                  </CustomLinkT>
                );
              })}
            </div>
          ) : (
            <span className="empty-td">-</span>
          );
        },
      },
      {
        title: '是否偿还',
        align: 'center',
        key: 'isPaidBack',
        dataIndex: 'isPaidBack',
        resizable: true,
        width: 80,
        render: (text: string, row: any) => {
          return <span title={''}>{row.isPaidBack ? '是' : row.isPaidBack === 0 ? '否' : '-'}</span>;
        },
      },
      {
        title: '披露日期',
        align: 'center',
        key: 'disclosureDate',
        dataIndex: 'disclosureDate',
        resizable: true,
        width: 95,
        render: (text: string, row: any) => {
          return text ? <span title={text}>{text}</span> : <span className="empty-td">-</span>;
        },
      },
    ];
  }, [skip, keyword, handleCheckClick]);

  return {
    column,
  };
}
const LinkStyle = styled.div`
  color: #025cdc;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
