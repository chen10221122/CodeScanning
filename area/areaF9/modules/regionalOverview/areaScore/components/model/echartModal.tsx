import { memo, useMemo } from 'react';

import { Modal, Table } from '@dzh/components';
import dayJs from 'dayjs';
import styled from 'styled-components';

// import { DEFAULT_APP_LOGO_ICON, getConfig } from '@/app';
import { Spin } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import ModalLine from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/echarts/modalLine';
import useEchartModal from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/model/useEchartModal';

interface Props {
  // title: string | undefined;
  visible: boolean;
  setVisible: Function;
  code: any;
  modalParams: any;
  regionName: any;
  year: any;
}

const EchartModal = (props: Props) => {
  const { visible, setVisible, modalParams, code, regionName, year } = props;
  const { indicatorName, indicatorCode } = modalParams;
  // const echartRef = useRef(null);

  const { data, loading } = useEchartModal({ code, indicatorCode });

  // const loading = true;
  // console.log('data', data);

  const resIndiName = useMemo(() => {
    return data?.[0]?.indicatorName || indicatorName;
  }, [data, indicatorName]);

  const unit = useMemo(() => {
    return data?.[0]?.units || '';
  }, [data]);

  const calcData: any = {
    xData: [],
    score: [],
    values: [],
  };

  const columns: any = [
    {
      title: '年份',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
  ];
  let tableLine1: any = {
    name: '评分',
  };
  let tableLine2: any = { name: `${resIndiName}(${unit})` };
  Array.isArray(data) &&
    data.forEach((item: any) => {
      tableLine1[`value${item.year}`] = item.selfScore;
      tableLine2[`value${item.year}`] = item.value;
      columns.push({
        title: item.year + '年',
        dataIndex: `value${item.year}`,
        key: `value${item.year}`,
        render: (text: any) => {
          return <div>{text || '-'}</div>;
        },
      });
      calcData.xData.push(item.year);
      calcData.score.push(item.selfScore);
      calcData.values.push(item.value);
    });
  let tableData: any[] = [tableLine1, tableLine2];

  const tableLoading = false;

  // console.log(calcData);

  const onCancel = () => {
    setVisible(false);
  };

  const modalSpin = useMemo(() => {
    return (
      <ModalSpinBox className="inner-spining-box">
        <Spin spinning={loading} type={'thunder'} tip="加载中"></Spin>
      </ModalSpinBox>
    );
  }, [loading]);

  const condition = useMemo(() => {
    return {
      module_type: 'area_f9_history_score',
      exportFlag: true,
      year: year,
      regionCode: code,
      indicatorCode: indicatorCode,
    };
  }, [code, indicatorCode, year]);

  const modalTitle = useMemo(() => {
    return (
      <ModalHead>
        <div className="right">
          <ExportDoc condition={condition} filename={`${regionName}_${resIndiName}_${dayJs().format('YYYYMMDD')}`} />
        </div>
      </ModalHead>
    );
  }, [condition, regionName, resIndiName]);

  return (
    <Modal.FullScreen
      destroyOnClose={true}
      // type=""
      className="comment-box-detail-modal-echart"
      width={800}
      centered
      footer={null}
      // getContainer={() => (document.getElementById('score-comment-box') as HTMLElement) || window}
      visible={visible}
      title={resIndiName}
      // title={modalTitle}
      extra={modalTitle}
      onCancel={onCancel}
    >
      <ScoreModel id="inner-echart-modal">
        {loading ? (
          modalSpin
        ) : (
          <>
            {/* <div className="inner-echart" ref={echartRef}></div> */}
            <ModalLine indicatorName={resIndiName} calcData={calcData} unit={unit} />
            <div className="inner-table">
              <Table
                pagination={false}
                columns={columns}
                onlyBodyLoading
                scroll={{ x: '100%' }}
                dataSource={tableData}
                loading={{ spinning: tableLoading, translucent: true, type: 'thunder' }}
                sticky={{
                  offsetHeader: 0,
                  getContainer: () => document.getElementById('inner-echart-modal') || document.body,
                }}
              />
            </div>
          </>
        )}
      </ScoreModel>
    </Modal.FullScreen>
  );
};

export default memo(EchartModal);
const ScoreModel = styled.div`
  // padding-top: 12px;
  // padding: 12px 0 0;
  // margin-bottom: 20px;
  // max-height: 719px;
  // height: 392px;
  // overflow-y: auto;

  .inner-echart {
    height: 292px;
    margin-bottom: 8px;
  }

  .inner-table {
    padding: 0 26px;
  }
`;

const ModalSpinBox = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalHead = styled.div`
  .right {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
    // .primary-hover {
    //   position: relative;
    //   top: 2px;
    // }
  }
`;
