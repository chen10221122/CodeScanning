import { FC, memo, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { useCtx, Provider } from '@pages/area/landTopic/components/transferSelect/context';
import { useInitPlan, useTipVisible, useNoPlan } from '@pages/area/landTopic/components/transferSelect/hooks';
import TemplateDropdown from '@pages/area/landTopic/components/transferSelect/modules/template';
import usePlanApi, {
  DefaultPlan,
} from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import { TransferSelectProps } from '@pages/area/landTopic/components/transferSelect/types';

import { Flex } from '@/components/layout';

import ArrowIcon from './icons/icon_arrow.svg';
import ArrowActiveIcon from './icons/icon_arrowActive.svg';

const TransferSelectInner: FC<TransferSelectProps> = (props) => {
  const { className, noPlan, selectedModalVisible, onSelectedModalVisibleChange, ...restProps } = props;
  const {
    state: { curSelectPlanId, allPlan, isFirstOpenModal, customPlan },
    update,
  } = useCtx();

  /* 处理message弹窗的隐藏 */
  useTipVisible();
  /* 模板的初始化 */
  useInitPlan();

  useNoPlan({ selectedModalVisible, onSelectedModalVisibleChange });

  const { openTemplateModal } = usePlanApi();

  const onSelectedClick = useMemoizedFn(() => {
    const curPlan = allPlan.find(({ planId }) => planId === curSelectPlanId);
    openTemplateModal(curPlan, false);
  });

  /* 存储用户所有的‘自定义模板’ */
  useEffect(() => {
    update((draft) => {
      draft.customPlan = (allPlan || []).filter((item) => item.description !== DefaultPlan.IsDefault);
    });
  }, [allPlan, update]);

  useEffect(() => {
    if (customPlan.length && isFirstOpenModal) {
      update((draft) => {
        draft.isFirstOpenModal = false;
      });
    }
  }, [customPlan, update, isFirstOpenModal]);

  return (
    <Flex align="center" className={className}>
      {noPlan ? null : (
        <SelectedButton className="selected-button" onClick={onSelectedClick}>
          指标筛选
        </SelectedButton>
      )}
      {/* 需求24028要求不存在‘自定义模板’时，仅展示‘指标筛选’下拉框 */}
      <TemplateWrapper className="selected-template" style={{ display: customPlan.length ? 'block' : 'none' }}>
        <TemplateDropdown noPlan={noPlan} {...restProps} />
      </TemplateWrapper>
    </Flex>
  );
};

const TransferSelect: FC<TransferSelectProps> = (props) => {
  return (
    <Provider>
      <TransferSelectInner {...props} />
    </Provider>
  );
};

export default memo(TransferSelect);

const SelectedButton = styled.div`
  font-size: 13px;
  color: #141414;
  line-height: 20px;
  padding: 0 12px 2px 0;
  background: url(${ArrowIcon}) no-repeat right 7px;
  background-size: 7px;
  cursor: pointer;
  &:hover {
    background: url(${ArrowActiveIcon}) no-repeat right 7px;
    background-size: 7px;
    color: #0171f6;
  }
`;

const TemplateWrapper = styled.div`
  margin-left: 16px;
`;
