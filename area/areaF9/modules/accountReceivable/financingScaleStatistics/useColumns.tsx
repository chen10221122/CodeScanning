import { formatNumber } from '@/utils/format';

import { NumberWrap } from '../common/style';
import { validateAndReturnText } from '../config';
import { modalType } from './useModal';

const map = new Map<string, string>([
  ['m', '按月'],
  ['q', '按季'],
  ['y', '按年'],
]);

export default function useColumns({ openModal, condition }: any) {
  return [
    {
      title: '序号',
      width: Math.max(`${Number(condition.from)}`.length * 10 + 22, 42),
      dataIndex: 'index',
      className: 'pdd-8',
      align: 'center',
      fixed: 'left',
    },
    {
      title: '登记起始日',
      width: 108,
      dataIndex: 'registerStartDateView',
      align: 'center',
      sorter: true,
      resizable: { max: 780 - Math.max(`${Number(condition.from)}`.length * 10 + 22, 42) },
      fixed: 'left',
    },
    {
      title: '新增应收账款融资事件',
      width: 170,
      dataIndex: 'eventCount',
      align: 'right',
      sorter: true,
      resizable: true,
      className: 'rightTitle',
      render: (text: string, row: any) => {
        const dateArray = row?.registerStartDateProps.split('-');
        const title = `${dateArray[0]}年${dateArray[1]}月应收账款融资事件明细`;
        const frequency = map.get(condition?.frequency);
        return (
          <NumberWrap
            num={text}
            onClick={() => {
              if (text !== '0') {
                openModal(
                  title,
                  row.registerStartDateProps,
                  modalType.EVENT,
                  'receivable_financing_event_detail',
                  `融资规模统计-(${frequency})应收账款融资事件明细`,
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
      width: 152,
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
      width: 119,
      dataIndex: 'financingEnterpriseCount',
      align: 'right',
      sorter: true,
      resizable: true,
      className: 'rightTitle',
      render: (text: string, row: any) => {
        const dateArray = row?.registerStartDateProps.split('-');
        const title = `${dateArray[0]}年${dateArray[1]}月应收账款融资事件明细-融资企业明细`;
        const frequency = map.get(condition?.frequency);
        return (
          <NumberWrap
            num={text}
            onClick={() => {
              text !== '0' &&
                openModal(
                  title,
                  row.registerStartDateProps,
                  modalType.ENTERPRISE,
                  'receivable_financing_pledgor_stat',
                  `融资规模统计-(${frequency})融资企业明细`,
                );
            }}
          >
            {formatNumber(text, 0)}
          </NumberWrap>
        );
      },
    },
    {
      title: '质权人/受让人数量',
      width: 150,
      dataIndex: 'pledgeeCount',
      align: 'right',
      sorter: true,
      resizable: true,
      className: 'rightTitle',
      render: (text: string, row: any) => {
        const dateArray = row?.registerStartDateProps.split('-');
        const title = `${dateArray[0]}年${dateArray[1]}月应收账款融资事件明细-质权人/受让人明细`;
        const frequency = map.get(condition?.frequency);
        return (
          <NumberWrap
            num={text}
            onClick={() => {
              text !== '0' &&
                openModal(
                  title,
                  row.registerStartDateProps,
                  modalType.PLEDGEE,
                  'receivable_financing_pledgee_stat',
                  `融资规模统计-(${frequency})质权人/受让人明细`,
                );
            }}
          >
            {formatNumber(text, 0)}
          </NumberWrap>
        );
      },
    },
    {
      title: '',
      dataIndex: 'noneData',
    },
  ];
}
