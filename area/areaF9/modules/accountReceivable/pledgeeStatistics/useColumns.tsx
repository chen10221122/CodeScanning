import { compact } from 'lodash';

import { formatNumber } from '@/utils/format';

import CompanyEllipsis from '../common/companyEllipsis';
import { NumberWrap } from '../common/style';
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
      title: '质权人/受让人',
      width: 232,
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
      sorter: true,
      resizable: true,
      className: 'rightTitle',
      render: (text: string, row: any) => {
        return (
          <NumberWrap
            num={text}
            onClick={() => {
              if (text !== '0') {
                openModal(
                  `${row.name}应收账款融资事件`,
                  modalType.EVENT,
                  'pledgee_receivable_financing_event_detail',
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
      width: 146,
      dataIndex: 'financingAmount',
      align: 'right',
      sorter: true,
      resizable: true,
      className: 'rightTitle',
      render: (text: string) => {
        return validateAndReturnText(text);
      },
    },
    {
      title: '融资企业数量',
      width: 135,
      dataIndex: 'financingEnterpriseCount',
      align: 'right',
      sorter: true,
      resizable: true,
      className: 'rightTitle',
      render: (text: string, row: any) => {
        return (
          <NumberWrap
            num={text}
            onClick={() => {
              if (text !== '0') {
                openModal(
                  `${row.name}应收账款融资事件数-融资企业明细`,
                  modalType.ENTERPRISE,
                  'receivable_financing_pledgor_stat',
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
      width: 148,
      dataIndex: 'registeredCapital',
      align: 'right',
      sorter: true,
      resizable: true,
      className: 'rightTitle',
      render: (text: string) => {
        return ContentDetection(text);
      },
    },
    {
      title: '所属地区',
      width: 145,
      dataIndex: 'primaryGBIndustry',
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
