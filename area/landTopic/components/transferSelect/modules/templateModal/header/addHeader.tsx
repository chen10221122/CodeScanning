import { memo, FC, useEffect, useRef } from 'react';

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

const InputId = 'transfer-create-modal-input';

interface Props {
  setNewPlanName: React.Dispatch<React.SetStateAction<string>>;
}

const AddHeader: FC<Props> = ({ setNewPlanName }) => {
  const {
    state: { addModalVisible: visible },
    update,
  } = useCtx();
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

  const { title, onChange } = useTemplateName({ inputId: InputId, visible, onTipChange });

  useEffect(() => {
    setNewPlanName(title);
  }, [title, setNewPlanName]);

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
    <Wrapper>
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
`;
