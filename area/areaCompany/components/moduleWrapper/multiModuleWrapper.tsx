/**
 * @description 子模块
 * 副标题+筛选+表格
 */
import { FC, useMemo, useRef, useState, useEffect, memo } from 'react';

import { Icon } from '@/components';
import { Empty, Spin } from '@/components/antd';

import { WrapperProps } from '.';
import Styles from './style.module.less';
import { ContentContainer, FirstEmpty } from './styles';

export interface SubModuleProps {
  subTitle: string;
  iconPath: string;
  contentDom: React.ReactElement;
  filterDom: React.ReactElement;
}

const SubModuleWrapper: FC<
  SubModuleProps &
    Pick<
      WrapperProps,
      'isEmpty' | 'loading' | 'firstLoading' | 'error' | 'onClear' | 'onReload' | 'id' | 'hasDefaultFilter'
    >
> = ({
  subTitle,
  iconPath,
  filterDom,
  contentDom,
  isEmpty,
  loading,
  firstLoading,
  error,
  onClear,
  onReload,
  id,
  hasDefaultFilter,
}) => {
  const firstRef = useRef(true);
  const [isFirstEmpty, setIsFirstEmpty] = useState(false);

  const dataEmpty = useMemo(
    () => isEmpty || (error && [100, 202, 203, 204].includes((error as any)?.returncode)),
    [isEmpty, error],
  );

  const retryLoading = useMemo(() => (dataEmpty || error ? !!loading : false), [dataEmpty, error, loading]);

  useEffect(() => {
    if (!firstLoading && firstRef.current && !hasDefaultFilter) {
      firstRef.current = false;
      setIsFirstEmpty(!!dataEmpty);
    }
  }, [dataEmpty, firstLoading, hasDefaultFilter]);

  return (
    <div className={Styles.subWrapper}>
      <div className={Styles.subStickyArea}>
        <div className={Styles.subTitle}>
          <Icon image={iconPath} size={13} className={Styles.subTitleIcon} />
          <span>{subTitle}</span>
        </div>
        {isFirstEmpty ? null : (
          <>
            <div className={Styles.subFilter}>{filterDom}</div>
            {/* sticky固定的dom */}
            <div className={Styles.subStickyDom}></div>
          </>
        )}
      </div>
      {isFirstEmpty ? (
        <FirstEmpty>该板块暂无数据</FirstEmpty>
      ) : (
        <>
          <ContentContainer className={Styles.subContent} id={`area-company-${id || subTitle}`}>
            {
              // 无数据或错误之后 还需要走这个loading
              <Spin spinning={retryLoading} type="square">
                {dataEmpty ? (
                  <Empty
                    type={Empty.NO_DATA_IN_FILTER_CONDITION_SMALL}
                    className={Styles.empty}
                    onClick={onClear as () => void}
                  />
                ) : error ? (
                  <Empty type={Empty.LOAD_FAIL_BIG} className={Styles.empty} onClick={onReload as () => void} />
                ) : (
                  contentDom
                )}
              </Spin>
            }
          </ContentContainer>
        </>
      )}
    </div>
  );
};

export default memo(SubModuleWrapper);
