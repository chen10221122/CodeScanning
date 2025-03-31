import { ReactNode, useRef } from 'react';

import { useMemoizedFn, useSize } from 'ahooks';
import { Modal, ModalProps } from 'antd';
import styled from 'styled-components';

import { ConfigType, NormalChildItem } from '@dataView/components/Indicators';

import { CommonTpl } from '@/components/modal';

import Indicators from './Indicators';
import useEdit from './useEdit';

interface IndicatorModalProps extends ModalProps {
  visible?: boolean;
  onVisibleChange?: (v: boolean, indexId: string, values: NormalChildItem[] | undefined) => void;
  children?: ReactNode;
  title?: ReactNode;
  indexId: string;
  data?: ConfigType;
}

export default function MetricEditModal({
  visible,
  onVisibleChange,
  children,
  title,
  indexId,
  data,
  ...restProps
}: IndicatorModalProps) {
  const containerRef = useRef(null);
  const { onChange, onCancel, onConfirm, value } = useEdit(indexId, data ?? []);
  const { height } = useSize(document.body) || { height: 0 };

  const handleCancel = useMemoizedFn(() => {
    onCancel();
    onVisibleChange && onVisibleChange(false, '', []);
  });

  const handleOk = useMemoizedFn(() => {
    // // 多报告期类型弹窗，须校验“报告期”/“月度”为必选字段
    // if (
    //   value &&
    //   value.find((d) => d.actionTrigger === 'multipleReport') &&
    //   !value.some((d) => ['reportDateType', 'monthType'].includes(d.key))
    // ) {
    //   showMessage({
    //     content: '你还没有选择报告期',
    //     key: 'warning',
    //     popContainer: containerRef.current,
    //     style: { top: 38 },
    //   });
    //   return;
    // }
    onConfirm();
    onVisibleChange && onVisibleChange(false, indexId, value);
  });

  // useIndicatorLoading(loading, error);

  if (!data) return null;

  return (
    <Modal
      width={438}
      visible={visible}
      centered
      zIndex={200}
      modalRender={() => (
        <CommonTplWrapper
          closable
          title={title || '指标修改'}
          showConfirmButton
          showCancelButton
          onCancel={handleCancel}
          onOk={handleOk}
          onClose={handleCancel}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @media (max-height: 800px) {
              .ant-dropdown > div > ul {
                max-height: ${height / 2 - 120}px;
                min-height: 34px;
              }
            }
            `,
            }}
          />
          <Wrapper ref={containerRef}>
            <div className="wrapper-box">
              <Indicators indicatorKey={indexId} data={data} value={value} onChange={onChange} />
            </div>
          </Wrapper>
        </CommonTplWrapper>
      )}
      {...restProps}
    />
  );
}

const Wrapper = styled.div`
  padding: 0 18px;
  .wrapper-box {
    border-top: 1px solid #f0f0f0;
    padding: 14px 6px 16px;
  }
`;

const CommonTplWrapper = styled(CommonTpl)`
  min-height: 192px;
  border-radius: 4px;
  button {
    font-size: 13px;
    height: 30px;
  }
  .dzh-modal-header {
    border-bottom: none !important;
  }
`;
