import { FC, memo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Modal, ModalProps, Icon, Spin, Empty, EmptySize } from '@dzh/components';
import { useImmer } from '@dzh/utils';
import { useRequest, useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import styled, { createGlobalStyle } from 'styled-components';

// import { LINK_PUBLIC_OPINION_ANALYSIS_NODYNAMIC } from '@/configs/routerMap';
import { getEnterpriseOpinionAlalysisJumpLink } from '@/pages/detail/modules/enterprise/newsNotice/utils/util';
import { getTrendDetail } from '@/pages/publicOpinionPages/monitoring/apis';

import Chart from './chart';
import TrendModalTitleIcon from './trend-modal-title.svg';

interface TrendModalProps extends ModalProps {
  modalInfo?: Record<string, any>;
}

interface ModalTitleProps {
  title: string;
  modalInfo: Record<string, any>;
}

const ModalTitleNode: FC<ModalTitleProps> = memo(({ title, modalInfo }) => {
  const history = useHistory();

  const hanldeJumpToAnalysis = useMemoizedFn(() => {
    // history.push(`${LINK_PUBLIC_OPINION_ANALYSIS_NODYNAMIC}/${modalInfo.itCode2}/company/${modalInfo.companyName}`);
    history.push(getEnterpriseOpinionAlalysisJumpLink({ code: modalInfo.itCode2, type: 'company' }));
  });

  return (
    <ModalTitleNodeStyle>
      <div className="left-title">{title}</div>
      <div className="right-tools" onClick={hanldeJumpToAnalysis}>
        <Icon size={14} image={TrendModalTitleIcon} />
        舆情分析
      </div>
    </ModalTitleNodeStyle>
  );
});

const defaultChartInfo: {
  data: Record<string, any>[];
  itCode2: string;
  loading: boolean;
  error: boolean;
} = {
  data: [],
  itCode2: '',
  loading: false,
  error: false,
};

const TrendModal: FC<TrendModalProps> = (props) => {
  const { modalInfo = {}, title = '负面舆情指数趋势', visible, onCancel } = props;

  const [chartInfo, updateChartInfo] = useImmer(defaultChartInfo);

  // 趋势详情
  const { run: getDetail, refresh } = useRequest(getTrendDetail, {
    manual: true,
    onBefore() {
      updateChartInfo((d) => {
        d.data = [];
        d.loading = true;
      });
    },
    onSuccess(res: Record<string, any>) {
      if (res && res.data) {
        updateChartInfo((d) => {
          const riskList = (res.data.riskList || []) as Record<string, any>[];
          const bpRiskListMap = ((res.data.bpRiskList || []) as Record<string, any>[]).reduce((map, item) => {
            map.set(item.newsDate, item);
            return map;
          }, new Map()) as Map<string, Record<string, any>>;
          const chartData = riskList.map((item) => ({
            ...item,
            value: item.trendIndex,
            newsInfo: bpRiskListMap.get(item.time),
          }));
          d.itCode2 = res.data.itCode2;
          d.data = chartData;
          d.loading = false;
          d.error = false;
        });
      } else {
        updateChartInfo((d) => {
          d.data = [];
          d.loading = false;
          d.error = true;
        });
      }
    },
    onError() {
      updateChartInfo((d) => {
        d.data = [];
        d.loading = false;
        d.error = true;
      });
    },
  });

  // 请求
  useEffect(() => {
    if (modalInfo.itCode2) {
      getDetail({
        endTime: dayjs().format('YYYYMMDD'),
        fromTime: dayjs().subtract(3, 'year').format('YYYYMMDD'),
        itCode2: modalInfo.itCode2,
      });
    }
  }, [getDetail, modalInfo.itCode2]);

  return (
    <>
      <ModalGlobalStyle />
      <Modal.Content
        width={800}
        height={380}
        title={<ModalTitleNode title={title as string} modalInfo={modalInfo} />}
        visible={visible}
        onCancel={onCancel}
        footer={null}
        className="public-opinionpage-monitoring-trend-modal"
        getContainer={() => (document.getElementById('area-areaf9-main-index-dom') || document.body) as HTMLDivElement}
      >
        <ContentStyle hiddenChart={chartInfo.error}>
          <Spin spinning={chartInfo.loading} type="thunder">
            {chartInfo.error ? (
              <Empty type={Empty.LOAD_FAIL_XS} size={EmptySize.XSmall} needDefaultDistance={false} onClick={refresh} />
            ) : null}
            <Chart data={chartInfo.data} itCode2={chartInfo.itCode2} />
          </Spin>
        </ContentStyle>
      </Modal.Content>
    </>
  );
};

export default memo(TrendModal);

const ModalGlobalStyle = createGlobalStyle`
  .public-opinionpage-monitoring-trend-modal {
    .ant-modal-content .ant-modal-header {
      .dzh-modal-content-title-content {
        width: 100%;
        padding-right: 36px;
      }
    }
    .ant-empty {
      padding-top: 10%;
    }
  }
`;

const ModalTitleNodeStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left-title {
    color: #141414;
  }
  .right-tools {
    cursor: pointer;
    i {
      margin-right: 4px;
    }
    height: 20px;
    font-size: 13px;
    color: #333333;
    line-height: 20px;
  }
`;

const ContentStyle = styled.div<{ hiddenChart: boolean }>`
  height: 305px;
  .dzh-spin-spin {
    overflow: hidden;
  }
  .ant-spin-container {
    height: 100%;
  }
  .monitoring-trend-modal-chart {
    opacity: ${({ hiddenChart }) => (hiddenChart ? '0' : '1')};
  }
`;
