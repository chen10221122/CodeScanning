import { useEffect, useMemo } from 'react';

import { produce } from 'immer';
import styled from 'styled-components';

import { Modal, Popover, Empty, Spin } from '@/components/antd';
import TableF9 from '@/components/tableF9';
import { LINK_JUDICIALCASES__DETAIL, LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { ApplyExecutorDetail } from '@/pages/detail/modules/enterprise/judicial/components/components/judHightlight';
import { CaseStatusTag } from '@/pages/detail/modules/enterprise/judicial/components/components/tag';
import ModalTitle from '@/pages/detail/modules/enterprise/judicial/components/components/title';
import { dynamicLink, useHistory } from '@/utils/router';
import { shortId } from '@/utils/share';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import useDatas from './useData';

import styles from '@/pages/detail/modules/enterprise/judicial/components/executedPeople/style.module.less';

export interface DetailModalParams {
  details: {
    announceId: string;
    companyId: string;
    companyType: string;
  };
}

type Iprops = {
  itName: string;
  visible: boolean;
  condition: DetailModalParams;
  onClose: (v: boolean) => void;
};

const secondTitleStyle = { padding: '18px 9px 10px' };
export default ({ itName, onClose, visible, condition }: Iprops) => {
  const history = useHistory();
  const { getDetails, dataDetails, getCaseDetails, caseInfo, loadingDetails, loadingCase, setList } = useDatas();

  useEffect(() => {
    const { details } = condition;
    if (details?.companyId) {
      getDetails(details);
    }
  }, [condition, getDetails]);

  useEffect(() => {
    if (dataDetails?.caseId) {
      getCaseDetails(dataDetails?.caseId);
    }
  }, [getCaseDetails, dataDetails?.caseId]);

  const { companyId, companyType } = useMemo(() => condition.details, [condition.details]);

  const dataCase = useMemo(() => {
    const { data = null } = caseInfo || {};
    if (data) {
      return [
        [
          {
            idx: shortId(),
            title: '案件名称',
            content: data.title ? (
              <span
                className="primary-link"
                onClick={() =>
                  history.push(
                    `${urlJoin(
                      dynamicLink(LINK_JUDICIALCASES__DETAIL),
                      urlQueriesSerialize({ caseId: data.id, companyId, type: companyType }),
                    )}`,
                  )
                }
              >
                {data.title}
              </span>
            ) : (
              '-'
            ),
            colspan: 9,
          },
          {
            idx: shortId(),
            title: '案件类型',
            content: data.caseType || '-',
            colspan: 9,
          },
        ],
        [
          { idx: shortId(), title: '案由', content: data.caseReason || '-', colspan: 9 },
          {
            idx: shortId(),
            title: '案号',
            content:
              data.caseNum?.length && data.caseNum.length > 3
                ? data.caseNum.slice(0, 3).join('，') + '等'
                : data.caseNum?.join('，') || '-',
            colspan: 9,
          },
        ],
        [
          { idx: shortId(), title: '法院', content: data.court?.join('、') || '-', colspan: 9 },
          { idx: shortId(), title: '最新进程', content: data.lastProcedure || '-', colspan: 9 },
        ],
      ];
    } else {
      return [];
    }
  }, [caseInfo, history, companyId, companyType]);

  const detailData = useMemo(() => {
    if (dataDetails) {
      return [
        [
          {
            idx: shortId(),
            title: '被执行人',
            content: dataDetails.dishonestExecutorName || '-',
            colspan: 9,
          },
          {
            idx: shortId(),
            title: '组织机构代码',
            content: dataDetails.organizationCode || '-',
            colspan: 9,
          },
        ],
        [
          {
            idx: shortId(),
            title: '案号',
            content: dataDetails.caseNum ? (
              <>
                <span
                  className={dataDetails.caseId ? 'primary-link' : ''}
                  style={{ marginRight: 6 }}
                  onClick={() => {
                    if (!dataDetails.caseId) return;
                    history.push(
                      urlJoin(
                        dynamicLink(LINK_JUDICIALCASES__DETAIL),
                        urlQueriesSerialize({ caseId: dataDetails.caseId, companyId, type: companyType }),
                      ),
                    );
                  }}
                >
                  {dataDetails.caseNum}
                </span>
                <CaseStatusTag status={dataDetails.status} style={{}} />
              </>
            ) : (
              '-'
            ),
            colspan: 9,
          },
          { idx: shortId(), title: '执行法院', content: dataDetails.court || '-', colspan: 9 },
        ],
        [
          { idx: shortId(), title: '执行依据文号', content: dataDetails.executeBasisFileNum || '-', colspan: 9 },
          {
            idx: shortId(),
            title: '做出执行依据单位',
            content: dataDetails.executeBasisOrg ? (
              <span
                className={dataDetails.executionOrgCode ? 'primary-link' : ''}
                onClick={() =>
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE, {
                        key: '',
                      }),
                      urlQueriesSerialize({ type: 'company', code: dataDetails.executionOrgCode }),
                    ),
                  )
                }
              >
                {dataDetails.executeBasisOrg}
              </span>
            ) : (
              '-'
            ),
            colspan: 9,
          },
        ],
        [
          { idx: shortId(), title: '立案日期', content: dataDetails.registerDate || '-', colspan: 9 },
          { idx: shortId(), title: '发布日期', content: dataDetails.publishDate || '-', colspan: 9 },
        ],
        [
          {
            idx: shortId(),
            title: '被执行人的履行情况',
            content: dataDetails.executePerformance || '-',
            colspan: 9,
          },
          {
            idx: shortId(),
            title: '失信被执行人行为具体情形',
            content: dataDetails.specificSituation || '-',
            colspan: 9,
          },
        ],
        [
          {
            idx: shortId(),
            title: '未履行金额(元)',
            content: dataDetails.outstandAmount || '-',
            colspan: 9,
          },
          { idx: shortId(), title: '已履行金额(元)', content: dataDetails.fulfilledAmount || '-', colspan: 9 },
        ],
        [
          {
            idx: shortId(),
            title: '生效法律文书确定的义务',
            content: dataDetails.adjudicationDuty || '-',
            colspan: 19,
          },
        ],
        [
          {
            idx: shortId(),
            title: (
              <div className={styles.tableTitleWrap}>
                申请执行人
                <Popover
                  overlayClassName={styles.judicialPopoverWrapper}
                  content={'企业预警通基于现有公开数据分析所得,仅供参考'}
                  placement="bottom"
                  getTooltipContainer={() => document.body}
                >
                  <div className={styles.des}></div>
                </Popover>
              </div>
            ),
            content: (
              <ApplyExecutorDetail
                content={dataDetails}
                text={dataDetails.applyExecutorDetail}
                setTableData={setList}
              />
            ),
            colspan: 19,
          },
        ],
      ];
    } else {
      return [];
    }
  }, [companyId, companyType, dataDetails, history, setList]);

  useEffect(() => {
    if (!loadingDetails && !loadingCase) {
      const el = document.querySelector('.ant-modal-body')?.querySelector('.content');
      if (el) {
        let more = (el as any)?.offsetHeight > 80 ? true : false;
        setList(
          produce((draft: any) => {
            draft.more = more;
          }),
        );
      }
    }
  }, [loadingDetails, loadingCase, setList]);

  return (
    <>
      <Modal
        title={`${itName}失信被执行人详情`}
        type="f9Judicial"
        modalWidth={1000}
        visible={visible}
        onCancel={() => onClose(false)}
        getContainer={false}
        wrapClassName={'area-f9-diahonest-modal'}
      >
        {loadingDetails || loadingCase ? (
          <Spin type="fullThunder" />
        ) : detailData.length || dataCase.length ? (
          <DishonestModalContent>
            <ModalTitle title="失信被执行人详情" color="origin" />
            <TableF9 data={detailData} titleStyle={{ width: 140 }} />
            <ModalTitle title="所属司法案件" color="origin" style={secondTitleStyle} />
            <TableF9 data={dataCase} titleStyle={{ width: 140 }} />
          </DishonestModalContent>
        ) : (
          <Empty type={Empty.NO_DATA_LG} style={{ marginTop: 22 }} />
        )}
      </Modal>
    </>
  );
};

const DishonestModalContent = styled.div`
  .primary-link {
    color: #025cdc !important;
  }
`;
