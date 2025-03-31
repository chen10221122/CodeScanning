import * as React from 'react';
import { useContext, useMemo } from 'react';

import { isUndefined } from 'lodash';

import { Empty } from '@/components/antd';
import CommonAnchorCard, { AnchorCardProps } from '@/pages/detail/components/baseAnchorCard';
import { Menu } from '@/pages/detail/components/menuTabs/types';

import { useCtx } from '../../provider/getContext';

type AnchorContextState = {
  tabs: Menu[];
  tabIndex: number;
};

const anchorContext = React.createContext<AnchorContextState>({} as AnchorContextState);

const AnchorCard = React.forwardRef<HTMLDivElement, AnchorCardProps>((props, ref) => {
  const { tabs, tabIndex } = useContext(anchorContext);

  return <CommonAnchorCard ref={ref} {...props} tabs={tabs} tabIndex={tabIndex} />;
});

const InternalAnchorCardWrapper: React.FC<{
  children: any;
}> = ({ children }) => {
  const {
    state: { tabIndex, tabs },
  } = useCtx();

  const isAllEmpty = useMemo(() => {
    if (isUndefined(tabs) || isUndefined(tabIndex) || !tabs[tabIndex]) return false;
    return tabs[tabIndex].children?.every((d) => d.disabled);
  }, [tabIndex, tabs]);

  if (isAllEmpty) {
    return (
      <div style={{ position: 'relative', height: 500 }}>
        <Empty type={Empty.NO_RELATED_DATA} full />
      </div>
    );
  }

  return <anchorContext.Provider value={{ tabs, tabIndex }}>{children}</anchorContext.Provider>;
};

export const AnchorCardWrapper = React.memo<typeof InternalAnchorCardWrapper>(InternalAnchorCardWrapper);

export default React.memo<typeof AnchorCard>(AnchorCard);
