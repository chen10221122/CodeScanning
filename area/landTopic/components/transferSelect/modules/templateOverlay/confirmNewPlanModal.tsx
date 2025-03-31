import { FC, memo, useState, useEffect, useRef, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { InputRef } from 'antd';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import usePlanApi from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import useTemplateName, {
  NewNameMaxLen,
} from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/useTemplateName';
import { SelectItem, selectItem } from '@pages/area/landTopic/components/transferSelect/types';

import ErrorMessage from '@/components/advanceSearch/components/extraModal/errorMessage';
import { Input, Modal } from '@/components/antd';
import { strHasEmoji } from '@/utils/share';

const InputId = 'transfer-create-newPlan-input';

interface Props {
  /** 将confirmData对应的原始数据返回给使用者 */
  onConfirmChange: (confirmData: selectItem[]) => void;
  onCancel: () => void;
  isEdit?: boolean;
  checkedNodes?: SelectItem[];
}

/** 确认新增模板，编辑模板名称弹窗 */
const ConfirmNewPlanModal: FC<Props> = ({ checkedNodes, isEdit = false, onConfirmChange, onCancel }) => {
  const {
    state: { confirmNewPlanModalVisible, editPlanNameModalVisible, hide, tipDelay, curEditPlan },
    update,
  } = useCtx();

  const visible = useMemo(
    () => (isEdit ? editPlanNameModalVisible : confirmNewPlanModalVisible),
    [confirmNewPlanModalVisible, editPlanNameModalVisible, isEdit],
  );

  const [tipText, setTipText] = useState('');
  const [tipVisible, setTipVisible] = useState(false);

  const tipTimeoutRef = useRef<number | undefined>();
  const inputTimeoutRef = useRef<number | undefined>();

  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (tipVisible)
      tipTimeoutRef.current = setTimeout(() => {
        setTipVisible(false);
      }, tipDelay);
    return () => {
      !isUndefined(tipTimeoutRef.current) && clearTimeout(tipTimeoutRef.current);
    };
  }, [tipDelay, tipVisible]);

  const onTipChange = useMemoizedFn((v) => {
    setTipText(v);
    setTipVisible(true);
  });

  const { title, onChange } = useTemplateName({
    inputId: InputId,
    visible,
    defaultTitle: isEdit ? curEditPlan?.planName : undefined,
    onTipChange,
  });

  /* 我的模板的一些操作 */
  const { confirmAddPlan, addOrUpdatePlan } = usePlanApi();

  const handleOk = useMemoizedFn(() => {
    if (strHasEmoji(title)) {
      setTipText('不能保存表情符号！');
      setTipVisible(true);
    } else {
      if (isEdit) {
        /* @ts-ignore */
        addOrUpdatePlan({
          ...curEditPlan,
          content: JSON.stringify(curEditPlan?.content),
          planName: title,
        });
      } else {
        onConfirmChange((isEdit ? curEditPlan?.content : checkedNodes) ?? []); // 将新模板选中指标返回给使用者
        /* 调用接口保存新模板 */
        confirmAddPlan({
          content: JSON.stringify(checkedNodes),
          planName: title,
        });
        hide();
      }
      update((draft) => {
        draft.confirmNewPlanModalVisible = false;
        draft.editPlanNameModalVisible = false;
      });
      onCancel();
    }
  });

  const handleCancel = useMemoizedFn(() =>
    update((draft) => {
      draft.confirmNewPlanModalVisible = false;
      draft.editPlanNameModalVisible = false;
    }),
  );

  useEffect(() => {
    if (visible) {
      inputTimeoutRef.current = setTimeout(() => {
        inputRef.current?.focus();
      });
      return () => {
        !isUndefined(inputTimeoutRef.current) && clearTimeout(inputTimeoutRef.current);
      };
    }
  }, [visible]);

  return (
    <>
      <ModalStyle
        title={isEdit ? '编辑模版名称' : '另存为“我的模板”'}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={438}
        okButtonProps={{ disabled: !title.length }}
        wrapClassName={`app-dialog`}
        okText={isEdit ? '确定' : '保存并查看'}
        cancelText="取消"
        zIndex={1300}
        destroyOnClose
      >
        <ErrorMessage visible={tipVisible} content={tipText} style={{ top: '20px' }} />
        <span className="prefixText">模板名称: </span>
        <MyInput
          ref={inputRef}
          onChange={onChange}
          value={title}
          placeholder={`最多${NewNameMaxLen / 2}个汉字或${NewNameMaxLen}个字符`}
          id={InputId}
          autoComplete="off"
          // maxLength={NewNameMaxLen}
          allowClear={true}
        />
      </ModalStyle>
    </>
  );
};

export default memo(ConfirmNewPlanModal);

const ModalStyle = styled(Modal)`
  .ant-modal-body {
    height: 116px;
    padding: 40px 24px !important;
  }
  .ant-btn-primary {
    padding: 0 11px 0 12px !important;
    min-width: 90px;
  }
  input {
    color: #262626;
    padding-top: 6px;
    padding-bottom: 6px;
  }
  .prefixText {
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #262626;
    line-height: 20px;
  }
`;

const MyInput = styled(Input)`
  box-shadow: none !important;
  margin-left: 2px;
  width: 324px;
`;
