import { FC, useMemo } from 'react';

import { Empty } from '@/components/antd';
import WrapperContainer from '@/pages/area/areaF9/components/wrapperContainer/new';
import { Provider, useCtx } from '@/pages/area/financialResources/context';

const Container: FC<{ content: JSX.Element; isContentEmpty?: boolean }> = ({ content, isContentEmpty }) => {
  const {
    state: { firstLoading, noData },
  } = useCtx();

  const empty = useMemo(() => {
    if (!firstLoading && noData && isContentEmpty) {
      return <Empty type={Empty.NO_DATA_NEW_IMG} className="new-no-data" />;
    }
    return null;
  }, [firstLoading, noData, isContentEmpty]);

  return (
    <WrapperContainer
      topIsSticky={false}
      loading={firstLoading}
      content={empty ? empty : content}
      contentStyle={{
        paddingBottom: '0',
      }}
      containerStyle={{
        paddingRight: '1px',
      }}
      backup={true}
    ></WrapperContainer>
  );
};

const Index: FC<{ content: JSX.Element; isContentEmpty?: boolean }> = (props) => (
  <Provider>
    <Container {...props} />
  </Provider>
);

export default Index;
