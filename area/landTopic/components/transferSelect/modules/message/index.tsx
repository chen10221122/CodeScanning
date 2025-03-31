import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';

import ErrorMessage from '@/components/advanceSearch/components/extraModal/errorMessage';

/** 消息提示样式对象 */
const ErrorMessageStyle = { top: '4px', minWidth: 'max-content' };

export default function Message() {
  const {
    state: { tipInfo, editModalVisible, confirmNewPlanModalVisible, editPlanNameModalVisible },
  } = useCtx();

  return tipInfo.outDropdown || editModalVisible || confirmNewPlanModalVisible || editPlanNameModalVisible ? null : (
    <ErrorMessage visible={tipInfo.visible} type={tipInfo.type} content={tipInfo.text} style={ErrorMessageStyle} />
  );
}
