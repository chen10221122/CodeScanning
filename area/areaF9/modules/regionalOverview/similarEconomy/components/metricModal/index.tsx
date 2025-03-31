import { FC, ReactNode, memo, useEffect, useState } from 'react';

import { Modal } from '@dzh/components';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import ErrorMessage from '@/components/advanceSearch/components/extraModal/errorMessage';
// import { Modal } from '@/components/antd';

import { Provider, useCtx, useInitCtx } from './context';
import Foot from './foot';
import SelectContent from './selectContent';
import { IParam, SelectItem } from './types';

const ErrorMessageStyle = { top: '20px', minWidth: 'max-content' };

interface Props {
  indicatorList?: any[];
  /** 将confirmData对应的原始数据返回给使用者 */
  onConfirmChange: (
    confirmData: SelectItem[],
    isDefault: boolean,
    paramMap: Record<string, IParam | undefined>,
  ) => void;
  visible: boolean;
  onCancel?: () => void;
  content?: ReactNode;
}

const Inner: FC<Props> = ({ onConfirmChange, visible, onCancel }) => {
  useInitCtx(onConfirmChange);
  const {
    state: { selectedNodes, tipInfo, selectedNodeParam },
  } = useCtx();
  const [checkedNodes, setCheckedNodes] = useState<SelectItem[]>(selectedNodes);
  const [checkedNodesParamMap, setCheckedNodesParamMap] =
    useState<Record<string, IParam | undefined>>(selectedNodeParam);
  useEffect(() => {
    setCheckedNodes(cloneDeep(selectedNodes));
  }, [selectedNodes]);
  useEffect(() => {
    setCheckedNodesParamMap(cloneDeep(selectedNodeParam));
  }, [selectedNodeParam]);

  return (
    <MyModal
      title={'选择指标'}
      // type="maskScroll"
      width={900}
      open={visible}
      destroyOnClose={false}
      onCancel={onCancel}
      footer={
        <Foot
          onCancel={onCancel!}
          checkedNodes={checkedNodes}
          checkedNodeParamMap={checkedNodesParamMap}
          onConfirmChange={onConfirmChange}
        />
      }
      zIndex={100}
      // wrapClassName={'app-dialog transform-selected-modal'}
      mask={true}
    >
      {tipInfo?.visible && (
        <ErrorMessage
          visible={tipInfo?.visible ?? false}
          type={tipInfo?.type}
          content={tipInfo?.text ?? ''}
          style={ErrorMessageStyle}
        />
      )}
      <SelectContent
        checkedNodes={checkedNodes}
        checkedNodeparamMap={checkedNodesParamMap}
        setCheckedNodes={setCheckedNodes}
        setCheckedNodeParamMap={setCheckedNodesParamMap}
      />
    </MyModal>
  );
};

const MetricModal: FC<Props> = ({ visible, onConfirmChange, onCancel }) => {
  return (
    <>
      <Provider>
        {/* <GlobalStyle /> */}
        <Inner onConfirmChange={onConfirmChange} visible={visible} onCancel={onCancel} />
      </Provider>
    </>
  );
};

export default memo(MetricModal);

const MyModal = styled(Modal.FullScreen)`
  // .ant-modal-content {
  //   height: calc(100vh - 160px) !important;
  //   .ant-modal-header {
  //     padding: 7px 50px !important;
  //     .ant-modal-title {
  //       font-size: 16px;
  //       line-height: 24px;
  //       font-weight: 500;
  //       color: #141414;
  //       &::before {
  //         height: 18px;
  //         width: 18px;
  //         left: -26px;
  //       }
  //     }
  //     &::after {
  //       left: 0;
  //       right: 0;
  //     }
  //   }
  // }
`;

// const GlobalStyle = createGlobalStyle`
//   .transform-selected-modal{
//     .ant-modal {
//       top: 80px !important;
//       .ant-modal-content .ant-modal-close{
//         top: -7px ;
//         right: calc(50% - 400px - 8px);
//       }
//     }
//   }
// `;
