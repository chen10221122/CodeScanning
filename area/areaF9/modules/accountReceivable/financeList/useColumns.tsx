import { compact } from 'lodash';

import { Popover } from '@/components/antd';
import { LINK_FINANCE_ACCOUNTS_RECEIVABLE_FINANCING_REGISTRATION_STATUS_DETAIL } from '@/configs/routerMap';
import { useHistory } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import CompanyEllipsis from '../common/companyEllipsis';
import { EllipseWrap, SingleEllipse } from '../common/style';
import S from '../common/style.module.less';
import { ContentDetection } from '../config';

export default function useColumns({ condition }: any) {
  const history = useHistory();
  return [
    {
      title: '序号',
      width: Math.max(`${Number(condition.from)}`.length * 10 + 22, 42),
      dataIndex: 'index',
      align: 'center',
      className: 'pdd-8',
      fixed: 'left',
    },
    {
      title: '登记起始日',
      width: 109,
      dataIndex: 'registerStartDate',
      align: 'center',
      fixed: 'left',
      sorter: true,
    },
    {
      title: '融资企业',
      width: 299,
      dataIndex: 'pledgorList',
      align: 'left',
      fixed: 'left',
      sorter: true,
      resizable: { max: 780 - Math.max(`${Number(condition.from)}`.length * 10 + 22, 42) - 109 },
      wrapLine: true,
      className: 'leftTitle',
      render: (text: string, row: any) => {
        return (
          <CompanyEllipsis data={row.pledgorList} rowLimit={2} textLimitwidth={299} keyword={condition?.keywords} />
        );
      },
    },
    {
      title: '质权人/受让人',
      width: 267,
      dataIndex: 'pledgeeList',
      align: 'left',
      resizable: true,
      wrapLine: true,
      sorter: true,
      className: 'leftTitle',
      render: (text: string, row: any) => {
        return <CompanyEllipsis data={row.pledgeeList} rowLimit={2} textLimitwidth={237} />;
      },
    },
    {
      title: '融资额(万元)',
      width: 122,
      dataIndex: 'financingAmount',
      align: 'right',
      resizable: true,
      sorter: true,
      className: 'rightTitle',
      render: (text: string, row: any) => {
        let content = null;
        if (!text) {
          content = '-';
        } else {
          if (row.currencyCHN) {
            content = (
              <>
                {text} ({row.currencyCHN})
              </>
            );
          } else {
            content = text;
          }
        }
        return <>{content}</>;
      },
    },
    {
      title: '期限',
      width: 102,
      dataIndex: 'timeLimit',
      align: 'right',
      resizable: true,
      sorter: true,
      className: 'rightTitle',
      render: (text: string) => {
        return ContentDetection(text);
      },
    },
    {
      title: '登记截止日',
      width: 109,
      dataIndex: 'registerEndDate',
      align: 'center',
      resizable: true,
      sorter: true,
      className: 'rightTitle',
      render: (text: string) => {
        return ContentDetection(text);
      },
    },
    {
      title: '融资类型',
      width: 109,
      dataIndex: 'financingType',
      align: 'right',
      resizable: true,
      sorter: true,
      className: 'rightTitle',
      render: (text: string) => {
        return ContentDetection(text);
      },
    },
    {
      title: '最新登记状态',
      width: 122,
      dataIndex: 'lastedRegisterStatus',
      align: 'right',
      resizable: true,
      sorter: true,
      className: 'rightTitle',
      render: (text: string, row: any) => {
        return (
          <>
            <div
              className={S.lastedRegisterStatus}
              onClick={() => {
                history.push(
                  urlJoin(
                    LINK_FINANCE_ACCOUNTS_RECEIVABLE_FINANCING_REGISTRATION_STATUS_DETAIL,
                    urlQueriesSerialize({
                      companyName: row?.pledgorList[0]?.name,
                      firstRegisterSerialNO: row.firstRegisterSerialNO,
                      registerStatus: row?.lastedRegisterStatus,
                    }),
                  ),
                );
              }}
            >
              {text}
              <span className={S.details}>详情</span>
            </div>
          </>
        );
      },
    },
    {
      title: '质押/转让财产价值(万元)',
      width: 189,
      dataIndex: 'pledgedProperty',
      align: 'right',
      resizable: true,
      sorter: true,
      className: 'rightTitle',
      render: (text: string, row: any) => {
        let content = null;
        if (!text) {
          content = '-';
        } else {
          if (row.propertyCurrencyCHN) {
            content = (
              <>
                {text} ({row.propertyCurrencyCHN})
              </>
            );
          } else {
            content = text;
          }
        }
        return <>{content}</>;
      },
    },
    {
      title: '质押/转让财产描述',
      width: 239,
      dataIndex: 'pledgedPropertyDesc',
      align: 'right',
      resizable: true,
      sorter: true,
      className: 'propertyColumns',
      render: (text: string) => {
        return (
          <EllipseWrap style={{ textAlign: 'left' }} row={2} title={text}>
            {ContentDetection(text)}
          </EllipseWrap>
        );
      },
    },
    {
      title: '国标行业',
      width: 210,
      dataIndex: 'fourthGBIndustry',
      align: 'left',
      resizable: true,
      sorter: true,
      className: 'leftTitle',
      render: (text: string, row: any) => {
        const array = compact([
          row?.pledgorList[0].primaryGBIndustry,
          row?.pledgorList[0].secondGBIndustry,
          row?.pledgorList[0].thirdGBIndustry,
          row?.pledgorList[0].fourthGBIndustry,
        ]);
        return (
          <>
            {array.length > 0 ? (
              <>
                <SingleEllipse>
                  <span title={array.join('>')}>{array[array.length - 1]}</span>
                  <Popover
                    destroyTooltipOnHide={true}
                    placement="bottom"
                    overlayClassName="accountReceivable-industry-popover"
                    content={array.join('>')}
                  >
                    <span className={S.arrow}></span>
                  </Popover>
                </SingleEllipse>
              </>
            ) : (
              '-'
            )}
          </>
        );
      },
    },
    {
      title: '所属地区',
      width: 148,
      dataIndex: 'provinceName',
      align: 'left',
      resizable: true,
      className: 'leftTitle',
      render: (text: string, row: any) => {
        const array = compact([row?.pledgorList[0].province, row?.pledgorList[0].city, row?.pledgorList[0].county]);
        return array.join('-');
      },
    },
  ];
}
