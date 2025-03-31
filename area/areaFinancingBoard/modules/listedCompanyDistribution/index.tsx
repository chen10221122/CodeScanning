import { useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';

import { withLazyLoad } from '@pages/detail/common/components';

import Tab from '@/pages/area/areaFinancingBoard/components/Tab';
import DetailModal from '@/pages/area/areaFinancingBoard/modules/stockMarket/modal';

import { Wrapper, ModuleTitle } from '../../components';
import { MODAL_TYPE } from '../../config';
import { useConditionCtx } from '../../context';
import Content from './content';
import useTab from './useTab';

//上市公司分布
const ListedCompanyDistribution = () => {
  const containerRef = useRef(null);
  const {
    state: { visible, detailModalConfig, type },
    update,
  } = useConditionCtx();

  const { tabConfig, tab, onTabChange } = useTab();

  const headerRight = useMemo(() => {
    return <Tab {...{ tabConfig, tab, onTabChange }} />;
  }, [tabConfig, tab, onTabChange]);

  const closeModal = useMemoizedFn(() => {
    update((d) => {
      d.visible = false;
      d.type = '';
    });
  });

  return (
    <Wrapper height={216} ratio={50}>
      <ModuleTitle title="上市公司分布" rightComp={headerRight} />
      <Content type={tab} containerRef={containerRef} />
      <DetailModal
        visible={(visible && type === MODAL_TYPE.COMPANYDISTRIBUTION) || false}
        closeModal={closeModal}
        detailModalConfig={detailModalConfig}
        containerRef={containerRef}
      />
    </Wrapper>
  );
};

export default withLazyLoad(ListedCompanyDistribution, 216);
