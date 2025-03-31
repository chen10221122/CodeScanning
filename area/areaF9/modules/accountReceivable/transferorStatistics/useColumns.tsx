import { compact } from 'lodash';

import { Popover } from '@/components/antd';
import { formatNumber } from '@/utils/format';

import CompanyEllipsis from '../common/companyEllipsis';
import { NumberWrap } from '../common/style';
import S from '../common/style.module.less';
import { ContentDetection, validateAndReturnText } from '../config';
import { modalType } from './useModal';

export default function useColumns({ openModal, condition }: any) {
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
      title: '融资企业',
      width: 252,
      dataIndex: 'name',
      align: 'left',
      fixed: 'left',
      resizable: { max: 780 - Math.max(`${Number(condition.from)}`.length * 10 + 22, 42) },
      wrapLine: true,
      className: 'leftTitle',
      render: (text: string, row: any) => {
        const data = [
          {
            code: row?.itcode,
            name: row?.name,
            enterpriseTag: row?.tags,
          },
        ];
        return (
          <>
            {data.length && (
              <CompanyEllipsis data={data} rowLimit={2} textLimitwidth={207} keyword={condition?.keywords} />
            )}
          </>
        );
      },
    },
    {
      title: '新增应收账款融资事件',
      width: 170,
      dataIndex: 'financingEventCount',
      align: 'right',
      resizable: true,
      sorter: true,
      className: 'rightTitle',
      render: (text: string, row: any) => {
        // const dateArray = row?.registerStartDate.split('-');
        // const title = `${dateArray[0]}年${dateArray[1]}月应收账款融资事件明细`;
        return (
          <NumberWrap
            num={text}
            onClick={() => {
              if (text !== '0') {
                openModal(
                  `${row.name}应收账款融资事件`,
                  modalType.EVENT,
                  'pledgor_receivable_financing_event_detail',
                  row.name,
                  row.itcode,
                );
              }
            }}
          >
            {formatNumber(text, 0)}
          </NumberWrap>
        );
      },
    },
    {
      title: '融资额(万元)',
      width: 124,
      dataIndex: 'financingAmount',
      align: 'right',
      resizable: true,
      sorter: true,
      className: 'rightTitle',
      render: (text: string) => {
        return validateAndReturnText(text);
      },
    },
    {
      title: '质权人/受让人数量',
      width: 151,
      dataIndex: 'pledgeeCount',
      align: 'right',
      resizable: true,
      sorter: true,
      className: 'rightTitle',
      render: (text: string, row: any) => {
        // const dateArray = row?.registerStartDate.split('-');
        // const title = `${dateArray[0]}年${dateArray[1]}月应收账款融资事件明细`;
        return (
          <NumberWrap
            num={text}
            onClick={() => {
              if (text !== '0') {
                openModal(
                  `${row.name}应收账款融资事件数-质权人/受让人明细`,
                  modalType.PLEDGEE,
                  'receivable_financing_pledgee_stat',
                  row.name,
                  row.itcode,
                );
              }
            }}
          >
            {formatNumber(text, 0)}
          </NumberWrap>
        );
      },
    },
    {
      title: '注册资本',
      width: 146,
      dataIndex: 'registeredCapital',
      align: 'right',
      resizable: true,
      sorter: true,
      className: 'rightTitle',
      render: (text: string) => {
        return ContentDetection(text);
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
        const array = compact([row.primaryGBIndustry, row.secondGBIndustry, row.thirdGBIndustry, row.fourthGBIndustry]);
        return (
          <>
            {array.length > 0 ? (
              <>
                {array[array.length - 1]}
                <Popover
                  destroyTooltipOnHide={true}
                  placement="bottom"
                  overlayClassName="accountReceivable-industry-popover"
                  content={array.join('>')}
                >
                  <span className={S.arrow}></span>
                </Popover>
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
      width: 168,
      dataIndex: 'provinceName',
      align: 'left',
      resizable: true,
      className: 'leftTitle',
      render: (text: string, row: any) => {
        const array = compact([row.provinceName, row.cityName, row.countyName]);
        return array.join('-');
      },
    },
    {
      title: '',
      dataIndex: '_emptyColumn',
    },
  ];
}
