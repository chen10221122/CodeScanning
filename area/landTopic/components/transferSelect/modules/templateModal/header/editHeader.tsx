import { useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import usePlanApi from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';

import Icon from '@/components/icon';
import { Image } from '@/components/layout';
import { Screen, Options, ScreenType } from '@/components/screen';

export default function EditHeader() {
  const {
    state: { allPlan, curEditPlan, hasPay },
    update,
  } = useCtx();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const { openTemplateModal } = usePlanApi();

  const options: Options[] = useMemo(
    () => [
      {
        title: '选择模板',
        ellipsis: 20,
        option: {
          type: ScreenType.SINGLE,
          cancelable: false,
          children: allPlan.map((planItem) => ({
            name: planItem.planName,
            planDetail: planItem,
            value: planItem.planId,
            active: curEditPlan?.planId === planItem.planId,
          })),
        },
      },
    ],
    [allPlan, curEditPlan?.planId],
  );
  const getPopContainer = useMemoizedFn(() => wrapperRef.current || document.body);

  const openNewModal = useMemoizedFn(() => {
    if (!hasPay) {
      update((draft) => {
        draft.noPayDialogVisible = true;
      });
    } else openTemplateModal(undefined);
  });

  const onScreenChange = useMemoizedFn(([curSelect]) => {
    update((draft) => {
      draft.curEditPlan = curSelect.planDetail;
    });
  });

  return (
    <Wrapper ref={wrapperRef}>
      当前模板
      <Screen
        values={curEditPlan?.planId ? [[curEditPlan?.planId]] : undefined}
        options={options}
        getPopContainer={getPopContainer}
        onChange={onScreenChange}
      />
      <div className="add-new" onClick={openNewModal}>
        <Icon unicode="&#xe6b3;" size={10} />
        新建模板
        <Image
          src={require('@/assets/images/common/vip.svg')}
          style={{ marginLeft: '4px', marginBottom: '1px' }}
          w={13}
          h={12}
        />
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  line-height: 24px;
  color: #262626;
  font-size: 12px;
  .ant-dropdown {
    left: 79px !important;
    top: 94px !important;
  }
  .screen-wrapper {
    margin-left: 6px;
    margin-right: 16px;
    width: 100%;
    padding: 0 8px;
    width: 140px;
    height: 24px;
    border: 1px solid #c4dcf5;
    border-radius: 2px;
    .ant-dropdown-trigger {
      font-size: 12px;
      width: 111px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
      > span {
        position: absolute;
        right: left;
        left: 200px;
        margin-left: 0;
      }
    }
  }
  .add-new {
    cursor: pointer;
    width: fit-content;
    height: 24px;
    padding: 0 13px;
    background: #f5faff;
    border: 1px solid #ebf4ff;
    border-radius: 2px;
    font-size: 12px;
    line-height: 22px;
    color: #434343;
    i {
      color: #0171f6;
      margin-right: 4px;
      vertical-align: 0;
    }
  }
`;
