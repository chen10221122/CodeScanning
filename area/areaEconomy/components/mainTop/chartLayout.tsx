import { FC, Fragment, memo, useEffect, useState } from 'react';

import styled from 'styled-components';

import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';

import ChartCard from './chartCard';

interface Data {
  [p: string]: any;
}

interface List {
  data: Data;
  widthChart: boolean;
  [p: string]: any;
}

interface Props {
  list: List[];
}

const config = [
  {
    width: [0, 1280], // 区域宽度
    padding: 24, // 两边padding边距
    gap: 10, // 卡片间隙
    columnNumber: 5, // 每行卡片数量
  },
  {
    width: [1281, 1600], // 区域宽度
    padding: 24, // 两边padding边距
    gap: 10, // 卡片间隙
    columnNumber: 5, // 每行卡片数量
  },
  {
    width: [1601, 1920], // 区域宽度
    padding: 24, // 两边padding边距
    gap: 10, // 卡片间隙
    columnNumber: 6, // 每行卡片数量
  },
  {
    width: [1921, Infinity], // 区域宽度
    padding: 24, // 两边padding边距
    gap: 10, // 卡片间隙
    columnNumber: 8, // 每行卡片数量
  },
];

const ChartLayout: FC<Props> = ({ list }) => {
  // eslint-disable-next-line
  const [curConfig, setCurConfig] = useState(config[0]);
  const { update } = useCtx();
  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector('#area_economy_container') as HTMLDivElement;
      const containerWidth = container?.offsetWidth || 1280;
      const curConfig =
        config.find((item) => item.width[0] <= containerWidth && item.width[1] >= containerWidth) || config[0];
      update((d) => {
        d.padding = curConfig.padding;
      });
      setCurConfig(curConfig);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [update]);

  // 将一维数组转换成二维数组
  // let doubleArrList: List[][] = chunk(list, curConfig.columnNumber);

  return (
    <div className="chart-wrap-container">
      <div className="chart-wrap-border">
        <FlexContainer>
          {[0, 1, 2, 3, 4].map((index) => {
            return (
              <Fragment key={index}>
                <div className="flex-item">
                  <>
                    <ChartCard
                      data={list[index].data}
                      withChart={list[index].widthChart}
                      backgroundImg={list[index]?.backgroundImg || ''}
                    />
                    <div style={{ marginTop: '17px' }} />
                    <ChartCard
                      data={list[index + 5].data}
                      withChart={list[index + 5].widthChart}
                      backgroundImg={list[index + 5]?.backgroundImg || ''}
                    />
                  </>
                </div>
              </Fragment>
            );
          })}
        </FlexContainer>
      </div>
    </div>
  );
};

export default memo(ChartLayout);

const FlexContainer = styled.div`
  display: flex;
  /* gap: 22px; */
  .flex-item {
    flex: 1;
    position: relative;
    min-width: 154px;
    font-size: 12px;
    &:not(:last-child) {
      padding-right: 20px;
      &:after {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        right: 9px;
        width: 1px;
        height: 105px;
        border: 1px solid;
        border-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f1f1f1 54%, rgba(255, 255, 255, 0) 100%) 1 1;
      }
    }
  }
`;
