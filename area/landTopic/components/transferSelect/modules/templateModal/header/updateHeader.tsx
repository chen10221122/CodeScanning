import { memo, FC, useEffect, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { InputRef } from 'antd';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import useTemplateName, {
  NewNameMaxLen,
} from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/useTemplateName';

import { TipType } from '@/components/advanceSearch/components/extraModal/errorMessage';
import { Input } from '@/components/antd';
import { Image } from '@/components/layout';

const InputId = 'transfer-create-modal-input';

interface Props {
  isAddModal?: boolean;
  setNewPlanName: React.Dispatch<React.SetStateAction<string>>;
}

const AddHeader: FC<Props> = ({ setNewPlanName, isAddModal = true }) => {
  const {
    state: { addModalVisible: visible, curEditPlan, editModalVisible },
    update,
  } = useCtx();

  const [showEdit, setShowEdit] = useState(false);

  const inputTimeoutRef = useRef<number | undefined>();

  const inputRef = useRef<InputRef>(null);

  const onTipChange = useMemoizedFn((v) => {
    update((draft) => {
      draft.tipInfo = {
        visible: true,
        text: v,
        type: TipType.error,
      };
    });
  });

  const { title, onChange } = useTemplateName({
    inputId: InputId,
    visible: visible || editModalVisible,
    onTipChange,
    defaultTitle: isAddModal ? undefined : curEditPlan?.planName,
  });

  useEffect(() => {
    setNewPlanName(title);
  }, [title, setNewPlanName]);

  useEffect(() => {
    if (editModalVisible) setShowEdit(false);
  }, [editModalVisible, setShowEdit]);

  useEffect(() => {
    if (visible || showEdit) {
      inputTimeoutRef.current = setTimeout(() => {
        inputRef.current?.focus();
      });
      return () => {
        !isUndefined(inputTimeoutRef.current) && clearTimeout(inputTimeoutRef.current);
      };
    }
  }, [visible, showEdit]);

  return (
    <Wrapper>
      {isAddModal || showEdit ? null : (
        <div className="planName">
          编辑_{curEditPlan?.planName}{' '}
          <div className="editIcon" onClick={() => setShowEdit(true)}>
            <Image
              src={require('@pages/area/landTopic/components/transferSelect/icons/editPlanName.png')}
              style={{
                margin: '-1px 0 0 6px',
              }}
              size="14"
            />
          </div>
        </div>
      )}

      <div style={{ display: isAddModal || showEdit ? 'block' : 'none' }}>
        <Input
          ref={inputRef}
          onChange={onChange}
          value={title}
          placeholder={`最多${NewNameMaxLen / 2}个汉字或${NewNameMaxLen}个字符`}
          id={InputId}
          autoComplete="off"
          // maxLength={NewNameMaxLen}
          allowClear={true}
        />
      </div>
    </Wrapper>
  );
};
export default memo(AddHeader);

const Wrapper = styled.div`
  color: #262626;
  font-size: 13px;
  .ant-input-affix-wrapper {
    box-shadow: none !important;
    width: 242px;
    padding: 3px 12px;
  }
  .planName {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: left;
    color: #141414;
    line-height: 30px;
    display: flex;
    align-items: center;
    .editIcon {
      cursor: pointer;
    }
  }
`;
