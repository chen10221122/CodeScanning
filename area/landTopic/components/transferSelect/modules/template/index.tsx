import { FC, memo, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import { useInitContext, useValues } from '@pages/area/landTopic/components/transferSelect/hooks';
import useTitle from '@pages/area/landTopic/components/transferSelect/hooks/useTitle';
import useVisible from '@pages/area/landTopic/components/transferSelect/hooks/useVisible';
import Message from '@pages/area/landTopic/components/transferSelect/modules/message';
import TemplateModal, { ModalType } from '@pages/area/landTopic/components/transferSelect/modules/templateModal';
import TemplateOverlay from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay';
// import { DefaultPlan } from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import { TransferSelectProps } from '@pages/area/landTopic/components/transferSelect/types';

import NoPayDialog from '@/app/components/dialog/power/noPayCreatLimit';
import Dropdown from '@/components/screen/components/dropdown';

import screenStyles from '@/components/screen/styles.module.less';

const Template: FC<TransferSelectProps> = ({
  title,
  data,
  moduleCode,
  pageCode,
  onChange,
  parentCheckable = true,
  hasSelectAll = false,
  hasExpandedAll = true,
  maxSelect = 100,
  maxPlan = 10,
  tipDelay = 3000,
  getPopupContainer,
  className,
  style,
  fuzzySearch = false,
  formatTitle,
  ellipsis = 8,
  forbidEmptyCheck = false,
  dropdownVisible,
  onDropdownVisibleChange,
  hideSaveTemplate,
  values,
  checkMaxLimit = true,
  noPlan = false,
  selectedModalTitle,
  defaultExpandKes,
  ...dropdownProps
}) => {
  /** 获取显示的title */
  const showTitle = useTitle({ formatTitle, ellipsis });

  const {
    state: { curSelectPlanId, noPayDialogVisible },
    update,
  } = useCtx();

  const { visible, hide, changeVisible } = useVisible({
    dropdownVisible,
    onDropdownVisibleChange,
  });

  useInitContext({
    title,
    data,
    moduleCode,
    pageCode,
    parentCheckable,
    hasSelectAll,
    hasExpandedAll,
    maxSelect,
    maxPlan,
    tipDelay,
    fuzzySearch,
    forbidEmptyCheck,
    hideSaveTemplate,
    values,
    checkMaxLimit,
    hide,
    noPlan,
    defaultExpandKes,
  });

  const { confirmChange } = useValues({ data, onChange });

  const rebuildStyle = useMemo(() => ({ ...style }), [style]);

  const onNoPayDialogChange = useMemoizedFn((v) => {
    update((draft) => {
      draft.noPayDialogVisible = v;
    });
  });

  // const defaultPlan = useMemo(
  //   () => (allPlan || []).find((item) => item.description === DefaultPlan.IsDefault),
  //   [allPlan],
  // );

  return (
    <>
      {noPlan ? null : (
        <>
          <ScreenWrapper className={cn(screenStyles.screenWrapper, 'screen-wrapper', className)} style={rebuildStyle}>
            <Dropdown
              title={showTitle}
              fullTitle={showTitle}
              overlay={
                <>
                  <TemplateOverlay wrapperVisible={visible} onConfirmChange={confirmChange} />
                  <Message />
                </>
              }
              overlayClassName="transfer-select-wrapper"
              // dirty={Boolean(curSelectPlanId) && defaultPlan?.planId !== curSelectPlanId}
              dirty={Boolean(curSelectPlanId)}
              visible={visible}
              onVisibleChange={changeVisible}
              // showClear={true}
              // clearVisible={true}
              // @ts-ignore
              getPopupContainer={(trigger) => trigger.parentNode}
              {...dropdownProps}
            />
          </ScreenWrapper>
          <TemplateModal
            onConfirmChange={confirmChange}
            modalType={ModalType.ADD}
            parentCheckable={parentCheckable}
            hasSelectAll={hasSelectAll}
            selectedModalTitle={selectedModalTitle}
          />
        </>
      )}

      <TemplateModal
        onConfirmChange={confirmChange}
        modalType={ModalType.EDIT}
        parentCheckable={parentCheckable}
        hasSelectAll={hasSelectAll}
      />
      <NoPayDialog
        visible={noPayDialogVisible}
        setVisible={onNoPayDialogChange}
        type
        customMsgTxt="此功能为VIP专属功能，开通VIP版即可使用"
        zIndex={1200}
      />
    </>
  );
};

export default memo(Template);

const ScreenWrapper = styled.div`
  width: 126px;
  height: 20px;
  border: 0.5px solid #bfbfbf;
  border-radius: 2px;
  /* overflow: hidden; */
  position: relative;
  &:hover {
    border-color: rgba(1, 113, 246, 0.5);
  }
  .ant-dropdown-trigger {
    width: 100%;
    padding: 0 20px 0 8px;
    margin: 0 !important;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 12px;
    > span {
      position: absolute;
      right: 8px;
      top: 0px;
    }
  }
  .transfer-select-wrapper {
    top: 30px !important;
  }
`;
