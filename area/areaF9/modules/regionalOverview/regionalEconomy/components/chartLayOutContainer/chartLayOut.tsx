import { useEffect, FC, memo, Fragment, useState, useRef } from 'react';

import { Skeleton } from '@dzh/components';
import { useSize } from 'ahooks';
import styled from 'styled-components';

import { useImmer } from '@/utils/hooks';

import ChartCard, { CARDHEIGHT, LoadingCard } from './chartCard';
import CustomMetricsCard from './customMetricsCard';
import { CardItem } from './types';

interface Props {
  list: CardItem[];
  openInfoModal?: (item: CardItem, name: any, data: any, unit: any) => void;
  openMetricModal?: () => void;
  resetFlag: boolean;
}

// 栅格横向间距和纵向间距
const GAPX = 6,
  GAPY = 6;
const CARDMINWIDTH = 200;
const MINCOLUMNS = 5;
// .chart-wrap-container 到 .main-container 层级的所有左右 padding
const PageContentPadding = /*6 +*/ 20 + 20;
const ChartLayout: FC<Props> = ({ list, openInfoModal, openMetricModal, resetFlag }) => {
  const [columns, setColumns] = useState(MINCOLUMNS); // 指标卡列数
  const [cardWidth, setCardWidth] = useState(CARDMINWIDTH); // 指标卡理论宽度
  // 自定义按钮模式，空字符串为默认大卡片，small为侧边吸附按钮
  const [cardType, setCardType] = useState('');
  // 自定义按钮吸附位置
  const [cardStyle, setCardStyle] = useImmer<Record<string, string>>({
    top: '0px',
  });

  const contentContainerRef = useRef(null);
  const sidePageRef = useRef(document.querySelector('.side-page-container') as HTMLDivElement);
  const containerSize = useSize(sidePageRef.current);
  const mainContainerRef = useRef(document.querySelector('.main-container') as HTMLDivElement);
  const contentContainerSize = useSize(mainContainerRef.current);
  const cardRef = useRef(document.querySelector('.card-item') as HTMLDivElement);
  const cardSize = useSize(cardRef.current);

  useEffect(() => {
    requestAnimationFrame(() => {
      let nowContainerWidth = 0;
      if (containerSize?.width) {
        // 指标卡上移的页面最大宽度 2560
        // 减去 chart-wrap-container 父元素的 padding，padding 不参与数量计算
        nowContainerWidth = Math.min(containerSize.width, 2560 - PageContentPadding);
      }
      if (contentContainerSize?.width) {
        nowContainerWidth = Math.min(nowContainerWidth, contentContainerSize.width - PageContentPadding);
      }
      // 指标卡默认宽度 200px 指标卡间隔 6px
      const _col = Math.floor(nowContainerWidth / CARDMINWIDTH);
      const col = Math.max(5, nowContainerWidth >= _col * (CARDMINWIDTH + GAPX) - GAPX ? _col : _col - 1);
      setColumns(col);
      // console.log('card width', nowContainerWidth, (nowContainerWidth - (col - 1) * GAPX) / col);
      setCardWidth((nowContainerWidth - (col - 1) * GAPX) / col);
    });
  }, [containerSize, contentContainerSize]);

  useEffect(() => {
    requestAnimationFrame(() => {
      // 当非默认指标时就变为small吸附按钮
      if (resetFlag) {
        const row = Math.floor(list.length / columns);
        const lastCol = list.length % columns;
        const top = lastCol ? row * (CARDHEIGHT + GAPY) + 'px' : (row - 1) * (CARDHEIGHT + GAPY) + 'px';
        const left = lastCol
          ? lastCol * (cardSize?.width ?? cardWidth) + (lastCol - 1) * GAPX + 'px'
          : columns * (cardSize?.width ?? cardWidth) + (columns - 1) * GAPX + 'px';
        // console.log('top left', top, left);
        setCardType('small');
        setCardStyle((d) => {
          d.top = top;
          d.left = left;
        });
      } else {
        setCardType('');
      }
    });
  }, [cardWidth, columns, list.length, resetFlag, setCardStyle, cardSize?.width]);

  return (
    <div className="chart-wrap-container" style={{ position: 'relative' }} ref={contentContainerRef}>
      <FlexContainer columns={columns}>
        {list.map((item, index) => {
          return (
            <Fragment key={index}>
              <ChartCard
                data={item.data}
                withChart={item?.withChart}
                backgroundImg={item?.backgroundImg ?? ''}
                click={
                  item.data?.chartValue
                    ? () =>
                        openInfoModal?.(
                          item,
                          item.data?.chartTitle + (item.data?.unit ? `(${item.data.unit})` : ''),
                          item.data.chartValue,
                          item.data?.unit,
                        )
                    : undefined
                }
              />
            </Fragment>
          );
        })}
        <CustomMetricsCard className={cardType} cardType={cardType} style={cardStyle} onClick={openMetricModal} />
      </FlexContainer>
    </div>
  );
};

export default memo(ChartLayout);

export function ChartLoadingLayout() {
  return (
    <div className="chart-wrap-container" style={{ height: `${CARDHEIGHT * 2 + GAPY}px`, position: 'relative' }}>
      <FlexContainer columns={MINCOLUMNS}>
        {new Array(10).fill(0).map((_, index) => {
          return (
            // <Fragment key={index}>
            <LoadingCard key={index}>
              <Skeleton title={false} active />
            </LoadingCard>
            // </Fragment>
          );
        })}
      </FlexContainer>
    </div>
  );
}

const FlexContainer = styled.div<{ columns?: number }>`
  width: 100%;
  box-sizing: border-box;
  display: grid;
  // grid-template-columns: ${({ columns }) => `repeat(${columns}, minmax(${CARDMINWIDTH}px, 1fr))`};
  grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
  grid-gap: ${GAPY}px ${GAPX}px;
  position: relative;
`;
