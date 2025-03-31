import { FC, useMemo } from 'react';

import { Modal } from '@/components/antd';
import TableF9 from '@/components/tableF9';
import { shortId } from '@/utils/share';

import styles from './styles.module.less';

// 弹窗数据
export interface DataProps<T> {
  /** 被执行人 */
  enterpriseName: T;
  /** 案号 */
  caseNumber: T;
  /** 执行法院 */
  identificationUnit: T;
  /** 被执行人的履行情况 */
  caseStatus: T;
  /** 立案日期 */
  caseDate: T;
  /** 公告日期 */
  declareDate: T;
  /** 执行依据文号 */
  caseBasisNum: T;
  /** 组织机构 */
  caseOrganization: T;
  /** 做出执行依据单位 */
  caseBasisUnit: T;
  /** 失信被执行人行为具体情况 */
  caseSituation: T;
  /** 生效法律文书确定的义务 */
  caseObligation: T;
}

export interface RowInfoProps extends DataProps<string> {
  [name: string]: any;
}

export interface RequestParamsProps {
  caseId: string;
  code: string;
  type: string;
  isCd: number;
  skip: number;
  pagesize: number;
}

export interface BreakCreditModalProps {
  visible: boolean;
  closeModal: () => void;
  rowInfo?: RowInfoProps;
}

const BreakCreditModal: FC<BreakCreditModalProps> = ({ visible, closeModal, rowInfo }) => {
  const detailData = useMemo(() => {
    let temp: Record<string, any>[][] = [];
    if (rowInfo) {
      temp = [
        [
          {
            idx: shortId(),
            title: '被执行人',
            content: rowInfo.enterpriseName || '-',
            style: { width: '282px' },
            titleStyle: { width: 128 },
            colspan: 9,
          },
          {
            idx: shortId(),
            title: '组织机构代码',
            content: rowInfo.caseOrganization || '-',
            style: { width: '282px' },
            titleStyle: { width: 128 },
            colspan: 9,
          },
        ],
        [
          {
            idx: shortId(),
            title: '案号',
            content: rowInfo.caseNumber ? rowInfo.caseNumber?.replace(/(.*)（(.*)）(.*)/, '$1($2)$3') : '-',
            colspan: 9,
          },
          { idx: shortId(), title: '执行法院', content: rowInfo.identificationUnit || '-', colspan: 9 },
        ],
        [
          { idx: shortId(), title: '执行依据文号', content: rowInfo.caseBasisNum || '-', colspan: 9 },
          { idx: shortId(), title: '做出执行依据单位', content: rowInfo.caseBasisUnit || '-', colspan: 9 },
        ],
        [
          { idx: shortId(), title: '立案日期', content: rowInfo.caseData || '-', colspan: 9 },
          { idx: shortId(), title: '公告日期', content: rowInfo.declareDate || '-', colspan: 9 },
        ],
        [
          {
            idx: shortId(),
            title: '被执行人的履行情况',
            content: rowInfo.caseStatus || '-',
            colspan: 9,
          },
          { idx: shortId(), title: '失信被执行人行为具体情况', content: rowInfo.caseSituation || '-', colspan: 9 },
        ],
        [
          {
            idx: shortId(),
            title: '生效法律文书确定的义务',
            content: rowInfo.caseObligation,
            colspan: 19,
          },
        ],
      ];
    }
    return temp;
  }, [rowInfo]);

  return (
    <Modal
      title={`${rowInfo?.enterpriseName}失信被执行人详情`}
      type="f9Modal"
      visible={visible}
      onCancel={closeModal}
      getContainer={() => document.body}
      contentStyle={{ padding: '0 20px', overflowY: 'overlay', maxHeight: '382px' }}
      modalWidth={860}
      wrapClassName={styles.blackListModalContainer}
      hasBlock={false}
    >
      <TableF9 data={detailData} titleStyle={{ width: 110 }} className="blackListBreakCreditModalTableWrapper" />
    </Modal>
  );
};

export default BreakCreditModal;
