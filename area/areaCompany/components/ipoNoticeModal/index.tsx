import { memo, useState, forwardRef, useImperativeHandle, useEffect } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import styled from 'styled-components';

import { getNotice } from '@/apis/finance/stockIssuance';
import { Modal, Spin } from '@/components/antd';

import Enquiry from './enquiry';
import FileDisclosure from './fileDisclosure';

const RecordModal = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState<any>();

  useImperativeHandle(ref, () => ({
    openModal: openRecordModal,
  }));

  const { data, run, loading } = useRequest(getNotice, { manual: true });

  const openRecordModal = useMemoizedFn((obj) => {
    setDataSource([]);
    setVisible(true);
    run({
      tabIndex: 'initialDeclare',
      itcode2: obj.itcode2,
      // startDate: obj.splitDate ? obj.Declaredate : obj.firstDeclaredate,
      startDate: obj.startDate,
      endDate: obj.splitDate ? obj.Updatedate : null,
      id: obj.splitDate ? obj.id : null,
      noticeType: obj.noticeType,
      from: 0,
      size: 999,
    });
  });

  useEffect(() => {
    if (data) {
      setDataSource(data);
    }
  }, [data]);

  return (
    <Modal
      title="相关公告"
      type="financeModal"
      visible={visible}
      onCancel={() => {
        setVisible(false);
      }}
      wrapClassName={'area-f9-ipo-notice-modal'}
      getContainer={() => document.getElementById('area-company-index-container') || document.body}
    >
      <Spin spinning={loading} type="thunder">
        {loading ? (
          <div style={{ height: 'calc(100vh - 154px)' }}></div>
        ) : (
          <>
            {dataSource?.data?.disclosure ? (
              <>
                <ModalTitle title="文件披露" />
                <FileDisclosure dataSource={dataSource.data.disclosure} />
              </>
            ) : null}
            {dataSource?.data?.enquireReply?.length ? (
              <div style={{ marginTop: 24 }}>
                <ModalTitle title="问询与回复" />
                <Enquiry dataSource={dataSource.data.enquireReply} />
              </div>
            ) : null}
            {dataSource?.data?.announcement?.length ? (
              <div style={{ marginTop: 24 }}>
                <ModalTitle title="会议公告与结果" />
                <Enquiry dataSource={dataSource.data.announcement} />
              </div>
            ) : null}
            {dataSource?.data?.register?.length ? (
              <div style={{ marginTop: 24 }}>
                <ModalTitle title="注册结果" />
                <Enquiry dataSource={dataSource.data.register} />
              </div>
            ) : null}
          </>
        )}
      </Spin>
    </Modal>
  );
});

export default memo(RecordModal);

//弹窗中带有橘色标志的标题
const ModalTitle = ({ title }: { title: string }) => {
  return (
    <Titlecontent>
      <div className="orange">{title}</div>
    </Titlecontent>
  );
};

const Titlecontent = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #141414;
  line-height: 15px;
  padding: 0 12px 10px 9px;
  position: relative;

  .orange :after {
    position: absolute;
    bottom: 10px;
    left: 0;
    content: '';
    display: block;
    width: 3px;
    height: 14px;
    opacity: 1;
    background: #ff9349;
    border-radius: 2px;
  }
`;
