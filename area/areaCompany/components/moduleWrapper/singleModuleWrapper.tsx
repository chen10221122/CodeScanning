/**
 * @description 子模块
 * 副标题+筛选+表格
 */
import { FC, memo, useMemo } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

import { Empty, Spin } from '@/components/antd';

import { WrapperProps } from '.';
import Styles from './style.module.less';
import { ContentContainer, SingleLoadingDom } from './styles';

interface SoloModuleProps {
  title: string;
  isFilterOverFlow?: boolean;
  contentDom: React.ReactElement;
  filterDom: React.ReactElement;
}

const SoloModuleWrapper: FC<
  SoloModuleProps & Pick<WrapperProps, 'isEmpty' | 'error' | 'loading' | 'onClear' | 'onReload' | 'id'>
> = ({ title, filterDom, contentDom, isEmpty, error, loading, onClear, onReload, id, isFilterOverFlow }) => {
  const dataEmpty = useMemo(
    () => isEmpty || (error && [100, 202, 203, 204].includes((error as any)?.returncode)),
    [isEmpty, error],
  );

  const retryLoading = useMemo(() => (dataEmpty || error ? !!loading : false), [dataEmpty, error, loading]);

  return (
    <Container isLoading={false}>
      <div className={cn(Styles.stickyArea, 'container-sticky-area')}>
        <div className={cn(Styles.filter, { [Styles.filterOverFlow]: isFilterOverFlow })}>{filterDom}</div>
      </div>
      <ContentContainer className={Styles.content} id={`area-company-${id || title}`} isLoading={retryLoading}>
        {retryLoading ? (
          // 无数据或错误之后 还需要走这个loading
          <Spin spinning={retryLoading} type="square">
            <SingleLoadingDom />
          </Spin>
        ) : null}
        <div className="area-company-single-container">
          {dataEmpty || error ? (
            <>
              <div className={Styles.emptyWrapper} />
              <Empty
                style={{ marginTop: 0 }}
                type={dataEmpty ? Empty.NO_DATA_IN_FILTER_CONDITION : Empty.LOAD_FAIL_BIG}
                onClick={dataEmpty ? (onClear as () => void) : (onReload as () => void)}
              />
            </>
          ) : (
            contentDom
          )}
        </div>
      </ContentContainer>
    </Container>
  );
};

export default memo(SoloModuleWrapper);

const Container = styled.div<{ isLoading: boolean }>`
  .container-sticky-area {
    opacity: ${({ isLoading }) => (isLoading ? '0' : '1')};
  }
`;
