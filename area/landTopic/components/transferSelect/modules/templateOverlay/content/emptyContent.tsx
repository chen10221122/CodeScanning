import { memo, FC, useMemo } from 'react';

import styled from 'styled-components';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import usePlanApi, {
  PlanItem,
} from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';

import Icon from '@/components/icon';
import { Image, Flex } from '@/components/layout';

interface Props {
  myPlan: PlanItem[];
}

const EmptyContent: FC<Props> = ({ myPlan }) => {
  const {
    state: { data, hasPay },
    update,
  } = useCtx();

  const { openTemplateModal } = usePlanApi();

  const defaultTip = useMemo(() => {
    let tip = '';
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      const { title, children = [] } = data[i];
      tip += `${title}：`;
      for (let index = 0; index < children.length; index++) {
        const { title: childrenTitle } = children[index];
        tip += `${childrenTitle}、`;
        count++;
        if (count >= 10) break;
      }
      if (count >= 10) break;
    }
    return tip;
  }, [data]);

  return (
    <>
      <Row>
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <span className="highlight">{myPlan[0].planName}</span>
            <span className="tag">默认</span>
          </Flex>
          <Image src={require('@pages/area/landTopic/components/transferSelect/icons/planCheck.svg')} />
        </Flex>
        <Flex align="center" style={{ marginTop: '4px' }}>
          <div className="tip" style={{ width: '266px', display: 'inline-block' }}>
            {defaultTip}
          </div>
          <span className="tip">等{myPlan[0]?.content?.length}个</span>
        </Flex>
      </Row>
      <Row
        onClick={() => {
          if (!hasPay) {
            update((draft) => {
              draft.noPayDialogVisible = true;
            });
          } else openTemplateModal(undefined);
        }}
      >
        <Flex align="center">
          <Icon unicode="&#xe6b3;" size={10} />
          自定义模板
          <Image
            src={require('@/assets/images/common/vip.svg')}
            style={{ marginLeft: '4px', marginBottom: '1px' }}
            w={13}
            h={12}
          />
        </Flex>
        <div className="tip">您可保存指标模版，快捷查看</div>
      </Row>
    </>
  );
};
export default memo(EmptyContent);

const Row = styled.div`
  padding: 6px 16px 4px;
  display: flex;
  flex-direction: column;
  line-height: 20px;
  font-size: 13px;
  color: #111111;
  cursor: pointer;
  .highlight {
    color: #0171f6;
  }
  .tag {
    display: inline-block;
    margin-left: 4px;
    width: 28px;
    height: 15px;
    text-align: center;
    background: #f1f2fb;
    border-radius: 2px;
    font-size: 11px;
    color: #7686de;
    line-height: 15px;
  }
  .tip {
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
    color: #999999;
    line-height: 18px;
  }
  i {
    color: #0171f6;
    margin-right: 4px;
  }
  &:hover {
    background: #f5faff;
  }
`;
