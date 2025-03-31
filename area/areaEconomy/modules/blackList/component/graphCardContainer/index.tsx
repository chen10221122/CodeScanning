import { FC, useRef } from 'react';

import { QuestionCircleOutlined } from '@ant-design/icons';
import cn from 'classnames';
import styled from 'styled-components';

import { Popover, Empty } from '@/components/antd';
import SkeletonScreen from '@/components/skeletonScreen';

import styles from './style.module.less';

export interface GraphCardProps {
  header: string;
  hasIcon?: boolean;
  style?: React.CSSProperties;
  className?: string;
  loading?: boolean;
  error?: boolean | Error;
  retry?: () => void;
  noData?: boolean;
}

const GraphCardContainer: FC<GraphCardProps> = ({
  header,
  hasIcon,
  style,
  children,
  className,
  loading,
  error,
  retry,
  noData,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <CardContainer className={cn(styles.cardContainer, className)} ref={containerRef} style={style}>
      <div className={styles.header}>
        <div className={styles.context}>{header}</div>
        {hasIcon ? (
          <Popover
            content="柱状图只统计了2013年及之后的数据"
            placement="right"
            getPopupContainer={() => containerRef.current || document.body}
          >
            <QuestionCircleOutlined style={{ fontSize: 13, color: '#BFBFBF' }} />
          </Popover>
        ) : null}
      </div>
      {loading ? (
        <SkeletonScreen
          firstStyle={{ paddingTop: '32px' }}
          paragraph={{ rows: 8, width: ['40%', '98%', '98%', '80%', '40%', '98%', '98%', '80%'] }}
        />
      ) : error ? (
        <Empty type={Empty.MODULE_LOAD_FAIL} onClick={retry} />
      ) : noData ? (
        <Empty type={Empty.NO_SCREEN_DATA} />
      ) : (
        children
      )}
    </CardContainer>
  );
};

export default GraphCardContainer;

const CardContainer = styled.div`
  .ant-popover {
    font-size: 12px;
    color: #595959;
    .ant-popover-inner-content {
      padding: 8px;
      height: 34px;
    }
  }
  .ant-empty {
    margin: 58px 0 74px;
    .ant-empty-image {
      width: 205px;
      height: 124px;
      margin-bottom: 10px;
    }
  }
`;
