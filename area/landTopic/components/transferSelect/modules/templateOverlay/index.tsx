import { FC, useState, memo, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import ConfirmNewPlanModal from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/confirmNewPlanModal';
import Content from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/content';
import DeleteModal, {
  DEFAULT_DELETE_INFO,
} from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/deleteModal';
import Header from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/header';
import { PlanItem } from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import { SelectItem } from '@pages/area/landTopic/components/transferSelect/types';

const CONTAINER_STYLE = { height: '294px', width: '340px' };

interface Props {
  /** 外层下拉是否可见 */
  wrapperVisible: boolean;
  /** 将confirmData对应的原始数据返回给使用者 */
  onConfirmChange: (confirmData: SelectItem[]) => void;
}

const TemplateOverlay: FC<Props> = ({ onConfirmChange, wrapperVisible }) => {
  const {
    state: { allPlan },
    update,
  } = useCtx();
  const [myPlan, setMyPlan] = useState<PlanItem[]>([...allPlan]);
  const [editFlag, setEditFlag] = useState(false); // 是否在编辑状态

  const [deleteConfirmInfo, setDeleteConfirmInfo] = useState(DEFAULT_DELETE_INFO);

  const onResetDeleteInfo = useMemoizedFn(() => {
    setDeleteConfirmInfo({ ...DEFAULT_DELETE_INFO });
  });

  useEffect(() => {
    setMyPlan([...allPlan]);
  }, [allPlan]);

  /** 弹窗关闭时，这里要恢复初始状态 */
  useEffect(() => {
    if (!wrapperVisible) {
      setEditFlag(false);
      setMyPlan([...allPlan]);
    }
  }, [wrapperVisible, allPlan, setEditFlag]);

  const onCancel = useMemoizedFn(() => {
    update((draft) => {
      draft.curEditPlan = undefined;
    });
  });

  return (
    <div style={CONTAINER_STYLE}>
      <DeleteModal
        myPlan={myPlan}
        deleteConfirmInfo={deleteConfirmInfo}
        onResetDeleteInfo={onResetDeleteInfo}
        onConfirmChange={onConfirmChange}
      />
      <Header editFlag={editFlag} myPlan={myPlan} setEditFlag={setEditFlag} />
      <Content
        editFlag={editFlag}
        myPlan={myPlan}
        setMyPlan={setMyPlan}
        onConfirmChange={onConfirmChange}
        setDeleteConfirmInfo={setDeleteConfirmInfo}
      />
      <ConfirmNewPlanModal isEdit={true} onConfirmChange={onConfirmChange} onCancel={onCancel} />
    </div>
  );
};

export default memo(TemplateOverlay);
